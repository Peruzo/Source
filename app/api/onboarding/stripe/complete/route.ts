import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';
import Stripe from 'stripe';
import { sendTransactionalEmail } from '@/lib/mail/mailService';

/**
 * POST /api/onboarding/stripe/complete
 * Markerar Stripe-onboarding som klar för autentiserad användare.
 * Anropas från success-sidan när Stripe redirectar tillbaka.
 */
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding Stripe Complete] POST called without authentication');
      return NextResponse.json(
        { error: 'NOT_AUTHENTICATED', success: false },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Stripe Complete] userSub =', userSub);

    const body = await request.json();
    const { accountId, onboardingId: providedOnboardingId } = body || {};

    if (!accountId) {
      return NextResponse.json({ success: false, message: 'Missing accountId' }, { status: 400 });
    }

    // KRITISK FIX: Kräv explicit onboardingId - skapar INGET implicit
    if (!providedOnboardingId) {
      return NextResponse.json(
        { success: false, message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }
    
    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Stripe Complete] Using onboardingId:', onboardingId);

    // Hämta state för att verifiera status
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);

    // FSM: Verifiera att onboarding är i korrekt status för att slutföra Stripe
    try {
      assertStatus(state, 'stripe_started');
    } catch (statusError) {
      console.warn(`[Onboarding Stripe Complete] Invalid status for onboarding ${onboardingId}:`, statusError);
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_ONBOARDING_STATE',
          message: statusError instanceof Error ? statusError.message : 'Onboarding must be in stripe_started status to complete Stripe',
        },
        { status: 403 }
      );
    }

    // Append event till event-logg (append-only, ingen read-modify-write)
    // onboardingId är redan hämtat/skapat ovan
    try {
      await appendOnboardingEvent(onboardingId, {
        type: 'stripe_completed',
        payload: { accountId },
      });
    } catch (eventError) {
      console.error('[Stripe Complete] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    // Hämta uppdaterad state efter event-append
    const updatedEvents = await listOnboardingEvents(onboardingId);
    const updatedState = reduceOnboarding(updatedEvents, onboardingId, userSub);
    const authEmail =
      typeof session.user.email === 'string'
        ? session.user.email.trim().toLowerCase()
        : '';

    // KRITISK: FSM-transitionen är klar (event append lyckades)
    // Returnera 200 omedelbart - admin-sync är best effort och får inte påverka FSM
    
    // Hämta full kontoinfo från Stripe (best effort)
    let stripeAccountData: Record<string, unknown> = { accountId };
    try {
      const stripeKey = process.env.STRIPE_PLATFORM_SECRET;
      if (stripeKey) {
        const stripe = new Stripe(stripeKey, { apiVersion: '2025-12-15.clover' });
        const account = await stripe.accounts.retrieve(accountId, {
          expand: ['individual', 'external_accounts', 'persons']
        });
        stripeAccountData = {
          accountId,
          detailsSubmitted: account.details_submitted,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          businessName: account.business_profile?.name || null,
          businessUrl: account.business_profile?.url || null,
          mcc: account.business_profile?.mcc || null,
          companyName: account.company?.name || null,
          companyPhone: account.company?.phone || (account as any).persons?.data?.[0]?.phone || null,
          companyAddress: account.company?.address || (account as any).persons?.data?.[0]?.address || null,
          taxId: account.company?.tax_id_provided ? '****' : null,
          individualFirstName: account.individual?.first_name || (account as any).persons?.data?.[0]?.first_name || null,
          individualLastName: account.individual?.last_name || (account as any).persons?.data?.[0]?.last_name || null,
          individualEmail: account.individual?.email || (account as any).persons?.data?.[0]?.email || null,
          individualPhone: account.individual?.phone || (account as any).persons?.data?.[0]?.phone || null,
          individualAddress: account.individual?.address || (account as any).persons?.data?.[0]?.address || null,
          representativeFirstName: (account as any).persons?.data?.[0]?.first_name || null,
          representativeLastName: (account as any).persons?.data?.[0]?.last_name || null,
          representativePhone: (account as any).persons?.data?.[0]?.phone || null,
          representativeEmail: (account as any).persons?.data?.[0]?.email || null,
          representativeAddress: (account as any).persons?.data?.[0]?.address || null,
          iban: (() => {
            const bankAccounts = (account as any).external_accounts?.data || [];
            const sepa = bankAccounts.find((b: any) => b.object === 'bank_account');
            return sepa?.last4 ? `****${sepa.last4}` : null;
          })(),
          bankAccountLast4: (() => {
            const bankAccounts = (account as any).external_accounts?.data || [];
            const bank = bankAccounts.find((b: any) => b.object === 'bank_account');
            return bank?.last4 || null;
          })(),
          bankName: (() => {
            const bankAccounts = (account as any).external_accounts?.data || [];
            const bank = bankAccounts.find((b: any) => b.object === 'bank_account');
            return bank?.bank_name || null;
          })(),
          country: account.country || null,
          email: account.email || null,
          organizationNumber: account.company?.tax_id_provided ? 'provided' : null,
          vatNumber: account.company?.vat_id_provided ? 'provided' : null,
          companyTaxIdProvided: account.company?.tax_id_provided || false,
          individualIdNumberProvided: account.individual?.id_number_provided || false,
          individualDob: account.individual?.dob || null,
          individualSsnLast4: account.individual?.ssn_last_4_provided ? 'provided' : null,
          kycVerified: account.individual?.verification?.status === 'verified',
          idDocumentVerified: account.individual?.verification?.document?.details_code === null,
          idType: (account.individual?.verification?.document as any)?.type || null,
          missingRequirements: account.requirements?.currently_due || [],
          eventuallyDue: account.requirements?.eventually_due || [],
          currency: account.default_currency || null,
          payoutSchedule: account.settings?.payouts?.schedule?.interval || null,
        };
        console.log('[Stripe Complete] Retrieved full account data for', accountId);
      }
    } catch (stripeError) {
      console.warn('[Stripe Complete] Could not retrieve full account data:', stripeError);
    }

    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-stripe-complete`,
      onboardingId,
      sessionId: userSub,
      step: 'stripe_completed',
      onboardingStatus: updatedState.status,
      user: {
        email: authEmail,
        sub: session.user.sub,
      },
      data: stripeAccountData,
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    }).catch((adminError) => {
      console.warn(`[Onboarding Stripe Complete] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
    });

    // Skicka välkomstmail (best effort, non-blocking)
    const firstName = typeof stripeAccountData.individualFirstName === 'string'
      ? stripeAccountData.individualFirstName
      : '';
    const companyName = typeof stripeAccountData.companyName === 'string' && stripeAccountData.companyName
      ? stripeAccountData.companyName
      : (typeof stripeAccountData.businessName === 'string' ? stripeAccountData.businessName : '');

    sendTransactionalEmail({
      to: authEmail,
      subject: 'Din ansökan är mottagen – Source',
      templatePath: 'templates/emails/application-received.html',
      variables: {
        contactName: firstName || authEmail,
        companyName: companyName || 'ditt företag',
        package: 'Growth', // TODO: hämta från onboarding-state när tillgängligt
      },
    }).catch(() => {});

    // Returnera 200 oavsett admin-sync-resultat
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Stripe Complete] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

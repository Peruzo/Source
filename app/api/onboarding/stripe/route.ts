import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import Stripe from 'stripe';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';
import { getBaseUrl } from '@/lib/utils/base-url';

/**
 * KRITISK: Stripe SDK-init sker på runtime (request scope), inte module scope.
 * Detta förhindrar SDK-init under build och gör att env-validering sker vid runtime.
 */
function getStripeClient(): Stripe | null {
  const stripeSecretKey = process.env.STRIPE_PLATFORM_SECRET;
  
  if (!stripeSecretKey) {
    // Warning är OK, men får inte kasta eller blockera build
    console.warn('[Stripe] STRIPE_PLATFORM_SECRET not configured');
    return null;
  }
  
  return new Stripe(stripeSecretKey, { apiVersion: '2025-12-15.clover' });
}

export async function POST(request: Request) {
  try {
    // Initiera Stripe SDK på runtime (request scope)
    const stripe = getStripeClient();
    
    if (!stripe) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // KRITISK: Kräv Auth0-autentisering
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      console.warn('[Onboarding Stripe] POST called without Auth0 authentication');
      return NextResponse.json(
        {
          error: 'AUTH_REQUIRED',
          message: 'User must be authenticated to start Stripe onboarding',
        },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Stripe] Using Auth0 userSub:', userSub);

    const body = await request.json();
    const providedOnboardingId = body.onboardingId;

    // KRITISK FIX: Kräv explicit onboardingId - skapar INGET implicit
    if (!providedOnboardingId) {
      return NextResponse.json(
        { success: false, message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }
    
    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Stripe] Using onboardingId:', onboardingId);

    // Använd canonical base URL (throwar error om den saknas, ingen fallback till localhost)
    const baseUrl = getBaseUrl();
    console.log(`[Stripe] Using base URL for redirects: ${baseUrl}`);

    // Hämta state från onboarding-state (inte Auth0 session)
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);
    const email = state.email || undefined;

    // FSM: Verifiera att onboarding är i korrekt status för att starta Stripe
    try {
      assertStatus(state, ['questions_completed', 'code_completed', 'stripe_started']);
    } catch (statusError) {
      console.warn(`[Onboarding Stripe] Invalid status for onboarding ${onboardingId}:`, statusError);
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_ONBOARDING_STATE',
          message:
            statusError instanceof Error
              ? statusError.message
              : 'Onboarding must be in questions_completed or code_completed status to start Stripe',
        },
        { status: 403 }
      );
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email,
      metadata: {
        userSub,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding/stripe`,
      return_url: `${baseUrl}/onboarding/success?account=${account.id}`,
      type: 'account_onboarding',
    });

    // Append event till event-logg (append-only, ingen read-modify-write)
    // onboardingId är redan hämtat/skapat ovan
    try {
      await appendOnboardingEvent(onboardingId, {
        type: 'stripe_started',
        payload: { accountId: account.id },
      });
    } catch (eventError) {
      console.error('[Stripe] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    // KRITISK: FSM-transitionen är klar (event append lyckades, Stripe account skapad)
    // Returnera response omedelbart - admin-sync är best effort och får inte påverka FSM
    
    // Hämta uppdaterad state efter event-append
    const updatedEvents = await listOnboardingEvents(onboardingId);
    const updatedState = reduceOnboarding(updatedEvents, onboardingId, userSub);

    // Best effort: admin-sync får aldrig påverka FSM-transitionen
    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-stripe-start`,
      onboardingId,
      sessionId: userSub,
      step: 'stripe_started',
      onboardingStatus: updatedState.status, // Använd formell status från FSM
      user: email ? { email, sub: userSub } : { sub: userSub },
      data: {
        accountId: account.id,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    }).catch((adminError) => {
      // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
      console.warn(`[Onboarding Stripe] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
    });

    // Returnera response oavsett admin-sync-resultat
    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error) {
    console.error('[Stripe] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

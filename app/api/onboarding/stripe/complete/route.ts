import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';

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
    
    // Skicka till admin-portalen med formell status från FSM (best effort)
    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-stripe-complete`,
      onboardingId,
      sessionId: userSub,
      step: 'stripe_completed',
      onboardingStatus: updatedState.status, // Använd formell status från FSM (inte heuristik)
      user: {
        email: authEmail,
        sub: session.user.sub,
      },
      data: {
        accountId,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    }).catch((adminError) => {
      // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
      console.warn(`[Onboarding Stripe Complete] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
    });

    // Returnera 200 oavsett admin-sync-resultat
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Stripe Complete] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

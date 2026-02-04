import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import Stripe from 'stripe';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';
import { getBaseUrl } from '@/lib/utils/base-url';
import { isAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

const stripeSecretKey = process.env.STRIPE_PLATFORM_SECRET;

if (!stripeSecretKey) {
  console.warn('[Stripe] STRIPE_PLATFORM_SECRET not configured');
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-12-15.clover' })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { sessionId, onboardingId: providedOnboardingId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    // KRITISK: Stripe Connect kräver Auth0-autentisering
    // Anonyma sessioner kan inte skapa Stripe Connect accounts
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      console.warn('[Onboarding Stripe] POST called without Auth0 authentication');
      return NextResponse.json(
        { 
          error: 'AUTH0_REQUIRED',
          message: 'Stripe Connect requires authentication. Please log in to continue.',
          success: false 
        },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Stripe] userSub =', userSub);

    // Verifiera att sessionId matchar user.sub (eller är anonym sessionId från onboarding)
    // Om sessionId är anonym, tillåt det men använd Auth0 userSub för Stripe
    if (!isAnonymousSessionId(sessionId) && sessionId !== userSub) {
      console.warn('[Onboarding Stripe] sessionId mismatch:', { sessionId, userSub });
      return NextResponse.json(
        { success: false, message: 'Onboarding session does not match current user' },
        { status: 403 }
      );
    }
    
    // För anonyma sessioner: använd Auth0 userSub för Stripe (onboardingId är kopplat till anonym sessionId)
    // Detta tillåter att användaren kan starta onboarding anonymt och logga in vid Stripe-steget

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
      assertStatus(state, 'code_completed');
    } catch (statusError) {
      console.warn(`[Onboarding Stripe] Invalid status for onboarding ${onboardingId}:`, statusError);
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_ONBOARDING_STATE',
          message: statusError instanceof Error ? statusError.message : 'Onboarding must be in code_completed status to start Stripe',
        },
        { status: 403 }
      );
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email,
      metadata: {
        sessionId,
        userSub,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding/stripe?sessionId=${sessionId}`,
      return_url: `${baseUrl}/onboarding/success?account=${account.id}&sessionId=${sessionId}`,
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
      sessionId,
      step: 'stripe_started',
      onboardingStatus: updatedState.status, // Använd formell status från FSM
      user: email ? { email, sub: session.user.sub } : { sub: session.user.sub },
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

import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import Stripe from 'stripe';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';
import { getBaseUrl } from '@/lib/utils/base-url';

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

    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding Stripe] POST called without authentication');
      return NextResponse.json(
        { error: 'NOT_AUTHENTICATED', success: false },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Stripe] userSub =', userSub);

    const { sessionId, onboardingId: providedOnboardingId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    // Verifiera att sessionId matchar user.sub
    if (sessionId !== userSub) {
      console.warn('[Onboarding Stripe] sessionId mismatch:', { sessionId, userSub });
      return NextResponse.json(
        { success: false, message: 'Onboarding session does not match current user' },
        { status: 403 }
      );
    }

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

    const account = await stripe.accounts.create({
      type: 'express',
      email: session.user.email || undefined,
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

    await sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-stripe-start`,
      onboardingId,
      sessionId,
      step: 'stripe_started',
      onboardingStatus: 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      data: {
        accountId: account.id,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    });

    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error) {
    console.error('[Stripe] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

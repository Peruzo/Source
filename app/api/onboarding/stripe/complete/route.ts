import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';

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
    const { accountId } = body || {};

    if (!accountId) {
      return NextResponse.json({ success: false, message: 'Missing accountId' }, { status: 400 });
    }

    const userSub = session.user.sub;

    // Append event till event-logg (append-only, ingen read-modify-write)
    try {
      await appendOnboardingEvent(userSub, {
        type: 'stripe_completed',
        payload: { accountId },
      });
    } catch (eventError) {
      console.error('[Stripe Complete] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    // Skicka till admin-portalen
    await sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${userSub}-stripe-complete`,
      sessionId: userSub,
      step: 'stripe_completed',
      onboardingStatus: 'redo',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      data: {
        accountId,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Stripe Complete] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

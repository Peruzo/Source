import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

/**
 * POST /api/onboarding/package-selected
 *
 * Anropas från /priser-sidan när kund klickar på ett paket.
 * - Genererar onboardingId (UUID) om kunden inte redan har en sessionId-cookie
 * - Sätter cookies: source_onboarding_id + source_selected_plan
 * - Skickar package_selected-event till admin-portalen för auditerbar trail
 *
 * Backend-eventet säkerställer att admin-portalen ALLTID har paket-valet
 * registrerat innan kunden ens loggar in. Tyst defaulting till 'bas' kan
 * därmed inte ske om kunden gått igenom hemsida-flödet.
 *
 * Body: { planId: 'bas' | 'growth' | 'enterprise' }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planId = typeof body.planId === 'string' ? body.planId.toLowerCase() : null;

    // Validera planId
    const VALID_PLANS = ['bas', 'growth', 'enterprise'];
    if (!planId || !VALID_PLANS.includes(planId)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PLAN', validPlans: VALID_PLANS },
        { status: 400 }
      );
    }

    // Återanvänd befintligt onboardingId från cookie om sådant finns
    const cookieStore = await cookies();
    let onboardingId = cookieStore.get('source_onboarding_id')?.value;

    if (!onboardingId) {
      onboardingId = crypto.randomUUID();
    }

    // Hämta Auth0-session om kunden är inloggad (för att binda till user)
    let userSub: string | null = null;
    let userEmail: string | null = null;
    try {
      const session = await auth0.getSession();
      userSub = session?.user?.sub || null;
      userEmail = session?.user?.email || null;
    } catch {
      // Inte inloggad — det är förväntat på /priser
    }

    // Skicka event till admin-portalen (best effort, non-blocking)
    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-package-selected`,
      publicOnboardingId: onboardingId,
      sessionId: userSub || undefined,
      step: 'package_selected',
      onboardingStatus: 'package_selected',
      user: userEmail && userSub
        ? { email: userEmail, sub: userSub }
        : userSub
          ? { sub: userSub }
          : undefined,
      data: {
        selectedPlan: planId,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    }).catch((err) => {
      console.error('[Package Selected] Admin sync failed (non-blocking):', err);
    });

    // Sätt cookies — onboardingId och selectedPlan
    // httpOnly: false eftersom getStoredPlanId() läser från localStorage
    // (vi sätter cookien för server-side guards som /onboarding/login)
    const response = NextResponse.json({
      success: true,
      onboardingId,
      planId,
    });

    response.cookies.set('source_onboarding_id', onboardingId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dagar
      path: '/',
    });

    response.cookies.set('source_selected_plan', planId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('[Package Selected]', { onboardingId, planId, userSub });

    return NextResponse.json({
      success: true,
      onboardingId,
      planId,
    }, {
      headers: response.headers,
    });
  } catch (error) {
    console.error('[Package Selected] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL' },
      { status: 500 }
    );
  }
}

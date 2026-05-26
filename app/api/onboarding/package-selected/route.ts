import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { getActiveOnboardingIdForSession } from '@/lib/storage/onboarding-sessions';
import { isValidOnboardingId } from '@/lib/onboarding/onboarding-id';

/**
 * POST /api/onboarding/package-selected
 *
 * Anropas från /priser-sidan när kund klickar på ett paket.
 *
 * Prioritetsordning för onboardingId (mest stabilt först):
 *   1. Aktiv onboarding-session bunden till userSub (om Auth0-inloggad)
 *   2. source_onboarding_id-cookie (om kund redan börjat anonymt)
 *   3. Ny crypto.randomUUID()
 *
 * Effekt: en kund som klickar /priser → Growth → Bas → Growth genererar
 * ALDRIG fler än EN onboarding-rad i admin-portalen. Admin-portalens
 * idempotency-upsert per idempotencyKey ser bara ETT 'package_selected'-event
 * som uppdateras vid varje klick.
 *
 * Body: { planId: 'core' | 'growth' | 'enterprise' } (legacy 'bas' accepteras under övergångsperiod)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planId = typeof body.planId === 'string' ? body.planId.toLowerCase() : null;

    // Validera planId
    // Övergångsperiod: 'bas' accepteras parallellt med 'core' för att skydda
    // mot stale klient-JS i öppna tabbar. Tas bort i PR A6.1 (tidigast 14 dagar efter merge).
    const VALID_PLANS = ['bas', 'core', 'growth', 'enterprise'];
    if (!planId || !VALID_PLANS.includes(planId)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PLAN', validPlans: VALID_PLANS },
        { status: 400 }
      );
    }

    // Hämta Auth0-session om kunden är inloggad
    let userSub: string | null = null;
    let userEmail: string | null = null;
    try {
      const session = await auth0.getSession();
      userSub = session?.user?.sub || null;
      userEmail = session?.user?.email || null;
    } catch {
      // Inte inloggad — det är förväntat på /priser
    }

    const cookieStore = await cookies();
    const cookieOnboardingId = cookieStore.get('source_onboarding_id')?.value;

    // Bestäm onboardingId i prioritetsordning
    let onboardingId: string | null = null;

    // Prio 1: Auth0-inloggad → leta upp existing onboarding för userSub
    if (userSub) {
      try {
        onboardingId = await getActiveOnboardingIdForSession(userSub);
        if (onboardingId) {
        }
      } catch (err) {
        console.warn('[Package Selected] Failed to lookup existing onboarding for userSub:', err);
      }
    }

    // Prio 2: cookie-UUID (anonym kund som klickat /priser tidigare)
    if (!onboardingId && cookieOnboardingId && isValidOnboardingId(cookieOnboardingId)) {
      onboardingId = cookieOnboardingId;
    }

    // Prio 3: generera nytt UUID (helt ny kund)
    if (!onboardingId) {
      onboardingId = crypto.randomUUID();
    }

    // Skicka event till admin-portalen (best effort, non-blocking)
    // Idempotency-key är konstant för samma onboardingId — admin-portalen upsertar
    // så multipla klick på samma kund-session uppdaterar EN rad, inte skapar nya.
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

    // Sätt cookies för bevarad UUID under hela kund-resan (7 dagar)
    // httpOnly: false så frontend kan läsa (legacy getStoredPlanId-helper).
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

    return response;
  } catch (error) {
    console.error('[Package Selected] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL' },
      { status: 500 }
    );
  }
}

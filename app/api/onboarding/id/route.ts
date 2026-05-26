import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { getActiveOnboardingId, getActiveOnboardingIdForSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * Hämtar aktiv onboardingId (read-only).
 *
 * ARKITEKTURREGEL: Denna endpoint får ALDRIG skapa onboarding.
 * Onboarding skapas endast via POST /api/onboarding/start.
 *
 * Om Auth0-session finns: använder session.user.sub och hämtar onboardingId från GCS.
 * Om ingen Auth0-session: fallback till anonym session (cookie-based) som tidigare.
 *
 * Detta säkerställer:
 * - OnboardingId är stabil genom hela onboarding-flödet (/questions → /code → /stripe)
 * - GET-endpoints är read-only och ändrar inte state
 * - Inga onboarding-loops orsakade av auto-create-logik
 */
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (session?.user?.sub) {
      const userSub = session.user.sub;
      const onboardingId = await getActiveOnboardingId(userSub);
      return NextResponse.json({ onboardingId });
    }

    // Fallback: anonym session (cookie-based)
    const sessionId = await getAnonymousSessionId();

    if (!sessionId) {
      return NextResponse.json({ onboardingId: null }, { status: 200 });
    }


    const onboardingId = await getActiveOnboardingIdForSession(sessionId);

    return NextResponse.json({ onboardingId });
  } catch (error) {
    console.error('[Onboarding ID] Error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding ID' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getActiveOnboardingId, createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * Hämtar aktiv onboardingId för autentiserad användare (read-only).
 * 
 * KRITISK FIX: GET-endpoint skapar ALDRIG onboarding-sessioner.
 * Returnerar befintlig onboardingId även om den är tom.
 * 
 * Detta säkerställer:
 * - OnboardingId är stabil genom hela onboarding-flödet (/questions → /code → /stripe)
 * - GET-endpoints är read-only och ändrar inte state
 * - Inga onboarding-loops orsakade av auto-create-logik
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    
    // Hämtar aktiv onboardingId (read-only, skapar inget)
    const onboardingId = await getActiveOnboardingId(userSub);
    
    if (!onboardingId) {
      return NextResponse.json({ error: 'NO_ONBOARDING_SESSION' }, { status: 404 });
    }

    return NextResponse.json({ onboardingId, userSub });
  } catch (error) {
    console.error('[Onboarding ID] Error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding ID' }, { status: 500 });
  }
}

/**
 * POST /api/onboarding/id
 * Skapar en ny onboarding-session (tvingar ny onboardingId).
 * Används när användaren startar en ny onboarding från början.
 */
export async function POST() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    const onboardingId = await createNewOnboardingSession(userSub);

    return NextResponse.json({ onboardingId, userSub });
  } catch (error) {
    console.error('[Onboarding ID] Error creating new session:', error);
    return NextResponse.json({ error: 'Failed to create onboarding session' }, { status: 500 });
  }
}

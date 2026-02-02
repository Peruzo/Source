import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getOrCreateActiveOnboardingId, createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * Hämtar eller skapar aktiv onboardingId för autentiserad användare.
 * Returnerar onboardingId som ska användas för alla onboarding-events.
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    const onboardingId = await getOrCreateActiveOnboardingId(userSub);

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

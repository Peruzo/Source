import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * KRITISK FIX: Skapar ALLTID en ny onboarding-session för att förhindra reuse vid custom signup.
 * 
 * Varje custom signup ska ALLTID skapa en NY onboarding-session.
 * userSub får INTE återanvända onboarding.
 * 
 * Detta säkerställer att:
 * - Repo, GitHub-state och frågor ALLTID börjar tomma
 * - Inga förifyllda onboarding-frågor
 * - Inget fel repo skickas till worker
 * - Inga 404 från GitHub trots korrekt worker
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    
    // KRITISK FIX: Skapa ALLTID ny onboarding-session (blockerar reuse helt i signup-pathen)
    // Detta förhindrar att gammal onboarding återanvänds vid custom signup
    const onboardingId = await createNewOnboardingSession(userSub);
    
    console.log(`[Onboarding ID] Created new onboarding session: ${onboardingId} for userSub: ${userSub}`);

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

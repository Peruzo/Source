import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';

/**
 * POST /api/onboarding/start
 * Skapar en ny onboarding-session explicit.
 * 
 * Detta är ENDA platsen som får skapa onboarding-sessioner.
 * Anropas från frontend när GET /api/onboarding/id returnerar 404.
 * 
 * Returnerar { onboardingId } som ska användas för alla onboarding-operationer.
 */
export async function POST() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    
    // Skapa ny onboarding-session (enda platsen som får skapa onboarding)
    const onboardingId = await createNewOnboardingSession(userSub);
    
    console.log(`[Onboarding Start] Created new onboarding session: ${onboardingId} for userSub: ${userSub}`);

    return NextResponse.json({ onboardingId, userSub });
  } catch (error) {
    console.error('[Onboarding Start] Error:', error);
    return NextResponse.json({ error: 'Failed to start onboarding' }, { status: 500 });
  }
}

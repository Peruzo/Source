import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getOrCreateActiveOnboardingId, createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * Hämtar eller skapar aktiv onboardingId för autentiserad användare.
 * 
 * KRITISK FIX: Återanvänder aktiv onboarding-session om den har events.
 * Skapar ny session endast om:
 * - Ingen onboarding finns, eller
 * - Onboarding är tom (0 events) - förhindrar reuse vid custom signup
 * 
 * Detta säkerställer:
 * - OnboardingId är stabil genom hela onboarding-flödet (/questions → /code → /stripe)
 * - Tom onboarding återanvänds inte vid custom signup
 * - Onboarding med data återanvänds korrekt
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    
    // Försök hämta aktiv onboardingId
    let onboardingId = await getOrCreateActiveOnboardingId(userSub);
    
    // Kontrollera om onboarding har events
    const { listOnboardingEvents } = await import('@/lib/storage/onboarding-events');
    const events = await listOnboardingEvents(onboardingId);
    
    // Om onboarding är tom (0 events), skapa ny session (förhindrar reuse vid custom signup)
    // Om onboarding har events, återanvänd den (säkerställer stabil onboardingId genom flödet)
    if (events.length === 0) {
      console.log(`[Onboarding ID] Onboarding ${onboardingId} is empty, creating new session for userSub: ${userSub}`);
      onboardingId = await createNewOnboardingSession(userSub);
    } else {
      console.log(`[Onboarding ID] Reusing active onboarding ${onboardingId} with ${events.length} events for userSub: ${userSub}`);
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

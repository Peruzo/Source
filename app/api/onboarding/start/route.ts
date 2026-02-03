import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createNewOnboardingSession, getActiveOnboardingId } from '@/lib/storage/onboarding-sessions';

/**
 * POST /api/onboarding/start
 * Skapar en ny onboarding-session explicit.
 * 
 * Detta är ENDA platsen som får skapa onboarding-sessioner.
 * Anropas från frontend när GET /api/onboarding/id returnerar 404.
 * 
 * @param forceNew - Om true, skapar alltid ny onboarding även om befintlig finns (för custom signup)
 * 
 * Returnerar { onboardingId } som ska användas för alla onboarding-operationer.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    
    // Läs forceNew från request body
    let forceNew = false;
    try {
      const body = await request.json().catch(() => ({}));
      forceNew = body.forceNew === true;
    } catch {
      // Om body saknas eller är ogiltig, fortsätt med forceNew = false
    }
    
    // Om forceNew är true (custom signup), skapa alltid ny onboarding
    // Annars, kontrollera om befintlig onboarding finns
    if (forceNew) {
      // Custom signup: skapa alltid ny onboarding
      const onboardingId = await createNewOnboardingSession(userSub);
      console.log(`[Onboarding Start] Created new onboarding session (forceNew): ${onboardingId} for userSub: ${userSub}`);
      return NextResponse.json({ onboardingId, userSub });
    }
    
    // Resume-flöde: kontrollera om befintlig onboarding finns
    const existingOnboardingId = await getActiveOnboardingId(userSub);
    if (existingOnboardingId) {
      console.log(`[Onboarding Start] Reusing existing onboarding: ${existingOnboardingId} for userSub: ${userSub}`);
      return NextResponse.json({ onboardingId: existingOnboardingId, userSub });
    }
    
    // Ingen befintlig onboarding: skapa ny
    const onboardingId = await createNewOnboardingSession(userSub);
    console.log(`[Onboarding Start] Created new onboarding session: ${onboardingId} for userSub: ${userSub}`);
    return NextResponse.json({ onboardingId, userSub });
  } catch (error) {
    console.error('[Onboarding Start] Error:', error);
    return NextResponse.json({ error: 'Failed to start onboarding' }, { status: 500 });
  }
}

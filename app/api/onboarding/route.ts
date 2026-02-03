import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { getActiveOnboardingId } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding?onboardingId=...
 * Hämtar onboarding-state för autentiserad användare (read-only).
 * State rekonstrueras från append-only event-logg via reducer.
 * 
 * KRITISK FIX: GET-endpoint skapar ALDRIG onboarding-sessioner.
 * Om onboardingId saknas → returnera { state: null }
 * Om 0 events → returnera tom state, skapa INGET
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding GET] Called without authentication');
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    const searchParams = request.nextUrl.searchParams;
    let onboardingId = searchParams.get('onboardingId');
    
    // Om onboardingId saknas, försök hämta aktiv onboardingId (read-only)
    if (!onboardingId) {
      onboardingId = await getActiveOnboardingId(userSub);
      
      // Om ingen onboarding-session finns, returnera null state
      if (!onboardingId) {
        return NextResponse.json({
          state: null,
          onboardingId: null,
          eventsCount: 0,
        });
      }
    }
    
    console.log('[Onboarding GET] userSub =', userSub, 'onboardingId =', onboardingId);
    
    const events = await listOnboardingEvents(onboardingId);
    
    // Reducer hanterar tom state automatiskt (returnerar null för alla fält)
    // Inga auto-create-logik här - GET-endpoint är read-only
    const state = reduceOnboarding(events, onboardingId, userSub);

    return NextResponse.json({
      state,
      onboardingId,
      eventsCount: events.length,
    });
  } catch (error) {
    console.error('[Onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Failed to load onboarding state' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { getOrCreateActiveOnboardingId } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding?onboardingId=...
 * Hämtar onboarding-state för autentiserad användare.
 * State rekonstrueras från append-only event-logg via reducer.
 * Om inga events finns, returneras tom state (skapar inget event).
 * Om onboardingId saknas, hämtas/skapas aktiv onboardingId.
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
    
    // Om onboardingId saknas, hämta/skapa aktiv onboardingId
    if (!onboardingId) {
      onboardingId = await getOrCreateActiveOnboardingId(userSub);
    }
    
    console.log('[Onboarding GET] userSub =', userSub, 'onboardingId =', onboardingId);
    
    const events = await listOnboardingEvents(onboardingId);
    
    // Reducer hanterar tom state automatiskt (returnerar null för alla fält)
    const state = reduceOnboarding(events, onboardingId, userSub);
    
    if (events.length === 0) {
      console.log('[Onboarding GET] No events found for onboardingId, returning empty state');
    }

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

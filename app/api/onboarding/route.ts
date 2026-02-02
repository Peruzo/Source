import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';

/**
 * GET /api/onboarding
 * Hämtar onboarding-state för autentiserad användare.
 * State rekonstrueras från append-only event-logg via reducer.
 * Om inga events finns, returneras tom state (skapar inget event).
 */
export async function GET() {
  try {
    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding GET] Called without authentication');
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const userSub = session.user.sub;
    console.log('[Onboarding GET] userSub =', userSub);
    
    const events = await listOnboardingEvents(userSub);
    
    // Reducer hanterar tom state automatiskt (returnerar null för alla fält)
    const state = reduceOnboarding(events, userSub);
    
    if (events.length === 0) {
      console.log('[Onboarding GET] No events found for userSub, returning empty state');
    }

    return NextResponse.json({
      state,
      eventsCount: events.length,
    });
  } catch (error) {
    console.error('[Onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Failed to load onboarding state' }, { status: 500 });
  }
}

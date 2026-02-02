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
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSub = session.user.sub;
    const events = await listOnboardingEvents(userSub);
    const state = reduceOnboarding(events, userSub);

    return NextResponse.json({
      state,
      eventsCount: events.length,
    });
  } catch (error) {
    console.error('[Onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Failed to load onboarding state' }, { status: 500 });
  }
}

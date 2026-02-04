import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { getActiveOnboardingId } from '@/lib/storage/onboarding-sessions';
import { getAnonymousSessionId, isAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

/**
 * GET /api/onboarding?onboardingId=...
 * Hämtar onboarding-state (read-only).
 * 
 * KRITISK: Stödjer både Auth0-autentiserade och anonyma sessioner.
 * För anonyma sessioner används cookie-based sessionId som userSub.
 * 
 * KRITISK FIX: GET-endpoint skapar ALDRIG onboarding-sessioner.
 * Om onboardingId saknas → returnera { state: null }
 * Om 0 events → returnera tom state, skapa INGET
 */
export async function GET(request: NextRequest) {
  try {
    // KRITISK: Tillåt både Auth0-autentiserade och anonyma sessioner
    const session = await auth0.getSession();
    let userSub: string | null = null;
    
    if (session?.user?.sub) {
      // Auth0-autentiserad användare
      userSub = session.user.sub;
    } else {
      // Anonym session - hämta från cookie
      const anonymousSessionId = await getAnonymousSessionId();
      if (anonymousSessionId) {
        userSub = anonymousSessionId;
        console.log('[Onboarding GET] Using anonymous sessionId:', userSub);
      }
    }
    
    // Om ingen session finns (varken Auth0 eller anonym) → returnera null state
    if (!userSub) {
      return NextResponse.json({
        state: null,
        onboardingId: null,
        eventsCount: 0,
      });
    }
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

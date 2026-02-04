import { NextRequest, NextResponse } from 'next/server';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { getActiveOnboardingId } from '@/lib/storage/onboarding-sessions';
import { getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

/**
 * GET /api/onboarding?onboardingId=...
 * Hämtar onboarding-state (read-only).
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske för onboarding GET (förhindrar implicit Auth0-init).
 * 
 * KRITISK FIX: GET-endpoint skapar ALDRIG onboarding-sessioner.
 * Om onboardingId saknas → returnera { state: null }
 * Om 0 events → returnera tom state, skapa INGET
 */
export async function GET(request: NextRequest) {
  try {
    // KRITISK: Använd ENDAST anonyma sessioner (cookie-based)
    // Auth0-init får INTE ske för onboarding GET
    const anonymousSessionId = await getAnonymousSessionId();
    const sessionId = anonymousSessionId;
    
    // Om ingen session finns → returnera null state
    if (!sessionId) {
      return NextResponse.json({
        state: null,
        onboardingId: null,
        eventsCount: 0,
      });
    }
    
    console.log('[Onboarding GET] Using anonymous sessionId:', sessionId);
    
    const searchParams = request.nextUrl.searchParams;
    let onboardingId = searchParams.get('onboardingId');
    
    // Om onboardingId saknas, försök hämta aktiv onboardingId (read-only)
    if (!onboardingId) {
      onboardingId = await getActiveOnboardingId(sessionId);
      
      // Om ingen onboarding-session finns, returnera null state
      if (!onboardingId) {
        return NextResponse.json({
          state: null,
          onboardingId: null,
          eventsCount: 0,
        });
      }
    }
    
    console.log('[Onboarding GET] sessionId =', sessionId, 'onboardingId =', onboardingId);
    
    const events = await listOnboardingEvents(onboardingId);
    
    // Reducer hanterar tom state automatiskt (returnerar null för alla fält)
    // Inga auto-create-logik här - GET-endpoint är read-only
    const state = reduceOnboarding(events, onboardingId, sessionId);

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

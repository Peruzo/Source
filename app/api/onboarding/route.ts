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
    
    console.log('[Onboarding GET] RAW Events from GCS:', {
      onboardingId,
      sessionId,
      eventsCount: events.length,
      firstEvent: events.length > 0 ? events[0] : null,
      lastEvent: events.length > 0 ? events[events.length - 1] : null,
      eventTypes: events.map(e => e.type),
      hasCodeSubmitted: events.some(e => e.type === 'code_submitted'),
      hasGithubVerified: events.some(e => e.type === 'github_repo_verified'),
      allEvents: events.map(e => ({ 
        type: e.type, 
        at: e.at, 
        payload: e.payload,
        fullEvent: e
      }))
    });
    
    // Reducer hanterar tom state automatiskt (returnerar null för alla fält)
    // Inga auto-create-logik här - GET-endpoint är read-only
    const state = reduceOnboarding(events, onboardingId, sessionId);

    console.log('[Onboarding GET] Reduced state:', {
      onboardingId,
      sessionId,
      stateStatus: state.status,
      stateCode: state.code,
      stateGithub: state.github,
      fullState: state,
      isStateNull: state === null
    });

    const responseData = {
      state,
      onboardingId,
      eventsCount: events.length,
    };

    console.log('[Onboarding GET] RAW Response being sent to frontend:', {
      responseState: responseData.state,
      responseStateStatus: responseData.state?.status,
      responseStateIsNull: responseData.state === null,
      responseOnboardingId: responseData.onboardingId,
      responseEventsCount: responseData.eventsCount,
      fullResponse: JSON.stringify(responseData, null, 2)
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Onboarding GET] Error:', error);
    return NextResponse.json({ error: 'Failed to load onboarding state' }, { status: 500 });
  }
}

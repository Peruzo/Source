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

    console.log(
      '[DEBUG RAW EVENTS]',
      JSON.stringify(
        events.map((e, i) => ({
          index: i,
          type: e.type,
          at: e.at,
          payload: e.payload,
        })),
        null,
        2
      )
    );

    // EVENT-SEKVENSVERIFIERING
    // - listOnboardingEvents(): sorterar på filnamn (prefix timestamp), inte på at. Filnamn = timestamp_eventtype.json → kronologisk ordning efter skrivtid.
    // - Reducer: sorterar om på at (sortedEvents = [...events].sort((a,b) => a.at.localeCompare(b.at))). at sätts alltid i appendOnboardingEvent (at: now).
    // - Risk: GCS write är async; om GET körs innan en nyss skriven fil är synlig (eventual consistency) kan reducer få en lista utan senaste event.
    // - Loggen nedan visar om github_repo_verified finns före code_submitted (githubVerifiedFöreCodeSubmitted). Om nej → race eller fel ordning.
    const eventSequenceLog = {
      onboardingId,
      sessionId,
      antalEvents: events.length,
      sorteringsordning: events.map((e, i) => ({ index: i, type: e.type, at: e.at })),
      eventTypes: events.map(e => e.type),
      hasAtPåAlla: events.every(e => e.at != null),
      indexGithubRepoVerified: events.findIndex(e => e.type === 'github_repo_verified'),
      indexCodeSubmitted: events.findIndex(e => e.type === 'code_submitted'),
      githubVerifiedFöreCodeSubmitted:
        events.findIndex(e => e.type === 'github_repo_verified') >= 0 &&
        events.findIndex(e => e.type === 'code_submitted') >= 0 &&
        events.findIndex(e => e.type === 'github_repo_verified') < events.findIndex(e => e.type === 'code_submitted'),
    };
    console.log('[Onboarding GET] EVENT-SEKVENS (precis innan reduceOnboarding):', JSON.stringify(eventSequenceLog, null, 2));

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

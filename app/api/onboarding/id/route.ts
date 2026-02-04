import { NextResponse } from 'next/server';
import { getActiveOnboardingId, createNewOnboardingSession } from '@/lib/storage/onboarding-sessions';
import { getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

/**
 * GET /api/onboarding/id
 * Hämtar aktiv onboardingId (read-only).
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske för onboarding-id (förhindrar implicit Auth0-init).
 * 
 * KRITISK FIX: GET-endpoint skapar ALDRIG onboarding-sessioner.
 * Returnerar befintlig onboardingId även om den är tom.
 * 
 * Detta säkerställer:
 * - OnboardingId är stabil genom hela onboarding-flödet (/questions → /code → /stripe)
 * - GET-endpoints är read-only och ändrar inte state
 * - Inga onboarding-loops orsakade av auto-create-logik
 * - Ingen Auth0-init under onboarding
 */
export async function GET() {
  try {
    // KRITISK: Använd ENDAST anonyma sessioner (cookie-based)
    // Auth0-init får INTE ske för onboarding-id
    const anonymousSessionId = await getAnonymousSessionId();
    const sessionId = anonymousSessionId;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'NO_ONBOARDING_SESSION' }, { status: 404 });
    }
    
    console.log('[Onboarding ID] Using anonymous sessionId:', sessionId);
    
    // Hämtar aktiv onboardingId (read-only, skapar inget)
    const onboardingId = await getActiveOnboardingId(sessionId);
    
    if (!onboardingId) {
      return NextResponse.json({ error: 'NO_ONBOARDING_SESSION' }, { status: 404 });
    }

    return NextResponse.json({ 
      onboardingId, 
      sessionId,
      isAnonymous: true,
    });
  } catch (error) {
    console.error('[Onboarding ID] Error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding ID' }, { status: 500 });
  }
}

/**
 * POST /api/onboarding/id
 * Skapar en ny onboarding-session (tvingar ny onboardingId).
 * Används när användaren startar en ny onboarding från början.
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske för onboarding-id.
 * 
 * OBS: Denna endpoint används sällan - POST /api/onboarding/start är primär.
 */
export async function POST() {
  try {
    // KRITISK: Använd ENDAST anonyma sessioner (cookie-based)
    // Auth0-init får INTE ske för onboarding-id
    const anonymousSessionId = await getAnonymousSessionId();
    
    if (!anonymousSessionId) {
      return NextResponse.json({ error: 'NO_SESSION' }, { status: 400 });
    }

    const sessionId = anonymousSessionId;
    const onboardingId = await createNewOnboardingSession(sessionId);

    return NextResponse.json({ 
      onboardingId, 
      sessionId,
      isAnonymous: true,
    });
  } catch (error) {
    console.error('[Onboarding ID] Error creating new session:', error);
    return NextResponse.json({ error: 'Failed to create onboarding session' }, { status: 500 });
  }
}

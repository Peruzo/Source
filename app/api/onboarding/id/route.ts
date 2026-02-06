import { NextResponse } from 'next/server';
import { getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { getActiveOnboardingForSession } from '@/lib/storage/onboarding-sessions';

/**
 * GET /api/onboarding/id
 * Hämtar aktiv onboardingId (read-only).
 * 
 * ARKITEKTURREGEL: Denna endpoint får ALDRIG skapa onboarding.
 * Onboarding skapas endast via POST /api/onboarding/start.
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske för onboarding-id (förhindrar implicit Auth0-init).
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
    const sessionId = await getAnonymousSessionId();
    
    if (!sessionId) {
      return NextResponse.json({ onboardingId: null }, { status: 200 });
    }
    
    console.log('[Onboarding ID] Using anonymous sessionId:', sessionId);
    
    // Hämtar aktiv onboardingId från session-bindning (read-only, skapar inget)
    const onboardingId = getActiveOnboardingForSession(sessionId);
    
    return NextResponse.json({ onboardingId });
  } catch (error) {
    console.error('[Onboarding ID] Error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding ID' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getActiveOnboardingIdForSession, createNewOnboardingSession, bindOnboardingToSession, getActiveOnboardingForSession } from '@/lib/storage/onboarding-sessions';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { patchAdminOnboarding, sendToAdminPortal } from '@/lib/api/admin-portal';
import { getOrCreateAnonymousSessionId, isAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

/**
 * POST /api/onboarding/start
 * Skapar en ny onboarding-session explicit.
 * 
 * Detta är ENDA platsen som får skapa onboarding-sessioner.
 * Anropas från frontend när GET /api/onboarding/id returnerar 404.
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske för onboarding-start.
 * 
 * @param forceNew - Om true, skapar alltid ny onboarding även om befintlig finns (för custom signup)
 * 
 * Returnerar { onboardingId, userSub, isAnonymous } (userSub = anonym sessionId).
 */
export async function POST(request: NextRequest) {
  try {
    // KRITISK: Använd ENDAST anonyma sessioner (cookie-based)
    // Auth0-init får INTE ske för onboarding-start
    const userSub = await getOrCreateAnonymousSessionId();
    console.log(`[Onboarding Start] Using anonymous sessionId: ${userSub}`);
    
    // Läs forceNew och email från request body (email kommer från signup-context)
    let forceNew = false;
    let emailFromBody: string | undefined;
    let nameFromBody: string | undefined;
    try {
      const body = await request.json().catch(() => ({}));
      forceNew = body.forceNew === true;
      emailFromBody = typeof body.email === 'string' ? body.email.trim() : undefined;
      nameFromBody = typeof body.name === 'string' ? body.name.trim() : undefined;
    } catch {
      // Om body saknas eller är ogiltig, fortsätt med forceNew = false
    }

    // KRITISKT: Kontrollera först om befintlig onboarding finns (utom vid forceNew)
    // Samma anon_<uuid> → samma onboardingId
    let onboardingId = await getActiveOnboardingIdForSession(userSub);
    
    if (!onboardingId || forceNew) {
      // Skapa ny onboarding endast om ingen finns (eller vid forceNew)
      onboardingId = await createNewOnboardingSession(userSub);
      console.log(`[Onboarding Start] Created new onboarding session${forceNew ? ' (forceNew)' : ''}: ${onboardingId} for userSub: ${userSub}`);
      
      // KRITISKT: Bind onboardingId till sessionId (förhindrar att onboardingId ändras)
      bindOnboardingToSession(userSub, onboardingId);
    } else {
      console.log(`[Onboarding Start] Reusing existing onboarding: ${onboardingId} for userSub: ${userSub}`);
      // Bind om den inte redan är bunden (t.ex. från GCS)
      if (!getActiveOnboardingForSession(userSub)) {
        bindOnboardingToSession(userSub, onboardingId);
      }
    }
    
    // Spara email i onboarding-state om det finns (från signup-context eller request body)
    if (emailFromBody) {
      try {
        await appendOnboardingEvent(onboardingId, {
          type: 'email_set',
          payload: { email: emailFromBody, name: nameFromBody },
        });
      } catch (eventErr) {
        console.error('[Onboarding Start] Failed to save email event:', eventErr);
      }
    }
    
    // Hämta state för att få email från onboarding-state (inte Auth0)
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);
    const email = state.email || '';
    const name = state.name || '';
    
    // Admin-sync är best effort och får aldrig påverka session-skapandet
    if (email) {
      patchAdminOnboarding(onboardingId, 'contact', {
        email,
        primaryContact: { email, name },
      }).catch((err) => {
        console.warn(`[Onboarding Start] Admin PATCH contact failed (non-blocking) for onboarding ${onboardingId}:`, err);
      });
    }
    
    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-start`,
      publicOnboardingId: onboardingId,
      user: email ? { email } : {},
      status: state.status || 'started',
      onboardingStatus: state.status || 'started', // För bakåtkompatibilitet
    }).catch((err) => {
      console.warn(`[Onboarding Start] Admin ingest failed (non-blocking) for onboarding ${onboardingId}:`, err);
    });
    
    return NextResponse.json({ 
      onboardingId, 
      userSub,
      isAnonymous: isAnonymousSessionId(userSub),
    });
  } catch (error) {
    console.error('[Onboarding Start] Error:', error);
    return NextResponse.json({ error: 'Failed to start onboarding' }, { status: 500 });
  }
}

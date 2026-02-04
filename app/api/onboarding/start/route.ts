import { NextRequest, NextResponse } from 'next/server';
import { createNewOnboardingSession, getActiveOnboardingId } from '@/lib/storage/onboarding-sessions';
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
 * KRITISK: Stödjer både Auth0-autentiserade och anonyma sessioner.
 * För anonyma sessioner används cookie-based sessionId som userSub.
 * 
 * @param forceNew - Om true, skapar alltid ny onboarding även om befintlig finns (för custom signup)
 * 
 * Returnerar { onboardingId, userSub } som ska användas för alla onboarding-operationer.
 */
export async function POST(request: NextRequest) {
  try {
    // KRITISK: Tillåt både Auth0-autentiserade och anonyma sessioner
    const session = await auth0.getSession();
    let userSub: string;
    
    if (session?.user?.sub) {
      // Auth0-autentiserad användare
      userSub = session.user.sub;
    } else {
      // Anonym session - skapa eller hämta cookie-based sessionId
      userSub = await getOrCreateAnonymousSessionId();
      console.log(`[Onboarding Start] Using anonymous sessionId: ${userSub}`);
    }
    
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

    if (forceNew) {
      // Custom signup: skapa alltid ny onboarding
      const onboardingId = await createNewOnboardingSession(userSub);
      console.log(`[Onboarding Start] Created new onboarding session (forceNew): ${onboardingId} for userSub: ${userSub}`);
      
      // Spara email i onboarding-state om det finns (från signup-context)
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
      
      // KRITISK: Onboarding-session är skapad (FSM-transition klar)
      // Admin-sync är best effort och får aldrig påverka session-skapandet
      
      if (email) {
        patchAdminOnboarding(onboardingId, 'contact', {
          email,
          primaryContact: { email, name },
        }).catch((err) => {
          // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
          console.warn(`[Onboarding Start] Admin PATCH contact failed (non-blocking) for onboarding ${onboardingId}:`, err);
        });
      }
      
      sendToAdminPortal('onboarding', {
        idempotencyKey: `onboarding-${onboardingId}-start`,
        publicOnboardingId: onboardingId,
        user: email ? { email } : {},
        status: state.status, // Använd formell status från FSM
        onboardingStatus: state.status, // För bakåtkompatibilitet
      }).catch((err) => {
        // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
        console.warn(`[Onboarding Start] Admin ingest failed (non-blocking) for onboarding ${onboardingId}:`, err);
      });
      return NextResponse.json({ 
        onboardingId, 
        userSub,
        isAnonymous: isAnonymousSessionId(userSub),
      });
    }
    
    // Resume-flöde: kontrollera om befintlig onboarding finns
    const existingOnboardingId = await getActiveOnboardingId(userSub);
    if (existingOnboardingId) {
      console.log(`[Onboarding Start] Reusing existing onboarding: ${existingOnboardingId} for userSub: ${userSub}`);
      
      // Hämta state för att få email från onboarding-state (inte Auth0)
      const events = await listOnboardingEvents(existingOnboardingId);
      const state = reduceOnboarding(events, existingOnboardingId, userSub);
      const email = state.email || '';
      const name = state.name || '';
      
      if (email) {
        patchAdminOnboarding(existingOnboardingId, 'contact', {
          email,
          primaryContact: { email, name },
        }).catch((err) => console.error('[Onboarding Start] Admin PATCH contact failed:', err));
      }
      
      sendToAdminPortal('onboarding', {
        idempotencyKey: `onboarding-${existingOnboardingId}-start`,
        publicOnboardingId: existingOnboardingId,
        user: email ? { email } : {},
        status: 'started',
      }).catch((err) => console.error('[Onboarding Start] Ingest onboarding failed:', err));
      return NextResponse.json({ onboardingId: existingOnboardingId, userSub });
    }
    
    // Ingen befintlig onboarding: skapa ny
    const onboardingId = await createNewOnboardingSession(userSub);
    console.log(`[Onboarding Start] Created new onboarding session: ${onboardingId} for userSub: ${userSub}`);
    
    // Spara email i onboarding-state om det finns (från request body)
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
    
    if (email) {
      patchAdminOnboarding(onboardingId, 'contact', {
        email,
        primaryContact: { email, name },
      }).catch((err) => console.error('[Onboarding Start] Admin PATCH contact failed:', err));
    }
    
    sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-start`,
      publicOnboardingId: onboardingId,
      user: email ? { email } : {},
      status: 'started',
    }).catch((err) => console.error('[Onboarding Start] Ingest onboarding failed:', err));
    return NextResponse.json({ onboardingId, userSub });
  } catch (error) {
    console.error('[Onboarding Start] Error:', error);
    return NextResponse.json({ error: 'Failed to start onboarding' }, { status: 500 });
  }
}

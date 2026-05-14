import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getActiveOnboardingIdForSession, createNewOnboardingSession, bindOnboardingToSession, getActiveOnboardingForSession } from '@/lib/storage/onboarding-sessions';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { patchAdminOnboarding, sendToAdminPortal } from '@/lib/api/admin-portal';
import { auth0 } from '@/lib/auth0';

/**
 * POST /api/onboarding/start
 * Skapar en ny onboarding-session explicit.
 * 
 * Detta är ENDA platsen som får skapa onboarding-sessioner.
 * Anropas från frontend när GET /api/onboarding/id returnerar 404.
 * 
 * KRITISK: Kräver Auth0-autentisering.
 * Användaren måste vara inloggad innan onboarding kan startas.
 * 
 * @param forceNew - Om true, skapar alltid ny onboarding även om befintlig finns (för custom signup)
 * 
 * Returnerar { onboardingId, userSub, isAnonymous } (userSub = Auth0 user.sub, isAnonymous = false).
 */
export async function POST(request: NextRequest) {
  try {
    // KRITISK: Kräv Auth0-autentisering
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      console.warn('[Onboarding Start] POST called without Auth0 authentication');
      return NextResponse.json(
        {
          error: 'AUTH_REQUIRED',
          message: 'User must be authenticated before starting onboarding',
        },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    const isAnonymous = false;
    console.log(`[Onboarding Start] Using Auth0 userSub: ${userSub}`);
    
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
    // Samma Auth0 userSub → samma onboardingId
    let onboardingId = await getActiveOnboardingIdForSession(userSub);
    
    if (!onboardingId || forceNew) {
      // Läs source_onboarding_id-cookie satt på /priser via /api/onboarding/package-selected.
      // Om cookien finns ska vi använda samma UUID som package_selected-eventet så att
      // hela kedjan av events (package_selected → start → questions → code → stripe)
      // delar ett gemensamt UUID. Annars skapas två separata 'inkommande'-rader i admin.
      const cookieStore = await cookies();
      const cookieOnboardingId = cookieStore.get('source_onboarding_id')?.value;

      // Skapa ny onboarding — använd cookie-UUID om det finns, annars generera nytt
      onboardingId = await createNewOnboardingSession(userSub, cookieOnboardingId);
      console.log(
        `[Onboarding Start] Created new onboarding session${forceNew ? ' (forceNew)' : ''}: ${onboardingId} for userSub: ${userSub}` +
        (cookieOnboardingId && cookieOnboardingId === onboardingId
          ? ' (from source_onboarding_id-cookie)'
          : '')
      );

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
    
    // Konsumera source_onboarding_id-cookien efter användning så den inte återanvänds
    // av en annan kund som loggar in på samma device. Cookien har redan tjänat sitt syfte:
    // att bevara UUID:t från /priser-klicket till login.
    const response = NextResponse.json({
      onboardingId,
      userSub,
      isAnonymous,
    });
    response.cookies.set('source_onboarding_id', '', {
      maxAge: 0,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[Onboarding Start] Error:', error);
    return NextResponse.json({ error: 'Failed to start onboarding' }, { status: 500 });
  }
}

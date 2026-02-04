import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { isAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

const statusMap: Record<string, string> = {
  questions: 'påbörjad',
  code: 'påbörjad',
  stripe_started: 'påbörjad',
  stripe_completed: 'redo',
  complete: 'klar',
};

/**
 * POST /api/onboarding/step
 * Uppdaterar onboarding-steg.
 * 
 * KRITISK: Stödjer både Auth0-autentiserade och anonyma sessioner.
 * För anonyma sessioner används sessionId från request body som userSub.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, step, data, onboardingId: providedOnboardingId } = body || {};

    if (!sessionId || !step) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    // KRITISK: Tillåt både Auth0-autentiserade och anonyma sessioner
    const session = await auth0.getSession();
    let userSub: string;
    
    if (session?.user?.sub) {
      // Auth0-autentiserad användare - verifiera att sessionId matchar user.sub
      if (sessionId !== session.user.sub) {
        console.warn('[Onboarding Step] sessionId mismatch:', { sessionId, userSub: session.user.sub });
        return NextResponse.json(
          { success: false, message: 'Onboarding session does not match current user' },
          { status: 403 }
        );
      }
      userSub = session.user.sub;
    } else {
      // Anonym session - använd sessionId från request body som userSub
      if (!isAnonymousSessionId(sessionId)) {
        console.warn('[Onboarding Step] Invalid anonymous sessionId format:', sessionId);
        return NextResponse.json(
          { success: false, message: 'Invalid sessionId format' },
          { status: 400 }
        );
      }
      userSub = sessionId;
      console.log('[Onboarding Step] Using anonymous sessionId:', userSub);
    }

    // KRITISK FIX: Kräv explicit onboardingId - skapar INGET implicit
    if (!providedOnboardingId) {
      return NextResponse.json(
        { success: false, message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }
    
    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Step] Using onboardingId:', onboardingId);

    // Append event till event-logg (append-only, ingen read-modify-write)
    try {
      if (step === 'questions') {
        await appendOnboardingEvent(onboardingId, {
          type: 'questions_submitted',
          payload: data,
        });
        // Om email finns i data (från questions-formuläret), spara det också i onboarding-state
        if (data.userEmail && typeof data.userEmail === 'string' && data.userEmail.trim()) {
          await appendOnboardingEvent(onboardingId, {
            type: 'email_set',
            payload: {
              email: data.userEmail.trim(),
              name: typeof data.userName === 'string' ? data.userName.trim() : undefined,
            },
          });
        }
      } else if (step === 'code') {
        await appendOnboardingEvent(onboardingId, {
          type: 'code_submitted',
          payload: {
            repoLink: data.repoLink,
            codeText: data.codeText,
            fileName: data.fileName,
          },
        });
      } else if (step === 'stripe_started') {
        await appendOnboardingEvent(onboardingId, {
          type: 'stripe_started',
          payload: { accountId: data.accountId },
        });
      } else if (step === 'stripe_completed') {
        await appendOnboardingEvent(onboardingId, {
          type: 'stripe_completed',
          payload: { accountId: data.accountId },
        });
      }
    } catch (eventError) {
      console.error('[Onboarding Step] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    // KRITISK: FSM-transitionen är klar (event append lyckades)
    // Returnera 200 omedelbart - admin-sync är best effort och får inte påverka FSM
    
    // Hämta state från onboarding-state (inte Auth0 session)
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);
    const email = state.email || '';

    // Admin-sync: fire-and-forget (best effort, får aldrig kasta eller orsaka 500)
    // Detta är arkitekturkrav: FSM-transitioner får aldrig bero på externa system
    const payload = {
      idempotencyKey: `onboarding-${onboardingId}-${step}`,
      onboardingId,
      sessionId,
      step,
      onboardingStatus: state.status, // Använd formell status från FSM (inte heuristik)
      user: email ? { email, sub: userSub } : { sub: userSub },
      data,
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    };

    // Best effort: admin-sync får aldrig påverka FSM-transitionen
    sendToAdminPortal('onboarding', payload).catch((adminError) => {
      // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
      console.warn(`[Onboarding Step] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
    });

    // Returnera 200 oavsett admin-sync-resultat
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboarding Step] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

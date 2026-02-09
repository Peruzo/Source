import { NextResponse } from 'next/server';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { isAnonymousSessionId, getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

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
    const { onboardingId: providedOnboardingId, step, nextStep, answers, data, sessionId } = body || {};

    // KRITISK FIX: Kräv explicit onboardingId - skapar INGET implicit
    // 400 får ENDAST ske om onboardingId saknas
    if (!providedOnboardingId) {
      console.error('[Onboarding Step] Missing onboardingId in payload');
      return NextResponse.json(
        { success: false, message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }
    
    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Step] Using onboardingId:', onboardingId);

    // BACKEND TOLERANS: Om step saknas → inferera från nuvarande FSM-state
    let currentStep = step;
    if (!currentStep) {
      const events = await listOnboardingEvents(onboardingId);
      const tempState = reduceOnboarding(events, onboardingId, 'temp');
      // Inferera step från status
      if (tempState.status === 'started') {
        currentStep = 'questions';
      } else if (tempState.status === 'questions_completed' || tempState.status === 'code_pending') {
        currentStep = 'code';
      } else if (tempState.status === 'code_completed') {
        currentStep = 'stripe';
      } else {
        currentStep = 'questions'; // Default fallback
      }
      console.log(`[Onboarding Step] Inferred step from FSM state: ${currentStep} (status: ${tempState.status})`);
    }

    // Hämta sessionId från cookie om det inte finns i payload (bakåtkompatibilitet)
    let userSub: string | null = null;
    if (sessionId && isAnonymousSessionId(sessionId)) {
      userSub = sessionId;
    } else {
      // Försök hämta från cookie (för bakåtkompatibilitet)
      userSub = await getAnonymousSessionId();
    }

    if (!userSub) {
      console.warn('[Onboarding Step] No valid sessionId found');
      return NextResponse.json(
        { success: false, message: 'Missing sessionId' },
        { status: 400 }
      );
    }

    console.log('[Onboarding Step] Using anonymous sessionId:', userSub);

    // Använd answers om det finns, annars data (bakåtkompatibilitet)
    const payloadData = answers || data;

    // VALIDERA payload för questions-step
    if (currentStep === 'questions') {
      if (!payloadData || typeof payloadData !== 'object') {
        console.error('[Onboarding Step] Invalid questions data:', payloadData);
        return NextResponse.json({ success: false, message: 'Invalid questions data' }, { status: 400 });
      }
      const requiredFields = ['hasExistingSite', 'currentStage', 'primaryGoal', 'customerCount'];
      const missingFields: string[] = [];
      for (const field of requiredFields) {
        if (!payloadData[field]) {
          missingFields.push(field);
        }
      }
      if (missingFields.length > 0) {
        console.error('[Onboarding Step] Missing required fields:', missingFields);
        return NextResponse.json({ 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        }, { status: 400 });
      }
    }

    // KRITISKT: Append event till event-logg (append-only, ingen read-modify-write)
    // FSM-transitionen MÅSTE sparas för att state ska uppdateras
    try {
      if (currentStep === 'questions') {
        await appendOnboardingEvent(onboardingId, {
          type: 'questions_submitted',
          payload: payloadData,
        });
        console.log(`[Onboarding Step] Appended questions_submitted event for onboarding ${onboardingId}`);
        
        // Om email finns i payloadData (från questions-formuläret), spara det också i onboarding-state
        if (payloadData.userEmail && typeof payloadData.userEmail === 'string' && payloadData.userEmail.trim()) {
          await appendOnboardingEvent(onboardingId, {
            type: 'email_set',
            payload: {
              email: payloadData.userEmail.trim(),
              name: typeof payloadData.userName === 'string' ? payloadData.userName.trim() : undefined,
            },
          });
        }
      } else if (currentStep === 'code') {
        await appendOnboardingEvent(onboardingId, {
          type: 'code_submitted',
          payload: {
            repoLink: payloadData.repoLink,
            codeText: payloadData.codeText,
            fileName: payloadData.fileName,
          },
        });
      } else if (currentStep === 'stripe_started') {
        await appendOnboardingEvent(onboardingId, {
          type: 'stripe_started',
          payload: { accountId: payloadData.accountId },
        });
      } else if (currentStep === 'stripe_completed') {
        await appendOnboardingEvent(onboardingId, {
          type: 'stripe_completed',
          payload: { accountId: payloadData.accountId },
        });
      }
    } catch (eventError) {
      console.error('[Onboarding Step] CRITICAL: Failed to append event:', eventError);
      // KRITISKT: Om event-sparning misslyckas kan FSM-transitionen inte appliceras
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to save onboarding step. Please try again.' 
      }, { status: 500 });
    }

    // KRITISK: FSM-transitionen är klar (event append lyckades)
    // Hämta UPPDATERAD state från onboarding-state (inklusive nyss appendade event)
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);
    const email = state.email || '';

    // Bestäm nextStep: använd explicit nextStep från payload, annars inferera från questions-data
    let determinedNextStep: string | undefined;
    if (nextStep) {
      // nextStep = "code" måste accepteras
      determinedNextStep = nextStep;
    } else if (currentStep === 'questions') {
      // Atomiskt: om hasExistingSite === 'Ja' → 'code', annars → 'stripe'
      determinedNextStep = payloadData.hasExistingSite === 'Ja' ? 'code' : 'stripe';
    }

    // KRITISKT: För admin-sync, skicka nextStep (inte currentStep) när questions_submitted
    // Admin ingest måste visa step progression: questions → code
    const adminStep = currentStep === 'questions' && determinedNextStep ? determinedNextStep : currentStep;

    // Admin-sync: fire-and-forget (best effort, får aldrig kasta eller orsaka 500)
    // Detta är arkitekturkrav: FSM-transitioner får aldrig bero på externa system
    const adminPayload = {
      idempotencyKey: `onboarding-${onboardingId}-${currentStep}-${determinedNextStep || 'completed'}`,
      onboardingId,
      sessionId: userSub,
      step: adminStep, // KRITISKT: Skicka nextStep (code) istället för currentStep (questions)
      onboardingStatus: state.status, // Använd formell status från FSM (code_pending eller questions_completed)
      user: email ? { email, sub: userSub } : { sub: userSub },
      data: payloadData,
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    };

    // FSM GUARD – prevent duplicate transitions
    // questions_submitted skickas endast om FSM faktiskt är i questions
    // Om FSM redan är code_pending → inget event skickas
    if (
      adminPayload.step === 'questions' &&
      state.status !== 'started'
    ) {
      console.info(
        '[FSM GUARD] Event blocked',
        { step: adminPayload.step, fsmStatus: state.status, onboardingId }
      );
    } else {
      // Best effort: admin-sync får aldrig påverka FSM-transitionen
      sendToAdminPortal('onboarding', adminPayload).catch((adminError) => {
        // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
        console.warn(`[Onboarding Step] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
      });
    }

    // RESPONSE CONTRACT: Returnera alltid success: true och nextStep när questions skickas
    if (currentStep === 'questions') {
      return NextResponse.json({ 
        success: true, 
        nextStep: determinedNextStep || 'stripe',
        step: determinedNextStep || 'stripe' // För bakåtkompatibilitet
      });
    }
    
    // För andra steps, returnera success: true
    return NextResponse.json({ success: true, ...(determinedNextStep ? { nextStep: determinedNextStep } : {}) });
  } catch (error) {
    console.error('[Onboarding Step] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

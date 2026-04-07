import { NextResponse } from 'next/server';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents, isGithubRepoVerifiedFromEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { auth0 } from '@/lib/auth0';

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
 * KRITISK: Kräver Auth0-autentisering.
 * Användaren måste vara inloggad för att uppdatera onboarding-steg.
 */
export async function POST(request: Request) {
  try {
    // KRITISK: Kräv Auth0-autentisering
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      console.warn('[Onboarding Step] POST called without Auth0 authentication');
      return NextResponse.json(
        {
          error: 'AUTH_REQUIRED',
          message: 'User must be authenticated to update onboarding steps',
        },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Step] Using Auth0 userSub:', userSub);

    const body = await request.json();
    const { onboardingId: providedOnboardingId, step, nextStep, answers, data } = body || {};

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
      const tempState = reduceOnboarding(events, onboardingId, userSub);
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

    // Använd answers om det finns, annars data (bakåtkompatibilitet)
    const payloadData = answers || data;

    // VALIDERA payload för questions-step
    if (currentStep === 'questions') {
      if (!payloadData || typeof payloadData !== 'object') {
        console.error('[Onboarding Step] Invalid questions data:', payloadData);
        return NextResponse.json({ success: false, message: 'Invalid questions data' }, { status: 400 });
      }
      const requiredFields = ['hasExistingSite', 'currentStage', 'primaryGoal', 'legalEntityType', 'employeeCount', 'heardAboutUs'];
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
        // KRITISK SÄKERHET: Om repoLink finns, verifiera att privata repon är OAuth-verifierade
        // code_submitted får ALDRIG skapas för privata repon utan github_repo_verified-event
        if (payloadData.repoLink) {
          const access = await checkRepoAccess(payloadData.repoLink);
          
          // Om repot är privat, kräv github_repo_verified event
          // github_repo_verified är INTE ett FSM-event - läser direkt från events
          if (access.private === true) {
            const events = await listOnboardingEvents(onboardingId);
            const githubVerification = isGithubRepoVerifiedFromEvents(events);
            
            if (!githubVerification.verified) {
              console.warn('[Onboarding Step] Private repo requires OAuth verification', {
                onboardingId,
                repoLink: payloadData.repoLink,
                githubVerified: false,
              });
              
              return NextResponse.json(
                {
                  success: false,
                  error: 'GITHUB_OAUTH_REQUIRED',
                  message: 'Privata GitHub-repon kräver OAuth-auktorisering innan kod kan laddas upp.',
                  nextStep: 'github_auth',
                },
                { status: 403 }
              );
            }
          }
        }
        
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

    // För questions: nextStep bestäms ALLTID från hasExistingSite på backend (strikt 'Ja' → code)
    const hasExistingSiteRaw = currentStep === 'questions' ? payloadData.hasExistingSite : undefined;
    console.log('[Onboarding Step] hasExistingSite (raw):', hasExistingSiteRaw, 'type:', typeof hasExistingSiteRaw, 'state.status:', state.status);

    let determinedNextStep: string | undefined;
    if (currentStep === 'questions') {
      // Strikt: endast exakt strängen "Ja" → code, annars (Nej, undefined, annan casing) → stripe
      determinedNextStep = hasExistingSiteRaw === 'Ja' ? 'code' : 'stripe';
      console.log('[Onboarding Step] determinedNextStep (from hasExistingSite):', determinedNextStep);
    } else if (nextStep) {
      determinedNextStep = nextStep;
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

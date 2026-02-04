import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';

const statusMap: Record<string, string> = {
  questions: 'påbörjad',
  code: 'påbörjad',
  stripe_started: 'påbörjad',
  stripe_completed: 'redo',
  complete: 'klar',
};

/**
 * POST /api/onboarding/step
 * Uppdaterar onboarding-steg för autentiserad användare.
 * Sparar state i backend (GCS) och skickar till admin-portalen.
 */
export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding Step] POST called without authentication');
      return NextResponse.json(
        { error: 'NOT_AUTHENTICATED', success: false },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Step] userSub =', userSub);

    const body = await request.json();
    const { sessionId, step, data, onboardingId: providedOnboardingId } = body || {};

    if (!sessionId || !step) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    // Verifiera att sessionId matchar user.sub
    if (sessionId !== userSub) {
      console.warn('[Onboarding Step] sessionId mismatch:', { sessionId, userSub });
      return NextResponse.json(
        { success: false, message: 'Onboarding session does not match current user' },
        { status: 403 }
      );
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

    // Hämta email från onboarding-state (inte Auth0 session)
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, userSub);
    const email = state.email || '';

    // Skicka till admin-portalen (befintlig logik)
    const payload = {
      idempotencyKey: `onboarding-${onboardingId}-${step}`,
      onboardingId,
      sessionId,
      step,
      onboardingStatus: statusMap[step] || 'påbörjad',
      user: email ? { email, sub: session.user.sub } : { sub: session.user.sub },
      data,
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    };

    await sendToAdminPortal('onboarding', payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboarding Step] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

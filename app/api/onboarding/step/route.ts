import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';

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
    const { sessionId, step, data } = body || {};

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

    // Append event till event-logg (append-only, ingen read-modify-write)
    try {
      if (step === 'questions') {
        await appendOnboardingEvent(userSub, {
          type: 'questions_submitted',
          payload: data,
        });
      } else if (step === 'code') {
        await appendOnboardingEvent(userSub, {
          type: 'code_submitted',
          payload: {
            repoLink: data.repoLink,
            codeText: data.codeText,
            fileName: data.fileName,
          },
        });
      } else if (step === 'stripe_started') {
        await appendOnboardingEvent(userSub, {
          type: 'stripe_started',
          payload: { accountId: data.accountId },
        });
      } else if (step === 'stripe_completed') {
        await appendOnboardingEvent(userSub, {
          type: 'stripe_completed',
          payload: { accountId: data.accountId },
        });
      }
    } catch (eventError) {
      console.error('[Onboarding Step] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    // Skicka till admin-portalen (befintlig logik)
    const payload = {
      idempotencyKey: `onboarding-${sessionId}-${step}`,
      sessionId,
      step,
      onboardingStatus: statusMap[step] || 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
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

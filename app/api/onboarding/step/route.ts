import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const statusMap: Record<string, string> = {
  questions: 'påbörjad',
  code: 'påbörjad',
  stripe_started: 'påbörjad',
  stripe_completed: 'redo',
  complete: 'klar',
};

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, step, data } = body || {};

    if (!sessionId || !step) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    if (sessionId !== session.user.sub) {
      return NextResponse.json(
        { success: false, message: 'Onboarding session does not match current user' },
        { status: 403 }
      );
    }

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

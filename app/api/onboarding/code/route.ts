import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const formData = await request.formData();
    const sessionId = String(formData.get('sessionId') || '');
    const repoLink = String(formData.get('repoLink') || '');
    const codeText = String(formData.get('codeText') || '');
    const file = formData.get('file') as File | null;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    let filePayload: null | {
      name: string;
      type: string;
      size: number;
      base64: string;
    } = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      filePayload = {
        name: file.name,
        type: file.type,
        size: file.size,
        base64: buffer.toString('base64'),
      };
    }

    const payload = {
      idempotencyKey: `onboarding-${sessionId}-code`,
      sessionId,
      step: 'code',
      onboardingStatus: 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      data: {
        repoLink,
        codeText,
        file: filePayload,
        temporary: true,
        readOnly: true,
      },
      submittedAt: new Date().toISOString(),
      source: 'public_onboarding',
    };

    await sendToAdminPortal('onboarding', payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboarding Code] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

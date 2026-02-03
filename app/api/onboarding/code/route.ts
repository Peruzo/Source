import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    
    // Hard guard: kräv autentisering med user.sub
    if (!session?.user?.sub) {
      console.warn('[Onboarding Code] POST called without authentication');
      return NextResponse.json(
        { error: 'NOT_AUTHENTICATED', success: false },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Code] userSub =', userSub);

    const formData = await request.formData();
    const sessionId = String(formData.get('sessionId') || '');
    const providedOnboardingId = formData.get('onboardingId')?.toString();

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    // Verifiera att sessionId matchar user.sub
    if (sessionId !== userSub) {
      console.warn('[Onboarding Code] sessionId mismatch:', { sessionId, userSub });
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
    console.log('[Onboarding Code] Using onboardingId:', onboardingId);

    const repoLink = String(formData.get('repoLink') || '').trim();
    const codeText = String(formData.get('codeText') || '');
    const file = formData.get('file') as File | null;

    // Only repo link, no file/codeText: verify GitHub repo; if private, return flags for GitHub OAuth
    if (repoLink && !file && !codeText.trim()) {
      const access = await checkRepoAccess(repoLink);
      if (access.repoSlug && (access.private || !access.ok)) {
        return NextResponse.json({
          success: false,
          repoPrivate: true,
          requiresGithubAccess: true,
          repoSlug: access.repoSlug,
        });
      }
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

    // Append event till event-logg (append-only, ingen read-modify-write)
    // onboardingId är redan hämtat/skapat ovan
    try {
      await appendOnboardingEvent(onboardingId, {
        type: 'code_submitted',
        payload: {
          repoLink,
          codeText,
          fileName: file?.name,
        },
      });
    } catch (eventError) {
      console.error('[Onboarding Code] Error appending event:', eventError);
      // Fortsätt även om event-sparning misslyckas (admin-portalen är primär)
    }

    const payload = {
      idempotencyKey: `onboarding-${onboardingId}-code`,
      onboardingId,
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

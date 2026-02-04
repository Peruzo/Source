import { NextResponse } from 'next/server';
import { sendToAdminPortal } from '@/lib/api/admin-portal';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { isAnonymousSessionId } from '@/lib/onboarding/anonymous-session';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sessionId = String(formData.get('sessionId') || '');
    const providedOnboardingId = formData.get('onboardingId')?.toString();

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    // KRITISK: Använd ENDAST anonyma sessioner (cookie-based sessionId)
    // Auth0-init får INTE ske för onboarding-code (förhindrar implicit Auth0-init)
    // Verifiera att sessionId är anonym format
    if (!isAnonymousSessionId(sessionId)) {
      console.warn('[Onboarding Code] Invalid anonymous sessionId format:', sessionId);
      return NextResponse.json(
        { success: false, message: 'Invalid sessionId format' },
        { status: 400 }
      );
    }
    const userSub = sessionId;
    console.log('[Onboarding Code] Using anonymous sessionId:', userSub);

    // KRITISK FIX: Kräv explicit onboardingId - skapar INGET implicit
    if (!providedOnboardingId) {
      return NextResponse.json(
        { success: false, message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }
    
    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Code] Using onboardingId:', onboardingId);

    // Förhindra POST när kod redan är kopplad via GitHub (backend-driven)
    const events = await listOnboardingEvents(onboardingId);
    const currentState = reduceOnboarding(events, onboardingId, userSub);
    if (currentState.code?.codeSource === 'github') {
      return NextResponse.json(
        { success: false, message: 'Code already linked via GitHub.' },
        { status: 400 }
      );
    }

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

    // KRITISK: FSM-transitionen är klar (event append lyckades)
    // Returnera 200 omedelbart - admin-sync är best effort och får inte påverka FSM
    
    // Hämta state från onboarding-state (inte Auth0 session)
    const updatedEvents = await listOnboardingEvents(onboardingId);
    const updatedState = reduceOnboarding(updatedEvents, onboardingId, userSub);
    const email = updatedState.email || '';

    const payload = {
      idempotencyKey: `onboarding-${onboardingId}-code`,
      onboardingId,
      sessionId,
      step: 'code',
      onboardingStatus: updatedState.status, // Använd formell status från FSM
      user: email ? { email, sub: userSub } : { sub: userSub },
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

    // Best effort: admin-sync får aldrig påverka FSM-transitionen
    sendToAdminPortal('onboarding', payload).catch((adminError) => {
      // Logga varning men kasta aldrig - admin-sync är sekundär till FSM
      console.warn(`[Onboarding Code] Admin sync failed (non-blocking) for onboarding ${onboardingId}:`, adminError);
    });

    // Returnera 200 oavsett admin-sync-resultat
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboarding Code] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

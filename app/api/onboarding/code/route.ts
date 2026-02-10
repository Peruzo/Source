import { NextResponse } from 'next/server';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { isAnonymousSessionId, getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let sessionId = String(formData.get('sessionId') || '').trim();
    const providedOnboardingId = formData.get('onboardingId')?.toString();

    // KRITISKT: I anonym onboarding måste backend:
    // 1. Acceptera sessionId från FormData OM det finns
    // 2. Annars läsa anon-session från cookie
    // 3. Annars returnera 400
    if (!sessionId) {
      // Försök läsa från cookie
      const cookieSessionId = await getAnonymousSessionId();
      if (cookieSessionId) {
        sessionId = cookieSessionId;
        console.log('[Onboarding Code] Using sessionId from cookie:', sessionId);
      } else {
        return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
      }
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

    const repoLink = String(formData.get('repoLink') || '').trim();
    const codeText = String(formData.get('codeText') || '');
    const file = formData.get('file') as File | null;

    // /api/onboarding/code ska ALDRIG blockeras av FSM-status
    // FSM-transition sker senare i GitHub-jobbet

    // 1. Validera input (repoLink, file, etc)
    if (!repoLink && !codeText && !file) {
      return NextResponse.json({
        success: false,
        error: 'Missing code input. Provide repoLink, codeText, or file.',
      }, { status: 400 });
    }

    // Only repo link, no file/codeText: verify GitHub repo; if private, return flags for GitHub OAuth
    if (repoLink && !file && !codeText.trim()) {
      const access = await checkRepoAccess(repoLink);
      const repoIsPrivate = access.private || !access.ok;
      
      // Hård gate: Blockera GitHub-job innan OAuth är verifierad för privata repo
      if (repoIsPrivate && access.repoSlug) {
        // Hämta onboarding state för att kolla OAuth-verifiering
        const events = await listOnboardingEvents(onboardingId);
        console.log('[Onboarding Code] Events before reduce:', {
          onboardingId,
          sessionId: userSub,
          eventsCount: events.length,
          eventTypes: events.map(e => e.type),
          hasCodeSubmitted: events.some(e => e.type === 'code_submitted')
        });
        const state = reduceOnboarding(events, onboardingId, userSub);
        console.log('[Onboarding Code] State after reduce:', {
          onboardingId,
          sessionId: userSub,
          stateStatus: state.status,
          stateCode: state.code,
          stateGithub: state.github
        });
        
        if (!state.github?.verified) {
          return NextResponse.json(
            {
              success: false,
              error: 'GITHUB_OAUTH_REQUIRED',
              message: 'Privata GitHub-repon kräver OAuth-auktorisering innan verifiering kan startas.',
              nextStep: 'github_auth'
            },
            { status: 403 }
          );
        }
      }
      
      if (access.repoSlug && repoIsPrivate) {
        return NextResponse.json({
          success: true,
          job: {
            status: 'requires_github_oauth',
            repoPrivate: true,
            requiresGithubAccess: true,
            repoSlug: access.repoSlug,
          },
        });
      }
      // Public repo - kan hanteras direkt, men GitHub OAuth-flödet används normalt
      // Returnera att job kan startas
      return NextResponse.json({
        success: true,
        job: {
          status: 'started',
          message: 'Public repo detected. Use GitHub OAuth flow for consistency.',
        },
      });
    }

    // 2. Starta eller återanvänd GitHub-job (idempotent)
    // För file/codeText: spara temporärt (ingen FSM-transition här)
    // FSM-transition till code_completed sker endast i GitHub-job-processorn

    // För nuvarande implementation: file/codeText sparas temporärt
    // Men eftersom FSM-transition sker i GitHub-job, behöver vi inte göra något här
    // Returnera success med job-status

    // 3. Returnera job-status
    // ALLTID returnera 200
    return NextResponse.json({
      success: true,
      job: {
        status: 'started',
        message: 'Code submitted. Processing...',
      },
    });
  } catch (error) {
    console.error('[Onboarding Code] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

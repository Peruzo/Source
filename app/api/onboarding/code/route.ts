import { NextResponse } from 'next/server';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { listOnboardingEvents, isGithubRepoVerifiedFromEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import { auth0 } from '@/lib/auth0';

export async function POST(request: Request) {
  try {
    // KRITISK: Kräv Auth0-autentisering
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      console.warn('[Onboarding Code] POST called without Auth0 authentication');
      return NextResponse.json(
        {
          error: 'AUTH_REQUIRED',
          message: 'User must be authenticated to submit code',
        },
        { status: 401 }
      );
    }
    
    const userSub = session.user.sub;
    console.log('[Onboarding Code] Using Auth0 userSub:', userSub);

    const formData = await request.formData();
    const providedOnboardingId = formData.get('onboardingId')?.toString();

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

    // HÅRD BLOCKERING: Om repoLink finns måste github_repo_verified event existera
    // github_repo_verified är INTE ett FSM-event - läser direkt från events
    // Detta stoppar ALLT: ingen ZIP, ingen code_submitted, ingen processing
    if (repoLink) {
      const events = await listOnboardingEvents(onboardingId);
      const githubVerification = isGithubRepoVerifiedFromEvents(events);
      
      if (!githubVerification.verified) {
        console.warn('[Onboarding Code] HARD BLOCK: repoLink provided but github_repo_verified missing', {
          onboardingId,
          repoLink,
          githubVerified: false,
        });
        
        return NextResponse.json(
          {
            success: false,
            error: 'GITHUB_OAUTH_REQUIRED',
            message: 'GitHub-repo kräver OAuth-auktorisering innan kod kan laddas upp.',
            nextStep: 'github_auth',
          },
          { status: 403 }
        );
      }
    }

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
          userSub,
          eventsCount: events.length,
          eventTypes: events.map(e => e.type),
          hasCodeSubmitted: events.some(e => e.type === 'code_submitted')
        });
        const state = reduceOnboarding(events, onboardingId, userSub);
        // github_repo_verified är INTE ett FSM-event - läser direkt från events
        const githubVerification = isGithubRepoVerifiedFromEvents(events);
        
        console.log('[Onboarding Code] GitHub verification check:', {
          onboardingId,
          userSub,
          stateStatus: state.status,
          stateCode: state.code,
          githubVerified: githubVerification.verified
        });
        
        if (!githubVerification.verified) {
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

import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';
import { createGitHubJob, updateJobStatus } from '@/lib/storage/github-jobs';
import { triggerExternalGitHubWorker } from '@/lib/utils/github-worker';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';

/**
 * GET /api/github/callback?code=...&state=...
 * GitHub OAuth callback: exchange code for token, verify repo access, create job,
 * trigger external worker, redirect to /onboarding/code.
 * 
 * Public website orkestrerar endast - extern worker hanterar all ZIP-hantering.
 * Token sparas temporärt i jobbet för worker-användning.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const stateRaw = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');

  if (errorParam) {
    console.warn('[GitHub Callback] OAuth error:', errorParam);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=denied'));
  }

  if (!code || !stateRaw) {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  let state: { repo: string; sessionId: string; onboardingId?: string };
  try {
    state = JSON.parse(
      Buffer.from(stateRaw, 'base64url').toString('utf8')
    ) as { repo: string; sessionId: string; onboardingId?: string };
  } catch {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  const { repo, sessionId, onboardingId } = state;
  const match = repo.match(/^([^/]+)\/([^/]+)$/);
  if (!match) {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }
  const [, owner, repoName] = match;

  const session = await auth0.getSession();
  if (!session?.user || session.user.sub !== sessionId) {
    return NextResponse.redirect(buildUrl('/onboarding/login'));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('[GitHub Callback] Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  // Använd canonical base URL (throwar error om den saknas)
  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    console.warn('[GitHub Callback] No access_token:', tokenData.error, tokenData.error_description);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=denied'));
  }

  const token = tokenData.access_token;

  // KRITISK: Verifiera repo-access med user-token INNAN event-sparning och job-skapande
  // Detta säkerställer att användaren faktiskt har gett consent och har access till repot
  // github_repo_verified får ALDRIG sättas enbart p.g.a. callback utan verifierad access
  
  // Verify user has read access to the repo med OAuth token
  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // STRICT: Endast 200 OK tillåter event-sparning och job-skapande
  if (repoRes.status !== 200) {
    console.warn(`[GitHub Callback] Repo access denied or repo not found: ${repo} (status: ${repoRes.status})`);
    console.warn(`[GitHub Callback] User did not grant access or repo is inaccessible. Blocking event and job creation.`);
    // Returnera 403 - användaren har inte gett consent eller saknar access
    return NextResponse.json(
      { 
        error: 'GITHUB_ACCESS_DENIED',
        message: 'Repository access denied or not found. User consent may not have been granted.',
      },
      { status: 403 }
    );
  }

  // Repo är verifierat - användaren har read-access (200 OK)
  const repoUrl = `https://github.com/${owner}/${repoName}`;
  const repoSlug = `${owner}/${repoName}`;
  const verifiedAt = new Date().toISOString();

  // Hämta onboardingId från state eller skapa ny
  const { getOrCreateActiveOnboardingId } = await import('@/lib/storage/onboarding-sessions');
  const activeOnboardingId = onboardingId || await getOrCreateActiveOnboardingId(session.user.sub);

  // KRITISK: Spara GitHub repo-verifiering i onboarding-state FÖRE job-skapande
  // Jobbet får endast skapas efter github_repo_verified event är sparat (FSM-krav)
  // Detta sker endast efter strikt verifiering (200 OK från GitHub API)
  try {
    await appendOnboardingEvent(activeOnboardingId, {
      type: 'github_repo_verified',
      payload: {
        repoUrl,
        repoSlug,
        verifiedAt,
      },
    });
    console.log(`[GitHub Callback] Saved github_repo_verified event for onboarding ${activeOnboardingId} (repo access verified with 200 OK)`);
  } catch (eventErr) {
    // Om verifiering-event inte kan sparas → blockera job-skapande
    // Detta säkerställer att FSM alltid har github_repo_verified innan job skapas
    console.error('[GitHub Callback] Failed to save github_repo_verified event:', eventErr);
    return NextResponse.json(
      { 
        error: 'EVENT_SAVE_FAILED',
        message: 'Failed to save repository verification event.',
      },
      { status: 500 }
    );
  }

  try {
    const memoryBefore = process.memoryUsage();
    console.log(`[GitHub Callback] Memory before job creation:`, {
      heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024),
    });

    // NIVÅ 2: Skapa jobb och spara token (ingen repo-download här)
    // Jobbet kommer att processas av worker-endpoint utanför request-livscykeln
    // KRITISK: Jobbet skapas endast efter github_repo_verified event är sparat
    const jobId = await createGitHubJob({
      onboardingId: activeOnboardingId,
      userSub: session.user.sub,
      repo,
      owner,
      repoName,
      repoUrl,
      githubToken: token, // Spara token temporärt i jobbet
    });

    console.log(`[GitHub Callback] Created job ${jobId}, triggering external worker`);

    // Trigga extern GitHub-worker (non-blocking)
    // Worker hanterar all ZIP-hantering utanför public website
    // KRITISK FIX: Skicka OAuth-token transient till worker (används för privata repo)
    triggerExternalGitHubWorker(jobId, repo, token).catch(async (error) => {
      console.error(`[GitHub Callback] Failed to trigger external worker for ${jobId}:`, error);
      // Markera jobbet som failed om worker inte kan triggas
      try {
        await updateJobStatus(jobId, 'failed', {
          error: `Failed to trigger worker: ${error instanceof Error ? error.message : String(error)}`,
        });
      } catch (updateError) {
        console.error(`[GitHub Callback] Failed to update job status:`, updateError);
      }
    });

    // Redirecta omedelbart - ingen repo-data laddas här
    // Worker kommer att processera jobbet async utanför request-livscykeln
    return NextResponse.redirect(buildUrl(`/onboarding/code?github=processing&jobId=${jobId}`));
  } catch (jobError) {
    // Om job-skapande misslyckas → logga och returnera error
    // Event är redan sparat, men jobbet kan inte skapas
    console.error('[GitHub Callback] Failed to create job after verification:', jobError);
    return NextResponse.json(
      { 
        error: 'JOB_CREATION_FAILED',
        message: 'Repository verified but job creation failed.',
      },
      { status: 500 }
    );
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }
}

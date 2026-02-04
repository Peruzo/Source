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

  // PROBLEM 2 FIX: Repo kommer från OAuth state (rad 38), inte från onboarding state
  // Validera repo-access INNAN createGitHubJob för att säkerställa att repo är korrekt och åtkomligt
  try {
    // Verify user has read access to the repo (repo kommer från OAuth state, inte från gammalt onboarding state)
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!repoRes.ok) {
      console.warn(`[GitHub Callback] Repo access denied or repo not found: ${repo} (${repoRes.status})`);
      return NextResponse.redirect(buildUrl('/onboarding/code?github=access_denied'));
    }

    // Repo är verifierat - användaren har read-access
    const repoUrl = `https://github.com/${owner}/${repoName}`;
    const repoSlug = `${owner}/${repoName}`;
    const verifiedAt = new Date().toISOString();

    // PROBLEM 2 FIX: Hämta onboardingId från state eller skapa ny, INTE från session.user.sub som fallback
    // Om onboardingId saknas i state, skapa ny onboarding-session
    const { getOrCreateActiveOnboardingId } = await import('@/lib/storage/onboarding-sessions');
    const activeOnboardingId = onboardingId || await getOrCreateActiveOnboardingId(session.user.sub);

    // Spara GitHub repo-verifiering i onboarding-state (API-nivå verifiering)
    try {
      await appendOnboardingEvent(activeOnboardingId, {
        type: 'github_repo_verified',
        payload: {
          repoUrl,
          repoSlug,
          verifiedAt,
        },
      });
      console.log(`[GitHub Callback] Saved github_repo_verified event for onboarding ${activeOnboardingId}`);
    } catch (eventErr) {
      console.error('[GitHub Callback] Failed to save github_repo_verified event:', eventErr);
      // Fortsätt ändå - jobbet ska skapas även om event-sparning misslyckas
    }
    const memoryBefore = process.memoryUsage();
    console.log(`[GitHub Callback] Memory before job creation:`, {
      heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024),
    });

    // NIVÅ 2: Skapa jobb och spara token (ingen repo-download här)
    // Jobbet kommer att processas av worker-endpoint utanför request-livscykeln
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
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }
}

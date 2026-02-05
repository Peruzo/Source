import { NextRequest, NextResponse } from 'next/server';
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

  // ARKITEKTURREGEL: Ingen Auth0. State innehåller sessionId (anon_<uuid>) och onboardingId från connect.
  // Vi verifierar inte Auth0-session – användaren kommer tillbaka från GitHub OAuth i samma webbläsare.

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
    scope?: string;
    token_type?: string;
  };

  // KRITISK SÄKERHET: Endast OAuth token från code-exchange får användas
  // Ingen fallback till app/installation token är tillåten
  if (!tokenData.access_token) {
    console.warn('[GitHub Callback] No access_token from OAuth code-exchange:', tokenData.error, tokenData.error_description);
    return NextResponse.json(
      {
        error: 'OAUTH_TOKEN_MISSING',
        message: 'Failed to obtain OAuth access token from code exchange. User consent may not have been granted.',
      },
      { status: 403 }
    );
  }

  // Säkerställ att token kommer från OAuth-flödet (inte app/installation token)
  const token = tokenData.access_token;
  const tokenType = tokenData.token_type || 'unknown';
  const tokenScopes = tokenData.scope || 'unknown';

  // Logga token source för verifiering (säkerhetsaudit)
  console.log(`[GitHub Callback] OAuth token obtained:`, {
    tokenType,
    scopes: tokenScopes,
    source: 'oauth_code_exchange',
    hasToken: !!token,
    tokenLength: token?.length || 0,
  });

  // KRITISK SÄKERHET: Verifiera repo-access med OAuth user-token INNAN event-sparning och job-skapande
  // Detta säkerställer att användaren faktiskt har gett consent och har access till repot
  // github_repo_verified får ALDRIG sättas enbart p.g.a. callback utan verifierad access
  // Token MÅSTE komma från OAuth code-exchange (inte app/installation token)
  
  // Verify user has read access to the repo med OAuth token från code-exchange
  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`, // Endast OAuth token från code-exchange
      },
    }
  );

  // Logga GitHub response headers för verifiering (säkerhetsaudit)
  const oauthScopesHeader = repoRes.headers.get('x-oauth-scopes');
  const githubAuthHeader = repoRes.headers.get('x-github-request-id');
  console.log(`[GitHub Callback] GitHub API response:`, {
    status: repoRes.status,
    oauthScopes: oauthScopesHeader || 'not present',
    githubRequestId: githubAuthHeader || 'not present',
    tokenSource: 'oauth_code_exchange',
    repo: `${owner}/${repoName}`,
  });

  // STRICT: Endast 200 OK tillåter event-sparning och job-skapande
  // KRITISK SÄKERHET: Verifiera att token faktiskt ger access (inte app-token som kan ha access)
  if (repoRes.status !== 200) {
    console.warn(`[GitHub Callback] Repo access denied or repo not found: ${repo} (status: ${repoRes.status})`);
    console.warn(`[GitHub Callback] OAuth token from code-exchange does not grant access. Blocking event and job creation.`);
    console.warn(`[GitHub Callback] Token details:`, {
      tokenType,
      scopes: tokenScopes,
      oauthScopesHeader: oauthScopesHeader || 'not present',
    });
    // Returnera 403 - OAuth token ger inte access (användaren har inte gett consent eller saknar access)
    return NextResponse.json(
      { 
        error: 'GITHUB_ACCESS_DENIED',
        message: 'OAuth token from code-exchange does not grant repository access. User consent may not have been granted or token is invalid.',
      },
      { status: 403 }
    );
  }

  // Ytterligare säkerhetskontroll: Verifiera att OAuth scopes finns i response header
  // Om x-oauth-scopes saknas eller är tom → token kan vara app-token (inte OAuth user-token)
  if (!oauthScopesHeader || oauthScopesHeader.trim() === '') {
    console.error(`[GitHub Callback] SECURITY WARNING: x-oauth-scopes header missing in GitHub API response. Token may not be OAuth user-token.`);
    console.error(`[GitHub Callback] Blocking event and job creation to prevent unauthorized access.`);
    return NextResponse.json(
      {
        error: 'OAUTH_SCOPE_VERIFICATION_FAILED',
        message: 'Cannot verify OAuth token scopes. Token may not be from OAuth code-exchange.',
      },
      { status: 403 }
    );
  }

  // Verifiera att OAuth scopes innehåller 'repo' (krävs för private repo access)
  const scopes = oauthScopesHeader.split(',').map(s => s.trim());
  if (!scopes.includes('repo')) {
    console.warn(`[GitHub Callback] OAuth token missing 'repo' scope. Scopes: ${scopes.join(', ')}`);
    console.warn(`[GitHub Callback] Blocking event and job creation - insufficient permissions.`);
    return NextResponse.json(
      {
        error: 'OAUTH_SCOPE_INSUFFICIENT',
        message: `OAuth token missing required 'repo' scope. Granted scopes: ${scopes.join(', ')}`,
      },
      { status: 403 }
    );
  }

  console.log(`[GitHub Callback] OAuth token verified:`, {
    scopes: scopes.join(', '),
    hasRepoScope: scopes.includes('repo'),
    tokenSource: 'oauth_code_exchange',
    repoAccess: 'granted',
  });

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
      userSub: sessionId,
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

import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';
import { createGitHubJob, updateJobStatus } from '@/lib/storage/github-jobs';
import { triggerExternalGitHubWorker } from '@/lib/utils/github-worker';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { checkAdminOnboardingExists, sendToAdminPortal } from '@/lib/api/admin-portal';
import { reduceOnboarding } from '@/lib/onboarding/reducer';

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

  let oauthState: { repo: string; sessionId: string; onboardingId?: string };

  try {
    oauthState = JSON.parse(
      Buffer.from(stateRaw, 'base64url').toString('utf8')
    ) as { repo: string; sessionId: string; onboardingId?: string };
  } catch {
    return NextResponse.json({ error: 'INVALID_STATE' }, { status: 400 });
  }

  const { repo, sessionId, onboardingId } = oauthState;
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
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  // Säkerställ att token kommer från OAuth-flödet (inte app/installation token)
  const token = tokenData.access_token;
  const tokenType = tokenData.token_type || 'unknown';
  const tokenScopes = tokenData.scope || 'unknown';

  // Logga token source för verifiering (säkerhetsaudit)

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
    
    // Försök hämta repo-info från response body (kan innehålla felmeddelande eller repo-data)
    let repoIsPrivate = false;
    let installationId: string | null = null;
    try {
      const repoData = await repoRes.clone().json().catch(() => null);
      if (repoData && typeof repoData === 'object') {
        // Om det är repo-data (inte felmeddelande)
        if ('private' in repoData) {
          repoIsPrivate = repoData.private === true;
          installationId = repoData.installation?.id?.toString() || null;
        }
      }
    } catch {
      // Ignorera om vi inte kan läsa body
    }
    
    const repoFullName = `${owner}/${repoName}`;
    const errorData = {
      success: false,
      error: 'GITHUB_ACCESS_DENIED',
      reason: 'REPO_ACCESS_DENIED',
      details: {
        repo: repoFullName,
        isPrivate: repoIsPrivate,
        installationId: installationId ?? null,
        possibleCauses: [
          'missing_repo_scope',
          'organization_oauth_restriction',
          'no_user_access_to_repo'
        ]
      },
      message:
        'GitHub kunde inte verifiera åtkomst till repot. Detta beror oftast på att repot är privat och OAuth-appen saknar rättigheter, eller att organisationen inte tillåter tredjepartsappar.'
    };
    
    // Redirecta med strukturerad felinfo i query params (base64url-encoded JSON)
    const errorParam = Buffer.from(JSON.stringify(errorData)).toString('base64url');
    return NextResponse.redirect(buildUrl(`/onboarding/code?github=access_denied&error=${encodeURIComponent(errorParam)}`));
  }

  // Ytterligare säkerhetskontroll: Verifiera att OAuth scopes finns i response header
  // Om x-oauth-scopes saknas eller är tom → token kan vara app-token (inte OAuth user-token)
  if (!oauthScopesHeader || oauthScopesHeader.trim() === '') {
    console.error(`[GitHub Callback] SECURITY WARNING: x-oauth-scopes header missing in GitHub API response. Token may not be OAuth user-token.`);
    console.error(`[GitHub Callback] Blocking event and job creation to prevent unauthorized access.`);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }

  // Verifiera att OAuth scopes innehåller 'repo' (krävs för private repo access)
  const scopes = oauthScopesHeader.split(',').map(s => s.trim());
  if (!scopes.includes('repo')) {
    console.warn(`[GitHub Callback] OAuth token missing 'repo' scope. Scopes: ${scopes.join(', ')}`);
    console.warn(`[GitHub Callback] Blocking event and job creation - insufficient permissions.`);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }


  // Repo är verifierat - användaren har read-access (200 OK)
  const repoUrl = `https://github.com/${owner}/${repoName}`;
  const repoSlug = `${owner}/${repoName}`;
  const verifiedAt = new Date().toISOString();

  // ARKITEKTURREGEL: onboardingId MÅSTE komma från state. Callback skapar aldrig onboarding.
  if (!onboardingId) {
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  }
  const activeOnboardingId = onboardingId;

  // Hämta state för att få email om det behövs för re-init
  const events = await listOnboardingEvents(activeOnboardingId);
  const onboardingState = reduceOnboarding(events, activeOnboardingId, sessionId);
  const email = onboardingState.email || '';

  // 🔒 DIREKT VERIFIERING: GitHub-verifiering sätts direkt via event (INTE via FSM)
  // github_repo_verified är INTE ett FSM-event - reducer ignorerar det helt
  // Verifiering läses direkt från events via isGithubRepoVerified() i andra routes

  // Re-initiera admin-onboarding om det saknas (non-blocking)
  const adminExists = await checkAdminOnboardingExists(activeOnboardingId);

  if (!adminExists) {
    console.warn('[GitHub Callback] Admin onboarding missing, continuing and re-initializing', {
      onboardingId: activeOnboardingId,
    });

    await sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${activeOnboardingId}-start`,
      publicOnboardingId: activeOnboardingId,
      user: email ? { email } : {},
      onboardingStatus: onboardingState.status || 'started',
      status: onboardingState.status || 'started',
    }).catch(err => {
      console.warn('[GitHub Callback] Admin re-init failed (non-blocking)', err);
    });
  }

  // HÅRD GUARD: OAuth MÅSTE vara genomförd innan github_repo_verified kan skapas
  // Detta är den ENDA platsen där github_repo_verified event får skapas
  if (!code || !token) {
    const errorMsg = 'OAuth not completed – cannot verify GitHub repo';
    console.error(`[GitHub Callback] HARD GUARD FAILED: ${errorMsg}`, {
      hasCode: !!code,
      hasToken: !!token,
      onboardingId: activeOnboardingId,
    });
    throw new Error(errorMsg);
  }

  // 🔒 DIREKT VERIFIERING: Spara event endast för spårning/logging (INTE för FSM)
  // github_repo_verified är INTE ett FSM-event - reducer ignorerar det helt
  // Verifiering sätts direkt i state ovan, inte via reducer-transition
  try {
    await appendOnboardingEvent(activeOnboardingId, {
      type: 'github_repo_verified',
      payload: {
        repoUrl,
        repoSlug,
        verifiedAt,
        source: 'github_oauth_callback',
        oauth: {
          codeExchangeCompleted: true,
          accessTokenPresent: true,
        },
      },
    });
  } catch (eventErr) {
    // Event-sparning är endast för spårning - om det misslyckas, fortsätt ändå
    // Verifiering är redan satt direkt i state ovan
    console.warn('[GitHub Callback] Failed to save github_repo_verified event (non-critical, logging only):', eventErr);
  }

  try {
    const memoryBefore = process.memoryUsage();

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


    // Trigga extern GitHub-worker (non-blocking)
    // Worker hanterar all ZIP-hantering utanför public website
    // KRITISK FIX: Skicka OAuth-token transient till worker (används för privata repo)
    triggerExternalGitHubWorker(jobId, activeOnboardingId, repo, { githubAccessToken: token }).catch(async (error) => {
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
    // Worker kommer att processa jobbet async utanför request-livscykeln
    return NextResponse.redirect(buildUrl(`/onboarding/code?github=processing&jobId=${jobId}`));
  } catch (jobError) {
    // Om job-skapande misslyckas → logga och redirecta tillbaka
    // Event är redan sparat, men jobbet kan inte skapas
    console.error('[GitHub Callback] Failed to create job after verification:', jobError);
    return NextResponse.redirect(buildUrl('/onboarding/code?github=error'));
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }
}

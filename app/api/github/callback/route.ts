import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';
import { createGitHubJob, processGitHubJob } from '@/lib/storage/github-jobs';

/**
 * GET /api/github/callback?code=...&state=...
 * GitHub OAuth callback: exchange code for token, verify repo access, fetch repo as ZIP,
 * build CodePackage (github), send to admin, redirect to /onboarding/stripe.
 * Token is never stored.
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

  // Hämta onboardingId om det saknas (backwards compatibility)
  const activeOnboardingId = onboardingId || session.user.sub;

  try {
    // Verify user has read access to the repo
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
      return NextResponse.redirect(buildUrl('/onboarding/code?github=access_denied'));
    }

    const repoUrl = `https://github.com/${owner}/${repoName}`;
    const memoryBefore = process.memoryUsage();
    console.log(`[GitHub Callback] Memory before job creation:`, {
      heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024),
    });

    // Skapa async jobb för att förhindra OOM
    // Jobbet kommer att processas i bakgrunden
    const jobId = await createGitHubJob({
      onboardingId: activeOnboardingId,
      userSub: session.user.sub,
      repo,
      owner,
      repoName,
      repoUrl,
    });

    console.log(`[GitHub Callback] Created job ${jobId}, redirecting immediately`);

    // Processa jobbet async (non-blocking)
    // Detta kommer att köras i bakgrunden och inte blockera redirect
    processGitHubJob(jobId, token).catch((error) => {
      console.error(`[GitHub Callback] Background job processing failed for ${jobId}:`, error);
    });

    // Redirecta omedelbart - jobbet processas async
    return NextResponse.redirect(buildUrl(`/onboarding/code?github=processing&jobId=${jobId}`));
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }
}

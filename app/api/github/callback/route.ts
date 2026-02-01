import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const baseUrl =
  process.env.APP_BASE_URL ||
  process.env.AUTH0_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL;

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
    return NextResponse.redirect(
      new URL('/onboarding/code?github=denied', request.url)
    );
  }

  if (!code || !stateRaw) {
    return NextResponse.redirect(
      new URL('/onboarding/code?github=error', request.url)
    );
  }

  let state: { repo: string; sessionId: string };
  try {
    state = JSON.parse(
      Buffer.from(stateRaw, 'base64url').toString('utf8')
    ) as { repo: string; sessionId: string };
  } catch {
    return NextResponse.redirect(
      new URL('/onboarding/code?github=error', request.url)
    );
  }

  const { repo, sessionId } = state;
  const match = repo.match(/^([^/]+)\/([^/]+)$/);
  if (!match) {
    return NextResponse.redirect(
      new URL('/onboarding/code?github=error', request.url)
    );
  }
  const [, owner, repoName] = match;

  const session = await auth0.getSession();
  if (!session?.user || session.user.sub !== sessionId) {
    return NextResponse.redirect(
      new URL('/onboarding/login', request.url)
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret || !baseUrl) {
    console.error('[GitHub Callback] Missing GITHUB_* or APP_BASE_URL');
    return NextResponse.redirect(
      new URL('/onboarding/code?github=error', request.url)
    );
  }

  const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/github/callback`;

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
    return NextResponse.redirect(
      new URL('/onboarding/code?github=denied', request.url)
    );
  }

  const token = tokenData.access_token;

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
      return NextResponse.redirect(
        new URL('/onboarding/code?github=access_denied', request.url)
      );
    }

    // Fetch repo as ZIP (302 redirect; follow with same auth)
    const zipRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/zipball/HEAD`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
      }
    );

    if (!zipRes.ok) {
      return NextResponse.redirect(
        new URL('/onboarding/code?github=download_failed', request.url)
      );
    }

    const zipBuffer = Buffer.from(await zipRes.arrayBuffer());
    const zipBase64 = zipBuffer.toString('base64');

    const repoUrl = `https://github.com/${owner}/${repoName}`;
    const retrievedAt = new Date().toISOString();

    const payload = {
      idempotencyKey: `onboarding-${sessionId}-code-github-${repo}`,
      sessionId,
      step: 'code',
      onboardingStatus: 'påbörjad',
      user: {
        email: session.user.email,
        name: session.user.name,
        sub: session.user.sub,
      },
      data: {
        type: 'github',
        github: {
          repoUrl,
          isPrivate: true,
          accessStatus: 'granted',
          retrievedVia: 'oauth',
          retrievedAt,
        },
        content: {
          format: 'zip',
          base64: zipBase64,
          byteLength: zipBuffer.length,
        },
        temporary: true,
        readOnly: true,
      },
      submittedAt: retrievedAt,
      source: 'public_onboarding',
    };

    await sendToAdminPortal('onboarding', payload);
  } finally {
    // Token is not stored; it goes out of scope here. No DB or session persistence.
  }

  return NextResponse.redirect(
    new URL('/onboarding/stripe', request.url)
  );
}

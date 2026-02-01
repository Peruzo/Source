import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

/**
 * GET /api/github/connect?repo=owner/repo
 * Redirects to GitHub OAuth for temporary read access to the given repo.
 * Requires Auth0 session (onboarding user). State carries repo + sessionId for callback.
 */
export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL('/onboarding/login', request.url));
  }

  const repo = request.nextUrl.searchParams.get('repo');
  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    return NextResponse.json(
      { error: 'Ogiltig repo. Använd formatet owner/repo.' },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl =
    process.env.APP_BASE_URL ||
    process.env.AUTH0_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;
  if (!clientId || !baseUrl) {
    console.error('[GitHub Connect] GITHUB_CLIENT_ID or APP_BASE_URL missing');
    return NextResponse.json(
      { error: 'GitHub OAuth är inte konfigurerad' },
      { status: 500 }
    );
  }

  const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/github/callback`;
  const state = Buffer.from(
    JSON.stringify({ repo, sessionId: session.user.sub })
  ).toString('base64url');

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  return NextResponse.redirect(authUrl.toString());
}

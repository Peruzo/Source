import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';

/**
 * GET /api/github/connect?repo=owner/repo
 * Redirects to GitHub OAuth for temporary read access to the given repo.
 * Requires Auth0 session (onboarding user). State carries repo + sessionId for callback.
 */
export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.redirect(buildUrl('/onboarding/login'));
  }

  const repo = request.nextUrl.searchParams.get('repo');
  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    return NextResponse.json(
      { error: 'Ogiltig repo. Använd formatet owner/repo.' },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error('[GitHub Connect] GITHUB_CLIENT_ID missing');
    return NextResponse.json(
      { error: 'GitHub OAuth är inte konfigurerad' },
      { status: 500 }
    );
  }

  // Använd canonical base URL (throwar error om den saknas)
  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;
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

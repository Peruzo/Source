import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';
import { getOrCreateActiveOnboardingId } from '@/lib/storage/onboarding-sessions';
import { checkRepoAccess } from '@/lib/github/repo-utils';

/**
 * GET /api/github/connect?repo=owner/repo
 * Preflight-check: Verifierar om repo är private/inaccessible.
 * Om private/inaccessible → redirect till GitHub OAuth.
 * Om public → returnera fel (public repos ska inte använda OAuth-flödet).
 * 
 * KRITISK: Endast private repos ska gå igenom OAuth-flödet.
 * Public repos ska hanteras direkt i /api/onboarding/code utan OAuth.
 */
export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.redirect(buildUrl('/onboarding/login'));
  }

  const repo = request.nextUrl.searchParams.get('repo');
  const providedOnboardingId = request.nextUrl.searchParams.get('onboardingId');
  
  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    return NextResponse.json(
      { error: 'Ogiltig repo. Använd formatet owner/repo.' },
      { status: 400 }
    );
  }

  // KRITISK: Preflight-check mot GitHub API för att avgöra om OAuth krävs
  const repoUrl = `https://github.com/${repo}`;
  const access = await checkRepoAccess(repoUrl);
  
  // Om repo är public och accessible → OAuth behövs inte (fel endpoint)
  if (access.ok && !access.private) {
    console.warn(`[GitHub Connect] Public repo ${repo} should not use OAuth flow`);
    return NextResponse.json(
      { 
        error: 'Public repos do not require OAuth. Use direct repo link instead.',
        repoSlug: access.repoSlug,
      },
      { status: 400 }
    );
  }

  // Om repo är private/inaccessible (404/403) → OAuth krävs
  if (!access.ok || access.private) {
    // Hämta eller skapa aktiv onboardingId
    const onboardingId = providedOnboardingId || await getOrCreateActiveOnboardingId(session.user.sub);

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
      JSON.stringify({ repo, sessionId: session.user.sub, onboardingId })
    ).toString('base64url');

    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'repo');
    authUrl.searchParams.set('state', state);

    console.log(`[GitHub Connect] Redirecting to OAuth for private repo: ${repo}`);
    return NextResponse.redirect(authUrl.toString());
  }

  // Fallback: om vi inte kan avgöra → behandla som private (säkrast)
  console.warn(`[GitHub Connect] Could not determine repo access for ${repo}, treating as private`);
  const onboardingId = providedOnboardingId || await getOrCreateActiveOnboardingId(session.user.sub);
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth är inte konfigurerad' },
      { status: 500 }
    );
  }
  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;
  const state = Buffer.from(
    JSON.stringify({ repo, sessionId: session.user.sub, onboardingId })
  ).toString('base64url');
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);
  return NextResponse.redirect(authUrl.toString());
}

import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils/base-url';
import { getOrCreateAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { checkAdminOnboardingExists, sendToAdminPortal } from '@/lib/api/admin-portal';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';

/**
 * GET /api/github/connect?repo=owner/repo&onboardingId=...
 * Preflight-check: Verifierar om repo är private/inaccessible.
 * Om private/inaccessible → redirect till GitHub OAuth.
 * Om public → returnera fel (public repos ska inte använda OAuth-flödet).
 *
 * ARKITEKTURREGEL: Ingen Auth0. Endast cookie-baserad anonym session (anon_<uuid>).
 * Kräver onboardingId i query (frontend skickar från useOnboardingId).
 */
export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get('repo');
  const providedOnboardingId = request.nextUrl.searchParams.get('onboardingId');

  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    return NextResponse.json(
      { error: 'Ogiltig repo. Använd formatet owner/repo.' },
      { status: 400 }
    );
  }

  if (!providedOnboardingId) {
    return NextResponse.json(
      { error: 'onboardingId krävs. Starta onboarding först.' },
      { status: 400 }
    );
  }

  const sessionId = await getOrCreateAnonymousSessionId();
  const onboardingId = providedOnboardingId;

  // SÄKERSTÄLL att admin-onboarding finns innan OAuth
  const adminExists = await checkAdminOnboardingExists(onboardingId);

  if (!adminExists) {
    // Hämta state för att få email om det finns
    const events = await listOnboardingEvents(onboardingId);
    const state = reduceOnboarding(events, onboardingId, sessionId);
    const email = state.email || '';

    await sendToAdminPortal('onboarding', {
      idempotencyKey: `onboarding-${onboardingId}-start`,
      publicOnboardingId: onboardingId,
      user: email ? { email } : {},
      status: 'started',
      onboardingStatus: 'started',
    });
  }

  const repoUrl = `https://github.com/${repo}`;
  const access = await checkRepoAccess(repoUrl);

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

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error('[GitHub Connect] GITHUB_CLIENT_ID missing');
    return NextResponse.json(
      { error: 'GitHub OAuth är inte konfigurerad' },
      { status: 500 }
    );
  }

  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;
  const state = Buffer.from(
    JSON.stringify({ repo, sessionId, onboardingId })
  ).toString('base64url');

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  console.log(`[GitHub Connect] Redirecting to OAuth for private repo: ${repo} (anonymous session)`);
  return NextResponse.redirect(authUrl.toString());
}

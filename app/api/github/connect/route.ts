import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl, buildUrl } from '@/lib/utils/base-url';
import { getOrCreateAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { auth0 } from '@/lib/auth0';
import { requireOnboardingOwner } from '@/lib/onboarding/ownership';
import { checkRepoAccess } from '@/lib/github/repo-utils';
import { checkAdminOnboardingExists, sendToAdminPortal } from '@/lib/api/admin-portal';
import { listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding } from '@/lib/onboarding/reducer';
import {
  createOAuthState,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_COOKIE_PATH,
  STATE_TTL_MS,
} from '@/lib/storage/github-oauth-states';

/**
 * GET /api/github/connect?repo=owner/repo&onboardingId=...
 * Preflight-check: Verifierar om repo är private/inaccessible.
 * Om private/inaccessible → redirect till GitHub OAuth.
 * Om public → tillbaka till kodsteget (publika repon hämtas direkt via POST /api/onboarding/code).
 *
 * Routen nås enbart genom navigering (window.location), aldrig fetch. Den svarar därför
 * ALDRIG med JSON: varje fel blir en redirect till /onboarding/code?github=<felkod>,
 * som kodformuläret översätter till ett svenskt meddelande.
 *
 * ÄGARSKAP: Auth0-session krävs och onboardingId måste vara bundet till anroparens
 * userSub, annars 404 (samma svar utan session).
 * Kräver onboardingId i query (frontend skickar från useOnboardingId).
 *
 * STATE: serverlagrad engångs-state (lib/storage/github-oauth-states.ts) bunden till
 * onboardingId, Auth0-användaren, den anonyma sessionen och webbläsaren (kortlivad
 * httpOnly-cookie som bara skickas till callbacken). Inget av detta går via GitHub i klartext.
 */
function backToCodeStep(errorCode: string): NextResponse {
  return NextResponse.redirect(buildUrl(`/onboarding/code?github=${encodeURIComponent(errorCode)}`));
}

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get('repo');
  const providedOnboardingId = request.nextUrl.searchParams.get('onboardingId');

  if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
    return backToCodeStep('invalid_repo');
  }

  if (!providedOnboardingId) {
    return backToCodeStep('not_initialized');
  }

  const onboardingId = providedOnboardingId;

  // ÄGARSKAP: onboardingId måste vara bundet till anroparens Auth0-userSub (404 annars)
  const session = await auth0.getSession();
  const denied = await requireOnboardingOwner(session?.user?.sub, onboardingId);
  if (denied) return backToCodeStep('not_found');

  const sessionId = await getOrCreateAnonymousSessionId();

  // FSM-status-guard: GitHub OAuth är endast tillåten i code_pending
  const events = await listOnboardingEvents(onboardingId);
  const onboardingState = reduceOnboarding(events, onboardingId, sessionId);

  // GitHub OAuth är endast tillåten i code_pending
  if (onboardingState.status !== 'code_pending') {
    console.warn('[GitHub Connect] Blocked due to invalid FSM status', {
      onboardingId,
      status: onboardingState.status,
    });

    return backToCodeStep('invalid_onboarding_state');
  }

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
    return backToCodeStep('public_repo');
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error('[GitHub Connect] GITHUB_CLIENT_ID missing');
    return backToCodeStep('not_configured');
  }

  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/github/callback`;
  let state: string;
  try {
    state = await createOAuthState({
      onboardingId,
      repo,
      userSub: session?.user?.sub ?? null,
      sessionId,
    });
  } catch (err) {
    console.error('[GitHub Connect] Failed to store OAuth state:', err);
    return backToCodeStep('oauth_unavailable');
  }

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    // Secure i alla driftsatta miljöer; undantag endast för lokal http-utveckling
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: OAUTH_STATE_COOKIE_PATH,
    maxAge: Math.floor(STATE_TTL_MS / 1000),
  });
  return response;
}

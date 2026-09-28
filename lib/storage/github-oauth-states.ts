import crypto from 'crypto';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * Serverlagrad engångs-state för GitHub OAuth i onboardingen.
 *
 * - Värdet som skickas via GitHub är 32 slumpbytes (base64url) och bär ingen data.
 * - Posten lagras i GCS under github-oauth-states/<sha256(state)>.json, så att det råa
 *   värdet aldrig ligger i lagringen.
 * - Posten binder state till onboardingId, Auth0-användaren, den anonyma sessionen och
 *   repot, och är giltig i STATE_TTL_MS.
 * - Webbläsarbindning: samma värde ligger i en kortlivad httpOnly-cookie som bara
 *   skickas till callbacken; callbacken kräver att cookie och query matchar.
 * - Förbrukas vid första användning, lyckad eller ej: posten raderas atomiskt
 *   (ifGenerationMatch) innan något annat kontrolleras.
 */

export const OAUTH_STATE_COOKIE = 'source_github_oauth_state';
export const OAUTH_STATE_COOKIE_PATH = '/api/github/callback';
export const STATE_TTL_MS = 10 * 60 * 1000;

const STATE_RE = /^[A-Za-z0-9_-]{43}$/;

export type OAuthStateRecord = {
  onboardingId: string;
  repo: string;
  userSub: string | null;
  sessionId: string;
  createdAt: string;
  expiresAt: string;
};

/** Felkoder mappas till ?github=<kod> och svenska texter i lib/onboarding/code-step-messages.ts. */
export type OAuthStateError =
  | 'oauth_state_invalid' // saknas, okänd eller redan förbrukad
  | 'oauth_state_expired'
  | 'oauth_state_mismatch'; // cookie eller bindning stämmer inte

/** Minimal lagringsyta så att förbrukningslogiken kan testas utan GCS. */
export interface OAuthStateStore {
  create(key: string, record: OAuthStateRecord): Promise<void>;
  /** Läser och raderar posten atomiskt. null om den saknas eller redan förbrukats. */
  take(key: string): Promise<OAuthStateRecord | null>;
}

function keyFor(state: string): string {
  return crypto.createHash('sha256').update(state, 'utf8').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

const gcsStore: OAuthStateStore = {
  async create(key, record) {
    if (!BUCKET) {
      throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
    }
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const file = storage.bucket(BUCKET).file(`github-oauth-states/${key}.json`);
    await file.save(JSON.stringify(record), {
      contentType: 'application/json',
      metadata: { cacheControl: 'private, no-cache' },
      preconditionOpts: { ifGenerationMatch: 0 }, // skriv aldrig över en befintlig post
    });
  },

  async take(key) {
    if (!BUCKET) return null;
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const file = storage.bucket(BUCKET).file(`github-oauth-states/${key}.json`);
    try {
      const [metadata] = await file.getMetadata();
      const [contents] = await file.download();
      // Endast den som lyckas radera just denna generation får posten → engångs även vid samtidiga anrop
      await file.delete({ ifGenerationMatch: metadata.generation });
      return JSON.parse(contents.toString('utf8')) as OAuthStateRecord;
    } catch (error) {
      const code = (error as { code?: number })?.code;
      if (code !== 404 && code !== 412) {
        console.warn('[GitHub OAuth State] Error consuming state:', error);
      }
      return null;
    }
  },
};

/** Skapar och lagrar en ny engångs-state. Returnerar värdet som ska till GitHub och i cookien. */
export async function createOAuthState(
  params: { onboardingId: string; repo: string; userSub: string | null; sessionId: string },
  store: OAuthStateStore = gcsStore,
  now: number = Date.now()
): Promise<string> {
  const state = crypto.randomBytes(32).toString('base64url');
  await store.create(keyFor(state), {
    onboardingId: params.onboardingId,
    repo: params.repo,
    userSub: params.userSub,
    sessionId: params.sessionId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + STATE_TTL_MS).toISOString(),
  });
  return state;
}

/**
 * Förbrukar en state och kontrollerar den mot webbläsaren och sessionerna.
 *
 * Ordning: formkontroll → förbrukning (radering) → utgång → cookie → bindningar.
 * Posten raderas alltså även om en senare kontroll fallerar.
 */
export async function consumeOAuthState(
  params: {
    state: string | null;
    cookieState: string | null | undefined;
    auth0UserSub: string | null | undefined;
    anonymousSessionId: string | null | undefined;
  },
  store: OAuthStateStore = gcsStore,
  now: number = Date.now()
): Promise<{ ok: true; record: OAuthStateRecord } | { ok: false; error: OAuthStateError }> {
  const { state, cookieState, auth0UserSub, anonymousSessionId } = params;
  if (!state || !STATE_RE.test(state)) {
    return { ok: false, error: 'oauth_state_invalid' };
  }

  const record = await store.take(keyFor(state));
  if (!record) {
    return { ok: false, error: 'oauth_state_invalid' };
  }

  const expiresAt = Date.parse(record.expiresAt);
  if (!Number.isFinite(expiresAt) || now > expiresAt) {
    return { ok: false, error: 'oauth_state_expired' };
  }

  if (!cookieState || !safeEqual(cookieState, state)) {
    return { ok: false, error: 'oauth_state_mismatch' };
  }

  if (!anonymousSessionId || !safeEqual(anonymousSessionId, record.sessionId)) {
    return { ok: false, error: 'oauth_state_mismatch' };
  }

  if (record.userSub && (!auth0UserSub || !safeEqual(auth0UserSub, record.userSub))) {
    return { ok: false, error: 'oauth_state_mismatch' };
  }

  return { ok: true, record };
}

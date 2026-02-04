import { cookies } from 'next/headers';
import { generateOnboardingId } from './onboarding-id';

const ANONYMOUS_SESSION_COOKIE = 'source_anonymous_session_id';
const ANONYMOUS_SESSION_PREFIX = 'anon_';

/**
 * Hämtar eller skapar anonym sessionId (cookie-based).
 * Används för onboarding utan Auth0.
 * 
 * @returns sessionId som kan användas som userSub för anonyma onboarding-sessioner
 */
export async function getOrCreateAnonymousSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get(ANONYMOUS_SESSION_COOKIE)?.value;
  
  if (existingSessionId && existingSessionId.startsWith(ANONYMOUS_SESSION_PREFIX)) {
    return existingSessionId;
  }
  
  // Skapa ny anonym sessionId
  const newSessionId = `${ANONYMOUS_SESSION_PREFIX}${generateOnboardingId()}`;
  
  // Spara i cookie (30 dagar, httpOnly, secure i prod)
  cookieStore.set(ANONYMOUS_SESSION_COOKIE, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dagar
    path: '/',
  });
  
  return newSessionId;
}

/**
 * Hämtar anonym sessionId om den finns (read-only).
 * Returnerar null om ingen anonym session finns.
 */
export async function getAnonymousSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ANONYMOUS_SESSION_COOKIE)?.value;
  
  if (sessionId && sessionId.startsWith(ANONYMOUS_SESSION_PREFIX)) {
    return sessionId;
  }
  
  return null;
}

/**
 * Kontrollerar om en sessionId är anonym (inte från Auth0).
 */
export function isAnonymousSessionId(sessionId: string): boolean {
  return sessionId.startsWith(ANONYMOUS_SESSION_PREFIX);
}

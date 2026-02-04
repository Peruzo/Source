'use client';

/**
 * Client-side helper för anonyma sessioner.
 * Hämtar eller skapar anonym sessionId från cookie.
 */

const ANONYMOUS_SESSION_COOKIE = 'source_anonymous_session_id';
const ANONYMOUS_SESSION_PREFIX = 'anon_';

/**
 * Hämtar anonym sessionId från cookie (client-side).
 * Om ingen finns, returnera null (backend skapar cookie vid första API-anrop).
 */
export function getAnonymousSessionIdFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ANONYMOUS_SESSION_COOKIE && value?.startsWith(ANONYMOUS_SESSION_PREFIX)) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Kontrollerar om en sessionId är anonym (client-side).
 */
export function isAnonymousSessionId(sessionId: string): boolean {
  return sessionId.startsWith(ANONYMOUS_SESSION_PREFIX);
}

import { randomUUID } from 'crypto';

/**
 * Genererar ett nytt onboardingId (UUID).
 * Varje onboarding-session får ett unikt ID för isolering.
 */
export function generateOnboardingId(): string {
  return randomUUID();
}

/**
 * Validerar att onboardingId är ett giltigt UUID-format.
 */
export function isValidOnboardingId(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

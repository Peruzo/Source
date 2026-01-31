'use client';

/** Legacy global keys – används inte längre; rensas vid första användning med userSub. */
const LEGACY_SESSION_KEY = 'source_onboarding_session_id';
const LEGACY_DATA_KEY = 'source_onboarding_data';

function dataKey(userSub: string): string {
  return `source_onboarding_data_${userSub}`;
}

export type OnboardingData = Record<string, any>;

/**
 * Rensar legacy global storage så att tidigare användares data inte visas för ny inloggad användare.
 * Anropas en gång när vi har userSub.
 */
function clearLegacyOnboardingData(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(LEGACY_SESSION_KEY);
    window.localStorage.removeItem(LEGACY_DATA_KEY);
  } catch {
    // ignore
  }
}

/**
 * Returnerar sessionId för aktuell användare = Auth0 user.sub.
 * Onboarding är alltid bundet till inloggad användare; backend validerar sessionId === user.sub.
 */
export function getOrCreateSessionId(userSub: string): string {
  if (!userSub) return '';
  if (typeof window !== 'undefined') clearLegacyOnboardingData();
  return userSub;
}

/**
 * Laddar onboarding-data för aktuell användare. Nycklas med user.sub så att olika konton inte delar data.
 */
export function loadOnboardingData(userSub: string): OnboardingData {
  if (typeof window === 'undefined' || !userSub) return {};
  clearLegacyOnboardingData();
  const raw = window.localStorage.getItem(dataKey(userSub));
  if (!raw) return {};
  try {
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return {};
  }
}

/**
 * Sparar onboarding-data för aktuell användare (nycklat med user.sub).
 */
export function saveOnboardingData(userSub: string, partial: OnboardingData): void {
  if (typeof window === 'undefined' || !userSub) return;
  const key = dataKey(userSub);
  const current = loadOnboardingData(userSub);
  const merged = { ...current, ...partial };
  window.localStorage.setItem(key, JSON.stringify(merged));
}

/**
 * Rensar onboarding-data för en användare (t.ex. vid utloggning eller reset).
 */
export function clearOnboardingData(userSub: string): void {
  if (typeof window === 'undefined') return;
  if (userSub) window.localStorage.removeItem(dataKey(userSub));
  clearLegacyOnboardingData();
}

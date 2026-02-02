'use client';

/** Legacy global keys – används inte längre; rensas vid första användning med userSub. */
const LEGACY_SESSION_KEY = 'source_onboarding_session_id';
const LEGACY_DATA_KEY = 'source_onboarding_data';

function dataKey(userSub: string): string {
  return `source_onboarding_data_${userSub}`;
}

function seenUserSubKey(userSub: string): string {
  return `source_onboarding_seen_${userSub}`;
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
 * IMPORTANT:
 * Reset pre-auth onboarding state on first login after custom signup.
 * Prevents leakage of onboarding data between anonymous sessions and user.sub.
 * 
 * Laddar onboarding-data för aktuell användare. Nycklas med user.sub så att olika konton inte delar data.
 * Vid första login efter custom signup rensas eventuell pre-auth onboarding-data.
 */
export function loadOnboardingData(userSub: string): OnboardingData {
  if (typeof window === 'undefined' || !userSub) return {};
  clearLegacyOnboardingData();
  
  const key = dataKey(userSub);
  const seenKey = seenUserSubKey(userSub);
  const raw = window.localStorage.getItem(key);
  const hasSeenUserSub = window.localStorage.getItem(seenKey) === 'true';
  
  // Reset onboarding-data vid första login efter custom signup
  // Om onboarding-data finns men vi inte har sett denna user.sub tidigare,
  // är det första login och data kommer från pre-auth session → rensa
  if (raw && !hasSeenUserSub) {
    try {
      const data = JSON.parse(raw) as OnboardingData;
      // Om det finns onboarding-data (frågor, kod, stripe-status, etc.), rensa den
      if (Object.keys(data).length > 0) {
        window.localStorage.removeItem(key);
        // Markera att vi har sett denna user.sub så vi inte reset:ar igen
        window.localStorage.setItem(seenKey, 'true');
        return {};
      }
    } catch {
      // Om parsing misslyckas, rensa och returnera tom
      window.localStorage.removeItem(key);
      window.localStorage.setItem(seenKey, 'true');
      return {};
    }
  }
  
  // Markera att vi har sett denna user.sub (även om inga data fanns)
  if (!hasSeenUserSub) {
    window.localStorage.setItem(seenKey, 'true');
  }
  
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
  if (userSub) {
    window.localStorage.removeItem(dataKey(userSub));
    window.localStorage.removeItem(seenUserSubKey(userSub));
  }
  clearLegacyOnboardingData();
}

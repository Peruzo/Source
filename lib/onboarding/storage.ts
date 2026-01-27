'use client';

const SESSION_KEY = 'source_onboarding_session_id';
const DATA_KEY = 'source_onboarding_data';

export type OnboardingData = Record<string, any>;

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, sessionId);
  document.cookie = `onboarding_session_id=${sessionId}; path=/; SameSite=Lax`;
  return sessionId;
}

export function loadOnboardingData(): OnboardingData {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(DATA_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return {};
  }
}

export function saveOnboardingData(partial: OnboardingData) {
  if (typeof window === 'undefined') {
    return;
  }

  const current = loadOnboardingData();
  const merged = { ...current, ...partial };
  window.localStorage.setItem(DATA_KEY, JSON.stringify(merged));
}

export function clearOnboardingData() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(DATA_KEY);
}

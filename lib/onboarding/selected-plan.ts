/**
 * Onboarding plan-context — localStorage-helpers + Stripe-URL-builder.
 * Ingen backend-persistens; planId bevaras endast i klient-state mellan steg.
 */

const SELECTED_PLAN_STORAGE_KEY = 'source_selected_plan';

export function getStoredPlanId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(SELECTED_PLAN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredPlanId(planId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, planId);
  } catch {
    // ignore
  }
}

/**
 * URL för nästa steg efter code (Stripe). Används av code- och questions-steg så att
 * routing inte hårdkodas och plan (t.ex. från /onboarding/login?plan=...) bevaras.
 */
export function getStripeOnboardingUrl(planId: string | null | undefined): string {
  if (planId && planId.trim()) {
    return `/onboarding/stripe?plan=${encodeURIComponent(planId.trim())}`;
  }
  return '/onboarding/stripe';
}

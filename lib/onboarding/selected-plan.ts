/**
 * Valt prispaket – onboarding-context (tillfällig, t.ex. URL/localStorage).
 * Ingen backend-persistens i detta steg.
 */

export type SelectedPlan = {
  planId: string;
  name: string;
  price: string;
  currency: string;
  interval: string;
  features: string[];
};

const PLANS: SelectedPlan[] = [
  {
    planId: 'bas',
    name: 'Bas',
    price: '399',
    currency: 'SEK',
    interval: 'månad',
    features: [
      'Responsiv design',
      'Upp till 5 sidor',
      'Betalningar, faktuering, prenumerationer',
      'Support',
      'Rapporter för försäljning',
    ],
  },
  {
    planId: 'growth',
    name: 'Growth',
    price: '799',
    currency: 'SEK',
    interval: 'månad',
    features: [
      'Allt i Bas, plus:',
      'Obegränsat antal sidor och design',
      'Rapporter',
      'Kontaktformulär till kundportal',
      'AI agent',
      'Marknadsföring',
      'Betalningslänk',
      'Kampanjer',
      'Logistik',
      'Integrationer',
      'Bokningssystem',
      'Produkthantering',
      'Max 5 användare',
    ],
  },
  {
    planId: 'enterprise',
    name: 'Enterprise',
    price: 'Pris på förfrågan',
    currency: 'SEK',
    interval: 'månad',
    features: [
      'Allt i Growth, plus:',
      'AI insikter',
      'Inventarier hantering',
      '24/7 support',
      'Avancerad statistik och analys',
      'Bokföring verktyg',
      'Max 10 användare',
    ],
  },
];

const PLAN_BY_ID = new Map(PLANS.map((p) => [p.planId, p]));

export function getPlan(planId: string | null): SelectedPlan | null {
  if (!planId) return null;
  return PLAN_BY_ID.get(planId.toLowerCase()) ?? null;
}

export const SELECTED_PLAN_STORAGE_KEY = 'source_selected_plan';

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

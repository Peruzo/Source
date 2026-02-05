import { SuccessMessage } from './success-message';

/**
 * ARKITEKTURREGEL: /onboarding/** får aldrig initiera Auth0.
 * Success-sidan använder useOnboardingId() (cookie-baserad) och anropar
 * POST /api/onboarding/stripe/complete med onboardingId – Auth0 används endast i Stripe-API:et.
 */
export default function SuccessPage() {
  return <SuccessMessage />;
}

import { StripeStart } from './stripe-start';

export const dynamic = 'force-dynamic';

/**
 * KRITISK: Stripe-steget kräver Auth0 för Stripe Connect onboarding.
 * Men questions och code ska fungera anonymt.
 * 
 * Stripe-page kan behålla Auth0-kravet eftersom Stripe Connect faktiskt kräver autentisering.
 * Men frontend-komponenten hanterar både Auth0 och anonyma sessioner.
 */
export default async function StripePage() {
  // Stripe-steget kan kräva Auth0 när användaren faktiskt gör Stripe onboarding
  // Men komponenten hanterar både Auth0 och anonyma sessioner
  return <StripeStart />;
}

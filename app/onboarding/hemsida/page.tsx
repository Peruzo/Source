import { SiteBuilderFlow } from './site-builder-flow';

/**
 * "Gör min hemsida": nej-grenen i onboardingen, för kunder utan egen hemsida.
 * Frågorna (app/onboarding/questions) leder hit när kunden svarar Nej. Härifrån går kunden
 * vidare till samma Stripe-steg som tidigare. API-anropen kräver Auth0-session och ägarskap
 * (app/api/onboarding/site-builder/*).
 */
export default function SiteBuilderPage() {
  return <SiteBuilderFlow />;
}

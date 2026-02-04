import { QuestionsForm } from './questions-form';

/**
 * KRITISK: Onboarding-sidor kräver INTE Auth0.
 * Custom signup + onboarding måste fungera helt utan Auth0.
 * Auth0 är ett val, inte ett hinder.
 */
export default async function QuestionsPage() {
  // Tillåt anonyma sessioner - frontend hanterar sessionId via cookie/hook
  return <QuestionsForm />;
}

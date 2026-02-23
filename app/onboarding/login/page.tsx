import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

/**
 * /onboarding/login
 * Kontrollerar Auth0-session: ingen session → redirect till login, annars → /onboarding/questions.
 * Inga formulär.
 */
export default async function OnboardingLoginPage() {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    const returnTo = '/onboarding/questions';
    redirect(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  redirect('/onboarding/questions');
}

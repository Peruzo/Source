import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export default async function OnboardingLoginPage() {
  const session = await auth0.getSession();

  // 1️⃣ Ingen Auth0-session → skicka till login
  if (!session?.user?.sub) {
    redirect('/api/auth/login?returnTo=/onboarding/questions');
  }

  // 2️⃣ Kolla onboarding-status i kundportalen
  try {
    const res = await fetch(
      `${process.env.CUSTOMER_PORTAL_URL}/api/public/onboarding-status?sub=${encodeURIComponent(session.user.sub)}`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.onboardingStatus === 'completed') {
        redirect(`${process.env.CUSTOMER_PORTAL_URL}/dashboard`);
      }
    }
  } catch (err) {
    console.error('Onboarding status check failed:', err);
  }

  // 3️⃣ Inte completed → fortsätt onboarding
  redirect('/onboarding/questions');
}

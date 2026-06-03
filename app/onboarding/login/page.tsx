import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export default async function OnboardingLoginPage() {
  // Robusthet-guard: kund MÅSTE ha kommit via /priser-sidan där paket valdes.
  // Om source_selected_plan-cookie saknas → skicka tillbaka till /priser så
  // de kan välja paket innan onboarding fortsätter. Detta garanterar att
  // admin-portalen alltid har ett paket-event registrerat.
  const cookieStore = await cookies();
  const selectedPlan = cookieStore.get('source_selected_plan')?.value;

  if (!selectedPlan) {
    redirect('/priser');
  }

  const session = await auth0.getSession();

  // 1️⃣ Ingen Auth0-session → skicka till login
  if (!session?.user?.sub) {
    redirect('/api/auth/login?returnTo=/onboarding/questions&screen_hint=signup');
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

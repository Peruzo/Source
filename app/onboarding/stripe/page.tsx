import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { StripeStart } from './stripe-start';

export default async function StripePage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <StripeStart userSub={session.user.sub ?? ''} />;
}

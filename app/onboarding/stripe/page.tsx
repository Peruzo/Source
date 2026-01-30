import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { StripeStart } from './stripe-start';

export default async function StripePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <StripeStart />;
}

import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { SuccessMessage } from './success-message';

export default async function SuccessPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <SuccessMessage />;
}

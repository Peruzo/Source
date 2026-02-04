import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { SuccessMessage } from './success-message';

export default async function SuccessPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <SuccessMessage />;
}

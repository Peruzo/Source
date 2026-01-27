import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { QuestionsForm } from './questions-form';

export default async function QuestionsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <QuestionsForm userEmail={session.user.email || ''} />;
}

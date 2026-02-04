import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { QuestionsForm } from './questions-form';

export default async function QuestionsPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return (
    <QuestionsForm
      userSub={session.user.sub ?? ''}
    />
  );
}

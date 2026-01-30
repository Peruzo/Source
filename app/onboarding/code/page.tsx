import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { CodeUploadForm } from './code-upload-form';

export default async function CodePage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <CodeUploadForm />;
}

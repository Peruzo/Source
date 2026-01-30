import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { CodeUploadForm } from './code-upload-form';

export default async function CodePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/onboarding/login');
  }

  return <CodeUploadForm />;
}

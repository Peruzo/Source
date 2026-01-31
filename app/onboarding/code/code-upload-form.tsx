'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getOrCreateSessionId,
  loadOnboardingData,
  saveOnboardingData,
} from '@/lib/onboarding/storage';

export function CodeUploadForm({ userSub }: { userSub: string }) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [codeText, setCodeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userSub) return;
    const stored = loadOnboardingData(userSub);
    if (stored.questions?.hasExistingSite !== 'Ja') {
      router.replace('/onboarding/questions');
      return;
    }
    setSessionId(getOrCreateSessionId(userSub));
    setRepoLink(stored.code?.repoLink || '');
    setCodeText(stored.code?.codeText || '');
  }, [userSub, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!repoLink && !codeText && !file) {
      setError('Lägg till ZIP eller klistra in kod/repo-länk.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('repoLink', repoLink);
    formData.append('codeText', codeText);
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch('/api/onboarding/code', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      setError('Ett fel uppstod. Försök igen.');
      setSubmitting(false);
      return;
    }

    saveOnboardingData(userSub, {
      code: {
        repoLink,
        codeText,
        fileName: file?.name,
      },
    });

    router.push('/onboarding/stripe');
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Koduppladdning</h1>
      <p className="text-gray-600 mb-6">
        Du kan ladda upp en ZIP eller klistra in kod/repo-länk. Allt är read-only och används
        endast som tillfälligt onboarding-material.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ladda upp ZIP</label>
          <input
            type="file"
            accept=".zip"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Repo-länk</label>
          <input
            type="url"
            value={repoLink}
            onChange={(event) => setRepoLink(event.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Klistra in kod</label>
          <textarea
            value={codeText}
            onChange={(event) => setCodeText(event.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 min-h-[180px]"
            placeholder="Klistra in kod här..."
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          disabled={submitting}
        >
          {submitting ? 'Sparar...' : 'Fortsätt till Stripe'}
        </button>
      </form>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

export function CodeUploadForm({ userSub }: { userSub: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onboardingId, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId(userSub);
  const { state, loading: stateLoading } = useOnboardingState(userSub, onboardingId);
  const [sessionId, setSessionId] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [codeText, setCodeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [privateRepoPrompt, setPrivateRepoPrompt] = useState<{ repoSlug: string } | null>(null);
  const [githubCallbackError, setGithubCallbackError] = useState<string | null>(null);
  const [githubJobId, setGithubJobId] = useState<string | null>(null);
  const [githubJobStatus, setGithubJobStatus] = useState<'processing' | 'completed' | 'failed' | null>(null);

  const loading = onboardingIdLoading || stateLoading;

  useEffect(() => {
    if (!userSub) return;
    setSessionId(getOrCreateSessionId(userSub));
  }, [userSub]);

  // Visa fel om onboardingId saknas
  useEffect(() => {
    if (onboardingIdError) {
      setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
    }
  }, [onboardingIdError]);

  // Ladda data från backend när state är tillgänglig
  useEffect(() => {
    if (loading) return;
    
    if (!state?.questions || state.questions.hasExistingSite !== 'Ja') {
      router.replace('/onboarding/questions');
      return;
    }
    
    setRepoLink(state.code?.repoLink || '');
    setCodeText(state.code?.codeText || '');
  }, [state, loading, router]);

  // URL-parametrar (github, jobId) används endast för init. Rensa URL direkt så att routing/rerenders inte återställer state.
  useEffect(() => {
    const gh = searchParams.get('github');
    const jobId = searchParams.get('jobId');
    
    if (gh === 'processing' && jobId) {
      setGithubJobId(jobId);
      setGithubJobStatus('processing');
      setGithubCallbackError(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('github');
      params.delete('jobId');
      const q = params.toString();
      router.replace(q ? `/onboarding/code?${q}` : '/onboarding/code');
    } else if (gh === 'denied') {
      setGithubCallbackError('GitHub-kopplingen avbröts.');
      setGithubJobStatus(null);
    } else if (gh === 'upload_failed') {
      setGithubCallbackError('Uppladdning till lagring misslyckades. Försök igen.');
      setGithubJobStatus(null);
    } else if (gh === 'payload_too_large') {
      setGithubCallbackError('Payload för stor. Kontakta support om problemet kvarstår.');
      setGithubJobStatus(null);
    } else if (gh === 'payload_error') {
      setGithubCallbackError('Fel i payload. Kontakta support om problemet kvarstår.');
      setGithubJobStatus(null);
    } else if (gh === 'error' || gh === 'access_denied' || gh === 'download_failed') {
      setGithubCallbackError('Kunde inte koppla eller hämta repot. Försök igen.');
      setGithubJobStatus(null);
    }
  }, [searchParams]);

  // Poll GitHub jobb-status när processing
  useEffect(() => {
    if (!githubJobId || githubJobStatus !== 'processing' || !onboardingId) return;

    // Guard: säkerställ att githubJobId är string (TypeScript narrowing)
    const jobId = githubJobId;
    if (!jobId) return;

    let cancelled = false;
    let pollInterval: NodeJS.Timeout;

    async function pollJobStatus() {
      // Ytterligare guard för runtime-säkerhet
      if (!jobId) return;

      try {
        const res = await fetch(`/api/github/job?jobId=${encodeURIComponent(jobId)}`);
        if (!res.ok) {
          throw new Error(`Failed to get job status: ${res.status}`);
        }
        const data = await res.json();
        const job = data.job;

        if (cancelled) return;

        if (job.status === 'completed') {
          setGithubJobStatus('completed');
          setGithubCallbackError(null);
        } else if (job.status === 'failed') {
          setGithubJobStatus('failed');
          setGithubCallbackError(job.error || 'GitHub import misslyckades.');
        } else if (job.status === 'processing' || job.status === 'pending') {
          // Fortsätt polla
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Code Upload] Error polling job status:', err);
        }
      }
    }

    // Polla var 2:e sekund
    pollInterval = setInterval(pollJobStatus, 2000);
    pollJobStatus(); // Kör direkt också

    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [githubJobId, githubJobStatus, onboardingId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    if (!repoLink && !codeText && !file) {
      setError('Lägg till ZIP eller klistra in kod/repo-länk.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('onboardingId', onboardingId);
    formData.append('repoLink', repoLink);
    formData.append('codeText', codeText);
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch('/api/onboarding/code', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (data.repoPrivate === true && data.requiresGithubAccess === true && data.repoSlug) {
      setPrivateRepoPrompt({ repoSlug: data.repoSlug });
      setSubmitting(false);
      return;
    }

    if (!response.ok) {
      setError(normalizeError(data.message || data.error || 'Ett fel uppstod. Försök igen.'));
      setSubmitting(false);
      return;
    }

    // State sparas automatiskt i backend via POST /api/onboarding/code
    // Ingen localStorage-sparning behövs längre

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
            onChange={(event) => {
              setRepoLink(event.target.value);
              setPrivateRepoPrompt(null);
            }}
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

        {error && <p className="text-red-600">{typeof error === 'string' ? error : normalizeError(error)}</p>}
        {githubCallbackError && (
          <p className="rounded-md bg-amber-50 p-3 text-amber-800" role="alert">
            {typeof githubCallbackError === 'string' ? githubCallbackError : normalizeError(githubCallbackError)}
          </p>
        )}

        {githubJobStatus === 'processing' && (
          <div className="rounded-md bg-blue-50 p-3 text-blue-800" role="alert">
            <p className="font-medium">⏳ Processing repository...</p>
            <p className="mt-1 text-sm">Vi hämtar och laddar upp repot. Detta kan ta några sekunder.</p>
          </div>
        )}

        {privateRepoPrompt && onboardingId && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="font-medium">🔒 Det här är ett privat repo</p>
            <p className="mt-1 text-sm">
              För att vi ska kunna granska koden behöver du ge tillfällig läsåtkomst.
            </p>
            <a
              href={`/api/github/connect?repo=${encodeURIComponent(privateRepoPrompt.repoSlug)}&onboardingId=${encodeURIComponent(onboardingId)}`}
              className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Koppla GitHub-konto
            </a>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          disabled={submitting || githubJobStatus === 'processing' || !onboardingId}
        >
          {submitting ? 'Sparar...' : githubJobStatus === 'processing' ? 'Processing...' : 'Fortsätt till Stripe'}
        </button>
      </form>
    </section>
  );
}

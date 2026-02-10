'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { getStoredPlanId, getStripeOnboardingUrl } from '@/lib/onboarding/selected-plan';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { getAnonymousSessionIdFromCookie } from '@/lib/onboarding/anonymous-session-client';
import { normalizeError } from '@/lib/utils/normalize-error';

export function CodeUploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onboardingId, userSub, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId();
  const { state, loading: stateLoading } = useOnboardingState(userSub || '', onboardingId);
  const [repoLink, setRepoLink] = useState('');
  const [codeText, setCodeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [privateRepoPrompt, setPrivateRepoPrompt] = useState<{ repoSlug: string } | null>(null);
  const [githubCallbackError, setGithubCallbackError] = useState<string | null>(null);
  const [showGithubAuthButton, setShowGithubAuthButton] = useState(false);
  const [githubJobId, setGithubJobId] = useState<string | null>(null);
  const [githubJobStatus, setGithubJobStatus] = useState<'processing' | 'completed' | 'failed' | null>(null);
  /** Sätt när GitHub-job completed (innan state har refetch:ats) så att vi aldrig POST:ar och knappen är klickbar. */
  const [codePersistedByBackend, setCodePersistedByBackend] = useState(false);

  /** När true: backend har redan code (GitHub/ZIP/tidigare POST). POST /api/onboarding/code får ALDRIG anropas. */
  const codeAlreadyInBackendRef = useRef(false);

  const loading = onboardingIdLoading || stateLoading;

  useEffect(() => {
    if (state?.code) codeAlreadyInBackendRef.current = true;
  }, [state?.code]);

  // Visa fel om onboardingId saknas
  useEffect(() => {
    if (onboardingIdError) {
      setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
    }
  }, [onboardingIdError]);

  // Ladda data från backend när state är tillgänglig
  useEffect(() => {
    if (loading) return;
    
    // ARKITEKTURREGEL: Ingen server-side redirect baserat på step.
    // Sidan får renderas även om state ännu inte reflekterar 'code'.
    // Visa loader om state.step !== 'code' (hanteras i render-logik nedan).
    
    setRepoLink(state?.code?.repoLink || '');
    setCodeText(state?.code?.codeText || '');
  }, [state, loading]);

  // Rensa GitHub-relaterad UI-state när FSM-status blir code_completed
  useEffect(() => {
    if (state?.status === 'code_completed') {
      setPrivateRepoPrompt(null);
      setShowGithubAuthButton(false);
    }
  }, [state?.status]);

  // URL-parametrar (github, jobId) används endast för init. Rensa URL direkt så att routing/rerenders inte återställer state.
  useEffect(() => {
    const gh = searchParams.get('github');
    const jobId = searchParams.get('jobId');
    const errorParam = searchParams.get('error');
    
    if (gh === 'processing' && jobId) {
      setGithubJobId(jobId);
      setGithubJobStatus('processing');
      setGithubCallbackError(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('github');
      params.delete('jobId');
      const q = params.toString();
      router.replace(q ? `/onboarding/code?${q}` : '/onboarding/code');
    } else if (gh === 'access_denied' && errorParam) {
      // Dekoda strukturerad felinfo från backend (base64url)
      try {
        // Använd atob för base64-dekodning i browser (base64url är kompatibelt med base64 för URL-safe chars)
        const decoded = atob(errorParam.replace(/-/g, '+').replace(/_/g, '/'));
        const errorData = JSON.parse(decoded);
        if (errorData?.error === 'GITHUB_ACCESS_DENIED') {
          setGithubCallbackError(
            'Vi kunde inte få åtkomst till GitHub-repot.\n\n' +
            'Vanliga orsaker:\n' +
            '• Repot är privat och OAuth-åtkomst saknas\n' +
            '• Repot ägs av en organisation som inte tillåter tredjepartsappar\n' +
            '• Du har inte själv tillgång till repot\n\n' +
            'Åtgärd:\n' +
            '1. Kontrollera att du äger repot eller har access\n' +
            '2. Säkerställ att GitHub frågar efter repo-åtkomst vid godkännande\n' +
            '3. Om det är ett organisationsrepo – be admin godkänna OAuth-appen'
          );
        } else {
          setGithubCallbackError(errorData?.message || 'Kunde inte koppla eller hämta repot. Försök igen.');
        }
      } catch {
        setGithubCallbackError('Kunde inte koppla eller hämta repot. Försök igen.');
      }
      setGithubJobStatus(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('github');
      params.delete('error');
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
    } else if (gh === 'error' || gh === 'download_failed') {
      setGithubCallbackError('Kunde inte koppla eller hämta repot. Försök igen.');
      setGithubJobStatus(null);
    }
  }, [searchParams, router]);

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
          codeAlreadyInBackendRef.current = true;
          setCodePersistedByBackend(true);
          setGithubJobStatus('completed');
          setGithubCallbackError(null);
          // Backend har redan append:at code_submitted; hämta state så att formuläret visar repoLink
          if (onboardingId) {
            fetch(`/api/onboarding?onboardingId=${encodeURIComponent(onboardingId)}`)
              .then((r) => r.ok ? r.json() : null)
              .then((data) => {
                if (!cancelled && data?.state?.code) {
                  setRepoLink(data.state.code.repoLink ?? '');
                  setCodeText(data.state.code.codeText ?? '');
                }
              })
              .catch(() => {});
          }
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

  const codeFromBackend = Boolean(state?.code) || codePersistedByBackend;
  const isReadOnly = codeFromBackend;

  // ARKITEKTURREGEL: Visa loader endast när state.status === 'started'
  // state === undefined är normalt initialt tillstånd vid RSC → client hydration och ska INTE blockera
  // code-sidan ska rendera när state.status === 'code_pending' ELLER 'code_completed' ELLER när state saknas
  const isWaitingForStateUpdate =
    !loading &&
    state !== null &&
    state !== undefined &&
    state.status === 'started';

  if (loading || isWaitingForStateUpdate) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    console.log('[handleSubmit] fired', { 
      stateStatus: state?.status, 
      codeFromBackend, 
      submitting, 
      githubJobStatus,
      onboardingId: !!onboardingId 
    });
    event.preventDefault();
    setError('');

    // FSM: När code redan är färdigt → gå DIREKT till Stripe
    if (state?.status === 'code_completed') {
      const planId = typeof window !== 'undefined' ? searchParams.get('plan') ?? getStoredPlanId() : null;
      router.push(getStripeOnboardingUrl(planId));
      return;
    }

    // När backend redan har code (oavsett källa) – aldrig POST. Endast navigera.
    if (state?.code || codeAlreadyInBackendRef.current) {
      const planId = typeof window !== 'undefined' ? searchParams.get('plan') ?? getStoredPlanId() : null;
      router.push(getStripeOnboardingUrl(planId));
      return;
    }

    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    if (!repoLink && !codeText && !file) {
      setError('Lägg till ZIP eller klistra in kod/repo-länk.');
      return;
    }

    setSubmitting(true);

    // KRITISKT: Hämta sessionId från anonym onboarding-session (samma källa som onboardingId)
    // Backend kräver anon_<uuid> i FormData, inte userSub från hook
    // Backend avgör om tomt sessionId är OK eller inte
    const sessionId = getAnonymousSessionIdFromCookie() || '';

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

    const result = await response.json().catch(() => ({}));

    // Explicit tolkning av payload - aldrig tolka HTTP-status som onboarding-semantik
    if (!result.success) {
      if (result?.error === 'GITHUB_OAUTH_REQUIRED') {
        setError(
          'Detta är ett privat GitHub-repo.\n\n' +
          'Du måste först auktorisera GitHub för att vi ska kunna läsa repot.'
        );
        setShowGithubAuthButton(true);
        setSubmitting(false);
        return;
      }
      if (result?.error === 'ONBOARDING_NOT_INITIALIZED') {
        setError('Onboarding-sessionen är inte korrekt initierad. Ladda om sidan eller starta onboarding på nytt.');
        setSubmitting(false);
        return;
      }
      setError(result.error ?? 'Unexpected error');
      setSubmitting(false);
      return;
    }

    // Hantera job-status explicit
    if (result.job) {
      switch (result.job.status) {
        case 'requires_github_oauth':
          if (result.job.repoPrivate && result.job.requiresGithubAccess && result.job.repoSlug) {
            setPrivateRepoPrompt({ repoSlug: result.job.repoSlug });
            setSubmitting(false);
            return;
          }
          break;
        case 'started':
        case 'already_running':
          // Visa loader / polling (hanteras av GitHub OAuth-flödet)
          break;
        case 'completed':
          // Fortsätt till Stripe
          break;
      }
    }

    const planId = typeof window !== 'undefined' ? searchParams.get('plan') ?? getStoredPlanId() : null;
    router.push(getStripeOnboardingUrl(planId));
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Koduppladdning</h1>
      <p className="text-gray-600 mb-6">
        Du kan ladda upp en ZIP eller klistra in kod/repo-länk. Allt är read-only och används
        endast som tillfälligt onboarding-material.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {codeFromBackend && (
          <div className="rounded-md bg-emerald-50 p-3 text-emerald-800" role="status">
            <p className="font-medium">
              {state?.code?.codeSource === 'github' ? '✓ Kod kopplad via GitHub' : '✓ Kod sparad'}
            </p>
            {state?.code?.repoLink && (
              <p className="mt-1 text-sm truncate" title={state.code.repoLink}>
                {state.code.repoLink}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ladda upp ZIP</label>
          <input
            type="file"
            accept=".zip"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            disabled={isReadOnly}
            className={isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}
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
              setShowGithubAuthButton(false);
            }}
            readOnly={isReadOnly}
            className={`w-full border border-gray-300 rounded-md p-3 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Klistra in kod</label>
          <textarea
            value={codeText}
            onChange={(event) => setCodeText(event.target.value)}
            readOnly={isReadOnly}
            className={`w-full border border-gray-300 rounded-md p-3 min-h-[180px] ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            placeholder="Klistra in kod här..."
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-red-800" role="alert">
            <p className="whitespace-pre-line">{typeof error === 'string' ? error : normalizeError(error)}</p>
            {showGithubAuthButton && onboardingId && repoLink && state?.status === 'code_pending' && (
              <a
                href={`/api/github/connect?repo=${encodeURIComponent(repoLink.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''))}&onboardingId=${encodeURIComponent(onboardingId)}`}
                className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Auktorisera GitHub
              </a>
            )}
          </div>
        )}
        {githubCallbackError && (
          <div className="rounded-md bg-amber-50 p-3 text-amber-800" role="alert">
            <p className="whitespace-pre-line">
              {typeof githubCallbackError === 'string' ? githubCallbackError : normalizeError(githubCallbackError)}
            </p>
            {githubCallbackError.includes('Vi kunde inte få åtkomst till GitHub-repot') && (
              <a
                href="https://github.com/settings/connections/applications"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm underline text-emerald-600"
              >
                Kontrollera GitHub-appar och behörigheter
              </a>
            )}
          </div>
        )}

        {githubJobStatus === 'processing' && (
          <div className="rounded-md bg-blue-50 p-3 text-blue-800" role="alert">
            <p className="font-medium">⏳ Processing repository...</p>
            <p className="mt-1 text-sm">Vi hämtar och laddar upp repot. Detta kan ta några sekunder.</p>
          </div>
        )}

        {privateRepoPrompt && onboardingId && state?.status === 'code_pending' && (
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

        {state?.status === 'code_completed' && state?.code?.repoLink && (
          <div className="rounded-md bg-emerald-50 p-3 text-emerald-800" role="status">
            <p className="font-medium">✓ GitHub-repo redan verifierat</p>
            <p className="mt-1 text-sm truncate" title={state.code.repoLink}>
              {state.code.repoLink}
            </p>
            <p className="mt-2 text-sm">
              Repot har redan kopplats och verifierats. Du kan fortsätta till Stripe onboarding.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          disabled={submitting || githubJobStatus === 'processing' || !onboardingId || (!codeFromBackend && !repoLink && !codeText && !file)}
          onClick={() => {
            const isDisabled = submitting || githubJobStatus === 'processing' || !onboardingId || (!codeFromBackend && !repoLink && !codeText && !file);
            console.log('[Submit Button] clicked', {
              isDisabled,
              submitting,
              githubJobStatus,
              onboardingId: !!onboardingId,
              codeFromBackend,
              repoLink: !!repoLink,
              codeText: !!codeText,
              file: !!file,
              stateStatus: state?.status
            });
          }}
        >
          {submitting ? 'Sparar...' : githubJobStatus === 'processing' ? 'Processing...' : 'Fortsätt till Stripe'}
        </button>
      </form>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { getStoredPlanId, getStripeOnboardingUrl } from '@/lib/onboarding/selected-plan';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { getAnonymousSessionIdFromCookie } from '@/lib/onboarding/anonymous-session-client';
import { normalizeError } from '@/lib/utils/normalize-error';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';

export function CodeUploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onboardingId, userSub, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId();
  const hookResult = useOnboardingState(userSub || '', onboardingId);
  const { state, loading: stateLoading } = hookResult;

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
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);


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
            try {
              const r = await fetch(`/api/onboarding?onboardingId=${encodeURIComponent(onboardingId)}`);
              if (r.ok) {
                const data = await r.json();
                if (!cancelled && data?.state?.code) {
                  setRepoLink(data.state.code.repoLink ?? '');
                  setCodeText(data.state.code.codeText ?? '');
                }
              }
            } catch {}
          }
          // Auto-fortsätt till Stripe när code är committed i FSM
          if (!cancelled) {
            handleStripeClick();
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
  const isWaitingForStateUpdate =
    !loading &&
    state !== null &&
    state !== undefined &&
    state.status === 'started';

  // ROUTING GUARD: URL och state ska alltid vara synkroniserade.
  // Om användaren hamnar på /onboarding/code med fel status → redirect till rätt steg.
  useEffect(() => {
    if (loading || state === null || state === undefined) return;

    const status = state.status;
    if (status === 'code_pending' || status === 'code_completed') return;

    const planId = typeof window !== 'undefined' ? getStoredPlanId() : null;
    const stripeUrl = getStripeOnboardingUrl(planId);

    if (status === 'started') {
      router.replace('/onboarding/questions');
    } else if (status === 'questions_completed' || status === 'stripe_started') {
      router.replace(stripeUrl);
    } else if (status === 'stripe_completed' || status === 'ready_for_review') {
      router.replace('/onboarding/success');
    }
  }, [loading, state?.status, router]);

  if (loading || isWaitingForStateUpdate) {
    return (
      <OnboardingLayout>
        <p className="text-gray-600">Laddar...</p>
      </OnboardingLayout>
    );
  }

  // Efter guard: om state inte är code_pending/code_completed visas redirect i useEffect; visa loader under omdirigering
  if (state && state.status !== 'code_pending' && state.status !== 'code_completed') {
    return (
      <OnboardingLayout>
        <p className="text-gray-600">Omdirigerar...</p>
      </OnboardingLayout>
    );
  }

  const handleGithubConnect = (repoSlug: string) => {
    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    // Disable knappen för att förhindra dubbelklick
    setConnectingGithub(true);

    // Direkt navigation till GitHub OAuth (backend redirectar till GitHub)
    window.location.href = `/api/github/connect?repo=${encodeURIComponent(repoSlug)}&onboardingId=${encodeURIComponent(onboardingId)}`;
  };

  const handleStripeClick = () => {
    const planId = typeof window !== 'undefined' ? searchParams.get('plan') ?? getStoredPlanId() : null;
    const stripeUrl = getStripeOnboardingUrl(planId);
    const returnTo = stripeUrl + (stripeUrl.includes('?') ? '&' : '?') + 'autostart=true';
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}&screen_hint=signup`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    // FSM: När code redan är färdigt → Auth0 login med returnTo Stripe (autostart)
    if (state?.status === 'code_completed') {
      handleStripeClick();
      return;
    }

    // När backend redan har code (oavsett källa) – aldrig POST. Endast redirect till login → Stripe.
    if (state?.code || codeAlreadyInBackendRef.current) {
      handleStripeClick();
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

    // KRITISK GUARD: Om repoLink finns men GitHub inte är verifierat → blockera POST
    // Privata repon kräver GitHub OAuth innan code-submission
    if (repoLink && !codeText && !file) {
      // Detta är en GitHub-repo (ingen kod eller fil)
      // Kolla om GitHub redan är verifierat
      if (!state || !state.github?.verified) {
        setError(
          'Detta är ett privat GitHub-repo.\n\n' +
          'Klicka på "Auktorisera GitHub" för att fortsätta.'
        );
        setShowGithubAuthButton(true);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(true);

    // Bug 8 — ZIP-upload-branch via direct GCS (bypassar Cloud Run 32 MB-limit)
    if (file) {
      try {
        // Steg 1: Begär signed PUT URL
        setUploadProgress(0);
        const urlResponse = await fetch('/api/onboarding/code/generate-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            onboardingId,
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type || 'application/zip',
          }),
        });

        const urlData = await urlResponse.json();
        if (!urlData.success) {
          throw new Error(urlData.message || urlData.error || 'Kunde inte begära uppladdnings-URL');
        }

        const { jobId, uploadUrl, gcsPath } = urlData;

        // Steg 2: PUT direkt till GCS med progress (XHR krävs för upload-events)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type || 'application/zip');

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`GCS upload misslyckades (status ${xhr.status})`));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Nätverksfel under uppladdning')));
          xhr.addEventListener('abort', () => reject(new Error('Uppladdning avbruten')));

          xhr.send(file);
        });

        // Steg 3: Finalize — PATCH admin + append code_submitted-event
        const finalizeResponse = await fetch('/api/onboarding/code/finalize-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            onboardingId,
            jobId,
            gcsPath,
            fileName: file.name,
            fileSize: file.size,
          }),
        });

        const finalizeData = await finalizeResponse.json();
        if (!finalizeData.success) {
          throw new Error(finalizeData.message || finalizeData.error || 'Finalize misslyckades');
        }

        // Trigga polling så frontend visar 'Processing repository...' tills FSM är klar
        // Polling-endpointen (/api/github/job?jobId=...) detekterar GCS-filen och
        // sätter status='completed' om finalize inte hann uppdatera än.
        setGithubJobId(jobId);
        setGithubJobStatus('processing');
        setUploadProgress(null);
        setSubmitting(false);
        return;
      } catch (uploadErr) {
        console.error('[Code Upload] Direct GCS upload failed:', uploadErr);
        setError(uploadErr instanceof Error ? uploadErr.message : 'Uppladdning misslyckades');
        setUploadProgress(null);
        setSubmitting(false);
        return;
      }
    }

    // ── Branch: repoLink eller codeText (oförändrat befintligt flöde) ──────────
    const sessionId = getAnonymousSessionIdFromCookie() || '';

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('onboardingId', onboardingId);
    formData.append('repoLink', repoLink);
    formData.append('codeText', codeText);

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
          // Worker uploadar fortfarande. Starta polling, vänta på 'completed'.
          // Polling-useEffecten kommer trigga handleStripeClick när FSM är klar.
          if (result.job.jobId) {
            setGithubJobId(result.job.jobId);
            setGithubJobStatus('processing');
          }
          setSubmitting(false);
          return;
        case 'completed':
          // Fortsätt till Stripe
          break;
      }
    }

    handleStripeClick();
  };


  const submitDisabled =
    submitting ||
    githubJobStatus === 'processing' ||
    !onboardingId ||
    (!codeFromBackend && !repoLink && !codeText && !file);

  return (
    <OnboardingLayout>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-4">
        Koduppladdning
      </h1>
      <p className="text-gray-600 text-center mb-10 max-w-md">
        Du kan ladda upp en ZIP eller klistra in kod/repo-länk. Allt är read-only och används
        endast som tillfälligt onboarding-material.
      </p>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
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
          <label
            htmlFor="zip-file-input"
            className={`block w-full text-center px-6 py-4 rounded-2xl border-2 font-medium text-gray-700 transition-all duration-150 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
            style={{
              borderColor: file ? '#10b981' : '#e5e7eb',
              background: file ? 'rgba(16,185,129,0.06)' : 'white',
            }}
          >
            {file ? `📁 ${file.name}` : '📎 Välj ZIP-fil'}
          </label>
          <input
            id="zip-file-input"
            type="file"
            accept=".zip"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            disabled={isReadOnly}
            className="hidden"
          />
          {uploadProgress !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Laddar upp...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Repo-länk</label>
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <input
              type="url"
              value={repoLink}
              onChange={(event) => {
                setRepoLink(event.target.value);
                setPrivateRepoPrompt(null);
                setShowGithubAuthButton(false);
              }}
              readOnly={isReadOnly}
              className={`w-full border border-gray-300 rounded-md p-3 pl-12 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="https://github.com/..."
            />
          </div>
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
              <button
                type="button"
                onClick={() => handleGithubConnect(repoLink.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''))}
                disabled={connectingGithub}
                className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectingGithub ? 'Ansluter...' : 'Auktorisera GitHub'}
              </button>
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
            <button
              type="button"
              onClick={() => handleGithubConnect(privateRepoPrompt.repoSlug)}
              disabled={connectingGithub}
              className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectingGithub ? 'Ansluter...' : 'Koppla GitHub-konto'}
            </button>
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
          type={state?.status === 'code_completed' ? 'button' : 'submit'}
          disabled={submitDisabled}
          onClick={state?.status === 'code_completed' ? handleStripeClick : undefined}
          className="mt-10 px-10 py-3 rounded-full font-semibold transition-all duration-200 w-full md:w-auto md:mx-auto block"
          style={{
            background: submitDisabled ? '#d1fae5' : '#10b981',
            color: submitDisabled ? '#6ee7b7' : 'white',
            cursor: submitDisabled ? 'not-allowed' : 'pointer',
            boxShadow: submitDisabled ? 'none' : '0 4px 14px rgba(16,185,129,0.3)',
          }}
        >
          {submitting ? 'Sparar...' : githubJobStatus === 'processing' ? 'Processing...' : state?.status === 'code_completed' ? 'Fortsätt till Stripe onboarding' : 'Fortsätt till Stripe'}
        </button>
      </form>
    </OnboardingLayout>
  );
}

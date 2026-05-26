import { signPayload } from '@/lib/crypto/hmac';

/**
 * Helper för att trigga extern GitHub-worker.
 * Public website orkestrerar endast - worker hanterar all ZIP-hantering.
 *
 * Alla anrop HMAC-signeras med ADMIN_SHARED_SECRET (samma secret som admin-portal).
 * Workern verifierar x-signature med samma algoritm.
 */

const GITHUB_WORKER_URL = process.env.GITHUB_WORKER_URL;

if (!GITHUB_WORKER_URL) {
  console.warn('[GitHub Worker] GITHUB_WORKER_URL not set - GitHub import will fail');
}

export interface TriggerWorkerOptions {
  branch?: string;
  githubAccessToken?: string;
}

export interface TriggerWorkerResult {
  accepted: boolean;
  body: unknown;
}

/**
 * Triggar extern GitHub-worker för att processera ett import-jobb.
 *
 * @param jobId          - GitHub job ID (skapat via createGitHubJob eller crypto.randomBytes)
 * @param onboardingId   - Onboarding-session ID
 * @param repo           - Repository slug (owner/repo)
 * @param options        - { branch?, githubAccessToken? }
 * @returns              - { accepted: true, body } om workern svarade 2xx
 * @throws               - Error om ADMIN_SHARED_SECRET/GITHUB_WORKER_URL saknas, eller om workern inte svarar 2xx
 */
export async function triggerExternalGitHubWorker(
  jobId: string,
  onboardingId: string,
  repo: string,
  options: TriggerWorkerOptions = {}
): Promise<TriggerWorkerResult> {
  if (!GITHUB_WORKER_URL) {
    throw new Error('GITHUB_WORKER_URL environment variable is not set');
  }

  const secret = process.env.ADMIN_SHARED_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SHARED_SECRET is not configured');
  }

  const { branch, githubAccessToken } = options;

  const rawBody = JSON.stringify({
    jobId,
    onboardingId,
    repo,
    branch: branch || 'HEAD',
    ...(githubAccessToken && { githubAccessToken }),
  });

  // HMAC-signeras över exakt den sträng som skickas i body (ingen re-serialisering)
  const signature = signPayload(rawBody, secret);

  const workerUrl = `${GITHUB_WORKER_URL}/run-job`;


  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-signature': signature,
    },
    body: rawBody,
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `External GitHub worker failed: ${response.status} ${response.statusText}. ` +
        JSON.stringify(responseBody)
    );
  }

  return { accepted: true, body: responseBody };
}

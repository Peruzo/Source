/**
 * Helper för att trigga extern GitHub-worker.
 * Public website orkestrerar endast - worker hanterar all ZIP-hantering.
 */

const GITHUB_WORKER_URL = process.env.GITHUB_WORKER_URL;

if (!GITHUB_WORKER_URL) {
  console.warn('[GitHub Worker] GITHUB_WORKER_URL not set - GitHub import will fail');
}

/**
 * Triggar extern GitHub-worker för att processera ett import-jobb.
 * 
 * @param jobId - GitHub job ID (skapat via createGitHubJob)
 * @param repo - Repository slug (owner/repo)
 * @returns Promise som resolvas när worker accepterat jobbet
 * @throws Error om worker URL saknas eller request misslyckas
 */
export async function triggerExternalGitHubWorker(
  jobId: string,
  repo: string
): Promise<void> {
  if (!GITHUB_WORKER_URL) {
    throw new Error('GITHUB_WORKER_URL environment variable is not set');
  }

  const workerUrl = `${GITHUB_WORKER_URL}/run-job`;
  
  console.log(`[GitHub Worker] Triggering external worker: ${workerUrl} for job ${jobId}`);

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId,
      repo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `External GitHub worker failed: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  console.log(`[GitHub Worker] External worker accepted job ${jobId}`);
}

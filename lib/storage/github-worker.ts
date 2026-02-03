/**
 * DEPRECATED: Denna fil är deprecated.
 * 
 * GitHub ZIP-hantering har flyttats till extern Cloud Run-worker:
 * - Extern worker: https://source-github-worker-809785351172.europe-north1.run.app
 * - Public website orkestrerar endast (skapar jobb, triggar worker)
 * - Worker hanterar all ZIP-streaming och GCS-upload utanför public website
 * 
 * Denna fil behålls för referens men används inte längre.
 * All ZIP-hantering sker nu i extern worker.
 */

// Export tom funktion för backwards compatibility (används inte)
export async function processGitHubJobStreaming(
  jobId: string,
  githubToken: string
): Promise<void> {
  // DEPRECATED: Denna funktion används inte längre.
  // All ZIP-hantering sker nu i extern worker.
  console.warn(`[GitHub Worker] processGitHubJobStreaming called but deprecated. Job ${jobId} should be handled by external worker.`);
  throw new Error('This function is deprecated. GitHub import is handled by external worker.');
}

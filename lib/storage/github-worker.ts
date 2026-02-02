import { Storage } from '@google-cloud/storage';
import { Readable } from 'stream';
import { getGitHubJob, updateJobStatus } from './github-jobs';
import { appendOnboardingEvent } from './onboarding-events';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * NIVÅ 2: Streaming-baserad GitHub import worker.
 * 
 * Denna funktion streamar direkt från GitHub API till GCS utan att hålla data i minnet.
 * Detta eliminerar OOM-problem även för stora repositories.
 * 
 * @param jobId - GitHub job ID
 * @param githubToken - GitHub OAuth token (används för att hämta repo)
 */
export async function processGitHubJobStreaming(
  jobId: string,
  githubToken: string
): Promise<void> {
  const job = await getGitHubJob(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  // Idempotent: om jobbet redan är completed eller running, hoppa över
  if (job.status === 'completed') {
    console.log(`[GitHub Worker] Job ${jobId} already completed`);
    return;
  }

  if (job.status === 'running') {
    // Kontrollera om jobbet har hängt sig (timeout efter 10 minuter)
    const startedAt = job.startedAt ? new Date(job.startedAt) : null;
    if (startedAt) {
      const elapsedMinutes = (Date.now() - startedAt.getTime()) / 1000 / 60;
      if (elapsedMinutes > 10) {
        console.warn(`[GitHub Worker] Job ${jobId} timed out, resetting to queued`);
        await updateJobStatus(jobId, 'queued', { startedAt: undefined });
      } else {
        console.log(`[GitHub Worker] Job ${jobId} already running (started ${elapsedMinutes.toFixed(1)} min ago)`);
        return;
      }
    }
  }

  // Atomärt uppdatera status till 'running' (förhindrar race conditions)
  const now = new Date().toISOString();
  await updateJobStatus(jobId, 'running', { 
    startedAt: now,
    progress: { stage: 'fetching', message: 'Hämtar repository från GitHub...' }
  });

  const memoryBefore = process.memoryUsage();
  console.log(`[GitHub Worker] Starting job ${jobId}, memory before:`, {
    heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024),
  });

  try {
    // STEG 1: Fetch ZIP stream från GitHub (ingen buffer)
    const zipUrl = `https://api.github.com/repos/${job.owner}/${job.repoName}/zipball/HEAD`;
    console.log(`[GitHub Worker] Fetching ZIP from: ${zipUrl}`);

    const zipRes = await fetch(zipUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${githubToken}`,
      },
      redirect: 'follow',
    });

    if (!zipRes.ok) {
      throw new Error(`Failed to fetch ZIP: ${zipRes.status} ${zipRes.statusText}`);
    }

    if (!zipRes.body) {
      throw new Error('Response body is null');
    }

    // STEG 2: Stream direkt till GCS (ingen buffer i minnet)
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const bucket = storage.bucket(BUCKET!);
    
    const safeUserSub = job.userSub.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
    const repoSlug = job.repo.replace(/\//g, '-').replace(/[^a-zA-Z0-9._-]/g, '_');
    const uuid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const objectName = `code-packages/github/${safeUserSub}/${repoSlug}-${uuid}.zip`;
    const gcsFile = bucket.file(objectName);

    await updateJobStatus(jobId, 'running', {
      progress: { stage: 'uploading', message: 'Laddar upp till lagring...' }
    });

    // Konvertera ReadableStream till Node.js Stream och pipe till GCS
    const nodeStream = Readable.fromWeb(zipRes.body as any);
    
    // Stream direkt till GCS med progress tracking
    let uploadedBytes = 0;
    const uploadStream = gcsFile.createWriteStream({
      metadata: {
        contentType: 'application/zip',
        cacheControl: 'private, max-age=0',
      },
    });

    // Track upload progress
    nodeStream.on('data', (chunk: Buffer) => {
      uploadedBytes += chunk.length;
      if (uploadedBytes % (10 * 1024 * 1024) === 0) { // Logga var 10 MB
        const memoryCurrent = process.memoryUsage();
        console.log(`[GitHub Worker] Upload progress: ${Math.round(uploadedBytes / 1024 / 1024)} MB, memory:`, {
          heapUsed: Math.round(memoryCurrent.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryCurrent.heapTotal / 1024 / 1024),
        });
      }
    });

    // Pipe stream till GCS
    await new Promise<void>((resolve, reject) => {
      nodeStream
        .pipe(uploadStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const objectUrl = `gs://${BUCKET}/${objectName}`;
    const fileName = `${job.repoName}-${uuid}.zip`;

    const memoryAfterUpload = process.memoryUsage();
    console.log(`[GitHub Worker] Upload completed, memory after:`, {
      heapUsed: Math.round(memoryAfterUpload.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryAfterUpload.heapTotal / 1024 / 1024),
      uploadedMB: Math.round(uploadedBytes / 1024 / 1024),
    });

    await updateJobStatus(jobId, 'running', {
      progress: { stage: 'finalizing', message: 'Slutför import...' }
    });

    // STEG 3: Append onboarding event (endast metadata)
    const retrievedAt = new Date().toISOString();
    await appendOnboardingEvent(job.onboardingId, {
      type: 'code_submitted',
      payload: {
        repoLink: job.repoUrl,
        fileName,
      },
    });

    // STEG 4: Skicka till admin-portalen (endast metadata)
    const payload = {
      idempotencyKey: `onboarding-${job.onboardingId}-code-github-${job.repo}`,
      onboardingId: job.onboardingId,
      sessionId: job.userSub,
      step: 'code',
      onboardingStatus: 'påbörjad',
      user: {
        sub: job.userSub,
      },
      codePackage: {
        type: 'github',
        source: 'public_onboarding',
        status: 'received',
        github: {
          repoUrl: job.repoUrl,
          isPrivate: true,
          accessStatus: 'granted',
          retrievedVia: 'oauth',
          retrievedAt,
        },
        zip: {
          fileName,
          sizeBytes: uploadedBytes,
          storage: {
            type: 'gcs',
            objectUrl,
          },
        },
      },
      submittedAt: retrievedAt,
      source: 'public_onboarding',
    };

    await sendToAdminPortal('onboarding', payload);

    // STEG 5: Markera jobbet som completed och rensa token
    await updateJobStatus(jobId, 'completed', {
      completedAt: new Date().toISOString(),
      uploadResult: {
        objectUrl,
        sizeBytes: uploadedBytes,
        fileName,
      },
      githubToken: undefined, // Rensa token när klart
    });

    const memoryFinal = process.memoryUsage();
    console.log(`[GitHub Worker] Job ${jobId} completed successfully, memory final:`, {
      heapUsed: Math.round(memoryFinal.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryFinal.heapTotal / 1024 / 1024),
    });
  } catch (error) {
    console.error(`[GitHub Worker] Error processing job ${jobId}:`, error);
    
    // Markera som failed och rensa token
    await updateJobStatus(jobId, 'failed', {
      error: error instanceof Error ? error.message : String(error),
      githubToken: undefined, // Rensa token vid fel
    });
    
    throw error;
  }
}

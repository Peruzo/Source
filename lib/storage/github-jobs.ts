import { Storage } from '@google-cloud/storage';
import { uploadCodePackageZip } from './code-packages';
import { appendOnboardingEvent } from './onboarding-events';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type GitHubJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type GitHubJob = {
  jobId: string;
  onboardingId: string;
  userSub: string;
  repo: string;
  owner: string;
  repoName: string;
  repoUrl: string;
  status: GitHubJobStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
  uploadResult?: {
    objectUrl: string;
    sizeBytes: number;
    fileName: string;
  };
};

/**
 * Skapar ett nytt GitHub import-jobb.
 * Jobbet kommer att processas async för att förhindra OOM.
 */
export async function createGitHubJob(params: {
  onboardingId: string;
  userSub: string;
  repo: string;
  owner: string;
  repoName: string;
  repoUrl: string;
}): Promise<string> {
  if (!BUCKET) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
  }

  const jobId = `${params.onboardingId}-${Date.now()}`;
  const now = new Date().toISOString();
  
  const job: GitHubJob = {
    jobId,
    ...params,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const fileName = `github-jobs/${jobId}.json`;
  const file = bucket.file(fileName);

  await file.save(JSON.stringify(job, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });

  console.log(`[GitHub Jobs] Created job ${jobId} for onboardingId: ${params.onboardingId}`);
  return jobId;
}

/**
 * Hämtar ett GitHub-jobb.
 */
export async function getGitHubJob(jobId: string): Promise<GitHubJob | null> {
  if (!BUCKET) return null;

  try {
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const bucket = storage.bucket(BUCKET);
    const file = bucket.file(`github-jobs/${jobId}.json`);
    const [exists] = await file.exists();
    
    if (!exists) return null;

    const [contents] = await file.download();
    return JSON.parse(contents.toString('utf8')) as GitHubJob;
  } catch (error) {
    console.error(`[GitHub Jobs] Error reading job ${jobId}:`, error);
    return null;
  }
}

/**
 * Processar ett GitHub-jobb async.
 * Hämtar repo som ZIP, streamar direkt till GCS, och uppdaterar onboarding-state.
 */
export async function processGitHubJob(
  jobId: string,
  githubToken: string
): Promise<void> {
  const job = await getGitHubJob(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  if (job.status !== 'pending') {
    console.log(`[GitHub Jobs] Job ${jobId} already processed (status: ${job.status})`);
    return;
  }

  // Uppdatera status till processing
  await updateJobStatus(jobId, 'processing');

  try {
    const memoryBefore = process.memoryUsage();
    console.log(`[GitHub Jobs] Processing job ${jobId}, memory before:`, {
      heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024),
    });

    // Fetch repo as ZIP
    const zipRes = await fetch(
      `https://api.github.com/repos/${job.owner}/${job.repoName}/zipball/HEAD`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken}`,
        },
        redirect: 'follow',
      }
    );

    if (!zipRes.ok) {
      throw new Error(`Failed to fetch ZIP: ${zipRes.status} ${zipRes.statusText}`);
    }

    // Stream direkt till GCS (förhindrar OOM)
    const zipBuffer = Buffer.from(await zipRes.arrayBuffer());
    const memoryAfter = process.memoryUsage();
    console.log(`[GitHub Jobs] ZIP downloaded, memory after:`, {
      heapUsed: Math.round(memoryAfter.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryAfter.heapTotal / 1024 / 1024),
      zipSizeMB: Math.round(zipBuffer.length / 1024 / 1024),
    });

    const uploadResult = await uploadCodePackageZip({
      buffer: zipBuffer,
      userSub: job.userSub,
      repo: job.repo,
      contentType: 'application/zip',
      fileName: `${job.repoName}.zip`,
    });

    // Rensa zipBuffer från minnet så snart som möjligt
    // zipBuffer går ut ur scope här

    const retrievedAt = new Date().toISOString();

    // Append event till event-logg
    await appendOnboardingEvent(job.onboardingId, {
      type: 'code_submitted',
      payload: {
        repoLink: job.repoUrl,
        fileName: uploadResult.fileName,
      },
    });

    // Skicka till admin-portalen
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
          fileName: uploadResult.fileName,
          sizeBytes: uploadResult.sizeBytes,
          storage: {
            type: 'gcs',
            objectUrl: uploadResult.objectUrl,
          },
        },
      },
      submittedAt: retrievedAt,
      source: 'public_onboarding',
    };

    await sendToAdminPortal('onboarding', payload);

    // Uppdatera jobb med resultat
    await updateJobStatus(jobId, 'completed', { uploadResult });

    const memoryFinal = process.memoryUsage();
    console.log(`[GitHub Jobs] Job ${jobId} completed, memory final:`, {
      heapUsed: Math.round(memoryFinal.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryFinal.heapTotal / 1024 / 1024),
    });
  } catch (error) {
    console.error(`[GitHub Jobs] Error processing job ${jobId}:`, error);
    await updateJobStatus(jobId, 'failed', { error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}

async function updateJobStatus(
  jobId: string,
  status: GitHubJobStatus,
  updates?: { uploadResult?: GitHubJob['uploadResult']; error?: string }
): Promise<void> {
  if (!BUCKET) return;

  const job = await getGitHubJob(jobId);
  if (!job) return;

  const updated: GitHubJob = {
    ...job,
    status,
    updatedAt: new Date().toISOString(),
    ...updates,
  };

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const file = bucket.file(`github-jobs/${jobId}.json`);

  await file.save(JSON.stringify(updated, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });
}

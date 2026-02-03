import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type GitHubJobStatus = 'queued' | 'running' | 'completed' | 'failed';

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
  startedAt?: string;
  completedAt?: string;
  error?: string;
  progress?: {
    stage: 'fetching' | 'uploading' | 'finalizing';
    message?: string;
  };
  uploadResult?: {
    objectUrl: string;
    sizeBytes: number;
    fileName: string;
  };
  // GitHub token sparas temporärt i jobbet för worker-processering
  // Token rensas när jobbet är klart eller misslyckat
  githubToken?: string;
};

/**
 * Skapar ett nytt GitHub import-jobb.
 * Jobbet kommer att processas async för att förhindra OOM.
 * 
 * @param githubToken - GitHub OAuth token (sparas temporärt i jobbet för worker)
 */
export async function createGitHubJob(params: {
  onboardingId: string;
  userSub: string;
  repo: string;
  owner: string;
  repoName: string;
  repoUrl: string;
  githubToken: string;
}): Promise<string> {
  if (!BUCKET) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
  }

  const jobId = `${params.onboardingId}-${Date.now()}`;
  const now = new Date().toISOString();
  
  const job: GitHubJob = {
    jobId,
    onboardingId: params.onboardingId,
    userSub: params.userSub,
    repo: params.repo,
    owner: params.owner,
    repoName: params.repoName,
    repoUrl: params.repoUrl,
    githubToken: params.githubToken, // Spara temporärt för worker
    status: 'queued',
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
 * DEPRECATED: Denna funktion är deprecated.
 * 
 * GitHub ZIP-hantering har flyttats till extern Cloud Run-worker.
 * Public website triggar nu extern worker direkt från callback.
 * 
 * Denna funktion behålls för backwards compatibility men används inte längre.
 */
export async function processGitHubJob(
  jobId: string,
  githubToken: string
): Promise<void> {
  console.warn(`[GitHub Jobs] processGitHubJob called but deprecated. Job ${jobId} should be handled by external worker.`);
  throw new Error('This function is deprecated. GitHub import is handled by external worker.');
}

export async function updateJobStatus(
  jobId: string,
  status: GitHubJobStatus,
  updates?: Partial<Pick<GitHubJob, 'uploadResult' | 'error' | 'startedAt' | 'completedAt' | 'progress' | 'githubToken'>>
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

import { randomUUID } from 'crypto';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type GitHubJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export type GitHubJob = {
  jobId: string;
  onboardingId: string;
  userSub: string;
  // För GitHub-flöden: owner/repoName/repoUrl är satta från OAuth-callback.
  // För ZIP-upload-flöden: dessa är undefined.
  repo?: string;
  owner?: string;
  repoName?: string;
  repoUrl?: string;
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
  // Kundens GitHub-token sparas aldrig i jobbet. Callbacken skickar den bara direkt till
  // workern, som återkallar den efter nedladdningen.
  // FSM guard: förhindra att github_verified event skickas flera gånger från polling
  adminNotifiedAt?: string;
};

/** Samma format som workerns JOB_ID_RE; allt annat avvisas innan lagringen läses. */
export const JOB_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

export function isValidJobId(jobId: string | null | undefined): jobId is string {
  return typeof jobId === 'string' && JOB_ID_RE.test(jobId);
}

/** Jobbet tillhör onboardingen (UUID jämförs skiftlägesokänsligt). */
export function jobBelongsToOnboarding(job: Pick<GitHubJob, 'onboardingId'>, onboardingId: string): boolean {
  return (
    typeof job.onboardingId === 'string' &&
    job.onboardingId.toLowerCase() === onboardingId.toLowerCase()
  );
}

/**
 * Skapar ett nytt GitHub import-jobb.
 * Jobbet kommer att processas async för att förhindra OOM.
 * Kundens GitHub-token tas inte emot här och skrivs aldrig till lagringen.
 */
export async function createGitHubJob(params: {
  onboardingId: string;
  userSub: string;
  jobId?: string;
  status?: GitHubJobStatus;
  repo?: string;
  owner?: string;
  repoName?: string;
  repoUrl?: string;
}): Promise<string> {
  if (!BUCKET) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
  }

  // Slumpmässigt, ej förutsägbart id (tidigare onboardingId-tidsstämpel). Matchar workerns JOB_ID_RE.
  const jobId = params.jobId ?? randomUUID();
  const now = new Date().toISOString();

  const job: GitHubJob = {
    jobId,
    onboardingId: params.onboardingId,
    userSub: params.userSub,
    repo: params.repo,
    owner: params.owner,
    repoName: params.repoName,
    repoUrl: params.repoUrl,
    status: params.status ?? 'queued',
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

  return jobId;
}

/**
 * Äldre jobbfiler kan innehålla fältet githubToken från före rättningen. Det tas bort vid
 * läsning så att ingen anropare ser det, och försvinner ur filen vid nästa uppdatering.
 */
function withoutLegacyToken(job: GitHubJob & { githubToken?: unknown }): GitHubJob {
  const { githubToken: _legacyToken, ...rest } = job;
  return rest;
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
    return withoutLegacyToken(JSON.parse(contents.toString('utf8')) as GitHubJob);
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
  updates?: Partial<Pick<GitHubJob, 'uploadResult' | 'error' | 'startedAt' | 'completedAt' | 'progress' | 'adminNotifiedAt'>>
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

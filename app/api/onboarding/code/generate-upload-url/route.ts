import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Storage } from '@google-cloud/storage';
import { auth0 } from '@/lib/auth0';
import { createGitHubJob } from '@/lib/storage/github-jobs';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

const FILENAME_RE = /[^a-zA-Z0-9._-]/g;
function sanitizeFilename(name: string): string {
  return name.replace(FILENAME_RE, '_').slice(0, 128);
}

/**
 * POST /api/onboarding/code/generate-upload-url
 *
 * Bug 8: Returnerar signed PUT URL för direct GCS upload av kund-ZIP.
 *
 * Tidigare flöde:
 *   Frontend → POST /api/onboarding/code med FormData → Cloud Run
 *   buffrar hela body via request.formData() → 32 MB limit → 413
 *
 * Nytt flöde:
 *   1. Frontend POST → denna endpoint för signed URL
 *   2. Frontend PUT till GCS direkt (bypassar Cloud Run, supportar 5 GB)
 *   3. Frontend POST → /api/onboarding/code/finalize-upload för att
 *      trigga admin-PATCH med storageObjectUrl
 *
 * Body: { onboardingId, fileName, fileSize, contentType }
 * Returns: { jobId, uploadUrl, gcsPath, expiresInSeconds }
 */
export async function POST(request: Request) {
  try {
    // Auth (samma mönster som befintliga /api/onboarding/code)
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json(
        { success: false, error: 'AUTH_REQUIRED', message: 'User must be authenticated' },
        { status: 401 }
      );
    }
    const userSub = session.user.sub;

    if (!BUCKET) {
      return NextResponse.json(
        { success: false, error: 'BUCKET_NOT_CONFIGURED' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const { onboardingId, fileName, fileSize, contentType } = body;

    if (!onboardingId || !fileName || !contentType) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'onboardingId, fileName, contentType required' },
        { status: 400 }
      );
    }

    // Validera ZIP-typer
    const allowedTypes = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_CONTENT_TYPE', message: `Endast ZIP tillåts, fick: ${contentType}` },
        { status: 400 }
      );
    }

    // Max 5 GB (samma som worker MAX_UPLOAD_BYTES)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'FILE_TOO_LARGE', message: `Max ${MAX_FILE_SIZE / 1024 / 1024 / 1024} GB` },
        { status: 400 }
      );
    }

    // Validera filändelse
    const safeFileName = sanitizeFilename(fileName);
    if (!safeFileName.toLowerCase().endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: 'INVALID_EXTENSION', message: 'Filen måste vara .zip' },
        { status: 400 }
      );
    }

    // Generera jobId — 32 hex (matchar worker JOB_ID_RE)
    const jobId = crypto.randomBytes(16).toString('hex');
    const storagePath = `upload/${jobId}.zip`;

    // Skapa job-record så att polling-endpointen kan hitta jobbet
    try {
      await createGitHubJob({
        jobId,
        onboardingId,
        userSub,
        status: 'queued',
      });
    } catch (err) {
      console.error('[Generate Upload URL] Failed to create job record:', err);
      return NextResponse.json(
        { success: false, error: 'JOB_STORE_UNAVAILABLE' },
        { status: 502 }
      );
    }

    // Generera signed PUT URL
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const [uploadUrl] = await storage
      .bucket(BUCKET)
      .file(storagePath)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 30 * 60 * 1000, // 30 min för stora filer
        contentType,
      });

    const gcsPath = `gs://${BUCKET}/${storagePath}`;


    return NextResponse.json({
      success: true,
      jobId,
      uploadUrl,
      gcsPath,
      filename: safeFileName,
      expiresInSeconds: 30 * 60,
    });
  } catch (error) {
    console.error('[Generate Upload URL] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

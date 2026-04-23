import { signHeadersPayload } from '@/lib/crypto/hmac';

/**
 * Streama ZIP-fil direkt till GitHub-workerns /jobs/upload-endpoint.
 *
 * Fildata skickas som application/octet-stream i request body.
 * Metadata (jobId, onboardingId, filename) skickas som request headers.
 * HMAC-signaturen beräknas över "<jobId>\n<onboardingId>\n<filename>".
 *
 * duplex: 'half' är obligatoriskt för streaming fetch i Node.js 18+.
 * Utan det ignoreras request body tyst (ingen körningsfel, tom upload).
 */

export interface StreamUploadParams {
  jobId: string;
  onboardingId: string;
  filename: string;
  body: ReadableStream;
}

export async function streamUploadToWorker(params: StreamUploadParams): Promise<Response> {
  const workerUrl = process.env.GITHUB_WORKER_URL;
  if (!workerUrl) {
    throw new Error('GITHUB_WORKER_URL environment variable is not set');
  }

  const secret = process.env.ADMIN_SHARED_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SHARED_SECRET is not configured');
  }

  const { jobId, onboardingId, filename, body } = params;

  const signature = signHeadersPayload(jobId, onboardingId, filename, secret);

  const uploadUrl = `${workerUrl}/jobs/upload`;

  console.log(`[Worker Upload] Streaming file to ${uploadUrl}`, { jobId, onboardingId, filename });

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-signature': signature,
      'x-job-id': jobId,
      'x-onboarding-id': onboardingId,
      'x-filename': filename,
    },
    // @ts-expect-error — duplex is required for streaming request bodies in Node.js 18+
    // Without this flag the body is silently ignored (no error, empty upload).
    // See: https://github.com/nodejs/node/issues/46221
    duplex: 'half',
    body,
  });

  return response;
}

import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type UploadCodePackageZipResult = {
  objectUrl: string;
  publicUrl?: string;
  sizeBytes: number;
  fileName: string;
};

/**
 * Upload a ZIP buffer to GCS under code-packages/github/<userSub>/<repo>-<uuid>.zip.
 * No base64; buffer is streamed directly to GCS.
 */
export async function uploadCodePackageZip(params: {
  buffer: Buffer;
  fileName?: string;
  contentType?: string;
  userSub: string;
  repo: string;
}): Promise<UploadCodePackageZipResult> {
  const bucketName = BUCKET || process.env.GCS_BUCKET_CODE_PACKAGES;
  if (!bucketName) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES is not set');
  }

  const { buffer, userSub, repo, contentType = 'application/zip' } = params;
  const sizeBytes = buffer.length;

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(bucketName);

  const safeUserSub = userSub.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const repoSlug = repo.replace(/\//g, '-').replace(/[^a-zA-Z0-9._-]/g, '_');
  const uuid = crypto.randomUUID().slice(0, 8);
  const objectName = `code-packages/github/${safeUserSub}/${repoSlug}-${uuid}.zip`;

  const file = bucket.file(objectName);
  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: 'private, max-age=0',
    },
  });

  const objectUrl = `gs://${bucketName}/${objectName}`;
  const fileName = params.fileName ?? `${repoSlug}-${uuid}.zip`;

  return {
    objectUrl,
    sizeBytes,
    fileName,
  };
}

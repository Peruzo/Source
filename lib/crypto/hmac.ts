import crypto from 'crypto';

/**
 * Gemensam HMAC-SHA256-signeringshjälpare för kommunikation med
 * admin-portal och github-worker.
 *
 * Samma format som signBody() i lib/api/admin-portal.ts:
 *   sha256=<hex>
 *
 * Båda mottagarna verifierar med samma algoritm och samma ADMIN_SHARED_SECRET.
 */

/**
 * Signerar en godtycklig råsträng med ADMIN_SHARED_SECRET.
 * Strängen ska vara exakt den sträng som skickas i request body
 * (ingen re-serialisering efter signering).
 */
export function signPayload(rawPayload: string, secret: string): string {
  const hex = crypto.createHmac('sha256', secret).update(rawPayload, 'utf8').digest('hex');
  return `sha256=${hex}`;
}

/**
 * Signerar headers-payloaden för streaming ZIP-upload till workern.
 * Format: "<jobId>\n<onboardingId>\n<filename>"
 *
 * Workern förväntar sig att x-signature beräknas över exakt denna sträng.
 */
export function signHeadersPayload(
  jobId: string,
  onboardingId: string,
  filename: string,
  secret: string
): string {
  const payload = `${jobId}\n${onboardingId}\n${filename}`;
  return signPayload(payload, secret);
}

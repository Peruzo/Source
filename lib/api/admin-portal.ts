import crypto from 'crypto';

/**
 * Interns hjälpare: signerar en serialiserad request-body med HMAC-SHA256.
 * Används av sendToAdminPortal (POST /admin/api/ingest/*) och
 * patchAdminOnboarding när segment === 'code' (fas 2c).
 */
function signBody(rawBody: string): string {
  const secret = process.env.ADMIN_SHARED_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SHARED_SECRET is not configured');
  }
  const hex = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  return `sha256=${hex}`;
}

export async function sendToAdminPortal(
  endpoint: string,
  payload: any,
  retries = 3
): Promise<any> {
  const url = `${process.env.ADMIN_PORTAL_URL}/admin/api/ingest/${endpoint}`;
  const body = JSON.stringify(payload);

  // HMAC-signatur över serialiserad body (samma sträng som skickas i fetch)
  const signature = signBody(body);

  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': signature,
          'x-idempotency-key': payload.idempotencyKey,
        },
        body,
      });

      if (response.ok) {
        return response.status === 204 ? { success: true } : await response.json();
      }

      // Don't retry client errors (400-499)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      // Retry server errors (500+)
      lastError = new Error(`Server error: ${response.status}`);

    } catch (error) {
      lastError = error as Error;

      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  console.error(`[Integration] ${endpoint} failed after retries:`, lastError);
  throw lastError;
}

const ADMIN_PORTAL_URL = process.env.ADMIN_PORTAL_URL;

/**
 * Kontrollerar om admin-onboarding finns för ett onboardingId.
 * Används för att säkerställa att onboarding är initierad innan GitHub-job startar.
 */
export async function checkAdminOnboardingExists(onboardingId: string): Promise<boolean> {
  if (!ADMIN_PORTAL_URL) {
    console.warn('[Admin Portal] ADMIN_PORTAL_URL not set, cannot check onboarding existence');
    return false;
  }
  const secret = process.env.ADMIN_SHARED_SECRET;
  if (!secret) {
    console.warn('[Admin Portal] ADMIN_SHARED_SECRET not set, cannot check onboarding existence');
    return false;
  }

  const url = `${ADMIN_PORTAL_URL.replace(/\/$/, '')}/api/onboarding/${encodeURIComponent(onboardingId)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-admin-secret': secret,
      },
    });

    // 200 = onboarding finns
    // 404 = onboarding finns inte
    return response.ok;
  } catch (err) {
    console.error(`[Admin Portal] Error checking onboarding existence:`, err);
    // Vid fel, antag att onboarding inte finns (fail-safe)
    return false;
  }
}

/**
 * PATCH till admin-portalens onboarding-API (maskin-till-maskin).
 *
 * Auth-strategi per segment:
 *   'code'    → HMAC-SHA256 via x-signature (fas 2c).
 *   'contact' → plain x-admin-secret (migreras i fas 2d).
 *
 * VIKTIGT: rawBody serialiseras exakt en gång och skickas oförändrad till fetch.
 * Re-serialisering (JSON.stringify igen i fetch) ger annan sträng → HMAC-mismatch.
 *
 * // TODO(phase-2d): migrate /contact to HMAC and remove plain-secret branch
 */
export async function patchAdminOnboarding(
  onboardingId: string,
  segment: 'code' | 'contact',
  body: object
): Promise<void> {
  if (!ADMIN_PORTAL_URL) {
    console.warn('[Admin Portal] ADMIN_PORTAL_URL not set, skipping PATCH', segment);
    return;
  }
  const secret = process.env.ADMIN_SHARED_SECRET;
  if (!secret) {
    console.warn('[Admin Portal] ADMIN_SHARED_SECRET not set, skipping PATCH', segment);
    return;
  }

  const url = `${ADMIN_PORTAL_URL.replace(/\/$/, '')}/api/onboarding/${encodeURIComponent(onboardingId)}/${segment}`;

  // Serialisera en gång — samma sträng används för både HMAC och fetch body
  const rawBody = JSON.stringify(body);

  // /code uses HMAC (phase 2c). Other segments use x-admin-secret until migrated.
  const headers: Record<string, string> =
    segment === 'code'
      ? {
          'Content-Type': 'application/json',
          'x-signature': signBody(rawBody),
        }
      : {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: rawBody,
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`[Admin Portal] PATCH ${segment} failed: ${response.status}`, text);
      return;
    }
  } catch (err) {
    console.error(`[Admin Portal] PATCH ${segment} error:`, err);
  }
}

import crypto from 'crypto';

export async function sendToAdminPortal(
  endpoint: string,
  payload: any,
  retries = 3
): Promise<any> {
  const url = `${process.env.ADMIN_PORTAL_URL}/admin/api/ingest/${endpoint}`;
  const body = JSON.stringify(payload);
  
  // Create HMAC signature
  const signature = createHMAC(body);
  
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
        console.log(`[Integration] ${endpoint} succeeded`);
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

function createHMAC(body: string): string {
  const secret = process.env.ADMIN_SHARED_SECRET;
  
  if (!secret) {
    throw new Error('ADMIN_SHARED_SECRET not configured');
  }
  
  return 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex');
}

const ADMIN_PORTAL_URL = process.env.ADMIN_PORTAL_URL;

/**
 * PATCH till admin-portalens onboarding-API (maskin-till-maskin).
 * Admin kräver x-admin-secret. Använd för code/contact-uppdateringar.
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
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`[Admin Portal] PATCH ${segment} failed: ${response.status}`, text);
      return;
    }
    console.log(`[Admin Portal] PATCH ${segment} succeeded for onboarding ${onboardingId}`);
  } catch (err) {
    console.error(`[Admin Portal] PATCH ${segment} error:`, err);
  }
}


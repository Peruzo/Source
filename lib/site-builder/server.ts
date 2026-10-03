import { auth0 } from '@/lib/auth0';
import { userOwnsOnboarding } from '@/lib/onboarding/ownership';
import { createSiteBuilderClient, TIMEOUTS } from './client';
import { createGenerationLock, createRateLimiter } from './guards';
import { gcsLockStore } from './gcs-lock-store';
import { createHandlers, type SiteBuilderHandlers } from './handlers';
import { messageFor } from './errors';

/**
 * Serverns enda instans av hemsidebyggarens handlers. Importeras bara av route handlers under
 * app/api/onboarding/site-builder/ — aldrig av klientkomponenter, så miljövariablerna nedan
 * kan inte hamna i webbläsarens kod.
 *
 * Miljövariabler (namn):
 *   SITE_BUILDER_API_URL       kundportalens origin
 *   SITE_BUILDER_HMAC_SECRET   samma hemlighet som kundportalens (Secret Manager)
 *   GCS_BUCKET_CODE_PACKAGES / GCS_BUCKET_ONBOARDING   bucket för genereringslåset (som onboardingen)
 */

let instance: SiteBuilderHandlers | null = null;

export function siteBuilderHandlers(): SiteBuilderHandlers {
  if (instance) return instance;
  const baseUrl = (process.env.SITE_BUILDER_API_URL || '').trim();
  const secret = (process.env.SITE_BUILDER_HMAC_SECRET || '').trim();
  const bucket = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
  instance = createHandlers({
    getUserSub: async () => {
      const session = await auth0.getSession();
      return session?.user?.sub || null;
    },
    ownsOnboarding: userOwnsOnboarding,
    client: createSiteBuilderClient({ baseUrl, secret }),
    lock: createGenerationLock(bucket ? { store: gcsLockStore(bucket, process.env.GCP_PROJECT_ID) } : {}),
    // Per session: 60 anrop per minut; AI-anropen (generera, förbättra) 20 per 10 minuter,
    // samma nivåer som kundportalens egna gränser.
    limiter: createRateLimiter({ limit: 60, windowMs: 60_000 }),
    aiLimiter: createRateLimiter({ limit: 20, windowMs: 600_000 }),
    messageFor,
    portalOrigin: baseUrl || 'http://localhost',
    timeouts: { generateMs: TIMEOUTS.generateMs, defaultMs: TIMEOUTS.defaultMs },
    // Bara utfall och tid; aldrig svar, användare eller onboardingId.
    log: (entry) => console.info(JSON.stringify(entry)),
  });
  return instance;
}

import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * Input-kontrakt för onboarding-events (utan at-timestamp).
 * at sätts endast av systemet när eventet sparas.
 */
export type OnboardingEventInput =
  | { type: 'questions_submitted'; payload: Record<string, any> }
  | { type: 'code_submitted'; payload: { repoLink?: string; codeText?: string; fileName?: string; codeSource?: 'github' | 'manual'; storageObjectUrl?: string } }
  | { type: 'stripe_started'; payload: { accountId: string } }
  | { type: 'stripe_completed'; payload: { accountId: string } }
  | { type: 'plan_selected'; payload: { planId: string; name: string; price: string } };

/**
 * Fullständigt onboarding-event med timestamp (sparat i GCS).
 */
export type OnboardingEvent =
  | { type: 'questions_submitted'; payload: Record<string, any>; at: string }
  | { type: 'code_submitted'; payload: { repoLink?: string; codeText?: string; fileName?: string; codeSource?: 'github' | 'manual'; storageObjectUrl?: string }; at: string }
  | { type: 'stripe_started'; payload: { accountId: string }; at: string }
  | { type: 'stripe_completed'; payload: { accountId: string }; at: string }
  | { type: 'plan_selected'; payload: { planId: string; name: string; price: string }; at: string };

/**
 * Append-only event storage för onboarding.
 * Varje event sparas som egen fil i GCS.
 * Ingen read-modify-write; endast append.
 * Events är isolerade per onboardingId för att förhindra leak mellan onboarding-sessioner.
 */
export async function appendOnboardingEvent<T extends OnboardingEventInput>(
  onboardingId: string,
  event: T
): Promise<void> {
  if (!BUCKET || !onboardingId) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set, and onboardingId is required');
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);

  const now = new Date().toISOString();
  const timestamp = now.replace(/[:.]/g, '-').replace('T', '_').slice(0, -5); // ISO utan specialtecken
  const fileName = `onboarding-events/${onboardingId}/${timestamp}_${event.type}.json`;

  // Bygg fullEvent explicit så TypeScript kan verifiera att type och payload matchar
  const fullEvent: OnboardingEvent = (() => {
    switch (event.type) {
      case 'questions_submitted':
        return { type: 'questions_submitted', payload: event.payload, at: now };
      case 'code_submitted':
        return { type: 'code_submitted', payload: event.payload, at: now };
      case 'stripe_started':
        return { type: 'stripe_started', payload: event.payload, at: now };
      case 'stripe_completed':
        return { type: 'stripe_completed', payload: event.payload, at: now };
      case 'plan_selected':
        return { type: 'plan_selected', payload: event.payload, at: now };
      default: {
        const _exhaustive: never = event;
        throw new Error(`Unknown event type: ${(_exhaustive as any).type}`);
      }
    }
  })();

  const file = bucket.file(fileName);
  await file.save(JSON.stringify(fullEvent, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });
}

/**
 * Listar alla onboarding-events för en onboardingId.
 * Sorterar på timestamp (från filnamn).
 * Events är isolerade per onboardingId för att förhindra leak mellan onboarding-sessioner.
 */
export async function listOnboardingEvents(onboardingId: string): Promise<OnboardingEvent[]> {
  if (!BUCKET || !onboardingId) return [];

  try {
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const bucket = storage.bucket(BUCKET);
    const prefix = `onboarding-events/${onboardingId}/`;

    const [files] = await bucket.getFiles({ prefix });

    // Sortera på filnamn (timestamp kommer först i filnamnet)
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));

    const events: OnboardingEvent[] = [];

    for (const file of sortedFiles) {
      try {
        const [contents] = await file.download();
        const event = JSON.parse(contents.toString('utf8')) as OnboardingEvent;
        events.push(event);
      } catch (err) {
        console.error(`[Onboarding Events] Error parsing ${file.name}:`, err);
        // Fortsätt med nästa fil
      }
    }

    return events;
  } catch (error) {
    console.error('[Onboarding Events] Error listing events:', error);
    return [];
  }
}

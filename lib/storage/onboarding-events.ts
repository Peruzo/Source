import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type OnboardingEvent =
  | { type: 'questions_submitted'; payload: Record<string, any>; at: string }
  | { type: 'code_submitted'; payload: { repoLink?: string; codeText?: string; fileName?: string }; at: string }
  | { type: 'stripe_started'; payload: { accountId: string }; at: string }
  | { type: 'stripe_completed'; payload: { accountId: string }; at: string }
  | { type: 'plan_selected'; payload: { planId: string; name: string; price: string }; at: string };

/**
 * Append-only event storage för onboarding.
 * Varje event sparas som egen fil i GCS.
 * Ingen read-modify-write; endast append.
 */
export async function appendOnboardingEvent(
  userSub: string,
  event: Omit<OnboardingEvent, 'at'>
): Promise<void> {
  if (!BUCKET || !userSub) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);

  const now = new Date().toISOString();
  const timestamp = now.replace(/[:.]/g, '-').replace('T', '_').slice(0, -5); // ISO utan specialtecken
  const fileName = `onboarding-events/${userSub}/${timestamp}_${event.type}.json`;

  const fullEvent: OnboardingEvent = {
    ...event,
    at: now,
  };

  const file = bucket.file(fileName);
  await file.save(JSON.stringify(fullEvent, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });
}

/**
 * Listar alla onboarding-events för en användare.
 * Sorterar på timestamp (från filnamn).
 */
export async function listOnboardingEvents(userSub: string): Promise<OnboardingEvent[]> {
  if (!BUCKET || !userSub) return [];

  try {
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const bucket = storage.bucket(BUCKET);
    const prefix = `onboarding-events/${userSub}/`;

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

import { Storage } from '@google-cloud/storage';
import { generateOnboardingId, isValidOnboardingId } from '@/lib/onboarding/onboarding-id';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * NYTT: Aktiv onboarding per session (in-memory bindning).
 * En sessionId → exakt 1 aktiv onboardingId tills onboarding är klar.
 * Detta förhindrar att onboardingId ändras efter questions.
 */
const activeOnboardingBySession = new Map<string, string>();

export function bindOnboardingToSession(sessionId: string, onboardingId: string) {
  activeOnboardingBySession.set(sessionId, onboardingId);
}

export function getActiveOnboardingForSession(sessionId: string): string | null {
  return activeOnboardingBySession.get(sessionId) ?? null;
}

export function clearActiveOnboardingForSession(sessionId: string) {
  activeOnboardingBySession.delete(sessionId);
}

/**
 * Hämtar aktiv onboardingId för en sessionId (först i-memory, sedan GCS).
 * Returnerar null om ingen onboarding finns.
 * Används för att säkerställa att samma sessionId alltid får samma onboardingId.
 */
export async function getActiveOnboardingIdForSession(sessionId: string): Promise<string | null> {
  // Först kolla i-memory Map (snabbast)
  const inMemoryId = getActiveOnboardingForSession(sessionId);
  if (inMemoryId) {
    return inMemoryId;
  }
  
  // Om inte i-memory, kolla GCS
  return await getActiveOnboardingId(sessionId);
}

/**
 * Onboarding-session metadata (kopplat till user.sub).
 * Varje user.sub kan ha flera onboarding-sessioner (onboardingId).
 */
export type OnboardingSession = {
  onboardingId: string;
  userSub: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Hämtar eller skapar aktiv onboardingId för en user.sub.
 * Om ingen aktiv onboarding finns, skapas en ny.
 * Returnerar onboardingId som ska användas för alla events.
 */
export async function getOrCreateActiveOnboardingId(userSub: string): Promise<string> {
  if (!BUCKET || !userSub) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set, and userSub is required');
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const sessionsPrefix = `onboarding-sessions/${userSub}/`;

  try {
    // Lista alla sessions för userSub
    const [files] = await bucket.getFiles({ prefix: sessionsPrefix });
    
    if (files.length > 0) {
      // Hämta den senaste sessionen (sorterad på filnamn = timestamp)
      const sortedFiles = files.sort((a, b) => b.name.localeCompare(a.name));
      const latestFile = sortedFiles[0];
      
      const [contents] = await latestFile.download();
      const session = JSON.parse(contents.toString('utf8')) as OnboardingSession;
      
      // Verifiera att sessionen tillhör rätt userSub
      if (session.userSub === userSub && isValidOnboardingId(session.onboardingId)) {
        return session.onboardingId;
      }
    }
  } catch (error) {
    console.warn('[Onboarding Sessions] Error reading existing sessions:', error);
    // Fortsätt och skapa ny session
  }

  // Skapa ny onboarding-session
  const onboardingId = generateOnboardingId();
  const now = new Date().toISOString();
  const session: OnboardingSession = {
    onboardingId,
    userSub,
    createdAt: now,
    updatedAt: now,
  };

  const fileName = `${sessionsPrefix}${now.replace(/[:.]/g, '-').replace('T', '_').slice(0, -5)}_${onboardingId}.json`;
  const file = bucket.file(fileName);
  
  await file.save(JSON.stringify(session, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });

  return onboardingId;
}

/**
 * Hämtar aktiv onboardingId för en user.sub (read-only, skapar inget).
 * Returnerar null om ingen onboarding-session finns.
 * Används i GET-endpoints som ska vara read-only.
 */
export async function getActiveOnboardingId(userSub: string): Promise<string | null> {
  if (!BUCKET || !userSub) {
    return null;
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const sessionsPrefix = `onboarding-sessions/${userSub}/`;

  try {
    // Lista alla sessions för userSub
    const [files] = await bucket.getFiles({ prefix: sessionsPrefix });
    
    if (files.length > 0) {
      // Hämta den senaste sessionen (sorterad på filnamn = timestamp)
      const sortedFiles = files.sort((a, b) => b.name.localeCompare(a.name));
      const latestFile = sortedFiles[0];
      
      const [contents] = await latestFile.download();
      const session = JSON.parse(contents.toString('utf8')) as OnboardingSession;
      
      // Verifiera att sessionen tillhör rätt userSub
      if (session.userSub === userSub && isValidOnboardingId(session.onboardingId)) {
        return session.onboardingId;
      }
    }
  } catch (error) {
    console.warn('[Onboarding Sessions] Error reading existing sessions:', error);
  }

  return null;
}

/**
 * Skapar en ny onboarding-session (tvingar ny onboardingId).
 * Används när användaren startar en ny onboarding från början.
 */
export async function createNewOnboardingSession(
  userSub: string,
  predefinedId?: string
): Promise<string> {
  // Om predefinedId ges (t.ex. från source_onboarding_id-cookie satt på /priser),
  // validera och använd den istället för att generera ny.
  // Detta säkerställer att alla events i en onboarding delar samma UUID från första
  // klicket på /priser till slutförd Stripe.
  const onboardingId = predefinedId && isValidOnboardingId(predefinedId)
    ? predefinedId
    : generateOnboardingId();
  const now = new Date().toISOString();
  const session: OnboardingSession = {
    onboardingId,
    userSub,
    createdAt: now,
    updatedAt: now,
  };

  if (!BUCKET || !userSub) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set, and userSub is required');
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const sessionsPrefix = `onboarding-sessions/${userSub}/`;
  const fileName = `${sessionsPrefix}${now.replace(/[:.]/g, '-').replace('T', '_').slice(0, -5)}_${onboardingId}.json`;
  const file = bucket.file(fileName);
  
  await file.save(JSON.stringify(session, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });

  return onboardingId;
}

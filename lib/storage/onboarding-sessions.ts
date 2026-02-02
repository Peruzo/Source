import { Storage } from '@google-cloud/storage';
import { generateOnboardingId, isValidOnboardingId } from '@/lib/onboarding/onboarding-id';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

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
        console.log(`[Onboarding Sessions] Found existing onboardingId: ${session.onboardingId} for userSub: ${userSub}`);
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

  console.log(`[Onboarding Sessions] Created new onboardingId: ${onboardingId} for userSub: ${userSub}`);
  return onboardingId;
}

/**
 * Skapar en ny onboarding-session (tvingar ny onboardingId).
 * Används när användaren startar en ny onboarding från början.
 */
export async function createNewOnboardingSession(userSub: string): Promise<string> {
  const onboardingId = generateOnboardingId();
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

  console.log(`[Onboarding Sessions] Created new onboarding session: ${onboardingId} for userSub: ${userSub}`);
  return onboardingId;
}

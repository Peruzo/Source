import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

export type OnboardingState = {
  userSub: string;
  questions?: Record<string, any>;
  code?: {
    repoLink?: string;
    codeText?: string;
    fileName?: string;
  };
  stripe?: {
    accountId?: string;
    status?: string;
  };
  selectedPlan?: {
    planId: string;
    name: string;
    price: string;
  };
  updatedAt: string;
  createdAt: string;
};

/**
 * Hämtar onboarding-state för en användare från GCS.
 * Returnerar null om ingen state finns (ny användare).
 */
export async function getOnboardingState(userSub: string): Promise<OnboardingState | null> {
  if (!BUCKET || !userSub) return null;

  try {
    const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
    const bucket = storage.bucket(BUCKET);
    const fileName = `onboarding-state/${userSub}.json`;

    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    
    if (!exists) {
      return null;
    }

    const [contents] = await file.download();
    const state = JSON.parse(contents.toString('utf8')) as OnboardingState;
    return state;
  } catch (error) {
    console.error('[Onboarding State] Error loading state:', error);
    return null;
  }
}

/**
 * Sparar onboarding-state för en användare till GCS.
 * Skapar ny state om ingen finns, uppdaterar annars.
 */
export async function saveOnboardingState(
  userSub: string,
  partial: Partial<Omit<OnboardingState, 'userSub' | 'createdAt' | 'updatedAt'>>
): Promise<OnboardingState> {
  if (!BUCKET || !userSub) {
    throw new Error('GCS_BUCKET_CODE_PACKAGES or GCS_BUCKET_ONBOARDING must be set');
  }

  const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
  const bucket = storage.bucket(BUCKET);
  const fileName = `onboarding-state/${userSub}.json`;

  const existing = await getOnboardingState(userSub);
  const now = new Date().toISOString();

  const state: OnboardingState = {
    userSub,
    ...existing,
    ...partial,
    updatedAt: now,
    createdAt: existing?.createdAt || now,
  };

  const file = bucket.file(fileName);
  await file.save(JSON.stringify(state, null, 2), {
    contentType: 'application/json',
    metadata: {
      cacheControl: 'private, no-cache',
    },
  });

  return state;
}

/**
 * Skapar tom onboarding-state för ny användare.
 */
export async function createEmptyOnboardingState(userSub: string): Promise<OnboardingState> {
  return saveOnboardingState(userSub, {});
}

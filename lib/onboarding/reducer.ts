import type { OnboardingEvent } from '@/lib/storage/onboarding-events';

export type OnboardingState = {
  onboardingId: string;
  userSub: string;
  email: string | null;
  name: string | null;
  questions: Record<string, any> | null;
  code: {
    repoLink?: string;
    codeText?: string;
    fileName?: string;
    codeSource?: 'github' | 'manual';
    storageObjectUrl?: string;
  } | null;
  github: {
    repoUrl?: string;
    repoSlug?: string;
    verified: boolean;
    verifiedAt?: string;
  } | null;
  stripe: {
    accountId?: string;
    status?: string;
  } | null;
  plan: {
    planId: string;
    name: string;
    price: string;
  } | null;
  updatedAt: string | null;
  createdAt: string | null;
};

/**
 * Reducer för onboarding-events.
 * Deterministisk, ren funktion (ingen IO).
 * Senaste event av varje typ vinner.
 */
export function reduceOnboarding(
  events: OnboardingEvent[],
  onboardingId: string,
  userSub: string
): OnboardingState {
  // Om inga events finns, returnera helt tom state
  if (events.length === 0) {
    return {
      onboardingId,
      userSub,
      email: null,
      name: null,
      questions: null,
      code: null,
      github: null,
      stripe: null,
      plan: null,
      updatedAt: null,
      createdAt: null,
    };
  }

  const state: OnboardingState = {
    onboardingId,
    userSub,
    email: null,
    name: null,
    questions: null,
    code: null,
    github: null,
    stripe: null,
    plan: null,
    updatedAt: null,
    createdAt: null,
  };

  // Sortera events på timestamp (at) för deterministisk ordning
  const sortedEvents = [...events].sort((a, b) => a.at.localeCompare(b.at));

  let createdAt: string | null = null;
  let updatedAt: string | null = null;

  for (const event of sortedEvents) {
    updatedAt = event.at;
    if (!createdAt) {
      createdAt = event.at;
    }

    switch (event.type) {
      case 'email_set':
        state.email = event.payload.email;
        state.name = event.payload.name || null;
        break;

      case 'questions_submitted':
        state.questions = event.payload;
        break;

      case 'code_submitted':
        state.code = {
          repoLink: event.payload.repoLink,
          codeText: event.payload.codeText,
          fileName: event.payload.fileName,
          codeSource: event.payload.codeSource,
          storageObjectUrl: event.payload.storageObjectUrl,
        };
        break;

      case 'github_repo_verified':
        state.github = {
          repoUrl: event.payload.repoUrl,
          repoSlug: event.payload.repoSlug,
          verified: true,
          verifiedAt: event.payload.verifiedAt,
        };
        break;

      case 'stripe_started':
        state.stripe = {
          accountId: event.payload.accountId,
          status: 'started',
        };
        break;

      case 'stripe_completed':
        state.stripe = {
          accountId: event.payload.accountId,
          status: 'completed',
        };
        break;

      case 'plan_selected':
        state.plan = {
          planId: event.payload.planId,
          name: event.payload.name,
          price: event.payload.price,
        };
        break;
    }
  }

  state.createdAt = createdAt;
  state.updatedAt = updatedAt;

  return state;
}

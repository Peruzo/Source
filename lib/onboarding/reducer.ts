import type { OnboardingEvent } from '@/lib/storage/onboarding-events';

export type OnboardingState = {
  onboardingId: string;
  userSub: string;
  questions: Record<string, any> | null;
  code: {
    repoLink?: string;
    codeText?: string;
    fileName?: string;
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
      questions: null,
      code: null,
      stripe: null,
      plan: null,
      updatedAt: null,
      createdAt: null,
    };
  }

  const state: OnboardingState = {
    onboardingId,
    userSub,
    questions: null,
    code: null,
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
      case 'questions_submitted':
        state.questions = event.payload;
        break;

      case 'code_submitted':
        state.code = {
          repoLink: event.payload.repoLink,
          codeText: event.payload.codeText,
          fileName: event.payload.fileName,
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

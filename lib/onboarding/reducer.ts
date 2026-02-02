import type { OnboardingEvent } from '@/lib/storage/onboarding-events';

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
 * Reducer för onboarding-events.
 * Deterministisk, ren funktion (ingen IO).
 * Senaste event av varje typ vinner.
 */
export function reduceOnboarding(
  events: OnboardingEvent[],
  userSub: string
): OnboardingState {
  const state: OnboardingState = {
    userSub,
    updatedAt: '',
    createdAt: '',
  };

  // Sortera events på timestamp (at) för deterministisk ordning
  const sortedEvents = [...events].sort((a, b) => a.at.localeCompare(b.at));

  let createdAt = '';
  let updatedAt = '';

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
        state.selectedPlan = {
          planId: event.payload.planId,
          name: event.payload.name,
          price: event.payload.price,
        };
        break;
    }
  }

  state.createdAt = createdAt || new Date().toISOString();
  state.updatedAt = updatedAt || new Date().toISOString();

  return state;
}

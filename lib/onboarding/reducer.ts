import type { OnboardingEvent } from '@/lib/storage/onboarding-events';
import { isGithubRepoVerifiedFromEvents } from '@/lib/storage/onboarding-events';

/**
 * Formell onboarding-status (FSM - Finite State Machine).
 * Status är enda sanningskällan för onboarding-flödet.
 * Status ändras endast via reducer baserat på events.
 */
export type OnboardingStatus =
  | 'started'
  | 'questions_completed'
  | 'code_pending'
  | 'code_completed'
  | 'stripe_started'
  | 'stripe_completed'
  | 'ready_for_review';

/**
 * Transition-regler för onboarding-statusmaskin.
 * Definierar vilka events som är tillåtna i vilken status,
 * och vilken ny status som ska sättas.
 */
type TransitionRule = {
  eventType: OnboardingEvent['type'];
  allowedStatuses: OnboardingStatus[];
  newStatus: OnboardingStatus | null; // null = ingen statusändring
};

const TRANSITIONS: TransitionRule[] = [
  {
    eventType: 'questions_submitted',
    allowedStatuses: ['started'],
    newStatus: 'questions_completed',
  },
  {
    eventType: 'email_set',
    allowedStatuses: ['started', 'questions_completed', 'code_pending', 'code_completed'],
    newStatus: null, // Ingen statusändring
  },
  {
    eventType: 'github_repo_verified',
    allowedStatuses: ['code_pending'],
    newStatus: null, // GitHub-verifiering är INTE längre en FSM-status
  },
  {
    eventType: 'code_submitted',
    allowedStatuses: ['code_pending', 'questions_completed'],
    newStatus: 'code_completed',
  },
  {
    eventType: 'stripe_started',
    allowedStatuses: ['code_completed'],
    newStatus: 'stripe_started',
  },
  {
    eventType: 'stripe_completed',
    allowedStatuses: ['stripe_started'],
    newStatus: 'ready_for_review',
  },
  {
    eventType: 'plan_selected',
    allowedStatuses: ['started', 'questions_completed', 'code_pending', 'code_completed', 'stripe_started', 'stripe_completed', 'ready_for_review'],
    newStatus: null, // Ingen statusändring
  },
];

/**
 * Hjälpfunktion för att verifiera och ändra status baserat på event.
 * Returnerar ny status eller null om ingen ändring ska ske.
 * Kastar error i dev om transition är otillåten.
 */
function getNextStatus(
  currentStatus: OnboardingStatus,
  eventType: OnboardingEvent['type']
): OnboardingStatus | null {
  const rule = TRANSITIONS.find((t) => t.eventType === eventType);
  
  if (!rule) {
    // Event-typ saknar transition-regel - ingen statusändring
    return null;
  }

  if (!rule.allowedStatuses.includes(currentStatus)) {
    // Otillåten transition - logga och ignorera i prod, kasta i dev
    const errorMsg = `Invalid transition: cannot apply ${eventType} in status ${currentStatus}. Allowed statuses: ${rule.allowedStatuses.join(', ')}`;
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMsg);
    }
    console.warn(`[Onboarding FSM] ${errorMsg}`);
    return null;
  }

  return rule.newStatus;
}

export type OnboardingState = {
  onboardingId: string;
  userSub: string;
  status: OnboardingStatus; // Formell status (single source of truth)
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
  console.log('[reduceOnboarding] ENTRY:', {
    onboardingId,
    userSub,
    eventsCount: events.length,
    eventsInput: events,
    firstEvent: events.length > 0 ? events[0] : null
  });

  // Om inga events finns, returnera helt tom state med initial status
  if (events.length === 0) {
    console.log('[reduceOnboarding] NO EVENTS - returning empty state with status: started');
    return {
      onboardingId,
      userSub,
      status: 'started',
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
    status: 'started', // Initial status
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

  console.log('[reduceOnboarding] After sorting:', {
    onboardingId,
    userSub,
    sortedEventsCount: sortedEvents.length,
    sortedEventTypes: sortedEvents.map(e => e.type),
    sortedEvents: sortedEvents.map(e => ({ type: e.type, at: e.at }))
  });

  let createdAt: string | null = null;
  let updatedAt: string | null = null;
  let eventsProcessed = 0;
  let eventsSkipped = 0;

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    eventsProcessed++;
    updatedAt = event.at;
    if (!createdAt) {
      createdAt = event.at;
    }

    const statusBefore = state.status;

    // FSM: Verifiera och uppdatera status baserat på event
    let nextStatus = getNextStatus(state.status, event.type);

    // KRITISKT: För questions_submitted, om hasExistingSite === 'Ja', sätt code_pending istället för questions_completed
    if (event.type === 'questions_submitted' && event.payload.hasExistingSite === 'Ja' && nextStatus === 'questions_completed') {
      // Validera att transition är tillåten (från 'started')
      if (state.status === 'started') {
        nextStatus = 'code_pending';
      }
    }

    // HÅRD LÅSNING: code_completed med repoLink kräver OAuth-verifiering
    // Om repoLink finns men github_repo_verified (med korrekt metadata) saknas → blockera transition
    if (event.type === 'code_submitted' && nextStatus === 'code_completed' && event.payload?.repoLink) {
      const eventsSoFar = sortedEvents.slice(0, i + 1);
      const githubVerified = isGithubRepoVerifiedFromEvents(eventsSoFar);
      if (!githubVerified.verified) {
        nextStatus = null;
        console.warn('[reduceOnboarding] BLOCKED code_completed: repoLink present but github_repo_verified (OAuth) missing', {
          onboardingId,
          repoLink: event.payload.repoLink,
        });
      }
    }

    if (nextStatus !== null) {
      state.status = nextStatus;
    }

    const wasStatusChanged = nextStatus !== null && nextStatus !== statusBefore;
    const wasEventApplied = true; // Alla events appliceras, ingen filtrering här

    console.log('[reduceOnboarding] Event processed:', {
      onboardingId,
      userSub,
      eventType: event.type,
      statusBefore,
      statusAfter: state.status,
      nextStatus,
      wasStatusChanged,
      wasEventApplied,
      eventAt: event.at,
      eventPayload: event.payload,
      eventNumber: eventsProcessed,
      totalEvents: sortedEvents.length
    });

    if (!wasEventApplied) {
      eventsSkipped++;
      console.warn('[reduceOnboarding] Event SKIPPED:', {
        onboardingId,
        userSub,
        eventType: event.type,
        reason: 'Event was not applied (should not happen)'
      });
    }

    // Uppdatera state-data baserat på event
    switch (event.type) {
      case 'email_set':
        state.email = event.payload.email;
        state.name = event.payload.name || null;
        break;

      case 'questions_submitted':
        state.questions = event.payload;
        // Status är redan satt till code_pending (om hasExistingSite === 'Ja') eller questions_completed ovan
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

      // github_repo_verified är INTE ett FSM-event
      // Reducer ignorerar det helt - verifiering sätts direkt i /api/github/callback
      // Eventet skapas endast för spårning/logging, inte för FSM-transition
      case 'github_repo_verified':
        // Ignorera helt - detta är INTE ett FSM-event
        console.log('[reduceOnboarding] Ignoring github_repo_verified event (not a FSM event)');
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

  console.log('[reduceOnboarding] Final state:', {
    onboardingId,
    userSub,
    finalStatus: state.status,
    hasCode: !!state.code,
    hasGithub: !!state.github,
    eventsProcessed,
    eventsSkipped,
    totalEventsInput: events.length,
    totalEventsSorted: sortedEvents.length,
    fullState: state,
    stateIsNull: state === null
  });

  // VERIFIERA: Reducer returnerar ALDRIG null - den returnerar alltid en OnboardingState
  if (state === null) {
    console.error('[reduceOnboarding] CRITICAL: State is null - this should never happen!');
  }

  return state;
}

/**
 * Assert att onboarding-state har rätt status.
 * Används i backend-guards för att säkerställa att operationer endast kan utföras i korrekt status.
 * 
 * @throws Error om status inte matchar requiredStatus
 */
export function assertStatus(
  state: OnboardingState | null,
  requiredStatus: OnboardingStatus | OnboardingStatus[]
): void {
  if (!state) {
    throw new Error('INVALID_ONBOARDING_STATE: State is null');
  }

  const allowedStatuses = Array.isArray(requiredStatus) ? requiredStatus : [requiredStatus];
  
  if (!allowedStatuses.includes(state.status)) {
    throw new Error(
      `INVALID_ONBOARDING_STATE: Expected status ${allowedStatuses.join(' or ')}, but got ${state.status}`
    );
  }
}

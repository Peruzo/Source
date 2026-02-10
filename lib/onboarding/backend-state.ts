'use client';

import { useEffect, useState } from 'react';
import type { OnboardingState } from '@/lib/onboarding/reducer';
export type { OnboardingState };

/**
 * Hook för att hämta onboarding-state från backend.
 * Backend är enda källan till sanning; localStorage används endast för UI/draft.
 * 
 * @param userSub - Auth0 user.sub ELLER anonym sessionId (kan vara tom sträng för anonym onboarding)
 * @param onboardingId - OnboardingId för att hämta specifik onboarding-session (krävs för anonym onboarding)
 */
export function useOnboardingState(userSub: string, onboardingId?: string | null) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useOnboardingState] useEffect triggered:', {
      userSub,
      userSubIsEmpty: !userSub,
      userSubType: typeof userSub,
      onboardingId,
      onboardingIdIsNull: onboardingId === null,
      onboardingIdIsUndefined: onboardingId === undefined
    });

    // KRITISK FIX: I anonym onboarding är userSub tom sträng ('') eller sessionId
    // Hooken ska INTE blockera när userSub är tom - onboardingId är tillräckligt
    // Endast blockera om BÅDE userSub och onboardingId saknas
    if (!userSub && !onboardingId) {
      console.log('[useOnboardingState] Blocked: both userSub and onboardingId are missing');
      setLoading(false);
      return;
    }

    // Om onboardingId saknas, vänta tills den är tillgänglig
    if (onboardingId === undefined || onboardingId === null) {
      console.log('[useOnboardingState] Waiting for onboardingId');
      setLoading(true);
      return;
    }

    let cancelled = false;

    async function fetchState() {
      try {
        const url = onboardingId 
          ? `/api/onboarding?onboardingId=${encodeURIComponent(onboardingId)}`
          : '/api/onboarding';
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load onboarding: ${res.status}`);
        }
        const data = await res.json();
        console.log('[useOnboardingState] RAW API response:', {
          onboardingId,
          userSub,
          responseState: data.state,
          responseStateStatus: data.state?.status,
          responseStateIsNull: data.state === null,
          responseStateIsUndefined: data.state === undefined,
          eventsCount: data.eventsCount,
          responseOnboardingId: data.onboardingId,
          fullResponse: JSON.stringify(data, null, 2),
          responseType: typeof data.state
        });
        if (!cancelled) {
          console.log('[useOnboardingState] Setting state:', {
            onboardingId,
            userSub,
            stateToSet: data.state,
            stateToSetStatus: data.state?.status,
            stateToSetIsNull: data.state === null
          });
          setState(data.state);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load onboarding');
          setState(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchState();

    return () => {
      cancelled = true;
    };
  }, [userSub, onboardingId]);

  return { state, loading, error };
}

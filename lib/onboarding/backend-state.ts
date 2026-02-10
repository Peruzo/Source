'use client';

import { useEffect, useState } from 'react';
import type { OnboardingState } from '@/lib/onboarding/reducer';
export type { OnboardingState };

/**
 * Hook för att hämta onboarding-state från backend.
 * Backend är enda källan till sanning; localStorage används endast för UI/draft.
 * 
 * @param userSub - Auth0 user.sub (måste vara autentiserad)
 * @param onboardingId - OnboardingId för att hämta specifik onboarding-session
 */
export function useOnboardingState(userSub: string, onboardingId?: string | null) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSub) {
      setLoading(false);
      return;
    }

    // Om onboardingId saknas, vänta tills den är tillgänglig
    if (onboardingId === undefined || onboardingId === null) {
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
        console.log('[useOnboardingState] API response:', {
          onboardingId,
          userSub,
          state: data.state,
          stateStatus: data.state?.status,
          eventsCount: data.eventsCount,
          fullResponse: data
        });
        if (!cancelled) {
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

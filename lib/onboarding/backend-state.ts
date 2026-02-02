'use client';

import { useEffect, useState } from 'react';
import type { OnboardingState } from '@/lib/onboarding/reducer';
export type { OnboardingState };

/**
 * Hook för att hämta onboarding-state från backend.
 * Backend är enda källan till sanning; localStorage används endast för UI/draft.
 */
export function useOnboardingState(userSub: string) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSub) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchState() {
      try {
        const res = await fetch('/api/onboarding');
        if (!res.ok) {
          throw new Error(`Failed to load onboarding: ${res.status}`);
        }
        const data = await res.json();
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
  }, [userSub]);

  return { state, loading, error };
}

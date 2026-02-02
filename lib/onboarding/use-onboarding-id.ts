'use client';

import { useEffect, useState } from 'react';

/**
 * Hook för att hämta eller skapa aktiv onboardingId.
 * OnboardingId är obligatoriskt för alla onboarding-operationer.
 * 
 * @param userSub - Auth0 user.sub (måste vara autentiserad)
 * @returns onboardingId eller null om userSub saknas
 */
export function useOnboardingId(userSub: string): {
  onboardingId: string | null;
  loading: boolean;
  error: string | null;
} {
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSub) {
      setLoading(false);
      setOnboardingId(null);
      return;
    }

    let cancelled = false;

    async function fetchOnboardingId() {
      try {
        const res = await fetch('/api/onboarding/id');
        if (!res.ok) {
          throw new Error(`Failed to get onboarding ID: ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          if (data.onboardingId) {
            setOnboardingId(data.onboardingId);
            setError(null);
          } else {
            throw new Error('No onboardingId in response');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to get onboarding ID');
          setOnboardingId(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOnboardingId();

    return () => {
      cancelled = true;
    };
  }, [userSub]);

  return { onboardingId, loading, error };
}

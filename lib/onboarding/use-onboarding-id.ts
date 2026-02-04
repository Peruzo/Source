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
        const isCustomSignup =
          typeof window !== 'undefined' &&
          (window.location.search.includes('signup=true') || sessionStorage.getItem('customSignup') === 'true');

        // KRITISK FIX (Alternativ B): Vid custom signup anrop ALLTID POST start med forceNew.
        // GET /api/onboarding/id används INTE alls i signup-fallet – oberoende av session/onboarding.
        if (isCustomSignup) {
          // Hämta email från sessionStorage (sparat vid signup) så att det kan sparas i onboarding-state
          const signupEmail = typeof window !== 'undefined' ? sessionStorage.getItem('onboarding_signup_email') : null;
          const signupName = typeof window !== 'undefined' ? sessionStorage.getItem('onboarding_signup_name') : null;
          const startRes = await fetch('/api/onboarding/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              forceNew: true,
              email: signupEmail || undefined,
              name: signupName || undefined,
            }),
          });
          if (!startRes.ok) {
            throw new Error(`Failed to start onboarding: ${startRes.status}`);
          }
          const startData = await startRes.json();
          if (!cancelled) {
            if (startData.onboardingId) {
              setOnboardingId(startData.onboardingId);
              setError(null);
              sessionStorage.removeItem('customSignup');
              // Rensa signup-email efter att det har sparats i onboarding-state
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('onboarding_signup_email');
                sessionStorage.removeItem('onboarding_signup_name');
              }
            } else {
              throw new Error('No onboardingId in start response');
            }
          }
          if (!cancelled) setLoading(false);
          return;
        }

        // Resume / vanligt flöde: GET id (read-only), vid 404 skapa explicit utan forceNew
        const res = await fetch('/api/onboarding/id');

        if (res.status === 404) {
          const startRes = await fetch('/api/onboarding/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forceNew: false }),
          });
          if (!startRes.ok) {
            throw new Error(`Failed to start onboarding: ${startRes.status}`);
          }
          const startData = await startRes.json();
          if (!cancelled) {
            if (startData.onboardingId) {
              setOnboardingId(startData.onboardingId);
              setError(null);
            } else {
              throw new Error('No onboardingId in start response');
            }
          }
        } else if (!res.ok) {
          throw new Error(`Failed to get onboarding ID: ${res.status}`);
        } else {
          const data = await res.json();
          if (!cancelled) {
            if (data.onboardingId) {
              setOnboardingId(data.onboardingId);
              setError(null);
            } else {
              throw new Error('No onboardingId in response');
            }
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

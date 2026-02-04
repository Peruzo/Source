'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAnonymousSessionIdFromCookie } from './anonymous-session-client';

/**
 * Hook för att hämta eller skapa aktiv onboardingId.
 * OnboardingId är obligatoriskt för alla onboarding-operationer.
 * 
 * KRITISK: Stödjer både Auth0-autentiserade och anonyma sessioner.
 * För anonyma sessioner används cookie-based sessionId.
 * 
 * @returns onboardingId, userSub (Auth0 eller anonym), loading, error
 */
export function useOnboardingId(): {
  onboardingId: string | null;
  userSub: string | null;
  loading: boolean;
  error: string | null;
} {
  const { user, isLoading: authLoading } = useUser();
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOnboardingId() {
      try {
        // Vänta på Auth0-loading om det pågår
        if (authLoading) {
          return;
        }

        // Bestäm userSub: Auth0 user.sub eller anonym sessionId
        let currentUserSub: string | null = null;
        
        if (user?.sub) {
          // Auth0-autentiserad användare
          currentUserSub = user.sub;
        } else {
          // Anonym session - försök hämta från cookie, annars skapas session vid POST /api/onboarding/start
          const cookieSessionId = getAnonymousSessionIdFromCookie();
          if (cookieSessionId) {
            currentUserSub = cookieSessionId;
          }
          // Om ingen cookie finns, kommer backend att skapa session vid POST /api/onboarding/start
        }

        if (!cancelled) {
          setUserSub(currentUserSub);
        }

        const isCustomSignup =
          typeof window !== 'undefined' &&
          (window.location.search.includes('signup=true') || sessionStorage.getItem('customSignup') === 'true');

        // KRITISK FIX: Vid custom signup anrop ALLTID POST start med forceNew.
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
              setUserSub(startData.userSub || currentUserSub);
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
              setUserSub(startData.userSub || currentUserSub);
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
              setUserSub(data.userSub || currentUserSub);
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
          setUserSub(null);
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
  }, [authLoading, user?.sub]);

  return { onboardingId, userSub, loading, error };
}

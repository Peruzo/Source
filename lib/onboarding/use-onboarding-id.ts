'use client';

import { useEffect, useState } from 'react';
import { getAnonymousSessionIdFromCookie } from './anonymous-session-client';

/**
 * Hook för att hämta eller skapa aktiv onboardingId.
 * OnboardingId är obligatoriskt för alla onboarding-operationer.
 * 
 * KRITISK: Använder ENDAST anonyma sessioner (cookie-based).
 * Auth0-init får INTE ske i onboarding-hooks.
 * 
 * För Auth0-autentiserade användare: backend hanterar session via cookie.
 * För anonyma användare: cookie-based sessionId används.
 * 
 * @returns onboardingId, userSub (anonym sessionId), loading, error
 */
export function useOnboardingId(): {
  onboardingId: string | null;
  userSub: string | null;
  loading: boolean;
  error: string | null;
} {
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOnboardingId() {
      try {
        // KRITISK: Använd ENDAST cookie-baserad sessionId (ingen Auth0-init)
        // Backend kommer att skapa anonym sessionId vid POST /api/onboarding/start om ingen finns
        const cookieSessionId = getAnonymousSessionIdFromCookie();
        let currentUserSub: string | null = cookieSessionId;

        if (!cancelled) {
          setUserSub(currentUserSub);
        }

        // KRITISK FIX: Kolla först om det är en ny signup - i så fall rensa sessionStorage
        const isCustomSignup =
          typeof window !== 'undefined' &&
          (window.location.search.includes('signup=true') || sessionStorage.getItem('customSignup') === 'true');

        // Om det är en ny signup → rensa onboarding-relaterad sessionStorage för att förhindra återanvändning
        if (isCustomSignup && typeof window !== 'undefined') {
          console.log('[useOnboardingId] New signup detected - clearing onboarding sessionStorage');
          sessionStorage.removeItem('onboarding_id');
          // customSignup, onboarding_signup_email, onboarding_signup_name rensas senare efter start
        }

        // ARKITEKTURREGEL: Ny Auth0-user ska alltid få ny onboarding-session.
        // SessionStorage kan innehålla onboarding_id från tidigare användare – validera mot backend.
        const storedOnboardingId = typeof window !== 'undefined' && !isCustomSignup
          ? sessionStorage.getItem('onboarding_id')
          : null;

        if (storedOnboardingId) {
          // Validera: backend returnerar onboardingId för nuvarande session (Auth0 sub eller anonym).
          const idRes = await fetch('/api/onboarding/id');
          if (!idRes.ok) {
            throw new Error(`Failed to get onboarding ID: ${idRes.status}`);
          }
          const idData = await idRes.json();

          if (idData.onboardingId === null || idData.onboardingId === undefined) {
            // Nuvarande användare har ingen onboarding (t.ex. ny Auth0-user) → rensa och skapa ny session.
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('onboarding_id');
            }
            console.log('[useOnboardingId] Stored onboarding_id does not belong to current user – cleared, creating new');
            const startRes = await fetch('/api/onboarding/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ forceNew: false }),
            });
            if (!startRes.ok) {
              throw new Error(`Failed to start onboarding: ${startRes.status}`);
            }
            const startData = await startRes.json();
            if (!cancelled && startData.onboardingId) {
              setOnboardingId(startData.onboardingId);
              setUserSub(startData.userSub ?? currentUserSub);
              setError(null);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('onboarding_id', startData.onboardingId);
              }
            }
            if (!cancelled) setLoading(false);
            return;
          } else if (idData.onboardingId !== storedOnboardingId) {
            // Backend har annan onboardingId för denna användare → använd backend och uppdatera sessionStorage.
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('onboarding_id', idData.onboardingId);
            }
            if (!cancelled) {
              setOnboardingId(idData.onboardingId);
              setUserSub(idData.userSub ?? currentUserSub);
              setError(null);
              setLoading(false);
            }
            return;
          }
          // idData.onboardingId === storedOnboardingId → samma användare, använd den.
          if (!cancelled) {
            setOnboardingId(storedOnboardingId);
            setUserSub(idData.userSub ?? currentUserSub);
            setError(null);
            setLoading(false);
          }
          return;
        }

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
              // Spara onboardingId i sessionStorage (write-once)
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('onboarding_id', startData.onboardingId);
                sessionStorage.removeItem('customSignup');
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

        // Resume / vanligt flöde: GET id (read-only), om null skapa explicit utan forceNew
        const res = await fetch('/api/onboarding/id');

        if (!res.ok) {
          throw new Error(`Failed to get onboarding ID: ${res.status}`);
        }

        const data = await res.json();
        
        if (data.onboardingId) {
          // Spara onboardingId i sessionStorage (write-once)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('onboarding_id', data.onboardingId);
          }
          if (!cancelled) {
            setOnboardingId(data.onboardingId);
            setUserSub(data.userSub || currentUserSub);
            setError(null);
          }
        } else {
          // Ingen onboardingId finns → skapa ny via POST /api/onboarding/start
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
              // Spara onboardingId i sessionStorage (write-once)
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('onboarding_id', startData.onboardingId);
              }
            } else {
              throw new Error('No onboardingId in start response');
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
  }, []); // Inga dependencies - kör endast en gång vid mount

  return { onboardingId, userSub, loading, error };
}

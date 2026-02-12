'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

export function StripeStart() {
  const router = useRouter();
  const pathname = usePathname();
  const { onboardingId, userSub, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId();
  const { state, loading: stateLoading } = useOnboardingState(userSub || '', onboardingId);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadingState = onboardingIdLoading || stateLoading;

  useEffect(() => {
    // Använd userSub från hook (Auth0 eller anonym sessionId)
    if (userSub) {
      setSessionId(userSub);
    }
  }, [userSub]);

  const loginWithRedirect = (options: { appState?: { returnTo: string } }) => {
    const returnTo = options.appState?.returnTo || pathname;
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  };

  // Visa fel om onboardingId saknas
  useEffect(() => {
    if (onboardingIdError) {
      setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
    }
  }, [onboardingIdError]);

  // FSM: Backend-driven guards baserat på formell status
  // Status är enda sanningskällan - inga heuristiska kontroller
  useEffect(() => {
    if (loadingState) return;
    if (!state) return;

    // Redirecta baserat på status (FSM-driven)
    if (state.status === 'started') {
      router.replace('/onboarding/questions');
      return;
    }
    // Stripe får endast starta efter att code är färdigt
    if (state.status !== 'code_completed') {
      router.replace('/onboarding/code');
      return;
    }
    // Stripe tillåts först efter code_completed
    // MEN vi får aldrig redirecta bakåt över questions
    // Om status inte är code_completed eller senare, vänta (gör ingenting)
    if (state.status !== 'code_completed' && state.status !== 'stripe_started' && state.status !== 'stripe_completed' && state.status !== 'ready_for_review') {
      return; // gör ingenting, vänta på korrekt status
    }
  }, [state, loadingState, router]);

  const startStripe = async () => {
    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, onboardingId }),
      });

      if (response.status === 401) {
        await loginWithRedirect({ appState: { returnTo: pathname } });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Ett fel uppstod. Försök igen.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError(normalizeError(err));
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Stripe onboarding</h1>
      <p className="text-gray-600 mb-8">
        För att aktivera betalningar behöver vi koppla Stripe. Det tar bara några minuter.
      </p>
      {error && <p className="text-red-600 mb-4">{typeof error === 'string' ? error : normalizeError(error)}</p>}
      <button
        type="button"
        onClick={startStripe}
        className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
        disabled={loading}
      >
        {loading ? 'Förbereder...' : 'Starta Stripe onboarding'}
      </button>
    </section>
  );
}

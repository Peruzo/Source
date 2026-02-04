'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

export function StripeStart({ userSub }: { userSub: string }) {
  const router = useRouter();
  const { onboardingId, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId(userSub);
  const { state, loading: stateLoading } = useOnboardingState(userSub, onboardingId);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadingState = onboardingIdLoading || stateLoading;

  useEffect(() => {
    if (!userSub) return;
    setSessionId(getOrCreateSessionId(userSub));
  }, [userSub]);

  // Visa fel om onboardingId saknas
  useEffect(() => {
    if (onboardingIdError) {
      setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
    }
  }, [onboardingIdError]);

  // Backend-driven: kräv questions och (om hasExistingSite) code i state
  // KRITISK: Blockera Stripe tills GitHub-repo är verifierat (API-nivå verifiering)
  useEffect(() => {
    if (loadingState) return;
    if (!state?.questions) {
      router.replace('/onboarding/questions');
      return;
    }
    if (state.questions.hasExistingSite === 'Ja') {
      if (!state?.code) {
        router.replace('/onboarding/code');
        return;
      }
      // Om kod kommer från GitHub, kräv att repo är verifierat innan Stripe tillåts
      if (state.code.codeSource === 'github' && (!state?.github?.verified)) {
        // Redirecta tillbaka till code-steget med felmeddelande
        router.replace('/onboarding/code?github=verification_required');
        return;
      }
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

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(normalizeError(data.error || data.message || 'Ett fel uppstod. Försök igen.'));
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

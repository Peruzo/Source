'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateSessionId, loadOnboardingData } from '@/lib/onboarding/storage';

export function StripeStart({ userSub }: { userSub: string }) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userSub) return;
    const stored = loadOnboardingData(userSub);
    if (!stored.questions) {
      router.replace('/onboarding/questions');
      return;
    }
    setSessionId(getOrCreateSessionId(userSub));
  }, [userSub, router]);

  const startStripe = async () => {
    setLoading(true);
    setError('');

    const response = await fetch('/api/onboarding/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      setError('Ett fel uppstod. Försök igen.');
      setLoading(false);
      return;
    }

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Stripe onboarding</h1>
      <p className="text-gray-600 mb-8">
        För att aktivera betalningar behöver vi koppla Stripe. Det tar bara några minuter.
      </p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
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

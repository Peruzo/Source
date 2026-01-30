'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';

export function SuccessMessage() {
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('');
  const accountId = searchParams.get('account') || '';

  useEffect(() => {
    const sessionId = getOrCreateSessionId();

    const updateStatus = async () => {
      if (!accountId) {
        return;
      }

      const statusResponse = await fetch(`/api/onboarding/stripe/status?accountId=${accountId}`);
      const status = statusResponse.ok ? await statusResponse.json() : null;

      await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          step: 'stripe_completed',
          data: {
            accountId,
            status,
          },
        }),
      });

      setStatusMessage(status?.detailsSubmitted ? 'Stripe är nu kopplat.' : 'Stripe-onboarding mottagen.');
    };

    updateStatus();
  }, [accountId]);

  return (
    <section className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6">Tack!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Vi har nu all information vi behöver. Vårt team integrerar ditt system och återkommer så snart allt är klart.
      </p>
      {statusMessage && <p className="text-sm text-gray-500">{statusMessage}</p>}
    </section>
  );
}

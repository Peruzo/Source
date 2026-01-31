'use client';

import { useSearchParams } from 'next/navigation';

export function SuccessMessage() {
  const searchParams = useSearchParams();
  const account = searchParams.get('account') ?? '';
  const sessionId = searchParams.get('sessionId') ?? '';

  return (
    <section className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6">Klart!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Onboarding mottagen. Dina Stripe-uppgifter är inskickade och kontot granskas manuellt av vårt team.
      </p>
      <p className="text-base text-gray-600 mb-8">
        Vi hör av oss när allt är klart. Du får tillgång till kundportalen när kontot är godkänt.
      </p>
      {(account || sessionId) && (
        <p className="text-sm text-gray-400" aria-hidden="true">
          {account && `Konto: ${account}`}
          {account && sessionId && ' · '}
          {sessionId && `Session: ${sessionId}`}
        </p>
      )}
    </section>
  );
}

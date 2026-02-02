'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateSessionId } from '@/lib/onboarding/storage';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

type QuestionsData = {
  hasExistingSite: 'Ja' | 'Nej' | '';
  currentStage: 'Jag har bara en idé' | 'Jag har en färdig hemsida' | 'Jag har ett system i drift' | '';
  primaryGoal: 'Betalningar & fakturor' | 'Kundportal' | 'Analys & insikter' | 'Allt ovan' | '';
  customerCount: '0–10' | '10–100' | '100+' | '';
};

const defaultData: QuestionsData = {
  hasExistingSite: '',
  currentStage: '',
  primaryGoal: '',
  customerCount: '',
};

export function QuestionsForm({
  userEmail,
  userSub,
}: {
  userEmail: string;
  userSub: string;
}) {
  const router = useRouter();
  const { onboardingId, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId(userSub);
  const { state, loading: stateLoading } = useOnboardingState(userSub, onboardingId);
  const [sessionId, setSessionId] = useState('');
  const [formData, setFormData] = useState<QuestionsData>(defaultData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loading = onboardingIdLoading || stateLoading;

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

  // Ladda data från backend när state är tillgänglig
  useEffect(() => {
    if (state?.questions) {
      setFormData({ ...defaultData, ...state.questions });
    } else {
      setFormData(defaultData);
    }
  }, [state]);

  const updateField = (field: keyof QuestionsData, value: QuestionsData[keyof QuestionsData]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const isComplete = Object.values(formData).every((value) => value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!onboardingId) {
      setError('Onboarding är inte initierat. Ladda om sidan.');
      return;
    }

    if (!isComplete) {
      setError('Svara på alla frågor för att fortsätta.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      sessionId,
      onboardingId,
      step: 'questions',
      data: {
        ...formData,
        userEmail,
      },
    };

    try {
      const response = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(normalizeError(data.error || data.message || 'Ett fel uppstod. Försök igen.'));
        setSubmitting(false);
        return;
      }
    } catch (err) {
      setError(normalizeError(err));
      setSubmitting(false);
      return;
    }

    // State sparas automatiskt i backend via POST /api/onboarding/step
    // Ingen localStorage-sparning behövs längre

    if (formData.hasExistingSite === 'Ja') {
      router.push('/onboarding/code');
    } else {
      router.push('/onboarding/stripe');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Onboarding</h1>
      <p className="text-gray-600 mb-10">
        Svara på alla frågor. Detta steg är obligatoriskt innan vi kan gå vidare.
      </p>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Har du redan en hemsida eller system du vill integrera?
          </h2>
          <div className="flex flex-col gap-2">
            {['Ja', 'Nej'].map((value) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hasExistingSite"
                  value={value}
                  checked={formData.hasExistingSite === value}
                  onChange={() => updateField('hasExistingSite', value as QuestionsData['hasExistingSite'])}
                  required
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Vad beskriver dig bäst just nu?
          </h2>
          <div className="flex flex-col gap-2">
            {[
              'Jag har bara en idé',
              'Jag har en färdig hemsida',
              'Jag har ett system i drift',
            ].map((value) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="currentStage"
                  value={value}
                  checked={formData.currentStage === value}
                  onChange={() => updateField('currentStage', value as QuestionsData['currentStage'])}
                  required
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Vad vill du använda Source till?
          </h2>
          <div className="flex flex-col gap-2">
            {['Betalningar & fakturor', 'Kundportal', 'Analys & insikter', 'Allt ovan'].map((value) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="primaryGoal"
                  value={value}
                  checked={formData.primaryGoal === value}
                  onChange={() => updateField('primaryGoal', value as QuestionsData['primaryGoal'])}
                  required
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Ungefär hur många kunder har du idag?
          </h2>
          <div className="flex flex-col gap-2">
            {['0–10', '10–100', '100+'].map((value) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="customerCount"
                  value={value}
                  checked={formData.customerCount === value}
                  onChange={() => updateField('customerCount', value as QuestionsData['customerCount'])}
                  required
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600">{typeof error === 'string' ? error : normalizeError(error)}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          disabled={submitting}
        >
          {submitting ? 'Sparar...' : 'Fortsätt'}
        </button>
      </form>
    </section>
  );
}

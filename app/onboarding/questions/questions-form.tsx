'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredPlanId, getStripeOnboardingUrl } from '@/lib/onboarding/selected-plan';
import { useOnboardingState } from '@/lib/onboarding/backend-state';
import { useOnboardingId } from '@/lib/onboarding/use-onboarding-id';
import { normalizeError } from '@/lib/utils/normalize-error';

type QuestionsData = {
  hasExistingSite: 'Ja' | 'Nej' | '';
  currentStage: 'Jag har bara en idé' | 'Jag har en färdig hemsida' | 'Jag har ett system i drift' | '';
  primaryGoal: 'Betalningar & fakturor' | 'Kundportal' | 'Analys & insikter' | 'Allt ovan' | '';
  legalEntityType: 'Enskild firma' | 'Aktiebolag' | 'Handelsbolag' | 'Ekonomisk förening' | 'Annat' | '';
  employeeCount: '1' | '2–5' | '6–20' | '20+' | '';
  annualRevenue: 'Under 500 000 kr' | '500 000 – 2 000 000 kr' | '2 000 000 – 10 000 000 kr' | '10 000 000 – 50 000 000 kr' | 'Över 50 000 000 kr' | '';
  heardAboutUs: 'Google' | 'Sociala medier' | 'Vän eller kollega' | 'Event eller mässa' | 'Annat' | '';
};

const defaultData: QuestionsData = {
  hasExistingSite: '',
  currentStage: '',
  primaryGoal: '',
  legalEntityType: '',
  employeeCount: '',
  annualRevenue: '',
  heardAboutUs: '',
};

const questions = [
  {
    key: 'hasExistingSite' as keyof QuestionsData,
    question: 'Har du redan en hemsida eller ett system?',
    options: ['Ja', 'Nej'],
  },
  {
    key: 'currentStage' as keyof QuestionsData,
    question: 'Vad beskriver dig bäst just nu?',
    options: ['Jag har bara en idé', 'Jag har en färdig hemsida', 'Jag har ett system i drift'],
  },
  {
    key: 'primaryGoal' as keyof QuestionsData,
    question: 'Vad vill du använda Source till?',
    options: ['Betalningar & fakturor', 'Kundportal', 'Analys & insikter', 'Allt ovan'],
  },
  {
    key: 'legalEntityType' as keyof QuestionsData,
    question: 'Vad är din företagsform?',
    options: ['Enskild firma', 'Aktiebolag', 'Handelsbolag', 'Ekonomisk förening', 'Annat'],
  },
  {
    key: 'employeeCount' as keyof QuestionsData,
    question: 'Hur många anställda har du?',
    options: ['1', '2–5', '6–20', '20+'],
  },
  {
    key: 'annualRevenue' as keyof QuestionsData,
    question: 'Vad är er ungefärliga årsomsättning?',
    options: ['Under 500 000 kr', '500 000 – 2 000 000 kr', '2 000 000 – 10 000 000 kr', '10 000 000 – 50 000 000 kr', 'Över 50 000 000 kr'],
  },
  {
    key: 'heardAboutUs' as keyof QuestionsData,
    question: 'Hur hörde du talas om oss?',
    options: ['Google', 'Sociala medier', 'Vän eller kollega', 'Event eller mässa', 'Annat'],
  },
];

export function QuestionsForm() {
  const router = useRouter();
  const { onboardingId, userSub, loading: onboardingIdLoading, error: onboardingIdError } = useOnboardingId();
  const { state, loading: stateLoading } = useOnboardingState(userSub || '', onboardingId);
  const [formData, setFormData] = useState<QuestionsData>(defaultData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loading = onboardingIdLoading || stateLoading;

  useEffect(() => {
    if (onboardingIdError) setError(`Kunde inte initiera onboarding: ${onboardingIdError}`);
  }, [onboardingIdError]);

  useEffect(() => {
    if (state?.questions) setFormData({ ...defaultData, ...state.questions });
  }, [state]);

  const currentQ = questions[currentQuestion];
  const currentValue = formData[currentQ.key];
  const isLast = currentQuestion === questions.length - 1;

  const selectOption = (value: string) => {
    setFormData(prev => ({ ...prev, [currentQ.key]: value as QuestionsData[keyof QuestionsData] }));
  };

  const goNext = async () => {
    if (!currentValue) return;
    if (!isLast) {
      setAnimating(true);
      setDirection('out');
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setDirection('in');
        setAnimating(false);
      }, 250);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!onboardingId) { setError('Onboarding är inte initierat. Ladda om sidan.'); return; }
    const allAnswered = Object.values(formData).every(v => v);
    if (!allAnswered) { setError('Svara på alla frågor.'); return; }
    setSubmitting(true);
    setError('');
    const emailFromState = state?.email || '';
    const nextStep = formData.hasExistingSite === 'Ja' ? 'code' : 'stripe';
    const payload = {
      onboardingId,
      step: 'questions',
      nextStep,
      answers: { ...formData, ...(emailFromState ? { userEmail: emailFromState } : {}) },
    };
    try {
      const response = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(normalizeError(data.error || data.message || 'Ett fel uppstod.'));
        setSubmitting(false);
        return;
      }
      const result = await response.json();
      if (!result.success) { setError('Kunde inte spara onboarding-steg.'); setSubmitting(false); return; }
      if (result.nextStep === 'code') {
        router.push('/onboarding/code');
      } else {
        const planId = typeof window !== 'undefined' ? getStoredPlanId() : null;
        router.push(getStripeOnboardingUrl(planId));
      }
    } catch (err) {
      setError(normalizeError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Gradient bakgrund */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.10) 40%, transparent 70%)',
        }}
      />

      {/* Innehåll */}
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        
        {/* Logo + Progress dots */}
        <div className="flex flex-col items-center mb-12 gap-4">
          <img
            src="/twogreenarrows.png"
            alt="Source"
            className="h-16 w-auto"
          />
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentQuestion ? 24 : 8,
                  height: 8,
                  background: i <= currentQuestion ? '#10b981' : '#d1fae5',
                }}
              />
            ))}
          </div>
        </div>

        {/* Fråga + alternativ */}
        <div
          key={currentQuestion}
          className="w-full flex flex-col items-center"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? (direction === 'out' ? 'translateY(-16px)' : 'translateY(16px)') : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-10">
            {currentQ.question}
          </h1>

          <div className="flex flex-col gap-3 w-full">
            {currentQ.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(option)}
                className="w-full text-left px-6 py-4 rounded-2xl border-2 font-medium text-gray-800 transition-all duration-150"
                style={{
                  borderColor: currentValue === option ? '#10b981' : '#e5e7eb',
                  background: currentValue === option ? 'rgba(16,185,129,0.06)' : 'white',
                  boxShadow: currentValue === option ? '0 0 0 3px rgba(16,185,129,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                  transform: currentValue === option ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          <button
            type="button"
            onClick={goNext}
            disabled={!currentValue || submitting}
            className="mt-10 px-10 py-3 rounded-full font-semibold text-white transition-all duration-200"
            style={{
              background: currentValue ? '#10b981' : '#d1fae5',
              color: currentValue ? 'white' : '#6ee7b7',
              cursor: currentValue ? 'pointer' : 'not-allowed',
              boxShadow: currentValue ? '0 4px 14px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            {submitting ? 'Sparar...' : isLast ? 'Fortsätt →' : 'Nästa →'}
          </button>
        </div>
      </div>
    </div>
  );
}

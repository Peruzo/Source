'use client';

import { useState } from 'react';
import { T } from '@/lib/site-builder/texts';
import { QUOTE_LIMITS, validateQuote, type QuoteError, type QuoteInput } from '@/lib/site-builder/flow-state';
import { api } from './api';
import { ErrorBox, Field, InfoBox, LinkButton, PrimaryButton } from './ui';

/** Valet före byggarens första steg: själv med AI eller offert från Source. */
export function ChoiceStep(props: { onAi: () => void; onQuote: () => void }) {
  const card = 'w-full text-left rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200';
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-gray-600 text-center">{T.choiceIntro}</p>
      <button type="button" className={card} onClick={props.onAi}>
        <span className="block text-lg font-semibold text-gray-900">{T.choiceAiTitle}</span>
        <span className="mt-1 block text-gray-600">{T.choiceAiText}</span>
        <span className="mt-3 inline-block font-semibold text-emerald-800">{T.choiceAiCta} →</span>
      </button>
      <button type="button" className={card} onClick={props.onQuote}>
        <span className="block text-lg font-semibold text-gray-900">{T.choiceQuoteTitle}</span>
        <span className="mt-1 block text-gray-600">{T.choiceQuoteText}</span>
        <span className="mt-3 inline-block font-semibold text-emerald-800">{T.choiceQuoteCta} →</span>
      </button>
    </div>
  );
}

const EMPTY: QuoteInput = { content: '', references: '', timeline: '', message: '' };

/** Offertformuläret. Skickas som supportärende med kategorin quote_request. */
export function QuoteStep(props: { onboardingId: string; onSent: () => void; onSwitchToAi: () => void }) {
  const [input, setInput] = useState<QuoteInput>(EMPTY);
  const [errors, setErrors] = useState<QuoteError[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const errorFor = (field: keyof QuoteInput) => {
    const e = errors.find((x) => x.field === field);
    return e ? T.quoteErrors[e.code] : undefined;
  };
  const set = (field: keyof QuoteInput) => (v: string) => setInput((i) => ({ ...i, [field]: v }));

  async function send() {
    const checked = validateQuote(input);
    if (!checked.ok) { setErrors(checked.errors); return; }
    setErrors([]);
    setSending(true);
    setError('');
    const res = await api<{ supportRequest: { id: string; status: string } }>('/support-request', 'POST', { onboardingId: props.onboardingId, ...checked.payload });
    setSending(false);
    if (res.ok) props.onSent();
    else setError(res.message);
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <p className="text-gray-600 text-center">{T.quoteIntro}</p>
      <Field label={T.quoteContent} help={T.quoteContentHelp} value={input.content} onChange={set('content')} max={QUOTE_LIMITS.contentMax} multiline rows={5} error={errorFor('content')} />
      <Field label={T.quoteReferences} help={T.quoteReferencesHelp} value={input.references} onChange={set('references')} max={QUOTE_LIMITS.referencesMax * (QUOTE_LIMITS.referenceMax + 1)} multiline rows={3} error={errorFor('references')} />
      <Field label={T.quoteTimeline} help={T.quoteTimelineHelp} value={input.timeline} onChange={set('timeline')} max={QUOTE_LIMITS.timelineMax} error={errorFor('timeline')} />
      <Field label={T.quoteMessage} help={T.quoteMessageHelp} value={input.message} onChange={set('message')} max={QUOTE_LIMITS.messageMax} multiline rows={3} error={errorFor('message')} />
      {error && <ErrorBox message={error} />}
      <div className="flex flex-col items-center gap-3">
        <PrimaryButton onClick={send} disabled={sending}>{sending ? T.quoteSending : T.quoteSubmit}</PrimaryButton>
        <LinkButton onClick={props.onSwitchToAi}>{T.switchToAi}</LinkButton>
      </div>
    </div>
  );
}

/** Bekräftelsen efter offertförfrågan, med vägen vidare och möjligheten att bygga själv. */
export function QuoteSentStep(props: { onContinue: () => void; onSwitchToAi: () => void }) {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <InfoBox><span role="status">{T.quoteSentText}</span></InfoBox>
      <PrimaryButton onClick={props.onContinue}>{T.quoteContinue}</PrimaryButton>
      <LinkButton onClick={props.onSwitchToAi}>{T.switchToAi}</LinkButton>
    </div>
  );
}

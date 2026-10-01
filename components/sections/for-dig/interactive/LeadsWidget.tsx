'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { SparklesIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, RADIUS } from '../payment-cards/primitives';
import { EASE, Pill, ReplayButton, T, UiButton } from './ui';
import { useSequence } from './useSequence';

type LeadStatusTone = 'outline' | 'muted' | 'paid';

export type LeadsWidgetContent = {
  label: string;
  listTitle: string;
  ratingLabel: string;
  leads: { id: string; company: string; place: string; rating: string; status: string; tone: LeadStatusTone }[];
  open: {
    company: string;
    details: { label: string; value: string }[];
    notesTitle: string;
    note: { date: string; text: string };
    action: string;
    loading: string;
    answerTitle: string;
    evidence: string;
    sections: { title: string; body: string }[];
    objection: { title: string; question: string; answer: string };
  };
};

/*
 * "Hitta nya kunder": the portal's leads page as a work surface – the list on the
 * left, one lead open beside it with its details and notes. "Analysera & pitch" is
 * pressed, the house's three typing dots run, and the analysis comes back with the
 * portal's own sections (Bakgrund, Relevans, Säljpitch, Samtalsöppningar, Troliga
 * invändningar) and its evidence badge. The answer is example text.
 *
 *   0 idle → 1 button pressed → 2 analysing → 3 answer
 */
const DURATIONS = [1100, 350, 1900];

export function LeadsWidget({ content: c }: { content: LeadsWidgetContent }) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const listId = useId();
  const panelId = useId();
  const o = c.open;

  return (
    <div
      ref={(el) => {
        ref.current = el;
      }}
      className={`@container w-full bg-white p-4 text-left text-black sm:p-5 ${CARD_EDGE} ${RADIUS.card}`}
    >
      <p className="sr-only">{c.label}</p>
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* The list. */}
        <div>
          <h3 id={listId} className={T.title}>
            {c.listTitle}
          </h3>
          <ul aria-labelledby={listId} className="mt-3 space-y-2">
            {c.leads.map((lead, i) => (
              <li
                key={lead.id}
                className={`flex items-center gap-3 border px-3 py-2.5 ${RADIUS.field} ${
                  i === 0 ? 'border-teal-dark bg-teal/5' : 'border-gray-200'
                }`}
              >
                <span
                  role="img"
                  aria-label={`${c.ratingLabel} ${lead.rating}`}
                  className={`${T.body} flex h-9 w-9 shrink-0 items-center justify-center bg-teal-dark font-semibold text-white ${RADIUS.control}`}
                >
                  {lead.rating}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${T.body} block truncate font-semibold`}>{lead.company}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`${T.label} text-gray-600`}>{lead.place}</span>
                    <Pill tone={lead.tone}>{lead.status}</Pill>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The open lead. */}
        <div className={`border border-gray-200 p-4 ${RADIUS.field}`} aria-labelledby={panelId} role="group">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 id={panelId} className={T.title}>
              {o.company}
            </h4>
            <UiButton pressed={step === 1} icon={<SparklesIcon className="h-4 w-4" aria-hidden="true" />}>
              {o.action}
            </UiButton>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {o.details.map((d) => (
              <div key={d.label} className="min-w-0">
                <dt className={`${T.label} text-gray-600`}>{d.label}</dt>
                <dd className={`${T.body} truncate`}>{d.value}</dd>
              </div>
            ))}
          </dl>

          {/* Notes, the dots and the answer share one fixed area: nothing moves while it plays. */}
          <div className="relative mt-4 h-[26rem] @xl:h-[25.5rem]">
            <Layer show={step < 2}>
              <p className={`${T.label} font-semibold text-gray-600`}>{o.notesTitle}</p>
              <div className={`mt-2 bg-gray-50 px-3.5 py-3 ${RADIUS.field}`}>
                <p className={`${T.label} text-gray-600`}>{o.note.date}</p>
                <p className={`${T.body} mt-0.5`}>{o.note.text}</p>
              </div>
            </Layer>

            <Layer show={step === 2}>
              <div className="flex h-full flex-col items-center justify-center gap-4" aria-live="polite">
                <span className="flex items-center gap-2.5" aria-hidden="true">
                  <span className="ai-bubble-loading ai-bubble-loading-1 inline-block h-3.5 w-3.5 rounded-full bg-teal-dark" />
                  <span className="ai-bubble-loading ai-bubble-loading-2 inline-block h-3.5 w-3.5 rounded-full bg-teal-dark" />
                  <span className="ai-bubble-loading ai-bubble-loading-3 inline-block h-3.5 w-3.5 rounded-full bg-teal-dark" />
                </span>
                {step === 2 ? <span className={`${T.label} text-gray-600`}>{o.loading}</span> : null}
              </div>
            </Layer>

            <Layer show={step >= 3}>
              <div className="flex items-center justify-between gap-2">
                <p className={`${T.label} font-semibold text-gray-600`}>{o.answerTitle}</p>
                <Pill tone="muted">{o.evidence}</Pill>
              </div>
              <dl className="mt-2 space-y-2.5">
                {o.sections.map((s) => (
                  <div key={s.title}>
                    <dt className={`${T.label} font-semibold text-teal-dark`}>{s.title}</dt>
                    <dd className={`${T.label} text-gray-800`}>{s.body}</dd>
                  </div>
                ))}
                <div>
                  <dt className={`${T.label} font-semibold text-teal-dark`}>{o.objection.title}</dt>
                  <dd className={`${T.label} text-gray-800`}>
                    <span className="italic">”{o.objection.question}”</span> {o.objection.answer}
                  </dd>
                </div>
              </dl>
            </Layer>
          </div>
        </div>
      </div>
      <ReplayButton onClick={replay} />
    </div>
  );
}

/** One of the stacked layers in the fixed area: fades in and out, hidden from assistive tech while out. */
function Layer({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!show}
      className={`absolute inset-0 transition-[opacity,transform] duration-500 ${EASE} ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

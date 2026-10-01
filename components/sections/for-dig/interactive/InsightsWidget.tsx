'use client';

import { ArrowDownTrayIcon, ArrowPathIcon, DocumentChartBarIcon } from '@heroicons/react/20/solid';
import { RADIUS } from '../payment-cards/primitives';
import { EASE, Pill, T, UiButton, WidgetShell } from './ui';
import { useSequence } from './useSequence';

type Insight = { id: string; priority: string; category: string; title: string; action: string };

export type InsightsWidgetContent = {
  label: string;
  title: string;
  report: {
    name: string;
    pill: string;
    schedule: string;
    sections: string;
    pending: string;
    ready: string;
    downloadLabel: string;
  };
  insightsHeading: string;
  actionLabel: string;
  insights: Insight[];
  note: string;
  replayLabel: string;
};

/*
 * "Insikter utan att gräva": a scheduled report and the AI insights page.
 *
 *   0 the weekly report is being put together → 1 it is ready to download →
 *   2–4 the AI insights come in, one at a time, each with its action
 *
 * The report is not e-mailed – the portal keeps it under Rapporter, where the
 * PDF is made on "Ladda ner". The insights use the portal's own card: priority,
 * category, title and "Åtgärd". Rows are always rendered and only fade in, so
 * the card never changes height. "Spela igen" sits in the header instead of at
 * the bottom: the card has to fit beside her at 1280 × 720.
 */
const STEPS = [1100, 500, 450, 450];

export function InsightsWidget({ content: c }: { content: InsightsWidgetContent }) {
  const { ref, step, replay } = useSequence(STEPS);
  const ready = step >= 1;

  return (
    <WidgetShell
      innerRef={(el) => {
        ref.current = el;
      }}
      title={c.title}
      label={c.label}
      actions={
        <button
          type="button"
          onClick={replay}
          className={`${T.label} inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${RADIUS.control}`}
        >
          <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
          {c.replayLabel}
        </button>
      }
    >
      {/* The scheduled report. */}
      <div className={`border border-gray-200 p-3.5 ${RADIUS.field}`}>
        <div className="flex items-start gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
            <DocumentChartBarIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className={`${T.body} font-semibold`}>{c.report.name}</p>
              <Pill tone="muted">{c.report.pill}</Pill>
            </div>
            <p className={`${T.label} text-gray-600`}>
              {c.report.schedule} · {c.report.sections}
            </p>
          </div>
        </div>
        {/* Status: both states share one row, so swapping them moves nothing. */}
        <div className="relative mt-2 h-9">
          <p
            aria-hidden={ready}
            className={`${T.label} absolute inset-0 flex items-center gap-2 text-gray-600 transition-opacity duration-300 ${EASE} ${ready ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-gray-400 motion-reduce:animate-none" aria-hidden="true" />
            {c.report.pending}
          </p>
          <div
            aria-hidden={!ready}
            className={`absolute inset-0 flex items-center justify-between gap-3 transition-opacity duration-300 ${EASE} ${ready ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className={`${T.label} font-semibold text-teal-dark`} aria-live="polite">
              {ready ? c.report.ready : ''}
            </span>
            <UiButton tone="quiet" icon={<ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />}>
              {c.report.downloadLabel}
            </UiButton>
          </div>
        </div>
      </div>

      {/* The AI insights. */}
      <p className="mt-4 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-gray-600">{c.insightsHeading}</p>
      <ul className="mt-2 space-y-2">
        {c.insights.map((ins, i) => {
          const shown = step >= 2 + i;
          return (
            <li
              key={ins.id}
              aria-hidden={!shown}
              className={`border border-gray-200 bg-white px-3.5 py-2.5 transition-[opacity,transform] duration-500 ${EASE} ${RADIUS.field} ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0'
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Pill tone={i === 0 ? 'solid' : 'outline'}>{ins.priority}</Pill>
                <span className={`${T.label} text-gray-600`}>{ins.category}</span>
              </div>
              <p className={`${T.body} mt-1 font-semibold`}>{ins.title}</p>
              <p className={`${T.label} mt-0.5 text-gray-700`}>
                <span className="font-semibold text-black">{c.actionLabel}</span> {ins.action}
              </p>
            </li>
          );
        })}
      </ul>
      <p className={`${T.label} mt-3 text-gray-600`}>{c.note}</p>
    </WidgetShell>
  );
}

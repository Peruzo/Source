'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { CardShell, RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';

/*
 * Analytics widgets for the service pages. Same vocabulary as the inventory
 * widgets and the "För dig" cards – CardShell, the three radii, the
 * `.text-ui-*` scale – drawn after the customer portal's own screens
 * (statistics, analyser, customer report, AI insights, reports). They show
 * what the screens look like with neutral example data; they are not results.
 * Buttons are look-alikes, not controls. Nothing animates under reduced motion.
 */

const nf = new Intl.NumberFormat('sv-SE');

/** "+8 %" / "−3 %" with an arrow, green-ish up, red-ish down – like the portal's change pills. */
export function ChangePill({ value, suffix = 'mot perioden innan' }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const label = `${up ? '+' : '−'}${nf.format(Math.abs(value))} %`;
  return (
    <span
      className={`text-ui-label inline-flex items-center gap-1 px-2 py-0.5 font-semibold tabular-nums ${RADIUS.control} ${
        up ? 'bg-teal-light text-teal-darkest' : 'bg-status-overdue-bg text-status-overdue'
      }`}
    >
      <svg viewBox="0 0 12 12" className={`h-3 w-3 ${up ? '' : 'rotate-180'}`} aria-hidden="true">
        <path d="M6 2.5 10 8H2L6 2.5Z" fill="currentColor" />
      </svg>
      {label}
      <span className="sr-only"> {suffix}</span>
    </span>
  );
}

/** Line chart of this period against the previous one. */
export function PeriodTrendCard({
  active,
  title,
  period,
  value,
  change,
  current,
  previous,
  legend,
}: {
  active: boolean;
  title: string;
  period: string;
  value: string;
  change: number;
  current: readonly number[];
  previous: readonly number[];
  legend: { current: string; previous: string };
}) {
  const reduce = usePrefersReducedMotion();
  const titleId = useId();
  const all = [...current, ...previous];
  const max = Math.max(...all);
  const min = Math.min(...all);
  const W = 280;
  const H = 88;
  const path = (series: readonly number[]) =>
    series
      .map((v, i) => {
        const x = (i / (series.length - 1)) * W;
        const y = H - 6 - ((v - min) / (max - min || 1)) * (H - 12);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <CardShell labelledBy={titleId}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id={titleId} className="text-ui-title">
            {title}
          </h3>
          <p className="text-ui-label text-gray-600">{period}</p>
        </div>
        <ChangePill value={change} />
      </div>
      <p className="text-ui-amount mt-3 tabular-nums text-black">{value}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={`${legend.current} jämfört med ${legend.previous}`}>
        <path d={path(previous)} fill="none" stroke="#A3A3A3" strokeWidth="1.5" strokeDasharray="4 4" />
        <motion.path
          d={path(current)}
          fill="none"
          stroke="#00806D"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: active || reduce ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut', delay: reduce ? 0 : 0.2 }}
        />
      </svg>
      <div className="text-ui-label mt-2 flex gap-4 text-gray-600">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0.5 w-4 rounded bg-teal-dark" />
          {legend.current}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0 w-4 border-t border-dashed border-gray-400" />
          {legend.previous}
        </span>
      </div>
    </CardShell>
  );
}

/** Key figures with their change against the previous period. */
export function KpiCard({
  title,
  period,
  items,
}: {
  title: string;
  period: string;
  items: readonly { label: string; value: string; change: number }[];
}) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {title}
      </h3>
      <p className="text-ui-label text-gray-600">{period}</p>
      <dl className="mt-3 divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-ui-body text-gray-700">{item.label}</dt>
            <dd className="flex items-center gap-2">
              <span className="text-ui-body font-semibold tabular-nums text-black">{item.value}</span>
              <ChangePill value={item.change} />
            </dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}

/** Ring: returning customers as a share of the period's active customers. */
export function CustomerRingCard({
  active,
  title,
  period,
  total,
  totalLabel,
  newCount,
  returning,
  labels,
}: {
  active: boolean;
  title: string;
  period: string;
  total: number;
  totalLabel: string;
  newCount: number;
  returning: number;
  labels: { new: string; returning: string };
}) {
  const reduce = usePrefersReducedMotion();
  const titleId = useId();
  const share = returning / total;
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {title}
      </h3>
      <p className="text-ui-label text-gray-600">{period}</p>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#E6F7F4" strokeWidth="8" />
            <motion.circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke="#00806D"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={false}
              animate={{ strokeDashoffset: active || reduce ? C * (1 - share) : C }}
              transition={{ duration: reduce ? 0 : 1, ease: 'easeOut', delay: reduce ? 0 : 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-ui-title tabular-nums text-black">{nf.format(total)}</span>
            <span className="text-[0.625rem] font-medium text-gray-600">{totalLabel}</span>
          </div>
        </div>
        <dl className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ui-body flex items-center gap-2 text-gray-700">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-teal-light ring-1 ring-teal-dark/30" />
              {labels.new}
            </dt>
            <dd className="text-ui-body font-semibold tabular-nums text-black">{nf.format(newCount)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ui-body flex items-center gap-2 text-gray-700">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-teal-dark" />
              {labels.returning}
            </dt>
            <dd className="text-ui-body font-semibold tabular-nums text-black">{nf.format(returning)}</dd>
          </div>
        </dl>
      </div>
    </CardShell>
  );
}

type Move = 'up' | 'down' | 'same' | 'new';
const moveLabel: Record<Move, string> = { up: 'Upp', down: 'Ned', same: 'Oförändrad', new: 'Ny' };

/** Ranked list with the change in position since the previous period. */
export function TopListCard({
  title,
  period,
  items,
}: {
  title: string;
  period: string;
  items: readonly { name: string; value: string; move: Move }[];
}) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <h3 id={titleId} className="text-ui-title">
        {title}
      </h3>
      <p className="text-ui-label text-gray-600">{period}</p>
      <ol className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={item.name} className={`flex items-center gap-3 bg-gray-50 px-3 py-2 ${RADIUS.field}`}>
            <span className="text-ui-label w-4 font-semibold tabular-nums text-gray-600">{i + 1}</span>
            <span className="text-ui-body min-w-0 flex-1 truncate text-black">{item.name}</span>
            <span className="text-ui-body tabular-nums text-gray-700">{item.value}</span>
            <span
              className={`text-ui-label w-12 text-right font-semibold ${
                item.move === 'up' ? 'text-teal-dark' : item.move === 'down' ? 'text-status-overdue' : item.move === 'new' ? 'text-black' : 'text-gray-500'
              }`}
            >
              {item.move === 'up' ? '▲' : item.move === 'down' ? '▼' : item.move === 'new' ? 'Ny' : '–'}
              <span className="sr-only"> {moveLabel[item.move]}</span>
            </span>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}

/** One AI insight: category, what stands out, and a suggested next step. */
export function InsightCard({
  label,
  category,
  title,
  body,
  recommendationLabel,
  recommendation,
  updated,
}: {
  label: string;
  category: string;
  title: string;
  body: string;
  recommendationLabel: string;
  recommendation: string;
  updated: string;
}) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-ui-label flex items-center gap-1.5 font-semibold text-teal-dark">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6 8 1.5Z" fill="currentColor" />
          </svg>
          {label}
        </span>
        <span className={`text-ui-label bg-gray-100 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>{category}</span>
      </div>
      <h3 id={titleId} className="text-ui-title mt-3">
        {title}
      </h3>
      <p className="text-ui-body mt-1 text-gray-700">{body}</p>
      <div className={`mt-3 bg-teal-light px-3 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label font-semibold text-teal-darkest">{recommendationLabel}</p>
        <p className="text-ui-body text-black">{recommendation}</p>
      </div>
      <p className="text-ui-label mt-3 text-gray-500">{updated}</p>
    </CardShell>
  );
}

/** A generated report, as listed in the portal. */
export function ReportCard({
  title,
  frequency,
  schedule,
  sections,
  action,
}: {
  title: string;
  frequency: string;
  schedule: string;
  sections: readonly string[];
  action: string;
}) {
  const titleId = useId();
  return (
    <CardShell labelledBy={titleId}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={`flex h-10 w-10 flex-shrink-0 items-center justify-center bg-teal-light text-teal-dark ${RADIUS.field}`}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
            <path strokeLinejoin="round" d="M5 2.5h7l3 3v12H5v-15Z" />
            <path strokeLinecap="round" d="M8 10h5M8 13h5M12 2.5v3h3" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 id={titleId} className="text-ui-title truncate">
              {title}
            </h3>
            <span className={`text-ui-label bg-gray-100 px-2 py-0.5 text-gray-700 ${RADIUS.control}`}>{frequency}</span>
          </div>
          <p className="text-ui-label text-gray-600">{schedule}</p>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Innehåll">
        {sections.map((section) => (
          <li key={section} className={`text-ui-label border border-gray-200 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>
            {section}
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className={`text-ui-label mt-3 inline-flex bg-black px-3 py-1.5 font-semibold text-white ${RADIUS.control}`}>
        {action}
      </span>
    </CardShell>
  );
}

'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import { LoopingVideo } from './LoopingVideo';

export type ReturnCase = { order: string; customer: string; item: string; reason: string; status: string; tone: 'requested' | 'approved' | 'received' | 'rejected' };

export type LogisticsReturnsContent = {
  eyebrow: string;
  title: string;
  body: string[];
  list: { title: string; subtitle: string; label: string; columns: [string, string, string, string, string]; cases: ReturnCase[] };
  video: { label: string; sources: ServiceVideoSource[]; poster: ServiceVideoStill; end: ServiceVideoStill };
};

/* The portal's status colours: waiting amber, approved green, done grey, rejected red (status tokens in globals.css). */
const TONE: Record<ReturnCase['tone'], string> = {
  requested: 'bg-status-unpaid-bg text-status-unpaid',
  approved: 'bg-teal-light text-teal-darker',
  received: 'bg-gray-100 text-gray-700',
  rejected: 'bg-status-overdue-bg text-status-overdue',
};

function StatusPill({ c }: { c: ReturnCase }) {
  return <span className={`text-ui-label inline-flex whitespace-nowrap px-2.5 py-0.5 font-semibold ${RADIUS.control} ${TONE[c.tone]}`}>{c.status}</span>;
}

/** The return cases as a list in the portal's style: a table from sm, stacked rows on a phone. */
function CaseList({ list }: { list: LogisticsReturnsContent['list'] }) {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-5 text-left text-black ring-1 ring-gray-200 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {list.title}
      </h3>
      <p className="text-ui-label mt-0.5 text-gray-600">{list.subtitle}</p>

      {/* Table from sm */}
      <table className="mt-4 hidden w-full table-fixed text-left sm:table" aria-label={list.label}>
        <thead>
          <tr>
            {list.columns.map((col, i) => (
              <th key={col} scope="col" className={`text-ui-label pb-2 font-medium text-gray-600 ${['w-[4.5rem]', 'w-[6.5rem]', '', '', 'w-[6.5rem]'][i]}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.cases.map((c) => (
            <tr key={c.order} className="border-t border-gray-100">
              <td className="text-ui-body py-2.5 tabular-nums">{c.order}</td>
              <td className="text-ui-body truncate py-2.5">{c.customer}</td>
              <td className="text-ui-body truncate py-2.5">{c.item}</td>
              <td className="text-ui-label truncate py-2.5 text-gray-700">{c.reason}</td>
              <td className="py-2.5">
                <StatusPill c={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stacked rows on a phone */}
      <ul className="mt-3 divide-y divide-gray-100 sm:hidden" aria-label={list.label}>
        {list.cases.map((c) => (
          <li key={c.order} className="flex items-start justify-between gap-3 py-2.5">
            <span className="min-w-0">
              <span className="text-ui-body block">
                <span className="tabular-nums">{c.order}</span> · {c.customer}
              </span>
              <span className="text-ui-label block truncate text-gray-600">
                {c.item} · {c.reason}
              </span>
            </span>
            <StatusPill c={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
 * Returns on /logistik, under the flow video. Rendered when FLAGGOR.returerSektion is on
 * (lib/data/tjanster/logistik.ts); the older returns section in app/logistik/page.tsx stays behind
 * FLAGGOR.returer.
 * Shows only what is live in the portal: the case list, a case with its message thread,
 * "Godkänn retur" and the status email to the customer (video rendered in ~/remotion-source,
 * Returer). No customer photos, no return label, no refunds view.
 */
export function LogisticsReturnsSection({ content }: { content: LogisticsReturnsContent }) {
  const c = content;
  const headingId = useId();
  const { reveal } = useReveal();
  return (
    <section aria-labelledby={headingId} className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <motion.div {...reveal(0)} className="mx-auto max-w-[44rem] text-center">
          <p className="text-overline mb-4 text-teal-dark">{c.eyebrow}</p>
          <h2 id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            {c.title}
          </h2>
          <div className="mt-4 space-y-3">
            {c.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-gray-700 md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-[1240px] items-center gap-8 md:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <div className="mx-auto w-full max-w-[34rem] lg:max-w-none">
            <CaseList list={c.list} />
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-surface-stone ring-1 ring-black/5">
            <LoopingVideo sources={c.video.sources} poster={c.video.poster} end={c.video.end} label={c.video.label} sizes="(min-width: 1024px) 700px, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

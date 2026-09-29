'use client';

import { useId, type ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { RADIUS, formatNumber } from '@/components/sections/for-dig/payment-cards/primitives';
import {
  Card,
  CheckMark,
  PressButton,
  StatusPill,
  money,
  smooth,
  useStep,
} from '@/components/sections/tjanster/widgets/CampaignDemos';

/*
 * Scroll-driven demos for /bokforing. Same contract as CampaignDemos: each
 * takes the scene's progress (0 → 1, from ScrollScene), only opacity,
 * transforms and text change while it plays, every box keeps its size from
 * the first frame, and at 1 the demo rests in its final state – which is also
 * what reduced motion shows.
 *
 * The flows follow the customer portal exactly: a payout gives a proposal,
 * the vouchers are drafts until the user marks them ready, sending is done by
 * the user, and the annual report stays a draft template to be reviewed.
 */

/* ── Shared pieces ──────────────────────────────────────────────────────── */

/** A row that fades in between `from` and `to`. */
function Reveal({ progress, from, to, className = '', children }: { progress: MotionValue<number>; from: number; to: number; className?: string; children: ReactNode }) {
  const opacity = useStep(progress, from, to);
  return (
    <motion.div style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/** A check that fills in, with its label always readable (dimmed until checked). */
function CheckRow({ progress, at, children }: { progress: MotionValue<number>; at: number; children: ReactNode }) {
  const done = useStep(progress, at, at + 0.06);
  const labelOpacity = useTransform(done, [0, 1], [0.55, 1]);
  return (
    <li className="flex items-center gap-2.5">
      <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-gray-300">
        <motion.span
          style={{ opacity: done, scale: done }}
          className="absolute inset-[-1px] flex items-center justify-center rounded-full bg-teal-dark text-white"
        >
          <CheckMark />
        </motion.span>
      </span>
      <motion.span style={{ opacity: labelOpacity }} className="text-ui-body text-black">
        {children}
      </motion.span>
    </li>
  );
}

/* ── A1 – vouchers from a payout ────────────────────────────────────────── */

export type VoucherRow = { account: number; label: string; debit?: number; credit?: number };
export type VoucherDemoContent = {
  title: string;
  status: { idle: string; done: string };
  payout: { label: string; amount: number; report: string };
  headers: { account: string; debit: string; credit: string };
  vouchers: { title: string; rows: VoucherRow[] }[];
  checksTitle: string;
  checks: string[];
  markReady: string;
};

function VoucherTable({ progress, voucher, from, headers }: { progress: MotionValue<number>; voucher: VoucherDemoContent['vouchers'][number]; from: number; headers: VoucherDemoContent['headers'] }) {
  const step = 0.035;
  return (
    <div className={`border border-gray-200 bg-white px-3.5 pb-2 pt-2.5 ${RADIUS.field}`}>
      <p className="text-ui-label font-semibold text-black">{voucher.title}</p>
      <table className="mt-1 w-full table-fixed text-left tabular-nums">
        <thead>
          <tr className="text-ui-label text-gray-600">
            <th scope="col" className="w-[44%] py-1 font-normal @xs:w-[52%]">{headers.account}</th>
            <th scope="col" className="py-1 text-right font-normal">{headers.debit}</th>
            <th scope="col" className="py-1 text-right font-normal">{headers.credit}</th>
          </tr>
        </thead>
        <tbody>
          {voucher.rows.map((row, i) => (
            <VoucherTableRow key={`${row.account}-${i}`} progress={progress} row={row} from={from + i * step} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VoucherTableRow({ progress, row, from }: { progress: MotionValue<number>; row: VoucherRow; from: number }) {
  const opacity = useStep(progress, from, from + 0.05);
  return (
    <motion.tr style={{ opacity }} className="text-ui-label border-t border-gray-100 text-black">
      <td className="py-1 pr-2">
        {/* Narrow cards put the account name under its number, so it is never cut off. */}
        <span className="font-semibold">{row.account}</span> <span className="block text-gray-600 @xs:inline">{row.label}</span>
      </td>
      {/* Amounts without the currency – the column headers carry it – so they fit narrow cards. */}
      <td className="whitespace-nowrap py-1 text-right">{row.debit ? formatNumber(row.debit, 'sv-SE') : ''}</td>
      <td className="whitespace-nowrap py-1 text-right">{row.credit ? formatNumber(row.credit, 'sv-SE') : ''}</td>
    </motion.tr>
  );
}

export function VoucherDemo({ progress, content }: { progress: MotionValue<number>; content: VoucherDemoContent }) {
  const titleId = useId();
  const c = content;
  const ready = useStep(progress, 0.86, 0.92);
  const reportIn = useStep(progress, 0.02, 0.08);
  const rowsInA = 0.1;
  const rowsInB = rowsInA + c.vouchers[0].rows.length * 0.035 + 0.04;

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={ready} idle={c.status.idle} done={c.status.done} />}>
      <div className={`mt-3 flex items-center justify-between gap-3 bg-gray-50 px-3.5 py-2 ${RADIUS.field}`}>
        <span className="text-ui-body">
          {c.payout.label} <span className="tabular-nums text-gray-700">{money(c.payout.amount)}</span>
        </span>
        <motion.span style={{ opacity: reportIn }} className="text-ui-label flex items-center gap-1 font-semibold text-teal-darker">
          <CheckMark />
          {c.payout.report}
        </motion.span>
      </div>

      <div className="mt-2 space-y-2">
        <VoucherTable progress={progress} voucher={c.vouchers[0]} from={rowsInA} headers={c.headers} />
        <VoucherTable progress={progress} voucher={c.vouchers[1]} from={rowsInB} headers={c.headers} />
      </div>

      <div className="mt-3">
        <p className="text-ui-overline text-gray-600">{c.checksTitle}</p>
        <ol className="mt-2 space-y-1.5">
          {c.checks.map((check, i) => (
            <CheckRow key={check} progress={progress} at={0.6 + i * 0.08}>
              {check}
            </CheckRow>
          ))}
        </ol>
      </div>

      <div className="mt-3">
        <PressButton progress={progress} at={0.86} full>
          {c.markReady}
        </PressButton>
      </div>
    </Card>
  );
}

/* ── A2 – sending to Fortnox ───────────────────────────────────────────── */

export type FortnoxSendDemoContent = {
  title: string;
  status: { idle: string; done: string };
  test: string;
  checks: string[];
  listTitle: string;
  vouchers: { title: string; ready: string; sent: string }[];
  send: string;
  sentNote: string;
};

function SendRow({ progress, voucher, index }: { progress: MotionValue<number>; voucher: FortnoxSendDemoContent['vouchers'][number]; index: number }) {
  const selected = useStep(progress, 0.5 + index * 0.05, 0.55 + index * 0.05);
  const sent = useStep(progress, 0.72 + index * 0.05, 0.78 + index * 0.05);
  const readyOpacity = useTransform(sent, (v) => 1 - v);
  return (
    <li className="flex items-center gap-2.5 py-2">
      <span className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center border border-gray-400 ${RADIUS.field}`} aria-hidden="true">
        <motion.span style={{ opacity: selected }} className={`absolute inset-[-1px] flex items-center justify-center bg-teal-dark text-white ${RADIUS.field}`}>
          <CheckMark />
        </motion.span>
      </span>
      <span className="text-ui-body min-w-0 flex-1 truncate">{voucher.title}</span>
      <span className="text-ui-label relative inline-grid whitespace-nowrap">
        <motion.span style={{ opacity: readyOpacity }} className={`col-start-1 row-start-1 bg-gray-100 px-2.5 py-0.5 text-center text-gray-700 ${RADIUS.control}`} aria-hidden="true">
          {voucher.ready}
        </motion.span>
        <motion.span style={{ opacity: sent }} className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1 bg-teal-light px-2.5 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>
          <CheckMark />
          {voucher.sent}
        </motion.span>
      </span>
    </li>
  );
}

export function FortnoxSendDemo({ progress, content }: { progress: MotionValue<number>; content: FortnoxSendDemoContent }) {
  const titleId = useId();
  const c = content;
  const allSent = useStep(progress, 0.82, 0.9);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={allSent} idle={c.status.idle} done={c.status.done} />}>
      <div className={`mt-3 border border-gray-200 bg-white px-3.5 py-3 ${RADIUS.field}`}>
        <PressButton progress={progress} at={0.06}>
          {c.test}
        </PressButton>
        <ol className="mt-3 space-y-1.5">
          {c.checks.map((check, i) => (
            <CheckRow key={check} progress={progress} at={0.12 + i * 0.09}>
              {check}
            </CheckRow>
          ))}
        </ol>
      </div>

      <div className="mt-3">
        <p className="text-ui-overline text-gray-600">{c.listTitle}</p>
        <ul className="divide-y divide-gray-100">
          {c.vouchers.map((voucher, i) => (
            <SendRow key={voucher.title} progress={progress} voucher={voucher} index={i} />
          ))}
        </ul>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <motion.p style={{ opacity: allSent }} className="text-ui-label text-gray-700">
          {c.sentNote}
        </motion.p>
        <PressButton progress={progress} at={0.66}>
          {c.send}
        </PressButton>
      </div>
    </Card>
  );
}

/* ── A3 – closing the fiscal year ──────────────────────────────────────── */

export type FiscalYearDemoContent = {
  title: string;
  status: { idle: string; done: string };
  reports: string[];
  income: { title: string; rows: { label: string; amount: number }[]; result: string };
  balance: { title: string; assets: string; equity: string; amount: number; balanced: string };
  close: string;
  closedNote: string;
  annual: { title: string; status: string; hint: string };
};

export function FiscalYearDemo({ progress, content }: { progress: MotionValue<number>; content: FiscalYearDemoContent }) {
  const titleId = useId();
  const c = content;
  const incomeTick = useTransform(progress, [0.06, 0.3], [0, 1], { ease: smooth });
  const result = c.income.rows.reduce((sum, row) => sum + row.amount, 0);
  const resultText = useTransform(incomeTick, (v) => money(Math.round(result * v)));
  const balanceTick = useTransform(progress, [0.24, 0.44], [0, 1], { ease: smooth });
  const balanceText = useTransform(balanceTick, (v) => money(Math.round(c.balance.amount * v)));
  const balanced = useStep(progress, 0.44, 0.5);
  const closed = useStep(progress, 0.62, 0.68);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={closed} idle={c.status.idle} done={c.status.done} />}>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={c.reports.join(', ')}>
        {c.reports.map((report, i) => (
          <li key={report} className={`text-ui-label px-2.5 py-0.5 ${RADIUS.control} ${i === 0 ? 'bg-black text-white' : 'border border-gray-200 text-gray-700'}`}>
            {report}
          </li>
        ))}
      </ul>

      <div className={`mt-3 border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label font-semibold text-black">{c.income.title}</p>
        <dl className="mt-1 space-y-1 tabular-nums">
          {c.income.rows.map((row) => (
            <div key={row.label} className="text-ui-label flex justify-between gap-3 text-gray-700">
              <dt>{row.label}</dt>
              <dd>{money(row.amount)}</dd>
            </div>
          ))}
          <div className="text-ui-body flex justify-between gap-3 border-t border-gray-100 pt-1 font-semibold text-black">
            <dt>{c.income.result}</dt>
            <dd>
              <motion.span>{resultText}</motion.span>
            </dd>
          </div>
        </dl>
      </div>

      <div className={`mt-2 border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-ui-label font-semibold text-black">{c.balance.title}</p>
          <motion.span style={{ opacity: balanced }} className={`text-ui-label inline-flex items-center gap-1 bg-teal-light px-2 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>
            <CheckMark />
            {c.balance.balanced}
          </motion.span>
        </div>
        <dl className="mt-1 space-y-1 tabular-nums">
          <div className="text-ui-label flex justify-between gap-3 text-gray-700">
            <dt>{c.balance.assets}</dt>
            <dd>
              <motion.span>{balanceText}</motion.span>
            </dd>
          </div>
          <div className="text-ui-label flex justify-between gap-3 text-gray-700">
            <dt>{c.balance.equity}</dt>
            <dd>
              <motion.span>{balanceText}</motion.span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-3">
        <PressButton progress={progress} at={0.58} full>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          {c.close}
        </PressButton>
        <Reveal progress={progress} from={0.66} to={0.72} className="text-ui-label mt-1.5 px-1 text-gray-700">
          {c.closedNote}
        </Reveal>
      </div>

      <Reveal progress={progress} from={0.76} to={0.84} className={`mt-3 border border-dashed border-gray-400 bg-gray-50 px-3.5 py-2.5 ${RADIUS.field}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-ui-body font-semibold">{c.annual.title}</p>
          <span className={`text-ui-label bg-gray-200 px-2.5 py-0.5 text-gray-800 ${RADIUS.control}`}>{c.annual.status}</span>
        </div>
        <p className="text-ui-label mt-1 text-gray-700">{c.annual.hint}</p>
      </Reveal>
    </Card>
  );
}

/** Portal's own responsibility sentence, set as a quiet note next to a demo. */
export function ResponsibilityNote({ lead, text }: { lead: string; text: string }) {
  return (
    <p className={`border-l-2 border-teal-dark bg-surface-stone px-4 py-3 text-sm leading-relaxed text-gray-800 ${RADIUS.field}`}>
      <span className="font-semibold">{lead}</span> {text}
    </p>
  );
}

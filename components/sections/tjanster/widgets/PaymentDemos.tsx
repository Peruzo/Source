'use client';

import { useId, type ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { CARD_EDGE, RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import {
  Box,
  Card,
  CheckMark,
  PressButton,
  StatusPill,
  money,
  useStep,
} from '@/components/sections/tjanster/widgets/CampaignDemos';

/*
 * Scroll-driven demos for /tjanster/betalningar. Same contract as CampaignDemos and
 * BookkeepingDemos: each takes the scene's progress (0 → 1, from ScrollScene), only
 * opacity, transforms and text change while it plays, every box keeps its size from the
 * first frame, and at 1 the demo rests in its final state – which is also what reduced
 * motion shows.
 *
 * The flows follow the customer portal: a payment link is a Stripe Payment Link the
 * business copies and shares itself, a subscription is a product with an interval paid by
 * card, and a refund covers the whole payment or chosen lines. No card brands, no totals
 * or key figures – the amounts are a fictional shop's prices.
 */

/* ── Shared pieces ──────────────────────────────────────────────────────── */

/** A check box that fills in at `at`, with its label always readable. */
function CheckOption({ progress, at, children }: { progress: MotionValue<number>; at: number; children: ReactNode }) {
  const on = useStep(progress, at, at + 0.05);
  return (
    <li className="flex items-center gap-2.5 py-1.5">
      <span className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center border border-gray-400 ${RADIUS.field}`} aria-hidden="true">
        <motion.span style={{ opacity: on }} className={`absolute inset-[-1px] flex items-center justify-center bg-teal-dark text-white ${RADIUS.field}`}>
          <CheckMark />
        </motion.span>
      </span>
      <span className="text-ui-body text-black">{children}</span>
    </li>
  );
}

/** Two labels in one spot, the second fading in over the first. */
export function Swap({ show, from, to }: { show: MotionValue<number>; from: ReactNode; to: ReactNode }) {
  const hide = useTransform(show, (v) => 1 - v);
  return (
    <span className="inline-grid">
      <motion.span style={{ opacity: hide }} className="col-start-1 row-start-1" aria-hidden="true">
        {from}
      </motion.span>
      <motion.span style={{ opacity: show }} className="col-start-1 row-start-1">
        {to}
      </motion.span>
    </span>
  );
}

/** A segmented control look-alike; the chosen option fills in at `at`. Illustration, not a control. */
export function Segments({ progress, at, options, selected }: { progress: MotionValue<number>; at: number; options: string[]; selected: string }) {
  const on = useStep(progress, at, at + 0.05);
  return (
    <div className={`grid border border-gray-300 p-1 ${RADIUS.control}`} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <span key={option} className={`text-ui-label relative py-1 text-center ${RADIUS.control}`}>
          {option === selected ? (
            <motion.span style={{ opacity: on }} className={`absolute inset-0 bg-teal-dark ${RADIUS.control}`} aria-hidden="true" />
          ) : null}
          <span className="relative">
            {option === selected ? <Swap show={on} from={<span className="text-black">{option}</span>} to={<span className="font-semibold text-white">{option}</span>} /> : <span className="text-black">{option}</span>}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── Betalningslänk ─────────────────────────────────────────────────────── */

export type PaymentLinkDemoContent = {
  title: string;
  status: { idle: string; done: string };
  product: { label: string; value: string };
  options: string[];
  create: string;
  link: { label: string; value: string; copy: string };
  listTitle: string;
  row: string;
};

export function PaymentLinkDemo({ progress, content }: { progress: MotionValue<number>; content: PaymentLinkDemoContent }) {
  const titleId = useId();
  const c = content;
  const linkIn = useStep(progress, 0.5, 0.58);
  const rowIn = useStep(progress, 0.7, 0.76);
  const paid = useStep(progress, 0.84, 0.9);

  return (
    <Card titleId={titleId} title={c.title}>
      <Box label={c.product.label} className="mt-3">
        {c.product.value}
      </Box>
      <ul className="mt-2">
        {c.options.map((option, i) => (
          <CheckOption key={option} progress={progress} at={0.1 + i * 0.09}>
            {option}
          </CheckOption>
        ))}
      </ul>
      <div className="mt-2">
        <PressButton progress={progress} at={0.44} full>
          {c.create}
        </PressButton>
      </div>

      <motion.div style={{ opacity: linkIn }} className={`mt-3 flex items-center justify-between gap-3 bg-gray-50 px-3.5 py-2 ${RADIUS.field}`}>
        <span className="min-w-0">
          <span className="text-ui-label block text-gray-600">{c.link.label}</span>
          <span className="text-ui-body block truncate">{c.link.value}</span>
        </span>
        <PressButton progress={progress} at={0.64}>
          {c.link.copy}
        </PressButton>
      </motion.div>

      <motion.div style={{ opacity: rowIn }} className="mt-3">
        <p className="text-ui-overline text-gray-600">{c.listTitle}</p>
        <div className="mt-1 flex items-center justify-between gap-3 border-t border-gray-100 py-2">
          <span className="text-ui-body min-w-0 truncate">{c.row}</span>
          <StatusPill show={paid} idle={c.status.idle} done={c.status.done} />
        </div>
      </motion.div>
    </Card>
  );
}

/* ── Prenumerationer ───────────────────────────────────────────────────── */

export type SubscriptionDemoContent = {
  title: string;
  status: { idle: string; done: string };
  product: { label: string; value: string };
  intervalLabel: string;
  intervals: string[];
  selected: string;
  method: { label: string; value: string };
  save: string;
  listTitle: string;
  customer: string;
  active: string;
  paused: string;
  actions: string[];
};

export function SubscriptionDemo({ progress, content }: { progress: MotionValue<number>; content: SubscriptionDemoContent }) {
  const titleId = useId();
  const c = content;
  const saved = useStep(progress, 0.42, 0.48);
  const listIn = useStep(progress, 0.54, 0.6);
  const paused = useStep(progress, 0.82, 0.88);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={saved} idle={c.status.idle} done={c.status.done} />}>
      <Box label={c.product.label} className="mt-3">
        {c.product.value}
      </Box>
      <div className="mt-2">
        <p className="text-ui-label mb-1 text-gray-600">{c.intervalLabel}</p>
        <Segments progress={progress} at={0.14} options={c.intervals} selected={c.selected} />
      </div>
      <Box label={c.method.label} className="mt-2">
        {c.method.value}
      </Box>
      <div className="mt-3">
        <PressButton progress={progress} at={0.38} full>
          {c.save}
        </PressButton>
      </div>

      <motion.div style={{ opacity: listIn }} className="mt-3">
        <p className="text-ui-overline text-gray-600">{c.listTitle}</p>
        <div className="mt-1 border-t border-gray-100 pt-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-ui-body min-w-0 truncate">{c.customer}</span>
            <span className={`text-ui-label whitespace-nowrap bg-gray-100 px-2.5 py-0.5 text-gray-800 ${RADIUS.control}`}>
              <Swap show={paused} from={c.active} to={c.paused} />
            </span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {c.actions.map((action, i) => (
              <li key={action}>
                {i === 0 ? (
                  <PressButton progress={progress} at={0.78}>
                    {action}
                  </PressButton>
                ) : (
                  <span className={`text-ui-label inline-flex border border-gray-300 px-3 py-1.5 text-black ${RADIUS.control}`}>{action}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Card>
  );
}

/* ── Alla betalningar och återbetalning ────────────────────────────────── */

export type PaymentsRefundDemoContent = {
  title: string;
  periods: string[];
  selectedPeriod: string;
  rows: { id: string; customer: string; amount: number; status: string }[];
  receipt: string;
  refund: {
    title: string;
    lines: { label: string; amount: number; checked: boolean }[];
    button: string;
    done: string;
  };
};

export function PaymentsRefundDemo({ progress, content }: { progress: MotionValue<number>; content: PaymentsRefundDemoContent }) {
  const titleId = useId();
  const c = content;
  const chosen = useStep(progress, 0.3, 0.36);
  const refundIn = useStep(progress, 0.4, 0.48);
  const refunded = useStep(progress, 0.8, 0.86);

  return (
    <Card titleId={titleId} title={c.title}>
      <div className="mt-3">
        <Segments progress={progress} at={0.06} options={c.periods} selected={c.selectedPeriod} />
      </div>

      <ul className="mt-3 divide-y divide-gray-100 border-y border-gray-100">
        {c.rows.map((row, i) => (
          <li key={row.id} className="relative flex items-center gap-3 py-2">
            {i === 0 ? (
              <motion.span style={{ opacity: chosen }} className={`absolute inset-y-0.5 -inset-x-2 bg-teal-light ${RADIUS.field}`} aria-hidden="true" />
            ) : null}
            <span className="text-ui-body relative min-w-0 flex-1 truncate">{row.customer}</span>
            <span className="text-ui-body relative whitespace-nowrap tabular-nums">{money(row.amount)}</span>
            {/* Narrow cards keep the status column small and let "Delvis återbetald" wrap; the Swap
                layers share one grid cell, so the row is as tall as the longer label from the start. */}
            <span className="text-ui-label relative w-[5.5rem] flex-shrink-0 text-right leading-tight @sm:w-[7.5rem]">
              {i === 0 ? (
                <Swap show={refunded} from={<span className="text-gray-700">{row.status}</span>} to={<span className="font-semibold text-teal-darker">{c.refund.done}</span>} />
              ) : (
                <span className="text-gray-700">{row.status}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <motion.div style={{ opacity: refundIn }} className={`mt-3 border border-gray-200 bg-white px-3.5 py-2.5 ${RADIUS.field}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-ui-label font-semibold text-black">{c.refund.title}</p>
          <span className={`text-ui-label border border-gray-300 px-2.5 py-0.5 text-gray-800 ${RADIUS.control}`}>{c.receipt}</span>
        </div>
        <ul className="mt-1">
          {c.refund.lines.map((line) => (
            <li key={line.label} className="flex items-center justify-between gap-3">
              {line.checked ? (
                <CheckOptionInline progress={progress} at={0.56}>
                  {line.label}
                </CheckOptionInline>
              ) : (
                <span className="flex items-center gap-2.5 py-1.5">
                  <span className={`h-5 w-5 flex-shrink-0 border border-gray-400 ${RADIUS.field}`} aria-hidden="true" />
                  <span className="text-ui-body text-black">{line.label}</span>
                </span>
              )}
              <span className="text-ui-body whitespace-nowrap tabular-nums text-gray-700">{money(line.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <PressButton progress={progress} at={0.74} full>
            {c.refund.button}
          </PressButton>
        </div>
      </motion.div>
    </Card>
  );
}

/** CheckOption without the list item, for rows that carry an amount beside it. */
function CheckOptionInline({ progress, at, children }: { progress: MotionValue<number>; at: number; children: ReactNode }) {
  const on = useStep(progress, at, at + 0.05);
  return (
    <span className="flex items-center gap-2.5 py-1.5">
      <span className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center border border-gray-400 ${RADIUS.field}`} aria-hidden="true">
        <motion.span style={{ opacity: on }} className={`absolute inset-[-1px] flex items-center justify-center bg-teal-dark text-white ${RADIUS.field}`}>
          <CheckMark />
        </motion.span>
      </span>
      <span className="text-ui-body text-black">{children}</span>
    </span>
  );
}

/* ── Fotosektionen Fakturor: steg 3 ────────────────────────────────────── */

export type InvoicePaidCardContent = {
  title: string;
  recipient: string;
  status: { unpaid: string; paid: string };
  link: string;
  markPaid: string;
};

/**
 * A paid invoice: the step card for "Se när den är betald" in the Fakturor photo
 * section. Static – StickySteps swaps its cards itself. `active` false shows it unpaid.
 */
export function InvoicePaidCard({ content, active = true }: { content: InvoicePaidCardContent; active?: boolean }) {
  const titleId = useId();
  const c = content;
  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-5 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-ui-title">
          {c.title}
        </h3>
        {active ? (
          <span className={`text-ui-label inline-flex items-center gap-1 bg-teal-light px-2.5 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>
            <CheckMark />
            {c.status.paid}
          </span>
        ) : (
          <span className={`text-ui-label bg-gray-100 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>{c.status.unpaid}</span>
        )}
      </div>
      <p className="text-ui-body mt-1 text-gray-700">{c.recipient}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`text-ui-label border border-gray-300 px-3 py-1.5 ${RADIUS.control}`}>{c.link}</span>
        <span className={`text-ui-label border border-gray-300 px-3 py-1.5 ${RADIUS.control}`}>{c.markPaid}</span>
      </div>
    </div>
  );
}

'use client';

import { useId, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { usePinnedScrollHint } from '@/components/ui/ScrollHint';
import {
  Box,
  Card,
  Carton,
  CheckMark,
  PressButton,
  StatusPill,
  useStep,
} from '@/components/sections/tjanster/widgets/CampaignDemos';

/** Whole kronor, as the portal shows shipping prices: "59 kr". */
const money = (amount: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);

/*
 * The main scene of /logistik: the whole delivery flow, from the customer's
 * choice in the checkout to the tracking email, as five real UI cards.
 *
 * From `lg` the section is 520svh tall and a one-screen frame pins to the top.
 * The five steps sit in three columns (checkout · order and booking · label and
 * email) under a numbered rail; scrolling plays them one after another, and each
 * step rests in its final state once the next one starts. Scroll is never taken
 * over – only position is read.
 *
 * Below `lg` nothing pins: the cards are stacked, and each plays while it scrolls
 * into view. Under reduced motion there is no pinning at any width and every
 * card is shown in its final state.
 *
 * Only opacity, transforms and text change while it plays, so no box moves the
 * layout. One calm easing curve (from useStep), no springs, nothing loops.
 */

export type DeliveryOption = { label: string; price: number };

export type LogisticsFlowContent = {
  eyebrow: string;
  title: string;
  intro: string;
  label: string;
  steps: [string, string, string, string, string];
  checkout: {
    title: string;
    options: DeliveryOption[];
    selected: number;
    cart: { label: string; amount: number };
    freeShipping: { label: string; threshold: number; applied: string };
  };
  order: {
    title: string;
    status: { idle: string; done: string };
    rows: [string, string][];
  };
  booking: {
    title: string;
    status: { idle: string; done: string };
    profile: { label: string; value: string };
    button: string;
    note: string;
  };
  shippingLabel: {
    title: string;
    file: string;
    download: string;
  };
  mail: {
    title: string;
    subject: string;
    trackingLabel: string;
    button: string;
    to: string;
    /** Only when automatic status updates from PostNord are on – see FLAGGOR in the data file. */
    statuses?: string[];
  };
};

/* ── The five step cards ─────────────────────────────────────────────── */

function CheckoutStep({ p, c }: { p: MotionValue<number>; c: LogisticsFlowContent['checkout'] }) {
  const titleId = useId();
  const choose = useStep(p, 0.15, 0.35);
  const cartIn = useStep(p, 0.45, 0.6);
  const free = useStep(p, 0.65, 0.85);
  return (
    <Card titleId={titleId} title={c.title}>
      <ul className="mt-3 space-y-1.5" aria-label={c.title}>
        {c.options.map((option, i) => (
          <OptionRow key={option.label} option={option} chosen={i === c.selected ? choose : null} free={i === c.selected ? free : null} freeLabel={c.freeShipping.applied} />
        ))}
      </ul>
      <motion.div style={{ opacity: cartIn }} className={`mt-3 flex items-center justify-between gap-3 bg-gray-50 px-3 py-2 ${RADIUS.field}`}>
        <span className="text-ui-label text-gray-700">{c.cart.label}</span>
        <span className="text-ui-body tabular-nums">{money(c.cart.amount)}</span>
      </motion.div>
      <motion.p style={{ opacity: free }} className="text-ui-label mt-2 flex items-center gap-1 font-semibold text-teal-darker">
        <CheckMark />
        {c.freeShipping.label} {money(c.freeShipping.threshold)}
      </motion.p>
    </Card>
  );
}

function OptionRow({ option, chosen, free, freeLabel }: { option: DeliveryOption; chosen: MotionValue<number> | null; free: MotionValue<number> | null; freeLabel: string }) {
  const none = useMotionValue(0);
  const on = chosen ?? none;
  const freeOn = free ?? none;
  const priceOpacity = useTransform(freeOn, (v) => 1 - v * 0.55);
  return (
    <li className={`relative flex items-center gap-2.5 border border-gray-200 px-3 py-2 ${RADIUS.field}`}>
      <motion.span aria-hidden="true" style={{ opacity: on }} className={`pointer-events-none absolute inset-[-1px] border-2 border-teal-dark ${RADIUS.field}`} />
      <span className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-gray-400">
        <motion.span style={{ opacity: on, scale: on }} className="h-2 w-2 rounded-full bg-teal-dark" />
      </span>
      <span className="text-ui-label min-w-0 flex-1 truncate text-black">{option.label}</span>
      <span className="text-ui-label flex flex-shrink-0 items-center gap-1.5 text-right tabular-nums">
        {chosen ? (
          <motion.span style={{ opacity: freeOn }} className="font-semibold text-teal-darker">
            {freeLabel}
          </motion.span>
        ) : null}
        <motion.span style={{ opacity: priceOpacity }}>
          {chosen ? <FreeStrike free={freeOn}>{money(option.price)}</FreeStrike> : money(option.price)}
        </motion.span>
      </span>
    </li>
  );
}

function FreeStrike({ free, children }: { free: MotionValue<number>; children: ReactNode }) {
  return (
    <span className="relative">
      {children}
      <motion.span aria-hidden="true" style={{ scaleX: free }} className="absolute left-0 right-0 top-1/2 h-px origin-left bg-current" />
    </span>
  );
}

function OrderStep({ p, c }: { p: MotionValue<number>; c: LogisticsFlowContent['order'] }) {
  const titleId = useId();
  const arrive = useStep(p, 0.1, 0.5);
  const y = useTransform(arrive, [0, 1], [-10, 0]);
  const opacity = useTransform(arrive, [0, 1], [0.35, 1]);
  const done = useStep(p, 0.55, 0.75);
  return (
    <motion.div style={{ opacity, y }}>
      <Card titleId={titleId} title={c.title} badge={<StatusPill show={done} idle={c.status.idle} done={c.status.done} />}>
        <dl className="mt-3 space-y-1.5">
          {c.rows.map(([label, value]) => (
            <div key={label} className="text-ui-label flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-gray-600">{label}</dt>
              <dd className="flex items-center gap-2 text-right text-black">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </motion.div>
  );
}

function BookingStep({ p, c }: { p: MotionValue<number>; c: LogisticsFlowContent['booking'] }) {
  const titleId = useId();
  const booked = useStep(p, 0.55, 0.7);
  const note = useStep(p, 0.7, 0.85);
  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={booked} idle={c.status.idle} done={c.status.done} />}>
      <Box label={c.profile.label} className="mt-3">
        <span className="flex items-start gap-2">
          <Carton className="h-5 w-5 flex-shrink-0" />
          <span>{c.profile.value}</span>
        </span>
      </Box>
      <div className="mt-3">
        <PressButton progress={p} at={0.45} full>
          {c.button}
        </PressButton>
      </div>
      <motion.p style={{ opacity: note }} className="text-ui-label mt-2 text-gray-700">
        {c.note}
      </motion.p>
    </Card>
  );
}

const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3];

function LabelStep({ p, c }: { p: MotionValue<number>; c: LogisticsFlowContent['shippingLabel'] }) {
  const titleId = useId();
  const sheet = useStep(p, 0.05, 0.3);
  const bars = useStep(p, 0.3, 0.7);
  const download = useStep(p, 0.7, 0.85);
  const sheetY = useTransform(sheet, [0, 1], [12, 0]);
  return (
    <Card titleId={titleId} title={c.title}>
      {/* The label as a shape only: no address, no number – it stands for the PDF. */}
      <motion.div style={{ opacity: sheet, y: sheetY }} aria-hidden="true" className={`mt-3 border border-gray-200 bg-white p-3 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.5)] ${RADIUS.field}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-1.5 w-20 rounded-full bg-gray-300" />
            <div className="h-1.5 w-14 rounded-full bg-gray-200" />
            <div className="h-1.5 w-16 rounded-full bg-gray-200" />
          </div>
          <span className={`text-ui-label bg-gray-900 px-2 py-0.5 font-semibold text-white ${RADIUS.control}`}>PDF</span>
        </div>
        <motion.div style={{ scaleY: bars }} className="mt-3 flex h-10 origin-bottom items-end gap-[2px]">
          {BARS.map((w, i) => (
            <span key={i} className="h-full bg-gray-900" style={{ width: `${w + 1}px` }} />
          ))}
        </motion.div>
      </motion.div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-ui-label truncate text-gray-700">{c.file}</span>
        <motion.span style={{ opacity: download }} className={`text-ui-label inline-flex flex-shrink-0 items-center gap-1 border border-gray-300 bg-white px-3 py-1 ${RADIUS.control}`}>
          {c.download}
        </motion.span>
      </div>
    </Card>
  );
}

function MailStep({ p, c }: { p: MotionValue<number>; c: LogisticsFlowContent['mail'] }) {
  const titleId = useId();
  const arrive = useStep(p, 0.1, 0.4);
  const tracking = useStep(p, 0.4, 0.6);
  const button = useStep(p, 0.6, 0.8);
  const y = useTransform(arrive, [0, 1], [10, 0]);
  return (
    <Card titleId={titleId} title={c.title}>
      <motion.div style={{ opacity: arrive, y }} className={`mt-3 border border-gray-200 bg-gray-50 p-3 ${RADIUS.field}`}>
        <p className="text-ui-label text-gray-600">{c.to}</p>
        <p className="text-ui-body mt-1 font-semibold">{c.subject}</p>
        <motion.div style={{ opacity: tracking }} className="mt-2 flex items-center justify-between gap-3">
          <span className="text-ui-label text-gray-600">{c.trackingLabel}</span>
          <span aria-hidden="true" className="h-2 w-24 rounded-full bg-gray-300" />
        </motion.div>
        <motion.span style={{ opacity: button }} className={`text-ui-label mt-3 inline-flex bg-black px-3 py-1 text-white ${RADIUS.control}`}>
          {c.button}
        </motion.span>
        {c.statuses?.length ? (
          <ol className="mt-3 flex flex-wrap gap-1.5">
            {c.statuses.map((s) => (
              <li key={s} className={`text-ui-label bg-teal-light px-2 py-0.5 text-teal-darker ${RADIUS.control}`}>{s}</li>
            ))}
          </ol>
        ) : null}
      </motion.div>
    </Card>
  );
}

/** The tracking email on its own, in its final state (S4 on /logistik). */
export function TrackingMailCard({ content }: { content: LogisticsFlowContent['mail'] }) {
  const done = useMotionValue(1);
  return <MailStep p={done} c={content} />;
}

/* ── Layout ──────────────────────────────────────────────────────────── */

type StepRender = (p: MotionValue<number>) => ReactNode;

/** A step card with its number; `active` lights a ring while this step plays (pinned only). */
function StepFrame({ index, name, active, children }: { index: number; name: string; active?: MotionValue<number>; children: ReactNode }) {
  return (
    <div className="relative">
      <p className="text-ui-label mb-2 flex items-center gap-2 font-semibold text-teal-dark">
        <span className={`flex h-5 w-5 items-center justify-center bg-teal-dark text-[11px] text-white ${RADIUS.control}`}>{index + 1}</span>
        {name}
      </p>
      <div className="relative">
        {active ? (
          <motion.span aria-hidden="true" style={{ opacity: active }} className={`pointer-events-none absolute -inset-1.5 z-10 ring-2 ring-teal/60 ${RADIUS.card}`} />
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Plays its child while the card scrolls into view (below lg). */
function SelfPlaying({ render, reduce }: { render: StepRender; reduce: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.95'] });
  const done = useMotionValue(1);
  return <div ref={ref}>{render(reduce ? done : scrollYProgress)}</div>;
}

function PinnedStep({ progress, index, name, render }: { progress: MotionValue<number>; index: number; name: string; render: StepRender }) {
  const from = index / 5;
  const to = (index + 1) / 5;
  const local = useTransform(progress, [from, to], [0, 1], { clamp: true });
  const active = useTransform(progress, [from - 0.02, from + 0.02, to - 0.02, to + 0.02], [0, 1, 1, 0], { clamp: true });
  return (
    <StepFrame index={index} name={name} active={active}>
      {render(local)}
    </StepFrame>
  );
}

function Rail({ progress, steps }: { progress: MotionValue<number>; steps: LogisticsFlowContent['steps'] }) {
  return (
    <div className="relative mx-auto mt-8 max-w-[68rem]" aria-hidden="true">
      <div className="absolute left-0 right-0 top-[9px] h-0.5 bg-gray-200" />
      <motion.div style={{ scaleX: progress }} className="absolute left-0 right-0 top-[9px] h-0.5 origin-left bg-teal-dark" />
      <ol className="relative grid grid-cols-5">
        {steps.map((s, i) => (
          <RailDot key={s} progress={progress} index={i} label={s} />
        ))}
      </ol>
    </div>
  );
}

function RailDot({ progress, index, label }: { progress: MotionValue<number>; index: number; label: string }) {
  const reached = useTransform(progress, [index / 5 - 0.01, index / 5 + 0.01], [0, 1], { clamp: true });
  return (
    <li className="flex flex-col items-center gap-2 text-center">
      <span className="relative h-5 w-5 rounded-full border-2 border-gray-300 bg-white">
        <motion.span style={{ opacity: reached }} className="absolute inset-[-2px] rounded-full border-2 border-teal-dark bg-teal-dark" />
      </span>
      <span className="text-ui-label text-gray-700">{label}</span>
    </li>
  );
}

export function LogisticsFlowSection({ content }: { content: LogisticsFlowContent }) {
  const c = content;
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { reveal, shouldReduceMotion } = useReveal();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0.06, 0.9], [0, 1], { clamp: true });
  const pinned = !shouldReduceMotion;
  usePinnedScrollHint(trackRef, pinned);

  const renders: StepRender[] = [
    (p) => <CheckoutStep p={p} c={c.checkout} />,
    (p) => <OrderStep p={p} c={c.order} />,
    (p) => <BookingStep p={p} c={c.booking} />,
    (p) => <LabelStep p={p} c={c.shippingLabel} />,
    (p) => <MailStep p={p} c={c.mail} />,
  ];

  const header = (withId: boolean) => (
    <div className="mx-auto max-w-[44rem] text-center">
      <p className="text-overline mb-4 text-teal-dark">{c.eyebrow}</p>
      <h2 id={withId ? headingId : undefined} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
        {c.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">{c.intro}</p>
    </div>
  );

  // Three columns: checkout · order and booking · label and email.
  const columns = [[0], [1, 2], [3, 4]];

  return (
    <section id="bokningsflode" aria-labelledby={headingId} className="relative bg-surface-stone">
      {pinned ? (
        <div ref={trackRef} className="hidden lg:block" style={{ height: '520svh' }}>
          <div className="sticky top-0 mx-auto flex h-[100svh] max-w-[1360px] flex-col px-10 pb-8 pt-24 xl:px-20">
            {header(true)}
            <Rail progress={progress} steps={c.steps} />
            <div role="group" aria-label={c.label} className="mt-8 grid flex-1 grid-cols-3 items-start gap-6">
              {columns.map((col, k) => (
                <div key={k} className="space-y-5">
                  {col.map((i) => (
                    <PinnedStep key={i} progress={progress} index={i} name={c.steps[i]} render={renders[i]} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Unpinned: below lg, and at every width under reduced motion. */}
      <div className={`mx-auto max-w-[1360px] px-6 py-20 md:px-10 md:py-28 lg:px-20 ${pinned ? 'lg:hidden' : ''}`}>
        <motion.div {...reveal(0)}>{header(!pinned)}</motion.div>
        <div role="group" aria-label={c.label} className="mx-auto mt-10 grid max-w-[26rem] gap-8 lg:max-w-none lg:grid-cols-3 lg:items-start lg:gap-6">
          {columns.map((col, k) => (
            <div key={k} className="space-y-8 lg:space-y-5">
              {col.map((i) => (
                <StepFrame key={i} index={i} name={c.steps[i]}>
                  <SelfPlaying render={renders[i]} reduce={shouldReduceMotion} />
                </StepFrame>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import { Box, Card, CheckMark, PressButton, StatusPill, useStep } from '@/components/sections/tjanster/widgets/CampaignDemos';
import { Segments, Swap } from '@/components/sections/tjanster/widgets/PaymentDemos';

/*
 * Demos for /bokningssystem. The scroll-driven ones follow the same contract as
 * CampaignDemos: progress 0 → 1 from ScrollScene, only opacity, transforms and text change,
 * boxes keep their size, and at 1 the demo rests in its final state (what reduced motion
 * shows). The static cards are for the photo sections, which StickySteps and
 * ServiceFullBleed animate themselves.
 *
 * Only what works in the portal is shown: the day view with a timeline (no week view),
 * approve, check-in, a new booking from the portal, and payment at booking by card. No
 * reminders, no SMS, nothing in real time.
 */

/* ── Dagen i portalen ──────────────────────────────────────────────────── */

export type DayTimelineDemoContent = {
  title: string;
  /** Labels under the strip, evenly spread over the day it shows. */
  hours: string[];
  bookings: {
    id: string;
    time: string;
    name: string;
    service: string;
    /** Start and length as a share of the strip, 0–1. */
    start: number;
    length: number;
    /** Status before and after the demo; equal for a booking that does not change. */
    from: string;
    to: string;
    /** What the demo does to this booking, if anything. */
    action?: 'approve' | 'checkIn';
  }[];
  approve: string;
  checkIn: string;
  add: string;
};

export function DayTimelineDemo({ progress, content }: { progress: MotionValue<number>; content: DayTimelineDemoContent }) {
  const titleId = useId();
  const c = content;
  const approved = useStep(progress, 0.36, 0.42);
  const arrived = useStep(progress, 0.64, 0.7);
  const rows = [...c.bookings].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Card titleId={titleId} title={c.title}>
      {/* The day as a strip: one block per booking. */}
      <div className="mt-3" aria-hidden="true">
        <div className={`relative h-8 overflow-hidden bg-gray-50 ${RADIUS.field}`}>
          {c.bookings.map((b) => (
            <span
              key={b.id}
              className={`absolute inset-y-1.5 bg-teal-dark/80 ${RADIUS.control}`}
              style={{ left: `${b.start * 100}%`, width: `${Math.max(b.length * 100, 3)}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between">
          {c.hours.map((h) => (
            <span key={h} className="text-[0.75rem] tabular-nums text-gray-600">
              {h}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-3 divide-y divide-gray-100 border-y border-gray-100">
        {rows.map((b) => {
          const changes = Boolean(b.action) && b.from !== b.to;
          const isApproval = b.action === 'approve';
          const show = isApproval ? approved : arrived;
          return (
            <li key={b.id} className="py-2">
              <div className="flex items-start gap-3">
                <span className="text-ui-body w-12 flex-shrink-0 tabular-nums text-gray-700">{b.time}</span>
                <span className="min-w-0 flex-1">
                  <span className="text-ui-body block truncate">{b.name}</span>
                  <span className="text-ui-label block truncate text-gray-600">{b.service}</span>
                </span>
                <span className={`text-ui-label whitespace-nowrap bg-gray-100 px-2.5 py-0.5 text-gray-800 ${RADIUS.control}`}>
                  {changes ? <Swap show={show} from={b.from} to={b.to} /> : b.to}
                </span>
              </div>
              {changes ? (
                <div className="mt-1.5 pl-[3.75rem]">
                  <PressButton progress={progress} at={isApproval ? 0.32 : 0.6}>
                    {isApproval ? c.approve : c.checkIn}
                  </PressButton>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex justify-end">
        <PressButton progress={progress} at={0.88}>
          {c.add}
        </PressButton>
      </div>
    </Card>
  );
}

/* ── Betalning vid bokning ─────────────────────────────────────────────── */

export type BookingPaymentDemoContent = {
  title: string;
  toggle: string;
  typeLabel: string;
  types: string[];
  selected: string;
  method: { label: string; value: string };
  booking: { name: string; service: string };
  paid: string;
  status: { idle: string; done: string };
};

/** A switch look-alike that turns on at `at`. Illustration, not a control. */
function Toggle({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const on = useStep(progress, at, at + 0.06);
  const x = useTransform(on, [0, 1], [0, 16]);
  return (
    <span className="relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full bg-gray-300" aria-hidden="true">
      <motion.span style={{ opacity: on }} className="absolute inset-0 rounded-full bg-teal-dark" />
      <motion.span style={{ x }} className="relative ml-1 h-4 w-4 rounded-full bg-white shadow" />
    </span>
  );
}

export function BookingPaymentDemo({ progress, content }: { progress: MotionValue<number>; content: BookingPaymentDemoContent }) {
  const titleId = useId();
  const c = content;
  const bookingIn = useStep(progress, 0.5, 0.56);
  const paid = useStep(progress, 0.7, 0.76);
  const confirmed = useStep(progress, 0.82, 0.88);

  return (
    <Card titleId={titleId} title={c.title}>
      <div className={`mt-3 flex items-center justify-between gap-3 border border-gray-200 px-3.5 py-2.5 ${RADIUS.field}`}>
        <span className="text-ui-body">{c.toggle}</span>
        <Toggle progress={progress} at={0.08} />
      </div>
      <div className="mt-2">
        <p className="text-ui-label mb-1 text-gray-600">{c.typeLabel}</p>
        <Segments progress={progress} at={0.22} options={c.types} selected={c.selected} />
      </div>
      <Box label={c.method.label} className="mt-2">
        {c.method.value}
      </Box>

      <motion.div style={{ opacity: bookingIn }} className={`mt-3 bg-gray-50 px-3.5 py-2.5 ${RADIUS.field}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0">
            <span className="text-ui-body block truncate">{c.booking.name}</span>
            <span className="text-ui-label block truncate text-gray-600">{c.booking.service}</span>
          </span>
          <StatusPill show={confirmed} idle={c.status.idle} done={c.status.done} />
        </div>
        <motion.p style={{ opacity: paid }} className="text-ui-label mt-1.5 flex items-center gap-1 font-semibold text-teal-darker">
          <CheckMark />
          {c.paid}
        </motion.p>
      </motion.div>
    </Card>
  );
}

/* ── Static cards for the photo sections ───────────────────────────────── */

export type SettingsCardContent = { title: string; rows: { label: string; value: string }[] };

/** A settings card from the portal: a title and label–value rows. */
export function SettingsCard({ content }: { content: SettingsCardContent }) {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-5 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <dl className="mt-3 divide-y divide-gray-100 border-y border-gray-100">
        {content.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-ui-label text-gray-600">{row.label}</dt>
            <dd className="text-ui-body text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export type BookingTimeCardContent = {
  /** Accessible name for the floating card (ServiceFullBleedCard.label). */
  label: string;
  title: string;
  details: string;
  times: string[];
  selected: string;
};

/**
 * The floating card in the Tjänster och tider photo section: one service and three free
 * times, one of them chosen. Compact on purpose – on a phone the card spans the photo, so it
 * has to fit in the band under the hands.
 */
export function BookingTimeCard({ content }: { content: BookingTimeCardContent }) {
  const titleId = useId();
  const c = content;
  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-ui-title">
          {c.title}
        </h3>
        <span className="text-ui-label text-gray-600">{c.details}</span>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2" aria-label={`${c.title}, lediga tider`}>
        {c.times.map((t) => (
          <li
            key={t}
            className={`text-ui-body border py-1 text-center tabular-nums ${RADIUS.control} ${
              t === c.selected ? 'border-teal-dark bg-teal-dark font-semibold text-white' : 'border-gray-300 text-black'
            }`}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type BookingEmailCardContent = { title: string; from: string; text: string; cancelLink: string; policy: string };

/** The booking confirmation e-mail with its cancel link and the cancellation rule under it. */
export function BookingEmailCard({ content }: { content: BookingEmailCardContent }) {
  const titleId = useId();
  const c = content;
  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-5 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title flex items-center gap-2">
        <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
        {c.title}
      </h3>
      <p className="text-ui-label text-gray-600">{c.from}</p>
      <p className="text-ui-body mt-2">{c.text}</p>
      <p className="text-ui-body mt-2 font-semibold text-teal-dark underline underline-offset-2">{c.cancelLink}</p>
      <p className={`text-ui-label mt-3 bg-gray-50 px-3 py-2 text-gray-700 ${RADIUS.field}`}>{c.policy}</p>
    </div>
  );
}

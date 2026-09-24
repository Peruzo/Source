'use client';

import { useId, useState } from 'react';
import type {
  IncomingPaymentsContent,
  Interval,
  NewSubscriptionContent,
  TiersContent,
} from './content';
import type { summarize } from './content';
import { Field, RADIUS, formatMoney } from '../payment-cards/primitives';

/*
 * The subscription widgets – the running side of a subscription business:
 * money coming in, who pays for what, and adding one more. Built from the
 * payment-cards primitives (radii card 24 / field 12 / control pill,
 * `.text-ui-*`) like the other panels.
 *
 * The interval is the one piece of state, so it is a real radio group.
 * Everything else that looks like a control is illustration, not focusable.
 * Every widget fills the box it is given and knows nothing about the page,
 * so each can be rendered on its own (Remotion texture).
 */

type MoneyFormat = { currency: string; locale: string };
type Summary = ReturnType<typeof summarize>;

/**
 * 1 – Incoming payments: this month's recurring revenue, active subscribers
 * and the upcoming autogiro runs. `charges={false}` drops the run list for
 * the smallest box.
 */
export function IncomingPayments({
  content,
  summary,
  charges = true,
  currency,
  locale,
}: {
  content: IncomingPaymentsContent;
  summary: Summary;
  charges?: boolean;
} & MoneyFormat) {
  const titleId = useId();
  const count = new Intl.NumberFormat(locale);

  return (
    <div role="group" aria-labelledby={titleId} className="w-full text-left text-black">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-ui-body font-semibold">
          {content.title}
        </h3>
        <p className="text-ui-label text-gray-600">{content.periodLabel}</p>
      </div>

      <p className="text-ui-amount mt-1 tabular-nums">{formatMoney(summary.total, currency, locale)}</p>
      <p className="text-ui-label mt-1 text-gray-600">
        <span className="tabular-nums text-black">{count.format(summary.active)}</span> {content.activeLabel}
      </p>

      {charges ? (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-ui-label font-semibold text-gray-600">{content.upcomingLabel}</p>
            {/* TODO: verifiera att autogiro faktiskt stöds */}
            <span
              className={`text-ui-label inline-flex items-center gap-1 whitespace-nowrap border border-gray-500 px-2 py-0.5 text-black ${RADIUS.control}`}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8A6 6 0 0 0 4.6 6.5M4.5 12a6 6 0 0 0 10.9 1.5M4.5 3.5v3h3M15.5 16.5v-3h-3" />
              </svg>
              {content.paymentMethod}
            </span>
          </div>
          <ul className="mt-1 divide-y divide-gray-200">
            {summary.charges.map((charge) => (
              <li key={charge.id} className="text-ui-label flex items-baseline gap-3 py-1.5">
                <span className="w-[5.5rem] flex-shrink-0 tabular-nums text-gray-600">{charge.date}</span>
                <span className="min-w-0 flex-1 truncate">{charge.name}</span>
                <span className="text-ui-body whitespace-nowrap tabular-nums">
                  {formatMoney(charge.amount, currency, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 2 – The customer's three subscription levels side by side: name, monthly
 * price, what is included, subscriber count. The level with most subscribers
 * gets the "Populärast" mark – derived, not configured, so it cannot drift
 * from the numbers. The mark is a word plus an accent outline, never colour
 * alone. `includes={false}` drops the included lines for smaller boxes.
 */
export function SubscriptionTiers({
  content,
  includes = true,
  currency,
  locale,
}: { content: TiersContent; includes?: boolean } & MoneyFormat) {
  const top = Math.max(...content.tiers.map((tier) => tier.subscribers));
  const count = new Intl.NumberFormat(locale);

  return (
    <ul aria-label={content.label} className="grid h-full w-full grid-cols-3 gap-2">
      {content.tiers.map((tier) => {
        const popular = tier.subscribers === top;
        return (
          <li
            key={tier.id}
            className={`relative flex min-w-0 flex-col border bg-white p-2.5 text-left text-black ${RADIUS.field} ${
              popular ? 'border-teal-dark ring-1 ring-teal-dark' : 'border-gray-200'
            }`}
          >
            {/* Sits on the top border so the names stay aligned across levels. */}
            {popular ? (
              <span
                className={`text-ui-label absolute -top-2.5 left-2 whitespace-nowrap bg-teal-dark px-2 py-px text-white ${RADIUS.control}`}
              >
                {content.popularLabel}
              </span>
            ) : null}
            <p className="text-ui-body font-semibold leading-tight">{tier.name}</p>
            <p className="mt-0.5 whitespace-nowrap tabular-nums">
              <span className="text-ui-body">{formatMoney(tier.price, currency, locale)}</span>{' '}
              <span className="text-ui-label text-gray-600">{content.perMonth}</span>
            </p>
            {includes ? (
              <ul className="text-ui-label mt-1.5 space-y-0.5 text-gray-600">
                {tier.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            <p className="text-ui-label mt-auto pt-2 text-gray-600">
              <span className="text-ui-body block tabular-nums text-black">{count.format(tier.subscribers)}</span>
              {content.subscribersLabel}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The "Ny prenumeration" button. `pressed` freezes it mid-click. Illustration
 * only. (Same look as the pressed buttons in the invoice and campaign panels –
 * candidate for payment-cards/primitives once those branches are merged.)
 */
export function NewSubscriptionButton({ label, pressed = false }: { label: string; pressed?: boolean }) {
  return (
    <span
      className={`text-ui-label inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap bg-teal-dark px-3.5 py-1.5 text-white ${RADIUS.control} ${
        pressed ? 'relative z-10 scale-95 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] ring-4 ring-white/70' : ''
      }`}
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
        <path strokeLinecap="round" d="M10 4.5v11M4.5 10h11" />
      </svg>
      {label}
    </span>
  );
}

/**
 * Week / month / year – a real radio group styled as a segmented control:
 * native inputs, one tab stop, arrow keys move the selection. Selected
 * segment white on teal-dark (4.9:1), group outline gray-500 (4.7:1).
 */
function IntervalControl({
  content,
  value,
  onChange,
}: {
  content: NewSubscriptionContent['interval'];
  value: Interval;
  onChange: (value: Interval) => void;
}) {
  const labelId = useId();
  const name = useId();

  return (
    <div>
      <p id={labelId} className="text-ui-label text-gray-600">
        {content.label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={`mt-1 grid grid-cols-3 gap-1 border border-gray-500 p-1 ${RADIUS.control}`}
      >
        {(Object.keys(content.options) as Interval[]).map((option) => {
          const checked = option === value;
          return (
            <label key={option} className="relative block cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={`text-ui-body block whitespace-nowrap py-1 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 ${RADIUS.control} ${
                  checked ? 'bg-teal-dark text-white' : 'text-black'
                }`}
              >
                {content.options[option]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3 – "Ny prenumeration" dialog, a still of the flow (labelled group, not a
 * real dialog). Name, amount, interval, start date, payment method.
 */
export function NewSubscriptionDialog({
  content,
  currency,
  locale,
}: { content: NewSubscriptionContent } & MoneyFormat) {
  const titleId = useId();
  const [interval, setIntervalValue] = useState<Interval>(content.interval.defaultValue);

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`w-full bg-white p-4 text-left text-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.04)] ${RADIUS.card}`}
    >
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>

      <div className="mt-3 space-y-2">
        <Field label={content.name.label}>
          <span className="block truncate">{content.name.value}</span>
        </Field>
        <Field label={content.amount.label}>
          <span className="block truncate tabular-nums">{formatMoney(content.amount.value, currency, locale)}</span>
        </Field>
        <IntervalControl content={content.interval} value={interval} onChange={setIntervalValue} />
        <Field label={content.start.label}>
          <span className="block truncate tabular-nums">{content.start.value}</span>
        </Field>
        {/* TODO: verifiera att autogiro faktiskt stöds */}
        <Field label={content.paymentMethod.label}>
          <span className="block truncate">{content.paymentMethod.value}</span>
        </Field>
      </div>

      <span
        className={`text-ui-body mt-3 flex w-full items-center justify-center whitespace-nowrap bg-teal-dark px-4 py-2 text-white ${RADIUS.control}`}
      >
        {content.submitLabel}
      </span>
    </div>
  );
}

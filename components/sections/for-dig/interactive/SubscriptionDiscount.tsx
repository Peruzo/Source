'use client';

import { useId } from 'react';
import { TagIcon } from '@heroicons/react/20/solid';
import { formatMoney, RADIUS } from '../payment-cards/primitives';
import { Pill, Popup, ReplayButton, T, UiButton, UiField } from './ui';
import { useSequence } from './useSequence';

export type SubscriptionDiscountContent = {
  label: string;
  title: string;
  rows: { id: string; customer: string; plan: string; amount: number; perLabel: string; next: string; status: string }[];
  /** The row the discount is added to – always one customer's subscription. */
  targetId: string;
  addLabel: string;
  addHelp: string;
  removeLabel: string;
  removeHelp: string;
  dialog: {
    title: string;
    message: string;
    appliesTo: { label: string };
    type: { label: string; value: string };
    value: { label: string; value: string };
    duration: { label: string; value: string };
    months: { label: string; value: string };
    submitLabel: string;
  };
  /** What the row says afterwards, in the portal's own words. */
  appliedText: string;
};

/*
 * The portal's "Kunders prenumerationer" with a discount on ONE customer's
 * subscription: "Lägg till kampanj" is pressed on that row, the portal's form
 * opens filled in (type, value, validity, months), "Lägg till" is pressed, and the
 * row then shows "Kampanj: 10 % i 2 månader". A discount never covers all
 * subscriptions at once – it is always added per subscription.
 *
 *   0 idle → 1 add pressed → 2 form open → 3 submit pressed → 4 discount shown
 */
const DURATIONS = [1000, 350, 2600, 450];

export function SubscriptionDiscount({
  content: c,
  currency,
  locale,
}: {
  content: SubscriptionDiscountContent;
  currency: string;
  locale: string;
}) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const titleId = useId();
  const added = step >= 4;
  const target = c.rows.find((r) => r.id === c.targetId);
  const d = c.dialog;

  return (
    <>
      <div
        ref={(el) => {
          ref.current = el;
        }}
        role="group"
        aria-labelledby={titleId}
        className={`flex h-full flex-col bg-white p-5 text-left text-black ${RADIUS.card}`}
      >
        <p className="sr-only">{c.label}</p>
        <h3 id={titleId} className={T.title}>
          {c.title}
        </h3>
        <ul className="mt-3 flex-1 divide-y divide-gray-200 border-y border-gray-200">
          {c.rows.map((row) => {
            const isTarget = row.id === c.targetId;
            return (
              <li key={row.id} className={`py-3 ${isTarget ? 'bg-teal/5 -mx-2 px-2' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className={`${T.body} block truncate font-semibold`}>{row.customer}</span>
                    <span className={`${T.label} block text-gray-600`}>
                      {row.plan} · {formatMoney(row.amount, currency, locale)} {row.perLabel}
                    </span>
                    <span className={`${T.label} block text-gray-600`}>{row.next}</span>
                  </span>
                  <Pill tone="paid">{row.status}</Pill>
                </div>
                {isTarget ? (
                  <div className="mt-2.5">
                    {/* The discount line is always there, so adding it moves nothing. */}
                    <p
                      aria-hidden={!added}
                      className={`${T.label} flex items-center gap-1.5 font-semibold text-teal-dark transition-opacity duration-300 motion-reduce:transition-none ${added ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <TagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {c.appliedText}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <UiButton tone="quiet" pressed={step === 1} icon={<TagIcon className="h-3.5 w-3.5" aria-hidden="true" />}>
                        {added ? c.removeLabel : c.addLabel}
                      </UiButton>
                      <span className={`${T.label} text-gray-600`}>{added ? c.removeHelp : c.addHelp}</span>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
        <ReplayButton onClick={replay} />
      </div>

      {/* The portal's form, over the whole subscription view. */}
      <Popup open={step >= 2 && step < 4} title={d.title}>
        <p className={`${T.label} text-gray-600`}>{d.message}</p>
        <div className="mt-3 space-y-2">
          {target ? (
            <UiField label={d.appliesTo.label}>
              {target.customer} · {target.plan}
            </UiField>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <UiField label={d.type.label}>{d.type.value}</UiField>
            <UiField label={d.value.label}>
              <span className="tabular-nums">{d.value.value}</span>
            </UiField>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <UiField label={d.duration.label}>{d.duration.value}</UiField>
            <UiField label={d.months.label}>
              <span className="tabular-nums">{d.months.value}</span>
            </UiField>
          </div>
        </div>
        <div className="mt-4">
          <UiButton block pressed={step === 3}>
            {d.submitLabel}
          </UiButton>
        </div>
      </Popup>
    </>
  );
}

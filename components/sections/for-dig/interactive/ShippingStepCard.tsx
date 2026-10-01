'use client';

import type { ComponentType } from 'react';
import { CARD_EDGE, RADIUS } from '../payment-cards/primitives';
import { Pill, T, UiButton } from './ui';

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

export type ShippingStepCardContent = {
  title: string;
  pill: string;
  /** Short facts under the title, e.g. "2 artiklar · PostNord". */
  meta: string;
  /** Button look-alikes as in the portal; the first is the main one. */
  actions?: string[];
  /** A quiet line at the bottom. */
  note?: string;
};

/*
 * One step of "Frakt med PostNord" in StickySteps: the order, the booked
 * delivery with its shipping label and tracking link, and the customer's
 * shipping e-mail – with the portal's own labels ("Boka leverans", "Leverans
 * bokad", "Hämta fraktsedel", "Följ leveransen"). Larger than a status row, so
 * it reads over the photo; it follows the step text and has no sequence of its
 * own. Container queries stack the buttons in the narrow columns below lg.
 */
export function ShippingStepCard({ content: c, icon: Icon }: { content: ShippingStepCardContent; icon: Icon }) {
  return (
    <div className={`@container w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className={`${T.body} font-semibold`}>{c.title}</p>
            <Pill tone="paid">{c.pill}</Pill>
          </div>
          <p className={`${T.label} text-gray-600`}>{c.meta}</p>
        </div>
      </div>
      {c.actions?.length ? (
        <div className="mt-3 flex flex-col gap-2 @xs:flex-row @xs:flex-wrap">
          {c.actions.map((a, i) => (
            <UiButton key={a} tone={i === 0 ? 'accent' : 'quiet'} className="justify-center">
              {a}
            </UiButton>
          ))}
        </div>
      ) : null}
      {c.note ? <p className={`${T.label} mt-3 text-gray-600`}>{c.note}</p> : null}
    </div>
  );
}

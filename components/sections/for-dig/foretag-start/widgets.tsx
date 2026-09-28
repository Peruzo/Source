'use client';

import { useId } from 'react';
import { CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { CARD_EDGE, RADIUS, formatMoney } from '../payment-cards/primitives';
import type { OfferListContent, PhotoCardContent } from '@/lib/data/for-dig/foretag-start';

/*
 * Small widgets for /foretag-nya (Företag Start). Content comes from
 * lib/data/for-dig/foretag-start.ts; nothing here is page copy.
 */

/**
 * "Det du säljer": a short list of what the business sells, one row per item
 * with its kind (Vara, Tjänst, Abonnemang) and price. No photos, so the example
 * never reads as one particular trade.
 *
 * Names are never cut off. Below a 28rem container the kind pill moves under
 * the name, so the name gets the full width next to the price; from 28rem the
 * name, pill and price share one line. Reads only its own width (@container).
 */
export function OfferList({ content, currency, locale }: { content: OfferListContent; currency: string; locale: string }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`@container w-full bg-white p-4 text-left text-black @xl:p-5 ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <ul className="mt-3 divide-y divide-gray-200">
        {content.rows.map((row) => (
          <li key={row.id} className="flex items-center gap-3 py-2.5">
            <span className="flex min-w-0 flex-1 flex-col items-start gap-1 @md:flex-row @md:items-center @md:justify-between @md:gap-3">
              <span className="text-ui-body block min-w-0 break-words">{row.name}</span>
              <span className={`text-ui-label shrink-0 whitespace-nowrap border border-gray-300 px-2 py-0.5 text-gray-700 ${RADIUS.control}`}>
                {row.kind}
              </span>
            </span>
            <span className="text-ui-body w-[5.5rem] whitespace-nowrap text-right tabular-nums">
              {formatMoney(row.price, currency, locale)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Floating card for a ServiceFullBleed photo: a light frame over the photo with
 * a title and one pill, and a single solid row under it. One figure or status,
 * one pill, one row – nothing more (see the FullBleedPhoto spec).
 */
function PhotoCard({ content, icon: Icon }: { content: PhotoCardContent; icon: typeof CreditCardIcon }) {
  return (
    <div className={`bg-white/10 p-4 ring-1 ring-white/50 backdrop-blur-[16px] ${RADIUS.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ui-label text-white/80">{content.label}</p>
          <p className="text-ui-amount mt-1 text-white">{content.value}</p>
        </div>
        {content.pill ? (
          <span className={`text-ui-label shrink-0 bg-white px-2.5 py-1 font-semibold text-black ${RADIUS.control}`}>
            {content.pill}
          </span>
        ) : null}
      </div>
      <div className={`mt-4 flex items-center gap-3 bg-white px-3 py-2.5 text-black shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] ${RADIUS.field}`}>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="text-ui-body block truncate">{content.row.title}</span>
          <span className="text-ui-label block truncate text-gray-600">{content.row.note}</span>
        </span>
      </div>
    </div>
  );
}

export function PaymentLinkCard({ content }: { content: PhotoCardContent }) {
  return <PhotoCard content={content} icon={CreditCardIcon} />;
}

export function DeadlineCard({ content }: { content: PhotoCardContent }) {
  return <PhotoCard content={content} icon={CalendarDaysIcon} />;
}

'use client';

import { useId } from 'react';
import type { ComponentType } from 'react';
import { EnvelopeIcon, GiftIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, CardShell, RADIUS, formatMoney } from '../payment-cards/primitives';
import type {
  BrandedCheckoutContent,
  EmailRowContent,
  GiftCardContent,
  LeadListContent,
  LeadStage,
  ReviewCardContent,
  StatusCardContent,
  StatusRowContent,
} from '@/lib/data/for-dig/foretag-vaxa';

/*
 * Small widgets for /foretag-vaxande (Företag Växa). Content comes from
 * lib/data/for-dig/foretag-vaxa.ts; nothing here is page copy. Built from the
 * payment-cards primitives – same three radii, same `.text-ui-*` scale – so they
 * read as one product with the Företag Start and Privat widgets.
 */

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
type MoneyFormat = { currency: string; locale: string };

/**
 * One status row: icon, title and a short line. About 53 px tall, so in
 * StickySteps it fits in the strip of street under the doorway of the frakt
 * photo (see ForetagVaxaSections). Solid white with the card edge, so it reads
 * the same over the photo and on the white page below lg.
 */
export function StatusRow({ content, icon: Icon }: { content: StatusRowContent; icon: Icon }) {
  return (
    <div className={`flex w-full items-center gap-3 bg-white px-3 py-2 text-left text-black ${CARD_EDGE} ${RADIUS.field}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="text-ui-body block truncate">{content.title}</span>
        <span className="text-ui-label block truncate text-gray-600">{content.note}</span>
      </span>
    </div>
  );
}

/**
 * Floating card for a ServiceFullBleed photo: one value, at most one pill, one
 * row. `glass` is Företag Start's photo card (white text on a frosted frame) for
 * dark photos; `solid` is a white card with dark text for light photos, where
 * white text on a frosted frame would not hold 4.5:1.
 */
export function StatusCard({ content, icon: Icon, tone }: { content: StatusCardContent; icon: Icon; tone: 'glass' | 'solid' }) {
  const glass = tone === 'glass';

  return (
    <div
      className={`p-4 ${RADIUS.card} ${
        glass ? 'bg-white/10 ring-1 ring-white/50 backdrop-blur-[16px]' : `bg-white text-black ${CARD_EDGE}`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-ui-label ${glass ? 'text-white/80' : 'text-gray-600'}`}>{content.label}</p>
          <p className={`text-ui-amount mt-1 ${glass ? 'text-white' : 'text-black'}`}>{content.value}</p>
        </div>
        {content.pill ? (
          <span
            className={`text-ui-label shrink-0 px-2.5 py-1 font-semibold ${RADIUS.control} ${
              glass ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {content.pill}
          </span>
        ) : null}
      </div>
      <div
        className={`mt-4 flex items-center gap-3 px-3 py-2.5 text-black ${RADIUS.field} ${
          glass ? 'bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)]' : 'border border-gray-200 bg-white'
        }`}
      >
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

/*
 * Status pill per follow-up step. The step is written out in the pill, so the
 * colour is never the only signal: a plain outline for a new lead, grey for
 * contacted, the paid green (as in EmailRow) for won.
 */
const LEAD_STAGE_PILL: Record<LeadStage, string> = {
  new: 'border border-gray-300 text-gray-700',
  contacted: 'bg-gray-100 text-black',
  won: 'bg-status-paid-bg text-status-paid',
};

/**
 * A short lead list as on the portal's leads page: company and place, the
 * letter grade, a one-line motivation and the follow-up status, with the
 * pitch-analysis button under the list. Illustration only: the button is a
 * look-alike and no score numbers are shown.
 */
export function LeadList({ content }: { content: LeadListContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <p className="sr-only">{content.label}</p>

      <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
        {content.leads.map((lead) => (
          <li key={lead.id} className="flex items-start gap-3 py-3">
            <span
              aria-label={`${content.ratingLabel} ${lead.rating}`}
              role="img"
              className={`text-ui-body flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark font-semibold text-white ${RADIUS.control}`}
            >
              {lead.rating}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-ui-body min-w-0 break-words font-semibold">{lead.company}</span>
                <span className={`text-ui-label shrink-0 whitespace-nowrap px-2 py-0.5 ${RADIUS.control} ${LEAD_STAGE_PILL[lead.stage]}`}>
                  {lead.status}
                </span>
              </span>
              <span className="text-ui-label block text-gray-600">{lead.place}</span>
              <span className="text-ui-label mt-1 block break-words text-gray-700">{lead.motivation}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex">
        <span className={`text-ui-label inline-flex items-center whitespace-nowrap bg-teal-dark px-3.5 py-1.5 text-white ${RADIUS.control}`}>
          {content.action}
        </span>
      </div>
    </div>
  );
}

/**
 * The customer's checkout in the shop's own look: a header in the shop's
 * colour with a logo slot, the amount, the payment methods and the pay button
 * in the same colour. The logo slot is an empty frame – it never draws a logo.
 */
export function BrandedCheckout({ content, currency, locale }: { content: BrandedCheckoutContent } & MoneyFormat) {
  return (
    <CardShell label={content.label} flush>
      <div className="bg-black-tertiary p-5 text-white">
        <span className={`text-ui-label inline-flex items-center border border-dashed border-white/60 px-3 py-1.5 text-white/85 ${RADIUS.field}`}>
          {content.logoSlot}
        </span>
        <p className="text-ui-label mt-6 text-white/85">{content.orderLine}</p>
        <p className="text-ui-amount mt-1 tabular-nums">{formatMoney(content.amount, currency, locale)}</p>
      </div>

      <div className="p-5">
        <ul className={`divide-y divide-gray-200 border border-gray-200 px-3.5 ${RADIUS.field}`}>
          {content.methods.map((method, i) => (
            <li key={method.id} className="flex items-center gap-3 py-3">
              {/* The first method is shown chosen: a filled ring, not colour alone. */}
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center border-2 ${RADIUS.control} ${
                  i === 0 ? 'border-black-tertiary' : 'border-gray-400'
                }`}
              >
                {i === 0 ? <span className={`h-2 w-2 bg-black-tertiary ${RADIUS.control}`} /> : null}
              </span>
              <span className="text-ui-body text-black">{method.label}</span>
              {method.note ? <span className="text-ui-label ml-auto text-gray-600">{method.note}</span> : null}
            </li>
          ))}
        </ul>
        <span className={`text-ui-body mt-4 flex items-center justify-center bg-black-tertiary px-4 py-2.5 text-white ${RADIUS.control}`}>
          {content.payLabel}
        </span>
      </div>
    </CardShell>
  );
}

/** A gift card with its code – no amount. */
export function GiftCard({ content }: { content: GiftCardContent }) {
  return (
    <div className={`flex items-center gap-3 bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
        <GiftIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-ui-title">{content.title}</h3>
        <p className="text-ui-label text-gray-600">
          {content.code.label} <span className="text-ui-body font-mono tracking-wide text-black">{content.code.value}</span>
        </p>
      </div>
    </div>
  );
}

/** One sent newsletter: sender address, subject and status. */
export function EmailRow({ content }: { content: EmailRowContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-black ${RADIUS.control}`}>
          <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ui-body block break-words">{content.subject}</span>
          <span className="text-ui-label block break-all text-gray-600">{content.sender}</span>
        </span>
        <span className={`text-ui-label shrink-0 whitespace-nowrap bg-status-paid-bg px-2 py-0.5 text-status-paid ${RADIUS.control}`}>
          {content.status}
        </span>
      </div>
    </div>
  );
}

/** A new review: stars and where it shows. No quote – the example never puts words in a customer's mouth. */
export function ReviewCard({ content }: { content: ReviewCardContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span role="img" aria-label={`${content.starsLabel}: ${content.stars} av ${content.outOf}`} className="flex gap-0.5">
          {Array.from({ length: content.outOf }, (_, i) => (
            <StarIcon key={i} aria-hidden="true" className={`h-5 w-5 ${i < content.stars ? 'text-black' : 'text-gray-300'}`} />
          ))}
        </span>
        <span className="text-ui-label text-gray-600">{content.status}</span>
      </div>
    </div>
  );
}

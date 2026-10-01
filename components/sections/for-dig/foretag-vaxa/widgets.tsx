'use client';

import { useId } from 'react';
import type { ComponentType } from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, RADIUS } from '../payment-cards/primitives';
import type {
  GiftCardContent,
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

/**
 * One status row: icon, title and a short line, about 53 px tall. Solid white
 * with the card edge, so it reads the same over a photo and on a white page.
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

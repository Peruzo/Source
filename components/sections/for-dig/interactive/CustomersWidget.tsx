'use client';

import { useId } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon } from '@heroicons/react/20/solid';
import { CARD_EDGE, RADIUS } from '../payment-cards/primitives';
import { EASE, Pill, ReplayButton, T, UiButton } from './ui';
import { useSequence } from './useSequence';

export type CustomersWidgetContent = {
  label: string;
  reviews: {
    title: string;
    toggleLabel: string;
    toggleHint: string;
    on: string;
    off: string;
    offNote: string;
    starsLabel: string;
    verifiedLabel: string;
    shownLabel: string;
    items: { id: string; stars: number; text: string; name: string; product: string }[];
  };
  mailing: {
    title: string;
    recipients: { label: string; value: string };
    sender: { label: string; value: string };
    subject: { label: string; value: string };
    sendLabel: string;
    draft: string;
    sent: string;
  };
};

/*
 * "Håll kunderna nära": the portal's switch for showing reviews on the website is
 * turned on, and the product reviews come up – 5, 4 and 3 stars, each with its
 * comment, the customer's first name and initial and "Verifierat köp". Then a
 * mailing to existing customers is sent. (The portal has no newsletter sign-up
 * form; mailings go to the customers you already have.)
 *
 *   0 off → 1 switched on → 2 reviews shown → 3 "Skicka" pressed → 4 sent
 */
const DURATIONS = [1000, 500, 2300, 350];

export function CustomersWidget({ content: c }: { content: CustomersWidgetContent }) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const reviewsId = useId();
  const mailId = useId();
  const on = step >= 1;
  const shown = step >= 2;
  const sent = step >= 4;
  const r = c.reviews;
  const m = c.mailing;

  return (
    <div
      ref={(el) => {
        ref.current = el;
      }}
      className="@container w-full space-y-4 text-left text-black"
    >
      <p className="sr-only">{c.label}</p>

      {/* Reviews. */}
      <div role="group" aria-labelledby={reviewsId} className={`bg-white p-4 sm:p-5 ${CARD_EDGE} ${RADIUS.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 id={reviewsId} className={T.title}>
              {r.title}
            </h3>
          </div>
          <span className="flex items-center gap-3">
            <span className="text-right">
              <span className={`${T.body} block`}>{r.toggleLabel}</span>
              <span className={`${T.label} block text-gray-600`}>{r.toggleHint}</span>
            </span>
            {/* The switch as it looks in the portal – illustration, its state is read out. */}
            <span
              className={`relative inline-flex h-7 w-12 shrink-0 items-center transition-colors duration-300 ${EASE} ${RADIUS.control} ${on ? 'bg-teal-dark' : 'bg-gray-300'}`}
            >
              <span className="sr-only">{on ? r.on : r.off}</span>
              <span
                aria-hidden="true"
                className={`inline-block h-6 w-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-300 ${EASE} ${RADIUS.control} ${
                  on ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </span>
          </span>
        </div>

        {/* A fixed area: the note while off, the reviews once on. */}
        <div className="relative mt-4 h-[33rem] @lg:h-[24rem]">
          <p
            aria-hidden={shown}
            className={`${T.body} absolute inset-0 flex items-center justify-center border border-dashed border-gray-300 px-6 text-center text-gray-600 transition-opacity duration-300 ${EASE} ${RADIUS.field} ${
              shown ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {r.offNote}
          </p>
          <ul aria-hidden={!shown} className="absolute inset-0 space-y-2.5">
            {r.items.map((item, i) => (
              <li
                key={item.id}
                style={{ transitionDelay: shown ? `${i * 160}ms` : '0ms' }}
                className={`border border-gray-200 px-4 py-3 transition-[opacity,transform] duration-500 ${EASE} ${RADIUS.field} ${
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span role="img" aria-label={`${r.starsLabel}: ${item.stars} av 5`} className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, s) => (
                      <StarIcon key={s} aria-hidden="true" className={`h-4 w-4 ${s < item.stars ? 'text-black' : 'text-gray-300'}`} />
                    ))}
                  </span>
                  <span className={`${T.label} text-gray-600`}>{r.shownLabel}</span>
                </div>
                <p className={`${T.body} mt-1.5`}>{item.text}</p>
                <p className={`${T.label} mt-1.5 flex flex-wrap items-center gap-x-2 text-gray-600`}>
                  <span className="font-semibold text-black">{item.name}</span>
                  <span>· {item.product}</span>
                  <span className="inline-flex items-center gap-1">
                    · <CheckBadgeIcon className="h-4 w-4 text-teal-dark" aria-hidden="true" /> {r.verifiedLabel}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* A mailing to the customers you already have. */}
      <div role="group" aria-labelledby={mailId} className={`bg-white p-4 sm:p-5 ${CARD_EDGE} ${RADIUS.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id={mailId} className={`${T.title} flex items-center gap-2`}>
            <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
            {m.title}
          </h3>
          <span aria-live="polite">
            <Pill tone={sent ? 'paid' : 'outline'}>{sent ? m.sent : m.draft}</Pill>
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 @md:grid-cols-[auto_minmax(0,1fr)]">
          {[m.recipients, m.sender, m.subject].map((row) => (
            <div key={row.label} className="contents">
              <dt className={`${T.label} text-gray-600 @md:py-0.5`}>{row.label}</dt>
              <dd className={`${T.body} min-w-0 break-words`}>{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex justify-end">
          <UiButton pressed={step === 3}>{m.sendLabel}</UiButton>
        </div>
      </div>

      <div className="-mt-1">
        <ReplayButton onClick={replay} />
      </div>
    </div>
  );
}

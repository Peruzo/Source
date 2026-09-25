'use client';

import { useId, useState } from 'react';
import type { AddProductContent, ProductGridContent, ServiceBookingContent } from './content';
import {
  CARD_EDGE,
  Field,
  PlusIcon,
  RADIUS,
  formatMoney,
} from '../payment-cards/primitives';

/*
 * The three product widgets. Same visual vocabulary as PaymentCards – the
 * primitives, the three radii (card 24 / field 12 / control pill) and the
 * `.text-ui-*` scale are shared – so both sections read as one product.
 *
 * Every widget sizes itself from its content and its own width; none of them know
 * about the page, so each can be rendered on its own (Remotion texture).
 */

type MoneyFormat = { currency: string; locale: string };

/**
 * 1 – Dense product grid. Photos are square by default, so the grid has a
 * natural height; given more height (the grid as a flex item with room to
 * grow) the rows share it equally and the PHOTOS grow – text never scales. `className` sets the column count and
 * may hide trailing items per container width, e.g.
 * `grid-cols-3 @xl:grid-cols-5 @max-xl:[&>li:nth-child(n+10)]:hidden
 * @xl:[&>li:nth-child(n+11)]:hidden`. Hidden items are `display: none`, so they
 * are out of the accessibility tree as well.
 */
export function ProductGrid({
  content,
  className = 'grid-cols-4',
  currency,
  locale,
}: { content: ProductGridContent; className?: string } & MoneyFormat) {
  return (
    <ul aria-label={content.label} className={`grid w-full auto-rows-fr gap-x-2.5 gap-y-3 ${className}`}>
      {content.products.map((product) => (
        <li key={product.id} className="flex min-w-0 flex-col">
          <div className={`relative aspect-square grow overflow-hidden bg-gray-100 ${RADIUS.field}`}>
            {/* Plain <img>: must render outside Next (Remotion), see PaymentCards. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image.src}
              alt={product.image.alt ?? ''}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <p className="text-ui-label mt-1.5 truncate text-black">{product.name}</p>
          <p className="text-ui-label truncate tabular-nums text-gray-600">
            {formatMoney(product.price, currency, locale)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * 2 – "Add new product" dialog, drawn as a still of the flow (it is not a real
 * dialog, so no `role="dialog"`, no focus trap – just a labelled group).
 *
 * `fields` trims the form to what stays legible at the size it is shown:
 * text never shrinks below `.text-ui-label`, the form gets shorter instead.
 *   compact → name only · medium → + price, category · full → + image upload
 */
export function AddProductDialog({
  content,
  fields,
  currency,
  locale,
}: {
  content: AddProductContent;
  fields: 'compact' | 'medium' | 'full';
} & MoneyFormat) {
  const titleId = useId();

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`w-full bg-white p-4 text-left text-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.04)] ${RADIUS.card}`}
    >
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>

      <div className="mt-3 space-y-2">
        <Field label={content.name.label}>{content.name.value}</Field>

        {fields !== 'compact' ? (
          <div className="grid grid-cols-2 gap-2">
            <Field label={content.price.label}>
              <span className="tabular-nums">{formatMoney(content.price.amount, currency, locale)}</span>
            </Field>
            <Field label={content.category.label}>{content.category.value}</Field>
          </div>
        ) : null}

        {fields === 'full' ? (
          <div
            className={`flex items-center gap-3 border border-dashed border-gray-500 px-3.5 py-3 ${RADIUS.field}`}
          >
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center bg-gray-100 text-gray-700 ${RADIUS.control}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5M4 13v2.5h12V13" />
              </svg>
            </span>
            <span>
              <span className="text-ui-body block text-black">{content.upload.label}</span>
              <span className="text-ui-label block text-gray-600">{content.upload.hint}</span>
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <FauxBlockButton tone="accent">{content.submitLabel}</FauxBlockButton>
      </div>
    </div>
  );
}

/** Full-width button look-alike – not focusable, see FauxButton. */
function FauxBlockButton({ tone, children }: { tone: 'accent' | 'dark'; children: string }) {
  return (
    <span
      className={`text-ui-body flex w-full items-center justify-center px-4 py-2 text-white ${RADIUS.control} ${
        tone === 'accent' ? 'bg-teal-dark' : 'bg-black'
      }`}
    >
      {children}
    </span>
  );
}

/**
 * The plus button that opened the dialog, frozen in its pressed state. Pure
 * illustration – not focusable, hidden from assistive tech.
 */
export function PressedAddButton() {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 flex h-11 w-11 scale-95 items-center justify-center bg-teal-dark text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] ring-4 ring-white/70 ${RADIUS.control}`}
    >
      <span className="scale-[1.4]">
        <PlusIcon />
      </span>
    </span>
  );
}

/**
 * 3 – A bookable service instead of a product. In a container of 28rem or
 * more it lays out wide – name and price left, times and button right – so it
 * carries the same weight as the product grid above it. The time slots are the one
 * thing here that carries state, so they are real radio buttons (native
 * inputs, arrow keys move between them); the book button is illustration.
 */
export function ServiceBooking({
  content,
  currency,
  locale,
}: { content: ServiceBookingContent } & MoneyFormat) {
  const titleId = useId();
  const timesId = useId();
  const groupName = useId();
  const [selected, setSelected] = useState(content.defaultTimeId);

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`w-full bg-white p-5 text-left text-black @md:grid @md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] @md:items-end @md:gap-6 @xl:gap-8 @xl:p-7 ${CARD_EDGE} ${RADIUS.card}`}
    >
      <div>
        <h3 id={titleId} className="text-ui-title">
          {content.name}
        </h3>
        <p className="text-ui-label mt-0.5 text-gray-600">{content.details}</p>
        <p className="text-ui-amount mt-4 tabular-nums">{formatMoney(content.price, currency, locale)}</p>
      </div>

      <div>
        <div className="mt-5 @md:mt-0">
          <p id={timesId} className="text-ui-label font-semibold text-gray-600">
            {content.timesHeading}
          </p>
          <div role="radiogroup" aria-labelledby={timesId} className="mt-2 grid grid-cols-3 gap-2">
            {content.times.map((time) => {
              const checked = time.id === selected;
              return (
                <label key={time.id} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name={groupName}
                    value={time.id}
                    checked={checked}
                    onChange={() => setSelected(time.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={`text-ui-body block border py-1.5 text-center tabular-nums transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 ${RADIUS.control} ${
                      checked
                        ? 'border-teal-dark bg-teal-dark text-white'
                        : 'border-gray-500 bg-white text-black'
                    }`}
                  >
                    {time.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 @md:mt-4">
          <FauxBlockButton tone="dark">{content.bookLabel}</FauxBlockButton>
        </div>
      </div>
    </div>
  );
}

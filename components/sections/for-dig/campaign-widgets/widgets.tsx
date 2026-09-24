'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  CampaignCodeContent,
  CreateCampaignContent,
  DiscountType,
  PriceLabels,
  SaleProduct,
} from './content';
import { Field, RADIUS, formatMoney } from '../payment-cards/primitives';

/*
 * The campaign widgets. Built from the payment-cards primitives – same three
 * radii (card 24 / field 12 / control pill), same `.text-ui-*` scale – so the
 * payment, product, invoice and campaign visuals read as one product.
 *
 * The discount type is the one piece of state here, so it is a real radio
 * group. Everything else that looks like a control is illustration and is
 * not focusable. Every widget fills the box it is given and knows nothing
 * about the page, so each can be rendered on its own (Remotion texture).
 */

type MoneyFormat = { currency: string; locale: string };

/** Sale price in whole öre, so it matches what a till would charge. */
export function salePrice(price: number, rate: number) {
  return Math.round(price * (1 - rate) * 100) / 100;
}

function formatPercent(rate: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(rate);
}

/** "−30 %" – a real minus sign (U+2212), not a hyphen. */
function DiscountBadge({ rate, locale }: { rate: number; locale: string }) {
  return (
    <span
      className={`text-ui-label inline-flex items-center whitespace-nowrap bg-black px-2 py-0.5 font-semibold tabular-nums text-white ${RADIUS.control}`}
    >
      {'−'}
      {formatPercent(rate, locale)}
    </span>
  );
}

/**
 * Ordinary price struck through, sale price in the accent colour. <del> keeps
 * the "no longer valid" meaning in the markup, and the visually hidden labels
 * make screen readers say which price is which – most of them do not
 * announce <del> on their own.
 */
function PriceRow({
  price,
  rate,
  labels,
  currency,
  locale,
  stacked = false,
  large = false,
}: {
  price: number;
  rate: number;
  labels: PriceLabels;
  stacked?: boolean;
  large?: boolean;
} & MoneyFormat) {
  return (
    <p className={`tabular-nums ${stacked ? 'flex flex-col' : 'flex flex-wrap items-baseline gap-x-2'}`}>
      <span className={`${large ? 'text-ui-title' : 'text-ui-label font-semibold'} text-teal-dark`}>
        <span className="sr-only">{labels.sale} </span>
        {formatMoney(salePrice(price, rate), currency, locale)}
      </span>
      <span className="text-ui-label text-gray-600">
        <span className="sr-only">{labels.ordinary} </span>
        <del>{formatMoney(price, currency, locale)}</del>
      </span>
    </p>
  );
}

/** 3 – The discounted product, as a card: photo, name, prices, badge. */
export function SaleProductCard({
  product,
  rate,
  labels,
  currency,
  locale,
}: { product: SaleProduct; rate: number; labels: PriceLabels } & MoneyFormat) {
  const titleId = useId();

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`flex h-full w-full flex-col overflow-hidden bg-white text-left text-black shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] ${RADIUS.card}`}
    >
      <div className="relative min-h-0 flex-1 bg-gray-100">
        {/* Plain <img>: must render outside Next (Remotion). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image.src}
          alt={product.image.alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3">
          <DiscountBadge rate={rate} locale={locale} />
        </span>
      </div>
      <div className="px-4 pb-4 pt-3">
        <h3 id={titleId} className="text-ui-body">
          {product.name}
        </h3>
        <div className="mt-0.5">
          <PriceRow price={product.price} rate={rate} labels={labels} currency={currency} locale={locale} large />
        </div>
      </div>
    </div>
  );
}

/**
 * 3, narrow fallback – a small grid of discounted products. Shows exactly
 * `columns × rows`; rows stretch to fill the height and the photo takes the
 * slack, so no tile is ever cut off by the box.
 */
export function SaleGrid({
  products,
  columns,
  rows,
  rate,
  labels,
  currency,
  locale,
  badges = true,
}: {
  products: SaleProduct[];
  columns: number;
  rows: number;
  rate: number;
  labels: PriceLabels;
  /** Off where a dialog's edge would slice through the badges. */
  badges?: boolean;
} & MoneyFormat) {
  return (
    <ul
      className="grid h-full w-full gap-x-2 gap-y-2.5"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {products.slice(0, columns * rows).map((product) => (
        <li key={product.id} className="flex min-h-0 flex-col">
          <div className={`relative min-h-0 flex-1 overflow-hidden bg-gray-100 ${RADIUS.field}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image.src}
              alt={product.image.alt ?? ''}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {badges ? (
              <span className="absolute left-1.5 top-1.5">
                <DiscountBadge rate={rate} locale={locale} />
              </span>
            ) : null}
          </div>
          <p className="text-ui-label mt-1.5 truncate text-black">{product.name}</p>
          <PriceRow price={product.price} rate={rate} labels={labels} currency={currency} locale={locale} stacked />
        </li>
      ))}
    </ul>
  );
}

/** Screen chrome around the grid: heading and the "Skapa kampanj" button. */
export function CampaignScreenHeader({
  title,
  buttonLabel,
  pressed,
}: {
  title: string;
  buttonLabel: string;
  pressed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-ui-title mr-auto">{title}</h3>
      <CreateCampaignButton label={buttonLabel} pressed={pressed} />
    </div>
  );
}

/**
 * The "Skapa kampanj" button. `pressed` freezes it mid-click and lifts it above
 * a dim behind a dialog (z-10) – dimmed, its white text would drop below
 * 4.5:1. Illustration only.
 */
export function CreateCampaignButton({ label, pressed = false }: { label: string; pressed?: boolean }) {
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
 * Segmented control for the discount type – a real radio group: native
 * inputs, one tab stop, arrow keys switch. The selected segment is solid
 * accent (white on teal-dark 4.9:1); the group outline is gray-500 (4.7:1)
 * so the control's edge clears 3:1.
 */
function DiscountTypeControl({
  content,
  value,
  onChange,
}: {
  content: CreateCampaignContent['discountType'];
  value: DiscountType;
  onChange: (value: DiscountType) => void;
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
        className={`mt-1 grid grid-cols-2 gap-1 border border-gray-500 p-1 ${RADIUS.control}`}
      >
        {(Object.keys(content.options) as DiscountType[]).map((option) => {
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
 * 1 – "Ny kampanj" dialog, a still of the flow (labelled group, not a real
 * dialog). The value field follows the selected discount type. `fields`
 * trims the form for narrow boxes – text never shrinks, the form gets shorter:
 *   medium → name + value, discount type, button
 *   full   → name + product picker, discount type, value + period, button
 */
export function CreateCampaignDialog({
  content,
  products,
  fields,
  currency,
  locale,
}: {
  content: CreateCampaignContent;
  /** Selected products – the first three show as thumbnails. */
  products: SaleProduct[];
  fields: 'medium' | 'full';
} & MoneyFormat) {
  const titleId = useId();
  const [type, setType] = useState<DiscountType>(content.discountType.defaultValue);
  const value =
    type === 'percent'
      ? formatPercent(content.value.percent, locale)
      : formatMoney(content.value.amount, currency, locale);

  const name = <Field label={content.name.label}>{content.name.value}</Field>;
  const valueField = (
    <Field label={content.value.label}>
      <span className="block truncate tabular-nums" aria-live="polite">
        {value}
      </span>
    </Field>
  );
  const picker = (
    <Field label={content.products.label}>
      <span className="flex items-center gap-2">
        <span className="flex -space-x-1.5" aria-hidden="true">
          {products.slice(0, 3).map((product) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={product.id}
              src={product.image.src}
              alt=""
              className={`h-5 w-5 bg-gray-100 object-cover ring-2 ring-white ${RADIUS.control}`}
            />
          ))}
        </span>
        <span className="truncate">{content.products.selectedLabel}</span>
      </span>
    </Field>
  );

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
        <div className="grid grid-cols-2 gap-2">
          {name}
          {fields === 'full' ? picker : valueField}
        </div>

        <DiscountTypeControl content={content.discountType} value={type} onChange={setType} />

        {fields === 'full' ? (
          <div className="grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)] gap-2">
            {valueField}
            <Field label={content.period.label}>
              <span className="block truncate tabular-nums">
                {content.period.from} – {content.period.to}
              </span>
            </Field>
          </div>
        ) : null}
      </div>

      <span
        className={`text-ui-body mt-3 flex w-full items-center justify-center bg-teal-dark px-4 py-2 text-white ${RADIUS.control}`}
      >
        {content.submitLabel}
      </span>
    </div>
  );
}

/** 2 – Discount code: the code set like a code, its value and usage limit. */
export function CampaignCode({
  content,
  rate,
  locale,
}: {
  content: CampaignCodeContent;
  rate: number;
  locale: string;
}) {
  const titleId = useId();
  const row = (label: string, value: ReactNode) => (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="text-ui-label text-gray-600">{label}</dt>
      <dd className="text-ui-body text-right tabular-nums">{value}</dd>
    </div>
  );

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`w-full bg-white p-4 text-left text-black shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] ${RADIUS.card}`}
    >
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>

      <div className={`mt-3 border border-dashed border-gray-500 bg-gray-50 px-3.5 py-2.5 ${RADIUS.field}`}>
        <p className="text-ui-label text-gray-600">{content.code.label}</p>
        <p className="text-ui-body mt-0.5 font-mono font-semibold tracking-[0.18em] text-black">
          {content.code.value}
        </p>
      </div>

      <dl className="mt-1 divide-y divide-gray-200">
        {row(content.discount.label, `−${formatPercent(rate, locale)}`)}
        {row(content.usage.label, content.usage.value)}
      </dl>
    </div>
  );
}

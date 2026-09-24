'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import type {
  CreateInvoiceContent,
  InvoiceListContent,
  InvoicePreviewContent,
  InvoiceStatus,
} from './content';
import { FauxButton, Field, RADIUS, formatMoney } from '../payment-cards/primitives';

/*
 * The three invoice widgets. Built from the payment-cards primitives – same
 * three radii (card 24 / field 12 / control pill), same `.text-ui-*` scale –
 * so PaymentCards, ProductWidgets and these read as one product.
 *
 * Nothing here is interactive: there is no state to convey, so there are no
 * controls and no tab stops. Buttons are look-alikes (see FauxButton).
 * Each widget fills the box it is given and knows nothing about the page, so
 * it can be rendered on its own (Remotion texture).
 */

type MoneyFormat = { currency: string; locale: string };

/** Splits a VAT-inclusive total into net + VAT, in whole öre so the parts add up exactly. */
function splitVat(total: number, rate: number) {
  const totalMinor = Math.round(total * 100);
  const netMinor = Math.round(totalMinor / (1 + rate));
  return { net: netMinor / 100, vat: (totalMinor - netMinor) / 100 };
}

/**
 * 1 – The invoice as a document: white sheet, hairlines, wide margins, labels
 * over values rather than boxed fields. Uses the field radius (12px), not the
 * card radius – a softer corner would stop it reading as paper.
 */
export function InvoicePreview({
  content,
  currency,
  locale,
}: { content: InvoicePreviewContent } & MoneyFormat) {
  const { net, vat } = splitVat(content.total, content.vatRate);
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(
    content.vatRate,
  );
  const money = (amount: number) => formatMoney(amount, currency, locale);

  return (
    <article
      aria-label={content.label}
      className={`flex h-full w-full flex-col bg-white px-5 py-5 text-left text-black shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] ${RADIUS.field}`}
    >
      <div className="min-w-0">
        <p className="text-ui-body font-semibold">{content.sender.name}</p>
        <p className="text-ui-label text-gray-600">{content.sender.address}</p>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-gray-200 pt-3">
        <h3 className="text-ui-title">{content.documentTitle}</h3>
        <p className="text-ui-label tabular-nums text-gray-600">
          {content.number.label} {content.number.value}
        </p>
      </div>

      <dl className="text-ui-label mt-3 space-y-1">
        <div>
          <dt className="text-gray-600">{content.recipient.label}</dt>
          <dd className="text-ui-body text-black">{content.recipient.name}</dd>
          <dd className="text-gray-600">{content.recipient.address}</dd>
        </div>
        <div className="flex justify-between gap-3 pt-2">
          <dt className="text-gray-600">{content.issued.label}</dt>
          <dd className="tabular-nums">{content.issued.value}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600">{content.due.label}</dt>
          <dd className="tabular-nums">{content.due.value}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-start justify-between gap-3 border-y border-gray-200 py-3">
        <div className="min-w-0">
          <p className="text-ui-body">{content.line.description}</p>
          <p className="text-ui-label text-gray-600">{content.line.detail}</p>
        </div>
        <p className="text-ui-body whitespace-nowrap tabular-nums">{money(content.total)}</p>
      </div>

      <dl className="text-ui-label mt-auto space-y-1 pt-3">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600">{content.netLabel}</dt>
          <dd className="tabular-nums">{money(net)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600">
            {content.vatLabel} {percent}
          </dt>
          <dd className="tabular-nums">{money(vat)}</dd>
        </div>
        <div className="text-ui-body flex justify-between gap-3 border-t border-gray-200 pt-2 font-semibold">
          <dt>{content.totalLabel}</dt>
          <dd className="tabular-nums">{money(content.total)}</dd>
        </div>
      </dl>
    </article>
  );
}

/**
 * The "Skapa faktura" button. `pressed` freezes it mid-click and lifts it above
 * a dim behind a dialog (z-10) – it is what opened the dialog, and dimmed it
 * would drop below 4.5:1. Illustration only.
 */
export function CreateInvoiceButton({ label, pressed = false }: { label: string; pressed?: boolean }) {
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
 * 2 – "Ny faktura" dialog, drawn as a still of the flow: a labelled group,
 * not a real dialog. `fields` trims the form for narrow boxes – text stays at
 * `.text-ui-label` or larger, the form gets shorter instead:
 *   inline → recipient + amount with the button on the same row (one row
 *            tall, so the list above it keeps three readable rows)
 *   full   → recipient, product/service, amount, due date, button below
 */
export function CreateInvoiceDialog({
  content,
  fields,
  currency,
  locale,
}: { content: CreateInvoiceContent; fields: 'inline' | 'full' } & MoneyFormat) {
  const titleId = useId();
  const amount = (
    <Field label={content.amount.label}>
      <span className="block truncate tabular-nums">
        {formatMoney(content.amount.value, currency, locale)}
      </span>
    </Field>
  );
  const recipient = (
    <Field label={content.recipient.label}>
      <span className="block truncate">{content.recipient.value}</span>
    </Field>
  );
  const submit = (
    <span
      className={`text-ui-body flex items-center justify-center whitespace-nowrap bg-teal-dark px-4 py-2 text-white ${RADIUS.control}`}
    >
      {content.submitLabel}
    </span>
  );

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`w-full bg-white text-left text-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.04)] ${RADIUS.card} ${
        fields === 'inline' ? 'p-3' : 'p-4'
      }`}
    >
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>

      {fields === 'inline' ? (
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
          {recipient}
          {amount}
          {submit}
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {recipient}
            <Field label={content.item.label}>
              <span className="block truncate">{content.item.value}</span>
            </Field>
            {amount}
            <Field label={content.due.label}>
              <span className="block truncate tabular-nums">{content.due.value}</span>
            </Field>
          </div>
          <div className="mt-3">{submit}</div>
        </>
      )}
    </div>
  );
}

const statusStyle: Record<InvoiceStatus, string> = {
  paid: 'bg-status-paid-bg text-status-paid',
  unpaid: 'bg-status-unpaid-bg text-status-unpaid',
  overdue: 'bg-status-overdue-bg text-status-overdue',
};

/** Icon shape differs per status too, so colour is never the only signal. */
const statusIcon: Record<InvoiceStatus, ReactNode> = {
  paid: <path strokeLinecap="round" strokeLinejoin="round" d="m5 10.5 3 3 7-7" />,
  unpaid: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path strokeLinecap="round" d="M10 7v3.2l2 1.3" />
    </>
  ),
  overdue: (
    <>
      <path strokeLinejoin="round" d="M10 3.5 17 16H3z" />
      <path strokeLinecap="round" d="M10 8.5v3M10 13.8v.01" />
    </>
  ),
};

export function StatusBadge({ status, label }: { status: InvoiceStatus; label: string }) {
  return (
    <span
      className={`text-ui-label inline-flex items-center gap-1 whitespace-nowrap py-0.5 pl-1.5 pr-2 ${RADIUS.control} ${statusStyle[status]}`}
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
        {statusIcon[status]}
      </svg>
      {label}
    </span>
  );
}

/**
 * 3 – Invoice list with status and an optional integration mark per row.
 *
 * The mark is a square logo SLOT: it renders whatever file the content points
 * at and never draws a logo itself. Rows without a mark keep the empty slot
 * so recipients stay aligned. `actions` sits in the header next to "Se alla
 * fakturor" – the composition puts the pressed "Skapa faktura" button there.
 * `dense` tightens spacing for the two smaller boxes. `showTitle={false}`
 * keeps the heading for screen readers only; `maxRows`
 * trims the list so no row is ever cut off by the box.
 */
export function InvoiceList({
  content,
  currency,
  locale,
  actions,
  showTitle = true,
  maxRows,
  dense = false,
}: {
  content: InvoiceListContent;
  actions?: ReactNode;
  showTitle?: boolean;
  /** Show only the first N rows – the composition sizes this to its box. */
  maxRows?: number;
  /** Tighter rows and gaps and a 16px logo slot, for the two smaller boxes. */
  dense?: boolean;
} & MoneyFormat) {
  const titleId = useId();
  const integrations = new Map(content.integrations.map((i) => [i.id, i]));

  return (
    <div role="group" aria-labelledby={titleId} className="flex h-full w-full flex-col text-left text-black">
      <div className="flex items-center gap-2">
        <h3 id={titleId} className={showTitle ? 'text-ui-title mr-auto' : 'sr-only'}>
          {content.title}
        </h3>
        <span className={showTitle ? '' : 'mr-auto'}>
          <FauxButton variant="quiet">{content.seeAllLabel}</FauxButton>
        </span>
        {actions}
      </div>

      <ul className={`divide-y divide-gray-200 ${dense ? 'mt-1' : 'mt-2'}`}>
        {content.rows.slice(0, maxRows).map((row) => {
          const integration = row.integrationId ? integrations.get(row.integrationId) : undefined;
          return (
            <li key={row.id} className={`flex items-center ${dense ? 'gap-2 py-1.5' : 'gap-2.5 py-2'}`}>
              <span
                className={`flex flex-shrink-0 items-center justify-center ${dense ? 'h-4 w-4' : 'h-5 w-5'}`}
              >
                {integration ? (
                  // Plain <img>: must render outside Next (Remotion). Square, no
                  // radius – vendor logos bring their own shape.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={integration.logo.src}
                    alt={`${content.integrationAltPrefix} ${integration.label}`}
                    title={`${content.integrationAltPrefix} ${integration.label}`}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ui-body block truncate">{row.recipient}</span>
                <span className="text-ui-label block whitespace-nowrap tabular-nums text-gray-600">{row.date}</span>
              </span>
              <span className="text-ui-body whitespace-nowrap text-right tabular-nums">
                {formatMoney(row.amount, currency, locale)}
              </span>
              <span className="flex w-[5.75rem] flex-shrink-0 justify-end">
                <StatusBadge status={row.status} label={content.statusLabels[row.status]} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

'use client';

import { useId } from 'react';
import { formatMoney, RADIUS } from '../payment-cards/primitives';
import { Pill, ReplayButton, T, UiButton } from './ui';
import { useSequence } from './useSequence';

type Party = { name: string; lines: string[] };
type OfferLine = { id: string; description: string; quantity: number; unitPrice: number; vatRate: number };
type ActionKey = 'edit' | 'pdf' | 'send' | 'duplicate' | 'delete' | 'invoice' | 'paymentLink';
type Status = 'draft' | 'sent' | 'accepted';

export type OfferWidgetContent = {
  label: string;
  documentTitle: string;
  sender: string;
  number: { label: string; value: string };
  date: { label: string; value: string };
  validUntil: { label: string; value: string };
  from: { label: string } & Party;
  to: { label: string } & Party;
  columns: { description: string; quantity: string; unitPrice: string; vat: string; amount: string };
  lines: OfferLine[];
  subtotalLabel: string;
  vatLabel: string;
  totalLabel: string;
  statusLabel: string;
  statuses: Record<Status, string>;
  markAs: { accepted: string; declined: string };
  actionsLabel: string;
  actions: Record<ActionKey, string>;
};

/*
 * "Offerter som blir fakturor": a quote laid out like the portal's PDF, with the
 * portal's actions under it. Which actions apply depends on the status, as in the
 * portal: a draft can be edited and deleted, a sent quote is marked accepted (or
 * declined) by you, and an accepted quote becomes an invoice or a payment link.
 *
 *   0 draft → 1 "Skicka till kund" pressed → 2 sent → 3 "Accepterad" pressed → 4 accepted
 */
const DURATIONS = [1100, 350, 1500, 350];

const AVAILABLE: Record<Status, ActionKey[]> = {
  draft: ['edit', 'pdf', 'send', 'duplicate', 'delete'],
  sent: ['pdf', 'send', 'duplicate'],
  accepted: ['pdf', 'duplicate', 'invoice', 'paymentLink'],
};

export function OfferWidget({ content: c, currency, locale }: { content: OfferWidgetContent; currency: string; locale: string }) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const titleId = useId();
  const money = (n: number) => formatMoney(n, currency, locale);
  const status: Status = step >= 4 ? 'accepted' : step >= 2 ? 'sent' : 'draft';
  const available = AVAILABLE[status];

  const subtotal = c.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const vat = c.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice * l.vatRate, 0);
  const vatRate = c.lines[0]?.vatRate ?? 0;

  const action = (key: ActionKey, tone: 'accent' | 'quiet' | 'danger') => {
    const on = available.includes(key);
    return (
      <span key={key} className={`transition-opacity duration-300 motion-reduce:transition-none ${on ? 'opacity-100' : 'opacity-35'}`}>
        <UiButton tone={on ? tone : 'quiet'} pressed={key === 'send' && step === 1}>
          {c.actions[key]}
        </UiButton>
      </span>
    );
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
      }}
      className="@container w-full text-left text-black"
    >
      <article
        aria-labelledby={titleId}
        className={`bg-white px-5 py-6 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)] ring-1 ring-gray-200 sm:px-7 sm:py-7 ${RADIUS.field}`}
      >
        <p className="sr-only">{c.label}</p>

        {/* Head: sender left, document title and numbers right. */}
        <div className="flex flex-col gap-4 @lg:flex-row @lg:items-start @lg:justify-between">
          <p className={`${T.title}`}>{c.sender}</p>
          <div className="@lg:text-right">
            <h3 id={titleId} className="text-[1.5rem] font-semibold leading-none tracking-[-0.01em]">
              {c.documentTitle}
            </h3>
            <dl className={`${T.label} mt-2 grid grid-cols-[auto_auto] justify-start gap-x-3 gap-y-0.5 text-gray-600 @lg:justify-end`}>
              {[c.number, c.date, c.validUntil].map((row) => (
                <div key={row.label} className="contents">
                  <dt>{row.label}</dt>
                  <dd className="tabular-nums text-black">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* From / to. */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 @md:grid-cols-2">
          {[c.from, c.to].map((party) => (
            <div key={party.label}>
              <p className={`${T.overline} text-gray-600`}>{party.label}</p>
              <p className={`${T.body} mt-1 font-semibold`}>{party.name}</p>
              {party.lines.map((line) => (
                <p key={line} className={`${T.label} text-gray-700`}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Lines: a table from 30rem, stacked rows below that. */}
        <div className="mt-6">
          <div className={`${T.label} hidden grid-cols-[minmax(0,1fr)_3rem_6rem_3.5rem_6.5rem] gap-3 border-b border-gray-300 pb-2 text-gray-600 @lg:grid`}>
            <span>{c.columns.description}</span>
            <span className="text-right">{c.columns.quantity}</span>
            <span className="text-right">{c.columns.unitPrice}</span>
            <span className="text-right">{c.columns.vat}</span>
            <span className="text-right">{c.columns.amount}</span>
          </div>
          <ul className="divide-y divide-gray-200 border-b border-gray-200">
            {c.lines.map((l) => (
              <li key={l.id} className="py-2.5 @lg:grid @lg:grid-cols-[minmax(0,1fr)_3rem_6rem_3.5rem_6.5rem] @lg:gap-3">
                <span className={`${T.body} block min-w-0 break-words`}>{l.description}</span>
                <span className={`${T.label} block text-gray-600 @lg:hidden`}>
                  {l.quantity} × {money(l.unitPrice)} · {c.columns.vat} {Math.round(l.vatRate * 100)} %
                </span>
                <span className={`${T.body} hidden text-right tabular-nums @lg:block`}>{l.quantity}</span>
                <span className={`${T.body} hidden text-right tabular-nums @lg:block`}>{money(l.unitPrice)}</span>
                <span className={`${T.body} hidden text-right tabular-nums @lg:block`}>{Math.round(l.vatRate * 100)} %</span>
                <span className={`${T.body} block text-right tabular-nums`}>{money(l.quantity * l.unitPrice)}</span>
              </li>
            ))}
          </ul>
          <dl className="ml-auto mt-3 max-w-[18rem] space-y-1">
            <div className={`${T.body} flex justify-between gap-4`}>
              <dt className="text-gray-600">{c.subtotalLabel}</dt>
              <dd className="tabular-nums">{money(subtotal)}</dd>
            </div>
            <div className={`${T.body} flex justify-between gap-4`}>
              <dt className="text-gray-600">
                {c.vatLabel} {Math.round(vatRate * 100)} %
              </dt>
              <dd className="tabular-nums">{money(vat)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-300 pt-2 text-[1.0625rem] font-semibold">
              <dt>{c.totalLabel}</dt>
              <dd className="tabular-nums">{money(subtotal + vat)}</dd>
            </div>
          </dl>
        </div>
      </article>

      {/* Status and the portal's actions for it. */}
      <div className={`mt-4 bg-white p-4 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] ring-1 ring-gray-200 sm:p-5 ${RADIUS.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`${T.label} flex items-center gap-2 text-gray-600`}>
            {c.statusLabel}
            <span aria-live="polite">
              <Pill tone={status === 'accepted' ? 'paid' : status === 'sent' ? 'muted' : 'outline'}>{c.statuses[status]}</Pill>
            </span>
          </p>
          {/* Sent quotes are marked accepted or declined by you. */}
          <span className={`flex gap-2 transition-opacity duration-300 motion-reduce:transition-none ${status === 'sent' ? 'opacity-100' : 'opacity-0'}`} aria-hidden={status !== 'sent'}>
            <UiButton tone="quiet" pressed={step === 3}>
              {c.markAs.accepted}
            </UiButton>
            <UiButton tone="quiet">{c.markAs.declined}</UiButton>
          </span>
        </div>
        <div role="group" className="mt-3 flex flex-wrap gap-2" aria-label={c.actionsLabel}>
          {action('edit', 'quiet')}
          {action('pdf', 'quiet')}
          {action('send', 'quiet')}
          {action('duplicate', 'quiet')}
          {action('delete', 'danger')}
          {action('invoice', 'accent')}
          {action('paymentLink', 'accent')}
        </div>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  );
}

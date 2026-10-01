'use client';

import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { formatMoney, RADIUS } from '../payment-cards/primitives';
import { EASE, ReplayButton, T, UiButton } from './ui';
import { useSequence } from './useSequence';

export type CheckoutWidgetContent = {
  label: string;
  shopName: string;
  summaryTitle: string;
  lines: { id: string; name: string; quantity: number; unitPrice: number }[];
  subtotalLabel: string;
  code: { label: string; placeholder: string; value: string; rate: number; applyLabel: string; appliedLabel: string };
  totalLabel: string;
  payment: { title: string; method: string; cardNumber: string; expiry: string; cvc: string };
  payLabel: string;
  secureNote: string;
};

/*
 * "Kassan i ditt utseende": the customer's checkout with the shop's logo and
 * accent colour, an order summary, the discount-code field ("Lägg till"), and
 * card as the payment method – the only method the shop's checkout uses. The
 * sequence types a code, adds it, and the discount is taken off the total.
 *
 *   0 empty field → 1 typing → 2 code typed → 3 "Lägg till" pressed → 4 discount applied
 */
const DURATIONS = [1000, 450, 500, 350];

export function CheckoutWidget({
  content: c,
  currency,
  locale,
  accent = '#1F3A5F',
}: {
  content: CheckoutWidgetContent;
  currency: string;
  locale: string;
  /** The shop's own accent colour – one colour, as in the portal's checkout settings. */
  accent?: string;
}) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const money = (n: number) => formatMoney(n, currency, locale);
  const subtotal = c.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const discount = Math.round(subtotal * c.code.rate * 100) / 100;
  const applied = step >= 4;
  const typed = step >= 2 || applied ? c.code.value : step === 1 ? c.code.value.slice(0, 5) : '';

  return (
    <div
      ref={(el) => {
        ref.current = el;
      }}
      role="group"
      aria-label={c.label}
      className={`@container w-full overflow-hidden bg-white text-left text-black shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)] ring-1 ring-gray-200 ${RADIUS.card}`}
    >
      {/* The shop's own header: logo and accent colour. */}
      <div className="flex items-center gap-3 px-5 py-4 text-white sm:px-6" style={{ backgroundColor: accent }}>
        <span className={`flex h-9 w-9 items-center justify-center bg-white text-[0.9375rem] font-bold ${RADIUS.control}`} style={{ color: accent }} aria-hidden="true">
          {c.shopName.slice(0, 1)}
        </span>
        <span className="text-[1.0625rem] font-semibold">{c.shopName}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 @xl:grid-cols-2">
        {/* Order summary with the code field. */}
        <div>
          <p className={`${T.overline} text-gray-600`}>{c.summaryTitle}</p>
          <ul className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
            {c.lines.map((l) => (
              <li key={l.id} className="flex items-baseline justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className={`${T.body} block truncate`}>{l.name}</span>
                  <span className={`${T.label} text-gray-600`}>
                    {l.quantity} × {money(l.unitPrice)}
                  </span>
                </span>
                <span className={`${T.body} shrink-0 tabular-nums`}>{money(l.quantity * l.unitPrice)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <p className={`${T.label} text-gray-600`}>{c.code.label}</p>
            <div className="mt-1 flex gap-2">
              <span
                className={`${T.body} flex min-w-0 flex-1 items-center border px-3.5 py-2 font-mono tracking-[0.1em] ${RADIUS.field} ${
                  step >= 1 && !applied ? 'border-gray-500' : 'border-gray-300'
                }`}
              >
                {typed ? <span className="truncate">{typed}</span> : <span className="truncate font-sans tracking-normal text-gray-500">{c.code.placeholder}</span>}
                {step >= 1 && step < 4 ? <span className="ml-0.5 h-4 w-px animate-pulse bg-black motion-reduce:animate-none" aria-hidden="true" /> : null}
              </span>
              <UiButton tone="dark" pressed={step === 3}>
                {c.code.applyLabel}
              </UiButton>
            </div>
          </div>

          <dl className="mt-4 space-y-1.5">
            <div className={`${T.body} flex justify-between gap-3`}>
              <dt className="text-gray-600">{c.subtotalLabel}</dt>
              <dd className="tabular-nums">{money(subtotal)}</dd>
            </div>
            {/* The discount row is always there, so adding the code moves nothing. */}
            <div
              aria-hidden={!applied}
              className={`${T.body} flex justify-between gap-3 text-teal-dark transition-opacity duration-300 ${EASE} ${applied ? 'opacity-100' : 'opacity-0'}`}
            >
              <dt>
                {c.code.appliedLabel} <span className="font-mono tracking-[0.08em]">{c.code.value}</span>
              </dt>
              <dd className="tabular-nums">−{money(discount)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-gray-300 pt-2 text-[1.0625rem] font-semibold">
              <dt>{c.totalLabel}</dt>
              <dd className="tabular-nums" aria-live="polite">
                {money(applied ? subtotal - discount : subtotal)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Payment: card. */}
        <div>
          <p className={`${T.overline} text-gray-600`}>{c.payment.title}</p>
          <div className={`mt-2 flex items-center gap-2.5 border-2 px-3.5 py-2.5 ${RADIUS.field}`} style={{ borderColor: accent }}>
            <CreditCardIcon className="h-5 w-5" style={{ color: accent }} aria-hidden="true" />
            <span className={T.body}>{c.payment.method}</span>
          </div>
          <div className={`mt-3 overflow-hidden border border-gray-300 ${RADIUS.field}`}>
            <p className={`${T.body} border-b border-gray-300 px-3.5 py-2.5 font-mono tracking-[0.08em] text-gray-500`}>{c.payment.cardNumber}</p>
            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <p className={`${T.body} px-3.5 py-2.5 text-gray-500`}>{c.payment.expiry}</p>
              <p className={`${T.body} px-3.5 py-2.5 text-gray-500`}>{c.payment.cvc}</p>
            </div>
          </div>
          <span
            className={`${T.body} mt-4 flex w-full items-center justify-center px-4 py-3 font-semibold text-white ${RADIUS.control}`}
            style={{ backgroundColor: accent }}
          >
            {c.payLabel} {money(applied ? subtotal - discount : subtotal)}
          </span>
          <p className={`${T.label} mt-2 flex items-center justify-center gap-1.5 text-gray-600`}>
            <LockClosedIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {c.secureNote}
          </p>
        </div>
      </div>
      <div className="px-5 pb-4 sm:px-6">
        <ReplayButton onClick={replay} />
      </div>
    </div>
  );
}

'use client';

import { useId } from 'react';
import type {
  CheckoutCardContent,
  PaymentLinkCardContent,
  SubscriptionCardContent,
} from './content';
import {
  CardHeader,
  CardShell,
  FauxButton,
  Field,
  PlusIcon,
  RADIUS,
  Subheading,
  SwitchRow,
  formatMoney,
  formatNumber,
} from './primitives';

type MoneyFormat = { currency: string; locale: string };

/** Card 1 – a subscription with three delivery intervals. */
export function SubscriptionCard({
  content,
  currency,
  locale,
}: { content: SubscriptionCardContent } & MoneyFormat) {
  const titleId = useId();

  return (
    <CardShell labelledBy={titleId}>
      <CardHeader titleId={titleId} title={content.title} />

      <div className="mt-5">
        <Field label={content.field.label}>{content.field.value}</Field>
      </div>

      <div className="mt-6">
        <Subheading>{content.frequencyHeading}</Subheading>
        <ul className="mt-1 divide-y divide-gray-200">
          {content.frequencies.map((row) => (
            <li key={row.id} className="text-ui-body flex items-baseline justify-between gap-4 py-3">
              <span className="text-black">{row.label}</span>
              <span className="whitespace-nowrap text-right tabular-nums text-black">
                {formatMoney(row.amount, currency, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <FauxButton variant="quiet" icon={<PlusIcon />}>
          {content.addLabel}
        </FauxButton>
      </div>
    </CardShell>
  );
}

/** Card 2 – the customer's checkout: image header with amount, then payment methods. */
export function CheckoutCard({
  content,
  currency,
  locale,
  featured,
}: { content: CheckoutCardContent; featured?: boolean } & MoneyFormat) {
  return (
    <CardShell label={content.label} featured={featured} flush>
      <div className="relative isolate flex h-52 flex-col justify-end overflow-hidden bg-black-tertiary p-5 text-white">
        {content.image ? (
          // Plain <img>, not next/image: the card has to render outside Next
          // (Remotion texture), and next/image needs the Next runtime.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.image.src}
            alt={content.image.alt}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 -z-10"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(120% 90% at 85% 0%, var(--color-teal-dark) 0%, rgba(0,128,109,0.35) 45%, transparent 75%), var(--color-black-tertiary)',
            }}
          />
        )}
        {/* Scrim under the text – keeps white text above 4.5:1 on any photo. */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          aria-hidden="true"
        />

        <p className="text-ui-label text-white/85">{content.orderLine}</p>
        <p className="text-ui-amount mt-1 tabular-nums">
          {formatMoney(content.amount, currency, locale)}
        </p>
      </div>

      <div className="space-y-3 p-5">
        {content.methodGroups.map((group, index) => (
          <ul
            key={index}
            className={`divide-y divide-gray-200 border border-gray-200 px-3.5 ${RADIUS.field}`}
          >
            {group.map((method) => (
              <li key={method.id} className="flex items-center justify-between gap-3 py-3">
                <span className="text-ui-body text-black">{method.label}</span>
                <FauxButton>{method.actionLabel}</FauxButton>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </CardShell>
  );
}

/** Card 3 – creating a payment link, with two advanced switches. */
export function PaymentLinkCard({
  content,
  currency,
  locale,
}: { content: PaymentLinkCardContent } & MoneyFormat) {
  const titleId = useId();

  return (
    <CardShell labelledBy={titleId}>
      <CardHeader titleId={titleId} title={content.title} withMenu />

      <div className="mt-5 space-y-3">
        <Field label={content.productField.label}>{content.productField.value}</Field>

        <Field label={content.amountField.label}>
          <span className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 bg-gray-100 px-2.5 py-0.5 text-ui-label text-black ${RADIUS.control}`}
            >
              {currency}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5.5 8 4.5 4.5L14.5 8" />
              </svg>
            </span>
            <span className="ml-auto tabular-nums">{formatNumber(content.amountField.amount, locale)}</span>
          </span>
        </Field>
      </div>

      <div className="mt-6">
        <Subheading>{content.advancedHeading}</Subheading>
        <div className="mt-1 divide-y divide-gray-200">
          {content.options.map((option) => (
            <SwitchRow key={option.id} label={option.label} defaultOn={option.defaultOn} />
          ))}
        </div>
      </div>
    </CardShell>
  );
}

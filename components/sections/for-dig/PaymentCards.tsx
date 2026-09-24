'use client';

import { CheckoutCard, PaymentLinkCard, SubscriptionCard } from './payment-cards/cards';
import { paymentCardsDefaults, type PaymentCardsContent } from './payment-cards/content';

export type { PaymentCardsContent } from './payment-cards/content';

type PaymentCardsProps = Partial<PaymentCardsContent>;

/**
 * Three mock UI cards showing what a shop owner can do with payments:
 * subscription, checkout, payment link. Used as the content of the
 * "Börja ta betalt" section on the Privat page.
 *
 * Self-contained on purpose – it is also meant to be rendered as a texture in
 * the Remotion project. No framer-motion, no next/image, no page context: only
 * props, design tokens from globals.css and the `.text-ui-*` classes from
 * typography.css. Any prop left out falls back to `paymentCardsDefaults`.
 *
 * Layout: stacked below `lg`, three side by side from `lg` with the middle card
 * slightly scaled and lifted by a deeper shadow. Stacked rather than a
 * swipeable row on mobile because the next section is already a horizontal
 * scroller, and three cards is few enough to read straight through.
 *
 * Dark backdrop: the cards expect to sit on black. A faint radial light behind
 * the group gives the shadows something to fall on – pure black swallows them.
 */
export function PaymentCards(props: PaymentCardsProps) {
  const { label, currency, locale, subscription, checkout, paymentLink } = {
    ...paymentCardsDefaults,
    ...props,
  };
  const money = { currency, locale };

  return (
    <div role="group" aria-label={label} className="relative isolate mx-auto w-full max-w-[64rem]">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[80%] -translate-y-1/2"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.10) 0%, rgba(0,191,166,0.06) 45%, transparent 100%)',
        }}
      />

      <div className="mx-auto grid max-w-[22rem] grid-cols-1 items-center gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
        <SubscriptionCard content={subscription} {...money} />
        <CheckoutCard content={checkout} featured {...money} />
        <PaymentLinkCard content={paymentLink} {...money} />
      </div>
    </div>
  );
}

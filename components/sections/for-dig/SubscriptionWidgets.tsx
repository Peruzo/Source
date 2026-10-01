'use client';

import {
  subscriptionWidgetsDefaults,
  summarize,
  type SubscriptionWidgetsContent,
} from './subscription-widgets/content';
import { RADIUS } from './payment-cards/primitives';
import { SubscriptionDiscount, type SubscriptionDiscountContent } from './interactive/SubscriptionDiscount';
import {
  IncomingPayments,
  NewSubscriptionButton,
  NewSubscriptionDialog,
  SubscriptionTiers,
} from './subscription-widgets/widgets';

export type { SubscriptionWidgetsContent } from './subscription-widgets/content';
export { summarize } from './subscription-widgets/content';
export {
  IncomingPayments,
  NewSubscriptionButton,
  NewSubscriptionDialog,
  SubscriptionTiers,
} from './subscription-widgets/widgets';

type SubscriptionWidgetsProps = Partial<SubscriptionWidgetsContent> & {
  /** Larger level cards, for a full-screen section. Off by default (Privat Start is unchanged). */
  large?: boolean;
  /**
   * Replaces the "Ny prenumeration" tile with the customers' subscriptions and a
   * discount added to one of them (interactive). Off by default (Privat Start is unchanged).
   */
  discount?: SubscriptionDiscountContent;
};

/**
 * Visual for "Prenumerationer": a bento grid – tiles of different weight, like
 * a dashboard. The RUNNING side of a subscription business ("Börja ta betalt"
 * already shows setting one up): incoming payments take the widest tile, the
 * customer's three levels are one tile each, and "Ny prenumeration" has its
 * own tall tile next to the pressed button.
 *
 * Natural height, transparent, reads only its OWN width (container queries)
 * so it renders the same in isolation (Remotion texture). Two steps:
 *   < 768 px  stacked: payments (runs under the total) → levels → dialog;
 *             levels side by side from 448 px, one per row below that
 *   ≥ 768 px  bento: payments 3 columns wide with the runs beside the total,
 *             levels below it, dialog as a tall tile on the right
 */
export function SubscriptionWidgets(props: SubscriptionWidgetsProps) {
  const { large = false, discount, ...rest } = props;
  const { currency, locale, incoming, tiers, create } = {
    ...subscriptionWidgetsDefaults,
    ...rest,
  };
  const money = { currency, locale };
  const summary = summarize(tiers.tiers);

  return (
    <div className={`@container mx-auto w-full max-w-[68rem] text-left${discount ? ' relative' : ''}`}>
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-4">
        <div className={`bg-white p-5 @3xl:col-span-3 @3xl:p-6 ${RADIUS.card}`}>
          <div className="mb-3 flex justify-end">
            {/* Pressed only when its own dialog is the tile beside it. */}
            <NewSubscriptionButton label={create.buttonLabel} pressed={!discount} />
          </div>
          <IncomingPayments content={incoming} summary={summary} split {...money} />
        </div>

        <div className="order-3 @3xl:order-none @3xl:col-start-4 @3xl:row-span-2 @3xl:row-start-1">
          {discount ? (
            <SubscriptionDiscount content={discount} {...money} />
          ) : (
            <NewSubscriptionDialog content={create} {...money} />
          )}
        </div>

        <div className="order-2 @3xl:order-none @3xl:col-span-3">
          <SubscriptionTiers content={tiers} tiles large={large} className="grid-cols-1 @md:grid-cols-3" {...money} />
        </div>
      </div>
    </div>
  );
}

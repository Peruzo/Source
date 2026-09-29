'use client';

import {
  subscriptionWidgetsDefaults,
  summarize,
  type SubscriptionWidgetsContent,
} from './subscription-widgets/content';
import { RADIUS } from './payment-cards/primitives';
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

type SubscriptionWidgetsProps = Partial<SubscriptionWidgetsContent>;

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
  const { currency, locale, incoming, tiers, create } = {
    ...subscriptionWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };
  const summary = summarize(tiers.tiers);

  return (
    <div className="@container mx-auto w-full max-w-[68rem] text-left">
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-4">
        <div className={`bg-white p-5 @3xl:col-span-3 @3xl:p-6 ${RADIUS.card}`}>
          <div className="mb-3 flex justify-end">
            <NewSubscriptionButton label={create.buttonLabel} pressed />
          </div>
          <IncomingPayments content={incoming} summary={summary} split {...money} />
        </div>

        <div className="order-3 @3xl:order-none @3xl:col-start-4 @3xl:row-span-2 @3xl:row-start-1">
          <NewSubscriptionDialog content={create} {...money} />
        </div>

        <div className="order-2 @3xl:order-none @3xl:col-span-3">
          <SubscriptionTiers content={tiers} tiles className="grid-cols-1 @md:grid-cols-3" {...money} />
        </div>
      </div>
    </div>
  );
}

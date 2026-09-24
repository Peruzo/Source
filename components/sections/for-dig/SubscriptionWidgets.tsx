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
 * Visual for the "Prenumerationer" panel in HorizontalScrollSection: the
 * RUNNING side of a subscription business – section 3 (PaymentCards) already
 * shows setting one up. Incoming payments on top, the customer's own three
 * levels below, and – where there is room – the "Ny prenumeration" dialog.
 *
 * Unlike the other panels the dialog does not cover the screen: here the
 * screen itself (revenue and levels) is the message, so the dialog floats
 * beside it, next to the pressed button, instead of dimming it.
 *
 * Fills its parent box – built for the panel's 4:3 media box (662 × 497 px at
 * a 1440 px viewport, 332 × 249 px at 390 px). Reads only its OWN width via
 * container queries, never the viewport, so it renders the same in isolation
 * (Remotion texture). Same three steps as the other panels:
 *   < 448 px  incoming payments only, with the upcoming autogiro runs
 *   448–575   incoming payments (no run list) + the three levels
 *   ≥ 576     incoming payments + levels with what's included; dialog beside
 * Text never scales down; the content is trimmed instead. Hidden layouts are
 * `display: none`, so they are out of the accessibility tree and tab order.
 */
export function SubscriptionWidgets(props: SubscriptionWidgetsProps) {
  const { currency, locale, screenTitle, incoming, tiers, create } = {
    ...subscriptionWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };
  const summary = summarize(tiers.tiers);

  const screen = (step: 'medium' | 'full') => (
    <div className={`flex h-full flex-col bg-white p-3 ${RADIUS.card}`}>
      <div className="flex items-center gap-2">
        <h3 className="text-ui-title mr-auto">{screenTitle}</h3>
        <NewSubscriptionButton label={create.buttonLabel} pressed={step === 'full'} />
      </div>
      <div className="mt-2.5">
        <IncomingPayments content={incoming} summary={summary} charges={step === 'full'} {...money} />
      </div>
      <div className="mt-4 min-h-0 flex-1">
        <SubscriptionTiers content={tiers} {...money} />
      </div>
    </div>
  );

  return (
    <div
      className="@container relative h-full w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 100% 0%, rgba(0,128,109,0.55) 0%, transparent 60%), var(--color-black-tertiary)',
      }}
    >
      <div className="h-full p-2 @md:hidden">
        <div className={`h-full bg-white p-3 ${RADIUS.card}`}>
          <IncomingPayments content={incoming} summary={summary} {...money} />
        </div>
      </div>

      <div className="hidden h-full p-3 @md:block @xl:hidden">{screen('medium')}</div>

      <div className="hidden h-full gap-4 p-4 @xl:flex">
        <div className="min-w-0 flex-1">{screen('full')}</div>
        <div className="w-[13.5rem] flex-shrink-0">
          <NewSubscriptionDialog content={create} {...money} />
        </div>
      </div>
    </div>
  );
}

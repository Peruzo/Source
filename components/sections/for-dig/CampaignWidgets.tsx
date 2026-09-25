'use client';

import { campaignWidgetsDefaults, type CampaignWidgetsContent } from './campaign-widgets/content';
import { CARD_EDGE, RADIUS } from './payment-cards/primitives';
import {
  CampaignCode,
  CreateCampaignButton,
  CreateCampaignDialog,
  SaleGrid,
  SaleProductCard,
} from './campaign-widgets/widgets';

export type { CampaignWidgetsContent } from './campaign-widgets/content';
export {
  CampaignCode,
  CreateCampaignButton,
  CreateCampaignDialog,
  SaleGrid,
  SaleProductCard,
  salePrice,
} from './campaign-widgets/widgets';

type CampaignWidgetsProps = Partial<CampaignWidgetsContent>;

/**
 * Visual for "Kampanjer": a compact collage read at a glance – the opposite
 * rhythm of the tall scrolling column in the products section. The "Ny
 * kampanj" dialog with the discount code tucked under it, the discounted
 * product card standing tall beside both (overlapping the dialog's edge), and
 * a row of discounted products below. Both columns carry content all the way
 * down – no hole – and overlaps only ever cover padding, never text.
 *
 * Natural height, transparent – built to sit on a white page: every card has
 * a hairline and a soft shadow (CARD_EDGE) instead of relying on a dark
 * backdrop. Reads only its OWN width (container queries) so it renders the
 * same in isolation (Remotion texture). Two steps:
 *   < 576 px  stacked: product card → code → dialog → 3 × 2 sale grid
 *   ≥ 576 px  collage: dialog + code left, tall product card right,
 *             sale grid 6 × 1 below
 * Overlap is plain grid placement + negative margins; no transforms, so the
 * cards keep their exact sizes.
 */
export function CampaignWidgets(props: CampaignWidgetsProps) {
  const { currency, locale, discountRate, priceLabels, create, code, card, grid } = {
    ...campaignWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };
  const sale = { rate: discountRate, labels: priceLabels, ...money };

  return (
    <div className="@container w-full text-left">
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-12 @xl:gap-0">
        <div className="order-3 @xl:order-none @xl:col-span-7 @xl:col-start-1 @xl:row-start-1">
          <div className="mb-3">
            <CreateCampaignButton label={create.buttonLabel} pressed />
          </div>
          <CreateCampaignDialog content={create} products={grid.products} fields="full" {...money} />
        </div>

        <div className="relative z-10 order-1 @xl:order-none @xl:col-span-5 @xl:col-start-8 @xl:row-span-2 @xl:row-start-1 @xl:-ml-3 @xl:self-center">
          <SaleProductCard product={card.product} imageClassName="aspect-[4/3] @xl:aspect-[4/5]" {...sale} />
        </div>

        <div className="relative z-20 order-2 @xl:order-none @xl:col-span-6 @xl:col-start-2 @xl:row-start-2 @xl:mt-4">
          <CampaignCode content={code} rate={discountRate} locale={locale} />
        </div>

        <div className="order-4 @xl:order-none @xl:col-span-12 @xl:row-start-3 @xl:mt-8">
          <div className={`bg-white p-4 ${CARD_EDGE} ${RADIUS.card}`}>
            <h3 className="text-ui-title mb-3 text-black">{grid.title}</h3>
            <SaleGrid products={grid.products} className="grid-cols-3 @xl:grid-cols-6" {...sale} />
          </div>
        </div>
      </div>
    </div>
  );
}

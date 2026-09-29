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
 * Visual for "Kampanjer": a compact collage read at a glance. The "Ny
 * kampanj" dialog with the discount code tucked under it, the discounted
 * product card standing tall beside both (overlapping the dialog's edge), and
 * a row of discounted products at the bottom. Overlaps only ever cover
 * padding, never text.
 *
 * Fills the height it is given: the sale-grid row takes the leftover height
 * and its PHOTOS grow – text never scales. Without a set height it falls
 * back to its natural height. Transparent; every card carries CARD_EDGE.
 * Reads only its OWN width (container queries) so it renders the same in
 * isolation (Remotion texture). Three steps:
 *   < 448 px  stacked: product card → code → dialog → 3 × 2 sale grid
 *   448–591   compact: dialog full width, product card + code side by side,
 *             sale grid 3 × 1 – keeps the section near one screen tall
 *   ≥ 592 px  collage: dialog (8/12) + code left, tall product card right,
 *             sale grid 6 × 1
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
    <div className="@container h-full w-full text-left">
      <div className="grid h-full grid-cols-1 gap-4 @md:grid-cols-12 @md:grid-rows-[auto_auto_1fr] @[37rem]:gap-0">
        <div className="order-3 @md:order-none @md:col-span-12 @md:row-start-1 @[37rem]:col-span-8 @[37rem]:col-start-1">
          <div className="mb-3">
            <CreateCampaignButton label={create.buttonLabel} pressed />
          </div>
          <CreateCampaignDialog content={create} products={grid.products} fields="full" {...money} />
        </div>

        <div className="relative z-10 order-1 @md:order-none @md:col-span-6 @md:col-start-1 @md:row-start-2 @[37rem]:col-span-4 @[37rem]:col-start-9 @[37rem]:row-span-2 @[37rem]:row-start-1 @[37rem]:-ml-3 @[37rem]:self-center">
          <SaleProductCard product={card.product} imageClassName="aspect-[4/3] @[37rem]:aspect-[4/5]" {...sale} />
        </div>

        <div className="relative z-20 order-2 @md:order-none @md:col-span-6 @md:col-start-7 @md:row-start-2 @[37rem]:col-span-7 @[37rem]:col-start-2 @[37rem]:mt-4">
          <CampaignCode content={code} rate={discountRate} locale={locale} />
        </div>

        <div className="order-4 flex flex-col @md:order-none @md:col-span-12 @md:row-start-3 @[37rem]:mt-8">
          <div className={`flex flex-1 flex-col bg-white p-4 ${CARD_EDGE} ${RADIUS.card}`}>
            <h3 className="text-ui-title mb-3 text-black">{grid.title}</h3>
            <SaleGrid
              products={grid.products}
              className="flex-1 grid-cols-3 @[37rem]:grid-cols-6 @md:@max-[39rem]:[&>li:nth-child(n+4)]:hidden"
              {...sale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

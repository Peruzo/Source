'use client';

import { campaignWidgetsDefaults, type CampaignWidgetsContent } from './campaign-widgets/content';
import { RADIUS } from './payment-cards/primitives';
import {
  CampaignCode,
  CampaignScreenHeader,
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
 * Visual for the "Kampanjer" panel in HorizontalScrollSection: a grid of
 * discounted products with "Skapa kampanj" pressed and the "Ny kampanj"
 * dialog open over it, and – where there is room – the discount code and a
 * single discounted product card beside it.
 *
 * Fills its parent box – built for the panel's 4:3 media box (662 × 497 px at
 * a 1440 px viewport, 332 × 249 px at 390 px). Reads only its OWN width via
 * container queries, never the viewport, so it renders the same in isolation
 * (Remotion texture). Same three steps as ProductWidgets and InvoiceWidgets:
 *   < 448 px  sale grid only, 3 × 1. The dialog would cover every product,
 *             and the single card is the grid's job at this size anyway.
 *   448–575   sale grid + short dialog: name, value, discount type
 *   ≥ 576     sale grid + full dialog; code and product card beside it
 * Text never scales down; the content is trimmed instead. Hidden layouts are
 * `display: none`, so they are out of the accessibility tree and tab order.
 */
export function CampaignWidgets(props: CampaignWidgetsProps) {
  const { currency, locale, discountRate, priceLabels, create, code, card, grid } = {
    ...campaignWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };
  const sale = { rate: discountRate, labels: priceLabels, ...money };

  const screen = (dialog: 'medium' | 'full' | null, columns: number, rows: number) => (
    <div className={`relative isolate flex h-full flex-col overflow-hidden bg-white p-3 ${RADIUS.card}`}>
      <CampaignScreenHeader title={grid.title} buttonLabel={create.buttonLabel} pressed={dialog !== null} />
      <div className="mt-2.5 min-h-0 flex-1">
        <SaleGrid products={grid.products} columns={columns} rows={rows} badges={dialog !== 'medium'} {...sale} />
      </div>

      {dialog ? (
        <>
          {/* Soft dim – the grid still reads as "sale on" behind the dialog. */}
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="absolute inset-x-2 bottom-2">
            <CreateCampaignDialog content={create} products={grid.products} fields={dialog} {...money} />
          </div>
        </>
      ) : null}
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
      <div className="h-full p-2 @md:hidden">{screen(null, 3, 1)}</div>

      <div className="hidden h-full p-3 @md:block @xl:hidden">{screen('medium', 4, 2)}</div>

      <div className="hidden h-full gap-4 p-4 @xl:flex">
        <div className="min-w-0 flex-1">{screen('full', 3, 2)}</div>
        <div className="flex w-[14.5rem] flex-shrink-0 flex-col gap-4">
          <CampaignCode content={code} rate={discountRate} locale={locale} />
          <div className="min-h-0 flex-1">
            <SaleProductCard product={card.product} {...sale} />
          </div>
        </div>
      </div>
    </div>
  );
}

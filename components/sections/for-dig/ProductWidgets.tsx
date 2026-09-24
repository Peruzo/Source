'use client';

import { productWidgetsDefaults, type ProductWidgetsContent } from './product-widgets/content';
import { CARD_EDGE, RADIUS } from './payment-cards/primitives';
import {
  AddProductDialog,
  PressedAddButton,
  ProductGrid,
  ServiceBooking,
} from './product-widgets/widgets';

export type { ProductWidgetsContent } from './product-widgets/content';
export {
  AddProductDialog,
  ProductGrid,
  ServiceBooking,
} from './product-widgets/widgets';

type ProductWidgetsProps = Partial<ProductWidgetsContent>;

/**
 * Visual for "Lägg upp dina produkter eller tjänster": the shop screen – a
 * dense product grid with the "Lägg till ny produkt" dialog open over it –
 * and under it the bookable service, as wide as the grid so the two read as
 * equals (products and services, side by side in the offer).
 *
 * Natural height, transparent – built to sit on a white page: the cards have
 * a hairline and a soft shadow (CARD_EDGE). Reads only its OWN width
 * (container queries), never the viewport, so it renders the same in
 * isolation (Remotion texture). Two steps:
 *   < 576 px  grid 3 × 3, service card stacked
 *   ≥ 576 px  grid 5 × 2, service card laid out wide (price left, times right)
 * The dialog shows every field in both.
 */
export function ProductWidgets(props: ProductWidgetsProps) {
  const { currency, locale, grid, addProduct, service } = {
    ...productWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };

  return (
    <div className="@container w-full text-left">
      <div className={`relative isolate overflow-hidden bg-white p-4 @xl:p-5 ${CARD_EDGE} ${RADIUS.card}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-ui-title">{grid.label}</h3>
          <PressedAddButton />
        </div>
        <ProductGrid
          content={grid}
          className="grid-cols-3 @xl:grid-cols-5 @max-xl:[&>li:nth-child(n+10)]:hidden @xl:[&>li:nth-child(n+11)]:hidden"
          {...money}
        />

        {/* Soft dim – light enough that the grid still reads as "full shop" behind. */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-[20rem]">
            <AddProductDialog content={addProduct} fields="full" {...money} />
          </div>
        </div>
      </div>

      <div className="mt-4 @xl:mt-5">
        <ServiceBooking content={service} {...money} />
      </div>
    </div>
  );
}

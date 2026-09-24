'use client';

import { productWidgetsDefaults, type ProductWidgetsContent } from './product-widgets/content';
import { RADIUS } from './payment-cards/primitives';
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
 * Visual for "Lägg upp dina produkter eller tjänster": a tall column that
 * scrolls past the section's sticky text. The shop screen – a dense product
 * grid with the "Lägg till ny produkt" dialog open over it – and below it, a
 * bookable service card overlapping the screen's lower edge (padding only).
 *
 * Natural height, no fixed box. Transparent – the section supplies the dark
 * backdrop. Reads only its OWN width (container queries), never the viewport,
 * so it renders the same in isolation (Remotion texture). Two steps:
 *   < 576 px  grid 3 × 3, service card full width under the screen
 *   ≥ 576 px  grid 4 × 4 (all 16 products), service card overlapping
 * The dialog shows every field in both – there is room now.
 */
export function ProductWidgets(props: ProductWidgetsProps) {
  const { currency, locale, grid, addProduct, service } = {
    ...productWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };

  return (
    <div className="@container w-full text-left">
      <div className={`relative isolate overflow-hidden bg-white p-4 @xl:p-5 ${RADIUS.card}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-ui-title">{grid.label}</h3>
          <PressedAddButton />
        </div>
        <ProductGrid
          content={grid}
          className="grid-cols-3 @xl:grid-cols-4 [&>li:nth-child(n+10)]:hidden @xl:[&>li:nth-child(n+10)]:flex @xl:[&>li:nth-child(n+17)]:hidden"
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

      <div className="relative z-10 mt-4 @xl:-mt-4 @xl:ml-auto @xl:mr-8 @xl:w-[16rem]">
        <ServiceBooking content={service} {...money} />
      </div>
    </div>
  );
}

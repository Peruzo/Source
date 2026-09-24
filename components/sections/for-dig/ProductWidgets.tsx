'use client';

import type { ReactNode } from 'react';
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
 * Visual for the "Produkter & tjänster" panel in HorizontalScrollSection:
 * a dense product grid with the "Lägg till ny produkt" dialog open over it,
 * and – where there is room – a bookable service card beside it.
 *
 * Fills its parent box. Built for the panel's 4:3 media box (measured at
 * 662 × 497 px at a 1440 px viewport, 332 × 249 px at 390 px), but it only
 * reads its OWN width through container queries, never the viewport, so it
 * renders the same in isolation (Remotion texture) at the same size.
 *
 * Three layouts by container width – each one shows only what stays legible:
 *   < 448 px  grid 4×2, dialog with name only (left-aligned so the
 *             pressed plus button stays in view)
 *   448–575   grid 5×3, dialog adds category
 *   ≥ 576     grid 4×3 + dialog with image upload, service card beside it
 * Text never scales down with the box; the content is trimmed instead.
 *
 * The layouts are separate DOM trees toggled with `display`, so the hidden
 * ones are out of the accessibility tree and the tab order too.
 */
export function ProductWidgets(props: ProductWidgetsProps) {
  const { currency, locale, grid, addProduct, service } = {
    ...productWidgetsDefaults,
    ...props,
  };
  const money = { currency, locale };

  const screen = (
    columns: number,
    rows: number,
    fields: 'compact' | 'medium' | 'full',
    dialogWidth: string,
    dialogAlign: 'start' | 'center' = 'center',
  ) => (
    <ProductScreen
      dialogAlign={dialogAlign}
      grid={<ProductGrid content={grid} columns={columns} rows={rows} {...money} />}
      dialog={<AddProductDialog content={addProduct} fields={fields} {...money} />}
      dialogWidth={dialogWidth}
    />
  );

  return (
    <div
      className="@container relative h-full w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 100% 0%, rgba(0,128,109,0.55) 0%, transparent 60%), var(--color-black-tertiary)',
      }}
    >
      <div className="h-full p-2 @md:hidden">{screen(4, 2, 'compact', 'max-w-[15rem]', 'start')}</div>

      <div className="hidden h-full p-3 @md:block @xl:hidden">{screen(5, 3, 'medium', 'max-w-[18rem]')}</div>

      <div className="hidden h-full gap-4 p-4 @xl:flex">
        <div className="min-w-0 flex-1">{screen(4, 3, 'full', 'max-w-[18rem]')}</div>
        <div className="flex w-[14.5rem] flex-shrink-0 items-center">
          <ServiceBooking content={service} {...money} />
        </div>
      </div>
    </div>
  );
}

/** Grid + soft dim + dialog + the pressed plus button that opened it. */
function ProductScreen({
  grid,
  dialog,
  dialogWidth,
  dialogAlign,
}: {
  grid: ReactNode;
  dialog: ReactNode;
  dialogWidth: string;
  dialogAlign: 'start' | 'center';
}) {
  return (
    <div className={`relative isolate h-full overflow-hidden bg-white p-3 ${RADIUS.card}`}>
      {grid}

      {/* Soft dim – light enough that the grid still reads as "full shop" behind. */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="absolute bottom-3 right-3">
        <PressedAddButton />
      </div>

      <div
        className={`absolute inset-0 flex items-center p-3 ${
          dialogAlign === 'start' ? 'justify-start' : 'justify-center'
        }`}
      >
        <div className={`w-full ${dialogWidth}`}>{dialog}</div>
      </div>
    </div>
  );
}

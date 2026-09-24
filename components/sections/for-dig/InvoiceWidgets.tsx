'use client';

import { invoiceWidgetsDefaults, type InvoiceWidgetsContent } from './invoice-widgets/content';
import { RADIUS } from './payment-cards/primitives';
import {
  CreateInvoiceButton,
  CreateInvoiceDialog,
  InvoiceList,
  InvoicePreview,
} from './invoice-widgets/widgets';

export type { InvoiceWidgetsContent } from './invoice-widgets/content';
export {
  CreateInvoiceButton,
  CreateInvoiceDialog,
  InvoiceList,
  InvoicePreview,
  StatusBadge,
} from './invoice-widgets/widgets';

type InvoiceWidgetsProps = Partial<InvoiceWidgetsContent>;

/**
 * Visual for the "Fakturor" panel in HorizontalScrollSection: the invoice
 * list with "Skapa faktura" pressed and the "Ny faktura" dialog open over its
 * lower half, and – where there is room – the invoice document beside it.
 *
 * The dialog sits at the BOTTOM of the list, not centred as in ProductWidgets:
 * the list's point is status and integration marks, so its first rows have to
 * stay readable above the dialog. The first three rows cover all statuses.
 *
 * Fills its parent box – built for the panel's 4:3 media box (662 × 497 px at
 * a 1440 px viewport, 332 × 249 px at 390 px). Reads only its OWN width via
 * container queries, never the viewport, so it renders the same in isolation
 * (Remotion texture). Same three steps as ProductWidgets:
 *   < 448 px  list only – three rows, title visually hidden. No room for a
 *             dialog without covering every status, so it is left out.
 *   448–575   list + one-row dialog (recipient, amount, button)
 *   ≥ 576     list + full dialog (all four fields), invoice document beside
 * The list always shows exactly three rows, one per status.
 * Text never scales down; the content is trimmed instead. Hidden layouts are
 * `display: none`, so they are out of the accessibility tree.
 */
export function InvoiceWidgets(props: InvoiceWidgetsProps) {
  const { currency, locale, preview, create, list } = { ...invoiceWidgetsDefaults, ...props };
  const money = { currency, locale };

  const screen = (dialog: 'inline' | 'full' | null, showTitle: boolean) => (
    <div
      className={`relative isolate h-full overflow-hidden bg-white ${RADIUS.card} ${
        dialog ? 'p-3' : 'px-2.5 py-3'
      }`}
    >
      <InvoiceList
        content={list}
        showTitle={showTitle}
        dense={dialog !== 'full'}
        maxRows={3}
        actions={<CreateInvoiceButton label={create.buttonLabel} pressed={dialog !== null} />}
        {...money}
      />

      {dialog ? (
        <>
          {/* Soft dim – the list stays readable behind the dialog. */}
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="absolute inset-x-2 bottom-2">
            <CreateInvoiceDialog content={create} fields={dialog} {...money} />
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
      <div className="h-full p-2 @md:hidden">{screen(null, false)}</div>

      <div className="hidden h-full p-3 @md:block @xl:hidden">{screen('inline', true)}</div>

      <div className="hidden h-full gap-4 p-4 @xl:flex">
        <div className="min-w-0 flex-1">{screen('full', true)}</div>
        <div className="w-[14.5rem] flex-shrink-0">
          <InvoicePreview content={preview} {...money} />
        </div>
      </div>
    </div>
  );
}

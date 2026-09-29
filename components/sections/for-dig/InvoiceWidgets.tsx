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
 * Visual for "Fakturor": one wide app window – a single surface that reads as
 * the real program, unlike the free-standing cards in "Börja ta betalt".
 * The invoice list (all rows) and the invoice document side by side, with
 * "Ny faktura" open over the list's lower rows. The first three rows – one
 * per status – always stay clear of the dialog.
 *
 * Natural height, transparent, reads only its OWN width (container queries)
 * so it renders the same in isolation (Remotion texture). Two steps:
 *   < 768 px  stacked inside the window: list → document; the dialog sits
 *             under the window instead of over it
 *   ≥ 768 px  list and document side by side, dialog over the list
 */
export function InvoiceWidgets(props: InvoiceWidgetsProps) {
  const { currency, locale, preview, create, list } = { ...invoiceWidgetsDefaults, ...props };
  const money = { currency, locale };

  return (
    <div className="@container mx-auto w-full max-w-[68rem] text-left">
      <div
        className={`relative isolate overflow-hidden bg-white shadow-[0_40px_80px_-24px_rgba(0,0,0,0.9)] ${RADIUS.card}`}
      >
        {/* Window chrome – illustration only. */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 px-5 py-3" aria-hidden="true">
          <span className={`h-2.5 w-2.5 bg-gray-300 ${RADIUS.control}`} />
          <span className={`h-2.5 w-2.5 bg-gray-300 ${RADIUS.control}`} />
          <span className={`h-2.5 w-2.5 bg-gray-300 ${RADIUS.control}`} />
        </div>

        <div className="grid gap-5 p-4 @3xl:grid-cols-[minmax(0,1fr)_17rem] @3xl:gap-6 @3xl:p-6">
          <InvoiceList
            content={list}
            actions={<CreateInvoiceButton label={create.buttonLabel} pressed />}
            {...money}
          />
          <div className={`bg-gray-100 p-3 ${RADIUS.field}`}>
            <InvoicePreview content={preview} {...money} />
          </div>
        </div>

        {/* Dialog over the list – wide layout only. */}
        <div className="absolute inset-0 hidden bg-black/20 @3xl:block" aria-hidden="true" />
        <div className="absolute bottom-6 left-6 hidden w-[24rem] @3xl:block">
          <CreateInvoiceDialog content={create} fields="full" {...money} />
        </div>
      </div>

      {/* Narrow layout: the dialog follows the window instead of covering it. */}
      <div className="mt-4 @3xl:hidden">
        <CreateInvoiceDialog content={create} fields="full" {...money} />
      </div>
    </div>
  );
}

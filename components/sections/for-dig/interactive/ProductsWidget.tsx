'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { formatMoney, RADIUS } from '../payment-cards/primitives';
import { Pill, PlusGlyph, Popup, SlideInList, T, UiButton, UiField, WidgetShell } from './ui';
import { useSequence } from './useSequence';

export type ProductRow = { id: string; name: string; kind: string; price: number };

export type ProductsWidgetContent = {
  label: string;
  listTitle: string;
  addLabel: string;
  rows: ProductRow[];
  newRow: ProductRow;
  dialog: {
    title: string;
    name: { label: string; value: string };
    price: { label: string; amount: number };
    category: { label: string; value: string };
    type: { label: string; value: string };
    image: { label: string; fileName: string };
    submitLabel: string;
  };
};

/*
 * "Lägg upp det du säljer": the add button is pressed, the form opens filled in
 * (name, price, category, type, image), "Spara produkt" is pressed, the form
 * closes and the product lands at the top of "Det du säljer".
 *
 *   0 idle → 1 add pressed → 2 form open → 3 save pressed → 4 product added
 */
const DURATIONS = [900, 350, 2600, 450];

export function ProductsWidget({ content, currency, locale }: { content: ProductsWidgetContent; currency: string; locale: string }) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const d = content.dialog;
  const money = (n: number) => formatMoney(n, currency, locale);

  return (
    <WidgetShell
      innerRef={(el) => {
        ref.current = el;
      }}
      title={content.listTitle}
      label={content.label}
      actions={
        <UiButton pressed={step === 1} icon={<PlusGlyph />}>
          {content.addLabel}
        </UiButton>
      }
      onReplay={replay}
    >
      <SlideInList
        label={content.listTitle}
        newRow={content.newRow}
        rows={content.rows}
        added={step >= 4}
        rowHeight="4.25rem"
        render={(row) => (
          <div className="flex w-full min-w-0 items-center gap-3">
            <span className="flex min-w-0 flex-1 flex-col items-start gap-1 @md:flex-row @md:items-center @md:justify-between @md:gap-3">
              <span className={`${T.body} block min-w-0 max-w-full truncate`}>{row.name}</span>
              <Pill>{row.kind}</Pill>
            </span>
            <span className={`${T.body} w-[6.5rem] shrink-0 whitespace-nowrap text-right tabular-nums`}>{money(row.price)}</span>
          </div>
        )}
      />

      <Popup open={step >= 2 && step < 4} title={d.title}>
        <div className="space-y-2">
          <UiField label={d.name.label}>{d.name.value}</UiField>
          <div className="grid grid-cols-2 gap-2">
            <UiField label={d.price.label}>
              <span className="tabular-nums">{money(d.price.amount)}</span>
            </UiField>
            <UiField label={d.category.label}>{d.category.value}</UiField>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2">
            <UiField label={d.type.label}>{d.type.value}</UiField>
            <div className={`flex min-w-0 items-center gap-2.5 border border-gray-200 px-3 py-2 ${RADIUS.field}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center bg-gray-100 text-gray-600 ${RADIUS.field}`}>
                <PhotoIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className={`${T.label} block text-gray-600`}>{d.image.label}</span>
                <span className={`${T.body} block truncate`}>{d.image.fileName}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <UiButton block pressed={step === 3}>
            {d.submitLabel}
          </UiButton>
        </div>
      </Popup>
    </WidgetShell>
  );
}

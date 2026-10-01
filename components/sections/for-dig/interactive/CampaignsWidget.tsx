'use client';

import { RADIUS } from '../payment-cards/primitives';
import { Pill, PlusGlyph, Popup, SlideInList, T, UiButton, UiField, WidgetShell } from './ui';
import { useSequence } from './useSequence';

export type CampaignRow = {
  id: string;
  name: string;
  /** "Kampanj" or "Kampanjkod" – the portal's two kinds. */
  kind: string;
  /** For a code: the code itself, set like a code. */
  code?: string;
  discount: string;
  detail: string;
  status: string;
};

export type CampaignsWidgetContent = {
  label: string;
  listTitle: string;
  createLabel: string;
  rows: CampaignRow[];
  newRow: CampaignRow;
  dialog: {
    title: string;
    tabs: { campaign: string; code: string };
    name: { label: string; value: string };
    products: { label: string; value: string };
    discountType: { label: string; value: string };
    value: { label: string; value: string };
    period: { label: string; value: string };
    maxUses: { label: string; value: string };
    submitLabel: string;
  };
};

/*
 * "Kampanjer och rabattkoder": "Skapa kampanj" is pressed, the portal's modal
 * opens on its "Kampanj" tab filled in (name, products, discount type, value,
 * period, max uses), "Skapa kampanj" is pressed and the campaign lands at the
 * top of the active list – next to a discount code that is already running.
 *
 *   0 idle → 1 create pressed → 2 form open → 3 submit pressed → 4 campaign added
 */
const DURATIONS = [900, 350, 2800, 450];

export function CampaignsWidget({ content }: { content: CampaignsWidgetContent }) {
  const { ref, step, replay } = useSequence(DURATIONS);
  const d = content.dialog;

  return (
    <WidgetShell
      innerRef={(el) => {
        ref.current = el;
      }}
      title={content.listTitle}
      label={content.label}
      actions={
        <UiButton pressed={step === 1} icon={<PlusGlyph />}>
          {content.createLabel}
        </UiButton>
      }
      onReplay={replay}
    >
      <SlideInList
        label={content.listTitle}
        newRow={content.newRow}
        rows={content.rows}
        added={step >= 4}
        rowHeight="4.75rem"
        render={(row) => (
          <div className="flex w-full min-w-0 items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                {row.code ? (
                  <span className={`${T.body} truncate font-mono font-semibold tracking-[0.12em]`}>{row.code}</span>
                ) : (
                  <span className={`${T.body} truncate font-semibold`}>{row.name}</span>
                )}
                <Pill tone="muted">{row.kind}</Pill>
              </span>
              <span className={`${T.label} mt-0.5 block truncate text-gray-600`}>{row.detail}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className={`${T.body} whitespace-nowrap font-semibold tabular-nums`}>{row.discount}</span>
              <Pill tone="paid">{row.status}</Pill>
            </span>
          </div>
        )}
      />

      <Popup open={step >= 2 && step < 4} title={d.title}>
        <div className={`grid grid-cols-2 gap-1 border border-gray-500 p-1 ${RADIUS.control}`} aria-hidden="true">
          <span className={`${T.label} block py-1 text-center ${RADIUS.control} bg-teal-dark text-white`}>{d.tabs.campaign}</span>
          <span className={`${T.label} block py-1 text-center ${RADIUS.control} text-black`}>{d.tabs.code}</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <UiField label={d.name.label}>{d.name.value}</UiField>
            <UiField label={d.products.label}>{d.products.value}</UiField>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <UiField label={d.discountType.label}>{d.discountType.value}</UiField>
            <UiField label={d.value.label}>
              <span className="tabular-nums">{d.value.value}</span>
            </UiField>
          </div>
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-2">
            <UiField label={d.period.label}>
              <span className="tabular-nums">{d.period.value}</span>
            </UiField>
            <UiField label={d.maxUses.label}>{d.maxUses.value}</UiField>
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

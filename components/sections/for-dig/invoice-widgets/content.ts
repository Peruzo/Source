/*
 * Content types and defaults for InvoiceWidgets.
 *
 * Fictional gym ("Gym Norrgården") invoicing its members for a running
 * monthly membership. Names, addresses and amounts are made up; they are the
 * gym's CUSTOMER prices, never our own packages. Internally consistent: the
 * previewed invoice is the first row of the list, and the dialog drafts the
 * next one for a member not yet in the list.
 *
 * Integration marks: NO real logos here or in code. `integrations` points at
 * neutral placeholder files; swap in the vendors' press-kit logos in
 * public/images/for-dig/privat/integrationer/ and change `label` to match.
 */

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export type Integration = {
  id: string;
  /** Vendor name. Used in the logo's alt text, never drawn. */
  label: string;
  /** Square logo file, see the images README for size. */
  logo: { src: string };
};

export type InvoicePreviewContent = {
  /** Accessible name for the document. */
  label: string;
  sender: { name: string; address: string };
  documentTitle: string;
  number: { label: string; value: string };
  recipient: { label: string; name: string; address: string };
  /** Dates as ISO strings (YYYY-MM-DD) – the Swedish invoice standard. */
  issued: { label: string; value: string };
  due: { label: string; value: string };
  line: { description: string; detail: string };
  /** Amount including VAT. Net and VAT are derived from it and `vatRate`. */
  total: number;
  /** 0.06 for 6 %. */
  vatRate: number;
  netLabel: string;
  vatLabel: string;
  totalLabel: string;
};

export type CreateInvoiceContent = {
  buttonLabel: string;
  title: string;
  recipient: { label: string; value: string };
  item: { label: string; value: string };
  amount: { label: string; value: number };
  due: { label: string; value: string };
  submitLabel: string;
};

export type InvoiceListContent = {
  title: string;
  seeAllLabel: string;
  statusLabels: Record<InvoiceStatus, string>;
  /** Prefix for the logo's alt text, e.g. "Bokförd i" → "Bokförd i Bokföring A". */
  integrationAltPrefix: string;
  integrations: Integration[];
  rows: {
    id: string;
    recipient: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
    /** id from `integrations`, or omit for no mark. */
    integrationId?: string;
  }[];
};

export type InvoiceWidgetsContent = {
  currency: string;
  locale: string;
  preview: InvoicePreviewContent;
  create: CreateInvoiceContent;
  list: InvoiceListContent;
};

const MONTHLY = 499;
const INT = '/images/for-dig/privat/integrationer';

export const invoiceWidgetsDefaults: InvoiceWidgetsContent = {
  currency: 'SEK',
  locale: 'sv-SE',
  preview: {
    label: 'Förhandsgranskning av faktura',
    sender: { name: 'Gym Norrgården', address: 'Storgatan 12, 123 45 Småstad' },
    documentTitle: 'Faktura',
    number: { label: 'Nr', value: '2026-0418' },
    recipient: { label: 'Till', name: 'Sara Ek', address: 'Ekvägen 4, 123 47 Småstad' },
    issued: { label: 'Fakturadatum', value: '2026-10-01' },
    due: { label: 'Förfallodatum', value: '2026-10-31' },
    line: { description: 'Månadsavgift', detail: 'Medlemskap · oktober · löpande' },
    total: MONTHLY,
    vatRate: 0.06,
    netLabel: 'Summa exkl. moms',
    vatLabel: 'Moms',
    totalLabel: 'Att betala',
  },
  create: {
    buttonLabel: 'Skapa faktura',
    title: 'Ny faktura',
    recipient: { label: 'Mottagare', value: 'Jonas Berg' },
    item: { label: 'Produkt/tjänst', value: 'Månadsavgift' },
    amount: { label: 'Belopp', value: MONTHLY },
    due: { label: 'Förfallodatum', value: '2026-10-31' },
    submitLabel: 'Skicka faktura',
  },
  list: {
    title: 'Fakturor',
    seeAllLabel: 'Se alla fakturor',
    statusLabels: { paid: 'Betald', unpaid: 'Obetald', overdue: 'Förfallen' },
    integrationAltPrefix: 'Bokförd i',
    integrations: [
      { id: 'a', label: 'Bokföring A', logo: { src: `${INT}/bokforing-a.svg` } },
      { id: 'b', label: 'Bokföring B', logo: { src: `${INT}/bokforing-b.svg` } },
    ],
    // First three rows cover all three statuses – they are the ones that
    // stay visible above the dialog in every layout.
    rows: [
      { id: 'r1', recipient: 'Sara Ek', date: '2026-10-01', amount: MONTHLY, status: 'unpaid', integrationId: 'a' },
      { id: 'r2', recipient: 'Kraft AB', date: '2026-10-01', amount: 4990, status: 'paid', integrationId: 'b' },
      { id: 'r3', recipient: 'Elias Nord', date: '2026-09-01', amount: MONTHLY, status: 'overdue' },
      { id: 'r4', recipient: 'Maja Holm', date: '2026-09-01', amount: MONTHLY, status: 'paid', integrationId: 'a' },
      { id: 'r5', recipient: 'Lina Ström', date: '2026-09-01', amount: 1347, status: 'paid' },
    ],
  },
};

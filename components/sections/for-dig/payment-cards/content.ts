import type { SectionImage } from '../types';

/*
 * Content types and defaults for PaymentCards.
 *
 * The defaults are a fictional shop ("Bryggeriet på hörnet", a coffee roaster)
 * so the component renders on its own – on the page, in isolation, or as a
 * Remotion texture. Amounts are the shop's CUSTOMER prices, never ours, and
 * are internally consistent: card 3 creates the link that card 2 is paying.
 */

export type SubscriptionCardContent = {
  title: string;
  field: { label: string; value: string };
  frequencyHeading: string;
  frequencies: { id: string; label: string; amount: number }[];
  addLabel: string;
};

export type CheckoutCardContent = {
  /** Accessible name – the card has no visible heading. */
  label: string;
  /** Header image. Omit to show the built-in gradient placeholder. */
  image?: SectionImage;
  /** Line above the amount, e.g. product and order number. */
  orderLine: string;
  amount: number;
  /** Each inner array is one visually grouped block of rows. */
  methodGroups: { id: string; label: string; actionLabel: string }[][];
};

export type PaymentLinkCardContent = {
  title: string;
  productField: { label: string; value: string };
  amountField: { label: string; amount: number };
  advancedHeading: string;
  options: { id: string; label: string; defaultOn: boolean }[];
};

export type PaymentCardsContent = {
  /** Accessible name for the whole group of cards. */
  label: string;
  /** ISO 4217 code, used for every amount on all three cards. */
  currency: string;
  /** Number format locale. `sv-SE` gives "1 245,00 kr". */
  locale: string;
  subscription: SubscriptionCardContent;
  checkout: CheckoutCardContent;
  paymentLink: PaymentLinkCardContent;
};

const PRODUCT = 'Presentask Höstrost';
const PRODUCT_PRICE = 1245;

export const paymentCardsDefaults: PaymentCardsContent = {
  label: 'Exempel på vad du kan göra med betalningar',
  currency: 'SEK',
  locale: 'sv-SE',
  subscription: {
    title: 'Prenumeration',
    field: { label: 'Paket', value: 'Mellanrost, 500 g' },
    frequencyHeading: 'Frekvens',
    frequencies: [
      { id: 'vecka', label: 'Varje vecka', amount: 149 },
      { id: 'varannan', label: 'Varannan vecka', amount: 159 },
      { id: 'manad', label: 'Var fjärde vecka', amount: 169 },
    ],
    addLabel: 'Lägg till frekvens',
  },
  checkout: {
    label: 'Betalning',
    orderLine: `${PRODUCT} · Order 10482`,
    amount: PRODUCT_PRICE,
    methodGroups: [
      [
        { id: 'kort', label: 'Betala med kort', actionLabel: 'Välj' },
        { id: 'bank', label: 'Betala med bank', actionLabel: 'Välj' },
      ],
      [{ id: 'app', label: 'Betala i app', actionLabel: 'Välj' }],
    ],
  },
  paymentLink: {
    title: 'Ny betalningslänk',
    productField: { label: 'Produktnamn', value: PRODUCT },
    amountField: { label: 'Belopp', amount: PRODUCT_PRICE },
    advancedHeading: 'Avancerade alternativ',
    options: [
      { id: 'adress', label: 'Samla in leveransadress', defaultOn: true },
      { id: 'rabatt', label: 'Tillåt rabattkoder', defaultOn: false },
    ],
  },
};

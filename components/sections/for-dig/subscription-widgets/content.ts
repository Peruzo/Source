/*
 * Content types and defaults for SubscriptionWidgets.
 *
 * Fictional coffee roastery ("Rosteriet i hamnen") selling its OWN coffee
 * subscription in three levels. These are the customer's products – named
 * after coffee amounts on purpose, so they can never be mistaken for our
 * packages (Core/Growth/Enterprise) or read as bas/mellan/max.
 *
 * Amounts are consistent by construction: the month's revenue and the
 * upcoming charges are DERIVED from the tiers (price × subscribers, in öre)
 * – see `summarize` – never typed in separately.
 */

export type SubscriptionTier = {
  id: string;
  name: string;
  /** Monthly price in kronor. */
  price: number;
  /** Two short lines on what is included. */
  includes: string[];
  subscribers: number;
  /** Next autogiro run for this tier, ISO date. */
  chargeDate: string;
};

export type IncomingPaymentsContent = {
  title: string;
  periodLabel: string;
  activeLabel: string;
  upcomingLabel: string;
  // TODO: verifiera att autogiro faktiskt stöds
  paymentMethod: string;
};

export type TiersContent = {
  /** Accessible name for the tier list. */
  label: string;
  perMonth: string;
  subscribersLabel: string;
  popularLabel: string;
  tiers: SubscriptionTier[];
};

export type Interval = 'week' | 'month' | 'year';

export type NewSubscriptionContent = {
  buttonLabel: string;
  title: string;
  name: { label: string; value: string };
  amount: { label: string; value: number };
  interval: { label: string; options: Record<Interval, string>; defaultValue: Interval };
  start: { label: string; value: string };
  // TODO: verifiera att autogiro faktiskt stöds
  paymentMethod: { label: string; value: string };
  submitLabel: string;
};

export type SubscriptionWidgetsContent = {
  currency: string;
  locale: string;
  screenTitle: string;
  incoming: IncomingPaymentsContent;
  tiers: TiersContent;
  create: NewSubscriptionContent;
};

/**
 * Month total and per-tier charges, summed in whole öre so the parts always
 * add up to the total exactly.
 */
export function summarize(tiers: SubscriptionTier[]) {
  const charges = tiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    date: tier.chargeDate,
    subscribers: tier.subscribers,
    amountMinor: Math.round(tier.price * 100) * tier.subscribers,
  }));
  const totalMinor = charges.reduce((sum, charge) => sum + charge.amountMinor, 0);
  return {
    total: totalMinor / 100,
    active: tiers.reduce((sum, tier) => sum + tier.subscribers, 0),
    charges: charges.map(({ amountMinor, ...rest }) => ({ ...rest, amount: amountMinor / 100 })),
  };
}

export const subscriptionWidgetsDefaults: SubscriptionWidgetsContent = {
  currency: 'SEK',
  locale: 'sv-SE',
  screenTitle: 'Prenumerationer',
  incoming: {
    title: 'Inkommande betalningar',
    periodLabel: 'Oktober',
    activeLabel: 'aktiva prenumeranter',
    upcomingLabel: 'Kommande dragningar',
    paymentMethod: 'Autogiro',
  },
  tiers: {
    label: 'Prenumerationsnivåer',
    perMonth: '/mån',
    subscribersLabel: 'prenumeranter',
    popularLabel: 'Populärast',
    tiers: [
      {
        id: 'morgonkoppen',
        name: 'Morgonkoppen',
        price: 149,
        includes: ['250 g i månaden', 'Veckans rost'],
        subscribers: 204,
        chargeDate: '2026-10-25',
      },
      {
        id: 'hela-kannan',
        name: 'Hela kannan',
        price: 259,
        includes: ['500 g i månaden', 'Välj mals'],
        subscribers: 318,
        chargeDate: '2026-10-27',
      },
      {
        id: 'rosteriets-val',
        name: 'Rosteriets val',
        price: 449,
        includes: ['1 kg i månaden', 'Två sorter'],
        subscribers: 57,
        chargeDate: '2026-10-28',
      },
    ],
  },
  create: {
    buttonLabel: 'Ny prenumeration',
    title: 'Ny prenumeration',
    name: { label: 'Namn', value: 'Kontorskannan' },
    amount: { label: 'Belopp', value: 689 },
    interval: {
      label: 'Intervall',
      options: { week: 'Vecka', month: 'Månad', year: 'År' },
      defaultValue: 'month',
    },
    start: { label: 'Startdatum', value: '2026-11-01' },
    paymentMethod: { label: 'Betalsätt', value: 'Autogiro' },
    submitLabel: 'Skapa prenumeration',
  },
};

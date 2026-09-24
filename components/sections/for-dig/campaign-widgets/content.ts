/*
 * Content types and defaults for CampaignWidgets.
 *
 * Fictional shoe and clothing shop running an autumn sale. Generic product
 * nouns only, no brands, no logos. Prices are the shop's CUSTOMER prices,
 * never our own packages. Internally consistent: the campaign is 30 % off,
 * the code gives the same 30 %, and every sale price is the ordinary price
 * minus 30 %, rounded to whole öre.
 */

/**
 * Product photo. Every default points at the ONE existing shoe placeholder
 * (produkter/13-sneakers.svg) – swap `src` per product for real photos.
 * `alt` defaults to empty: the product name is printed right next to it.
 */
export type CampaignImage = { src: string; alt?: string };

export type SaleProduct = {
  id: string;
  name: string;
  /** Ordinary price. The sale price is derived from it and the discount. */
  price: number;
  image: CampaignImage;
};

export type DiscountType = 'percent' | 'amount';

export type PriceLabels = {
  /** Visually hidden, read before the struck-through price. */
  ordinary: string;
  /** Visually hidden, read before the sale price. */
  sale: string;
};

export type CreateCampaignContent = {
  buttonLabel: string;
  title: string;
  name: { label: string; value: string };
  products: { label: string; selectedLabel: string };
  discountType: {
    label: string;
    options: Record<DiscountType, string>;
    defaultValue: DiscountType;
  };
  /** The value field shows whichever matches the selected discount type. */
  value: { label: string; percent: number; amount: number };
  period: { label: string; from: string; to: string };
  submitLabel: string;
};

export type CampaignCodeContent = {
  title: string;
  code: { label: string; value: string };
  discount: { label: string };
  usage: { label: string; value: string };
};

export type SaleProductCardContent = {
  product: SaleProduct;
};

export type SaleGridContent = {
  title: string;
  /** Shown in order – all of them (six by default). */
  products: SaleProduct[];
};

export type CampaignWidgetsContent = {
  currency: string;
  locale: string;
  /** Discount applied everywhere, 0.3 for 30 %. */
  discountRate: number;
  priceLabels: PriceLabels;
  create: CreateCampaignContent;
  code: CampaignCodeContent;
  card: SaleProductCardContent;
  grid: SaleGridContent;
};

const SHOE = { src: '/images/for-dig/privat/produkter/13-sneakers.svg' };

const products: SaleProduct[] = [
  { id: 'sneakers', name: 'Sneakers', price: 1099, image: SHOE },
  { id: 'loparsko', name: 'Löparsko', price: 1299, image: SHOE },
  { id: 'tygsko', name: 'Tygsko', price: 749, image: SHOE },
  { id: 'loafers', name: 'Loafers', price: 1149, image: SHOE },
  { id: 'sandal', name: 'Sandal', price: 549, image: SHOE },
  { id: 'tofflor', name: 'Tofflor', price: 399, image: SHOE },
];

export const campaignWidgetsDefaults: CampaignWidgetsContent = {
  currency: 'SEK',
  locale: 'sv-SE',
  discountRate: 0.3,
  priceLabels: { ordinary: 'Ordinarie pris', sale: 'Kampanjpris' },
  create: {
    buttonLabel: 'Skapa kampanj',
    title: 'Ny kampanj',
    name: { label: 'Kampanjnamn', value: 'Höstrea' },
    products: { label: 'Gäller produkter', selectedLabel: '6 valda' },
    discountType: {
      label: 'Rabattyp',
      options: { percent: 'Procent', amount: 'Fast belopp' },
      defaultValue: 'percent',
    },
    value: { label: 'Värde', percent: 0.3, amount: 300 },
    period: { label: 'Giltighetsperiod', from: '2026-10-20', to: '2026-11-02' },
    submitLabel: 'Starta kampanj',
  },
  code: {
    title: 'Kampanjkod',
    code: { label: 'Kod', value: 'HOSTREA30' },
    discount: { label: 'Rabatt' },
    usage: { label: 'Får användas', value: '100 gånger' },
  },
  card: { product: products[0] },
  grid: { title: 'På rea nu', products },
};

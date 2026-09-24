/*
 * Content types and defaults for ProductWidgets.
 *
 * Fictional clothing and shoe shop, generic product nouns only – no brands,
 * no logos. Prices are the shop's CUSTOMER prices, never our own packages.
 */

/**
 * Product photo. `alt` defaults to empty on purpose: every tile prints the
 * product name right under the image, so a text alternative would only make
 * screen readers say the name twice. Pass `alt` if the photo shows something
 * the name does not.
 */
export type ProductImage = { src: string; alt?: string };

export type Product = { id: string; name: string; price: number; image: ProductImage };

export type ProductGridContent = {
  /** Accessible name for the product list. */
  label: string;
  /** At most 15 are shown (the widest layout); the order decides which. */
  products: Product[];
};

export type AddProductContent = {
  title: string;
  name: { label: string; value: string };
  price: { label: string; amount: number };
  category: { label: string; value: string };
  upload: { label: string; hint: string };
  submitLabel: string;
};

export type ServiceBookingContent = {
  name: string;
  /** Short line under the name, e.g. length and place. */
  details: string;
  price: number;
  timesHeading: string;
  times: { id: string; label: string }[];
  /** id of the time that starts out selected. */
  defaultTimeId: string;
  bookLabel: string;
};

export type ProductWidgetsContent = {
  currency: string;
  locale: string;
  grid: ProductGridContent;
  addProduct: AddProductContent;
  service: ServiceBookingContent;
};

const IMG = '/images/for-dig/privat/produkter';

const product = (id: string, name: string, price: number): Product => ({
  id,
  name,
  price,
  image: { src: `${IMG}/${id}.svg` },
});

export const productWidgetsDefaults: ProductWidgetsContent = {
  currency: 'SEK',
  locale: 'sv-SE',
  grid: {
    label: 'Produkter i butiken',
    products: [
      product('01-loparsko', 'Löparsko', 1299),
      product('02-tygsko', 'Tygsko', 749),
      product('03-kanga', 'Känga', 1895),
      product('04-huvtroja', 'Huvtröja', 649),
      product('05-t-shirt', 'T-shirt', 249),
      product('06-jeans', 'Jeans', 899),
      product('07-sandal', 'Sandal', 549),
      product('08-loafers', 'Loafers', 1149),
      product('09-vindjacka', 'Vindjacka', 1495),
      product('10-stickad-troja', 'Stickad tröja', 1049),
      product('11-chinos', 'Chinos', 799),
      product('12-mossa', 'Mössa', 299),
      product('13-sneakers', 'Sneakers', 1099),
      product('14-skjorta', 'Skjorta', 699),
      product('15-tofflor', 'Tofflor', 399),
      product('16-kappa', 'Kappa', 2495),
    ],
  },
  addProduct: {
    title: 'Lägg till ny produkt',
    name: { label: 'Produktnamn', value: 'Känga, hög' },
    price: { label: 'Pris', amount: 1595 },
    category: { label: 'Kategori', value: 'Skor' },
    upload: { label: 'Produktbild', hint: 'Dra hit en bild' },
    submitLabel: 'Spara produkt',
  },
  service: {
    name: 'Yogapass, vinyasa',
    details: '60 min · Studion',
    price: 220,
    timesHeading: 'Välj tid',
    times: [
      { id: 't0700', label: '07:00' },
      { id: 't1215', label: '12:15' },
      { id: 't1730', label: '17:30' },
    ],
    defaultTimeId: 't1215',
    bookLabel: 'Boka pass',
  },
};

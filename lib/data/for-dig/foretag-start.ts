/*
 * Innehåll för /foretag-nya (Företag Start, motsvarar Core-paketet).
 *
 * Varje påstående ska finnas i kundportalens kod – belägg per sektion i
 * ~/cc-rapporter/foretag-start-plan.md (source.database origin/develop
 * 80022cbb). Skriv inga resultat, inga paketnamn, inga priser på Source och
 * inga användarantal. Exempeldata i widgetarna är fiktiv och branschneutral:
 * den visar hur gränssnittet ser ut, inte vad en kund uppnår, och beloppen är
 * kundens egna priser, aldrig våra.
 */
import {
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  CubeIcon,
  DocumentChartBarIcon,
  LifebuoyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { GettingStartedStep } from '@/components/sections/for-dig/GettingStartedSection';
import type { InvoiceWidgetsContent } from '@/components/sections/for-dig/invoice-widgets/content';
import type { AddProductContent } from '@/components/sections/for-dig/product-widgets/content';
import type { CampaignCodeContent, CreateCampaignContent } from '@/components/sections/for-dig/campaign-widgets/content';
import type { SubscriptionWidgetsContent } from '@/components/sections/for-dig/subscription-widgets/content';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';

export type OfferListContent = {
  title: string;
  rows: { id: string; name: string; kind: string; price: number }[];
};

export type PhotoCardContent = {
  label: string;
  value: string;
  pill?: string;
  row: { title: string; note: string };
};

const money = { currency: 'SEK', locale: 'sv-SE' } as const;
export const foretagMoney = money;

/* Bilder – skapade med scripts/tjanster-bilder.mjs foretag-start. */
const IMG = '/for-dig/foretag-start/foretag-start';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const foretagImages = {
  // Man i en fåtölj med telefonen, varmt lampljus mot en trävägg.
  betalningslank: {
    base: `${IMG}-betalningslank`,
    alt: 'En man sitter i en fåtölj vid en golvlampa och ler mot sin telefon, en hund sover i hans knä.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // Kvinna vid köksbordet med telefonen, en hög papper på bordet.
  myndighetsdatum: {
    base: `${IMG}-myndighetsdatum`,
    alt: 'En kvinna sitter vid ett köksbord med en hög papper och tittar på sin telefon i kvällsljus.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * 1 – Produkter och tjänster. Belägg: produktsidan och typerna product,
 * service och subscription är core (models/Product.js:279,
 * config/packageTiers.js:198-200). Bokningsbara tider är growth och visas inte.
 */
export const foretagProdukter = {
  id: 'produkter-och-tjanster',
  eyebrow: 'PRODUKTER & TJÄNSTER',
  title: 'Lägg upp det du säljer',
  body: [
    'Varor, tjänster eller abonnemang – lägg upp dem med namn, pris, bild och kategori, och se lagersaldot för det du har i lager.',
    'Allt du säljer finns på ett ställe, redo för din webbplats och för dina fakturor.',
  ],
  offers: {
    title: 'Det du säljer',
    rows: [
      { id: 'o1', name: 'Startpaket', kind: 'Vara', price: 1200 },
      { id: 'o2', name: 'Tjänst per timme', kind: 'Tjänst', price: 950 },
      { id: 'o3', name: 'Månadsabonnemang', kind: 'Abonnemang', price: 299 },
      { id: 'o4', name: 'Tillbehör', kind: 'Vara', price: 149 },
    ],
  } satisfies OfferListContent,
  addProduct: {
    title: 'Lägg till ny produkt',
    name: { label: 'Produktnamn', value: 'Tjänst per timme' },
    price: { label: 'Pris', amount: 950 },
    category: { label: 'Kategori', value: 'Tjänster' },
    upload: { label: 'Produktbild', hint: 'Dra hit en bild' },
    submitLabel: 'Spara produkt',
  } satisfies AddProductContent,
};

/*
 * 2 – Fakturor. Belägg: skapa, PDF, markera betald, betalningslänk
 * (routes/tenantInvoiceRoutes.js:463, 687, 819, 936), moms per rad och
 * referenser (models/Invoice.js:120-124, 306-325), manuell påminnelse
 * (routes/adminTenantCustomerActions.js:183). Inga integrationsmarkeringar:
 * bokföring är growth.
 */
export const foretagFakturor = {
  id: 'fakturor',
  eyebrow: 'FAKTUROR',
  title: 'Fakturera företag',
  body: [
    'Skapa en faktura med moms per rad, era referenser och betalningsvillkor, och ge den en betalningslänk så att kunden kan betala direkt.',
    'Du ser på en gång vad som är betalt, obetalt och förfallet, och skickar en påminnelse när det behövs.',
  ],
  widgets: {
    ...money,
    preview: {
      label: 'Förhandsgranskning av faktura',
      sender: { name: 'Ditt företag AB', address: 'Exempelgatan 1, 123 45 Småstad' },
      documentTitle: 'Faktura',
      number: { label: 'Nr', value: '2026-0112' },
      recipient: { label: 'Till', name: 'Kund AB', address: 'Org.nr 556000-0000 · Er ref. Anna Lind' },
      issued: { label: 'Fakturadatum', value: '2026-11-02' },
      due: { label: 'Förfallodatum', value: '2026-12-02' },
      line: { description: 'Uppdrag enligt överenskommelse', detail: 'November · Betalningsvillkor 30 dagar' },
      total: 12500,
      vatRate: 0.25,
      netLabel: 'Summa exkl. moms',
      vatLabel: 'Moms',
      totalLabel: 'Att betala',
    },
    create: {
      buttonLabel: 'Skapa faktura',
      title: 'Ny faktura',
      recipient: { label: 'Mottagare', value: 'Holm AB' },
      item: { label: 'Produkt/tjänst', value: 'Tjänst per timme' },
      amount: { label: 'Belopp', value: 950 },
      due: { label: 'Förfallodatum', value: '2026-12-02' },
      submitLabel: 'Skicka faktura',
    },
    list: {
      title: 'Fakturor',
      seeAllLabel: 'Se alla fakturor',
      statusLabels: { paid: 'Betald', unpaid: 'Obetald', overdue: 'Förfallen' },
      integrationAltPrefix: '',
      integrations: [],
      rows: [
        { id: 'r1', recipient: 'Kund AB', date: '2026-11-02', amount: 12500, status: 'unpaid' },
        { id: 'r2', recipient: 'Kraft AB', date: '2026-11-01', amount: 4990, status: 'paid' },
        { id: 'r3', recipient: 'Nord AB', date: '2026-10-01', amount: 3200, status: 'overdue' },
        { id: 'r4', recipient: 'Holm AB', date: '2026-10-01', amount: 950, status: 'paid' },
        { id: 'r5', recipient: 'Strand AB', date: '2026-10-01', amount: 1875, status: 'paid' },
      ],
    },
  } satisfies InvoiceWidgetsContent,
};

/*
 * 3 – Betalningslänk. Belägg: routes/paymentLinks.js:263 (skapa), sidan är core
 * (server.js:1205), ingen plattformsavgift finns i kundportalen. Inga
 * rabattkoder på betalningslänkar – de finns inte.
 */
export const foretagBetalningslank = {
  id: 'betalningslank',
  eyebrow: 'BETALNINGSLÄNK',
  title: 'Få betalt utan webbutik',
  body: [
    'Skapa en betalningslänk, skicka den i ett mejl eller ett meddelande och låt kunden betala med kort.',
    'Pengarna går till ditt eget betalkonto, och Source tar ingen avgift på din försäljning.',
  ],
  card: {
    label: 'Betalningslänk',
    value: 'Betald',
    row: { title: 'Kortbetalning', note: 'Mottagen idag' },
  } satisfies PhotoCardContent,
};

/*
 * 4 – Kampanjer och rabattkoder. Belägg: kampanjer utan paketspärr
 * (routes/campaignRoutes.js:2213), rabattkoder med procent eller belopp,
 * högsta antal användningar och slutdatum (routes/campaignRoutes.js:776-795),
 * koden anges i kassan (services/storefrontCheckoutService.js:2335-2338).
 */
export const foretagKampanjer = {
  id: 'kampanjer',
  eyebrow: 'KAMPANJER',
  title: 'Kampanjer och rabattkoder',
  body: [
    'Sätt kampanjpriser under en period, eller skapa en rabattkod med procent eller ett fast belopp.',
    'Du bestämmer hur länge koden gäller och hur många gånger den får användas – kunden anger den i kassan.',
  ],
  discountRate: 0.1,
  create: {
    buttonLabel: 'Skapa kampanj',
    title: 'Ny kampanj',
    name: { label: 'Kampanjnamn', value: 'Välkomstrabatt' },
    products: { label: 'Gäller', selectedLabel: 'Alla produkter' },
    discountType: {
      label: 'Rabattyp',
      options: { percent: 'Procent', amount: 'Fast belopp' },
      defaultValue: 'percent',
    },
    value: { label: 'Värde', percent: 0.1, amount: 100 },
    period: { label: 'Giltighetsperiod', from: '2026-11-01', to: '2026-11-30' },
    submitLabel: 'Starta kampanj',
  } satisfies CreateCampaignContent,
  code: {
    title: 'Rabattkod',
    code: { label: 'Kod', value: 'VALKOMMEN10' },
    discount: { label: 'Rabatt' },
    usage: { label: 'Får användas', value: '100 gånger' },
  } satisfies CampaignCodeContent,
};

/*
 * 5 – Prenumerationer. Belägg: sidan är core (server.js:1237), intervallerna
 * dag, vecka, månad och år (models/Product.js:279-295), paus och uppsägning
 * från kundprofilen (config/permissions.js:97). Betalsätt kort; autogiro
 * nämns inte.
 */
export const foretagPrenumerationer = {
  id: 'prenumerationer',
  eyebrow: 'ÅTERKOMMANDE INTÄKTER',
  title: 'Sälj prenumerationer',
  body: [
    'Låt kunden betala automatiskt med kort varje vecka, månad eller år.',
    'Du ser vilka som är aktiva, och kan pausa eller avsluta ett abonnemang när kunden vill.',
  ],
  widgets: {
    ...money,
    incoming: {
      title: 'Inkommande betalningar',
      periodLabel: 'November',
      activeLabel: 'aktiva prenumeranter',
      upcomingLabel: 'Kommande dragningar',
      paymentMethod: 'Kort',
    },
    tiers: {
      label: 'Prenumerationsnivåer',
      perMonth: '/mån',
      subscribersLabel: 'prenumeranter',
      popularLabel: 'Populärast',
      tiers: [
        { id: 'grund', name: 'Grund', price: 199, includes: ['Varje månad', 'Kan pausas'], subscribers: 38, chargeDate: '2026-11-25' },
        { id: 'utokad', name: 'Utökad', price: 399, includes: ['Varje månad', 'Mer ingår'], subscribers: 24, chargeDate: '2026-11-27' },
        { id: 'allt-i-ett', name: 'Allt i ett', price: 699, includes: ['Varje månad', 'Allt ingår'], subscribers: 9, chargeDate: '2026-11-28' },
      ],
    },
    create: {
      buttonLabel: 'Ny prenumeration',
      title: 'Ny prenumeration',
      name: { label: 'Namn', value: 'Utökad' },
      amount: { label: 'Belopp', value: 399 },
      interval: {
        label: 'Intervall',
        options: { week: 'Vecka', month: 'Månad', year: 'År' },
        defaultValue: 'month',
      },
      start: { label: 'Startdatum', value: '2026-12-01' },
      paymentMethod: { label: 'Betalsätt', value: 'Kort' },
      submitLabel: 'Skapa prenumeration',
    },
  } satisfies SubscriptionWidgetsContent,
};

/*
 * 6 – Myndighetsdatum. Belägg: bolagsform, momsperiod och arbetsgivar-
 * registrering (models/TenantFiscalSettings.js:44-68), påminnelser om moms,
 * arbetsgivardeklaration den 12:e, årsredovisning för AB och BRF
 * (services/taxDeadlineService.js:60-118), egna datum (upp till 50). Skriv
 * påminnelser, inte garanterat rätt datum (taxDeadlineService.js:113).
 */
export const foretagMyndighetsdatum = {
  id: 'myndighetsdatum',
  eyebrow: 'MYNDIGHETSDATUM',
  title: 'Håll koll på viktiga datum',
  body: [
    'Fyll i bolagsform och momsperiod en gång, så får du påminnelser om moms, arbetsgivardeklaration och – för aktiebolag – årsredovisning i din kalender.',
    'Lägg till egna datum och flytta eller dölj dem som inte gäller dig.',
  ],
  card: {
    label: 'Nästa datum',
    value: 'Den 12:e',
    pill: 'Påminnelse',
    row: { title: 'Arbetsgivardeklaration', note: 'Varje månad' },
  } satisfies PhotoCardContent,
};

/* 7 – Mer som ingår. Allt core, se planens punkt 2. */
export const foretagMer = {
  id: 'mer-som-ingar',
  eyebrow: 'MER SOM INGÅR',
  title: 'Allt runt omkring, på samma ställe',
  items: [
    { icon: UserGroupIcon, title: 'Kunder med företagsuppgifter', body: 'Spara organisationsnummer, momsnummer och betalningsvillkor per kund.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Meddelanden från kunderna', body: 'Svara på kundernas meddelanden från en och samma inkorg.' },
    { icon: CubeIcon, title: 'Lagersaldo', body: 'Se hur många du har kvar av varje produkt och variant.' },
    { icon: DocumentChartBarIcon, title: 'Fakturaöversikt', body: 'Följ dina fakturor samlat, med belopp och status.' },
    { icon: CreditCardIcon, title: 'Kortbetalning i kassan', body: 'Kunden betalar med kort, och Source tar ingen avgift på din försäljning.' },
    { icon: LifebuoyIcon, title: 'Hjälp när du behöver den', body: 'AI-support i portalen och livechatt vardagar 08–20.' },
  ] satisfies FeatureItem[],
};

/*
 * 8 – Så kommer du igång. Följer onboardingflödet: ansökan, manuell aktivering
 * (middleware/requireAuth.js:237-255), Source kopplar betalkontot vid
 * provisioneringen (routes/adminTenantProvision.js:96-100). Ingen ledtid.
 */
export const foretagKomIgang = {
  id: 'sa-kommer-du-igang',
  eyebrow: 'KOM IGÅNG',
  title: 'Så kommer du igång',
  steps: [
    { number: '01', title: 'Ansök', body: 'Välj det som passar dig och skicka in din ansökan.' },
    { number: '02', title: 'Vi aktiverar kontot', body: 'Vi går igenom ansökan och öppnar ditt konto.' },
    { number: '03', title: 'Vi kopplar betalningarna', body: 'Vi kopplar ditt betalkonto, så att du kan ta betalt med kort.' },
    { number: '04', title: 'Börja sälja', body: 'Lägg upp det du säljer och skicka din första faktura.' },
  ] satisfies GettingStartedStep[],
  image: {
    src: '/images/for-dig/privat/08-sa-kommer-du-igang.webp',
    alt: 'En kvinna i tjock stickad tröja sitter i en grön soffa och skriver på en laptop, i ett ljust vardagsrum med en vägg full av inramade konstverk och en monstera.',
  },
  cta: { label: 'Prata med oss', href: '/kontakt' },
};

/* 9 – Avslutande CTA. */
export const foretagAvslut = {
  id: 'kom-igang-cta',
  title: 'Starta med allt på ett ställe',
  body: ['Se vad som ingår och vad det kostar, eller prata med oss om du har frågor.'],
  primary: { label: 'Se priser', href: '/priser' },
  secondary: { label: 'Boka demo', href: '/kontakt' },
};

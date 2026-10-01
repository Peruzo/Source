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
import type { ProductsWidgetContent } from '@/components/sections/for-dig/interactive/ProductsWidget';
import type { CampaignsWidgetContent } from '@/components/sections/for-dig/interactive/CampaignsWidget';
import type { DeadlinesWidgetContent } from '@/components/sections/for-dig/interactive/DeadlinesWidget';
import type { SubscriptionDiscountContent } from '@/components/sections/for-dig/interactive/SubscriptionDiscount';
import type { SubscriptionWidgetsContent } from '@/components/sections/for-dig/subscription-widgets/content';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';

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
 * Widgeten (source.database origin/develop e7f702d6): typetiketterna Produkt,
 * Tjänst och Prenumeration (public/produkter-layout2.html:3214), fälten
 * Produktnamn, Pris (SEK), Huvudkategori och produktbild (:1378, :1392,
 * :1521, :4096-4152). Presentkort är growth och visas inte här.
 */
export const foretagProdukter = {
  id: 'produkter-och-tjanster',
  eyebrow: 'PRODUKTER & TJÄNSTER',
  title: 'Lägg upp det du säljer',
  body: [
    'Varor, tjänster eller abonnemang – lägg upp dem med namn, pris, bild och kategori, och se lagersaldot för det du har i lager.',
    'Allt du säljer finns på ett ställe, redo för din webbplats och för dina fakturor.',
  ],
  widget: {
    label: 'Exempel: en ny produkt läggs till i listan över det du säljer',
    listTitle: 'Det du säljer',
    addLabel: 'Lägg till ny produkt',
    rows: [
      { id: 'o1', name: 'Startpaket', kind: 'Produkt', price: 1200 },
      { id: 'o2', name: 'Tjänst per timme', kind: 'Tjänst', price: 950 },
      { id: 'o3', name: 'Månadsabonnemang', kind: 'Prenumeration', price: 299 },
      { id: 'o4', name: 'Tillbehör', kind: 'Produkt', price: 149 },
    ],
    newRow: { id: 'o0', name: 'Startpaket Plus', kind: 'Produkt', price: 1490 },
    dialog: {
      title: 'Lägg till ny produkt',
      name: { label: 'Produktnamn', value: 'Startpaket Plus' },
      price: { label: 'Pris (SEK)', amount: 1490 },
      category: { label: 'Kategori', value: 'Paket' },
      type: { label: 'Typ', value: 'Produkt' },
      image: { label: 'Produktbild', fileName: 'produktbild.jpg' },
      submitLabel: 'Spara produkt',
    },
  } satisfies ProductsWidgetContent,
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
 * Widgeten (source.database origin/develop e7f702d6): modalen har flikarna
 * Kampanj och Kampanjkod (public/kampanjer-layout2.html:341-342). Kampanjen har
 * Kampanjnamn, Rabatttyp (Procentuell rabatt / Fast rabatt (kr) / 2 för 1),
 * Rabattvärde, Start- och Slutdatum, Max antal användningar och Produkter
 * (:355-465), och knappen Skapa kampanj (:477). Kampanjen gäller valda
 * produkter, inte kategorier. En kod gäller hela varukorgen
 * (routes/campaignRoutes.js:806-886) och listas med Aktiv och antal
 * användningar (public/js/campaigns.js:1598-1633).
 */
export const foretagKampanjer = {
  id: 'kampanjer',
  eyebrow: 'KAMPANJER',
  title: 'Kampanjer och rabattkoder',
  body: [
    'Sätt kampanjpriser under en period, eller skapa en rabattkod med procent eller ett fast belopp.',
    'Du bestämmer hur länge koden gäller och hur många gånger den får användas – kunden anger den i kassan.',
  ],
  widget: {
    label: 'Exempel: en ny kampanj läggs till bland de aktiva kampanjerna',
    listTitle: 'Aktiva kampanjer',
    createLabel: 'Skapa kampanj',
    rows: [
      { id: 'k1', name: 'Välkomstrabatt', kind: 'Kampanjkod', code: 'VALKOMMEN10', discount: '−10 %', detail: 'Hela varukorgen · 12 av 100 användningar', status: 'Aktiv' },
      { id: 'k2', name: 'Paketpris', kind: 'Kampanj', discount: '−150 kr', detail: '2 produkter · till 2026-12-31', status: 'Aktiv' },
      { id: 'k3', name: 'Två för en', kind: 'Kampanj', discount: '2 för 1', detail: '1 produkt · till 2026-11-30', status: 'Aktiv' },
      { id: 'k4', name: 'Stamkund', kind: 'Kampanjkod', code: 'TACK100', discount: '−100 kr', detail: 'Hela varukorgen · 8 av 50 användningar', status: 'Aktiv' },
    ],
    newRow: { id: 'k0', name: 'Höstkampanj', kind: 'Kampanj', discount: '−20 %', detail: '3 produkter · 1–30 nov 2026', status: 'Aktiv' },
    dialog: {
      title: 'Ny kampanj',
      tabs: { campaign: 'Kampanj', code: 'Kampanjkod' },
      name: { label: 'Kampanjnamn', value: 'Höstkampanj' },
      products: { label: 'Produkter', value: '3 valda' },
      discountType: { label: 'Rabatttyp', value: 'Procentuell rabatt' },
      value: { label: 'Rabattvärde (%)', value: '20' },
      period: { label: 'Start- och slutdatum', value: '1–30 nov 2026' },
      maxUses: { label: 'Max antal användningar', value: 'Obegränsat' },
      submitLabel: 'Skapa kampanj',
    },
  } satisfies CampaignsWidgetContent,
};

/*
 * 5 – Prenumerationer. Belägg: sidan är core (server.js:1237), intervallerna
 * dag, vecka, månad och år (models/Product.js:279-295), paus och uppsägning
 * från kundprofilen (config/permissions.js:97). Betalsätt kort; autogiro
 * nämns inte.
 * Kampanj på en prenumeration (source.database origin/develop b25b58c1): fliken
 * Kunders prenumerationer (public/prenumerationer-layout2.html:1109), knappen
 * Lägg till kampanj med hjälptexten Rabatt på prenumerationen per prenumeration
 * (public/js/subscription-actions-panel.js:210-235), formuläret med Typ av rabatt,
 * Värde, Giltighet och Antal månader och knappen Lägg till (:306-333), raden visar
 * "Kampanj: 10 % i 2 månader" (public/js/kundprenumerationer.js:70-81, 122-127),
 * rabatten läggs på den enskilda prenumerationen (routes/adminTenantCustomerActions.js:912-976).
 * Formuläret har inget namnfält, och det finns ingen kampanj för alla prenumerationer.
 */
export const foretagPrenumerationer = {
  id: 'prenumerationer',
  eyebrow: 'ÅTERKOMMANDE INTÄKTER',
  title: 'Sälj prenumerationer',
  body: [
    'Låt kunden betala automatiskt med kort varje vecka, månad eller år.',
    'Du ser vilka som är aktiva, och kan pausa eller avsluta ett abonnemang när kunden vill.',
    'Vill du ge en kund rabatt lägger du en kampanj på just den prenumerationen – en period, ett antal månader eller tills vidare.',
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
  discount: {
    label: 'Exempel: en kampanj läggs på en kunds prenumeration',
    title: 'Kunders prenumerationer',
    rows: [
      { id: 's1', customer: 'Kund AB', plan: 'Utökad', amount: 399, perLabel: '/ månad', next: 'Nästa period 2026-11-27', status: 'Aktiv' },
      { id: 's2', customer: 'Exempel Nord AB', plan: 'Grund', amount: 199, perLabel: '/ månad', next: 'Nästa period 2026-11-25', status: 'Aktiv' },
      { id: 's3', customer: 'Exempel Väst AB', plan: 'Allt i ett', amount: 699, perLabel: '/ månad', next: 'Nästa period 2026-11-28', status: 'Aktiv' },
    ],
    targetId: 's1',
    addLabel: 'Lägg till kampanj',
    addHelp: 'Rabatt på prenumerationen',
    removeLabel: 'Ta bort kampanj',
    removeHelp: 'Rabatten upphör direkt',
    dialog: {
      title: 'Lägg till kampanj',
      message: 'Rabatten gäller prenumerationens kommande fakturor.',
      appliesTo: { label: 'Prenumeration' },
      type: { label: 'Typ av rabatt', value: 'Procent av priset' },
      value: { label: 'Värde', value: '10' },
      duration: { label: 'Giltighet', value: 'Ett antal månader' },
      months: { label: 'Antal månader', value: '2' },
      submitLabel: 'Lägg till',
    },
    appliedText: 'Kampanj: 10 % i 2 månader',
  } satisfies SubscriptionDiscountContent,
};

/*
 * 6 – Myndighetsdatum. Belägg: bolagsform, momsperiod och arbetsgivar-
 * registrering (models/TenantFiscalSettings.js:44-68), påminnelser om moms,
 * arbetsgivardeklaration den 12:e, årsredovisning för AB och BRF
 * (services/taxDeadlineService.js:60-118), egna datum (upp till 50). Skriv
 * påminnelser, inte garanterat rätt datum (taxDeadlineService.js:113).
 * Widgeten (source.database origin/develop 86e59e2c): kortet "Viktiga datum" med
 * "Kommande deadlines", knappen "Hantera", datum och "N dagar" som blir rött under
 * sju dagar (public/layout2/index.html:731-732, 859-890), "Lägg till eget datum"
 * (index.html:1074-1092), titlarna "Arbetsgivardeklaration <månad>", "Momsdeklaration
 * Q<n>" och "Årsredovisning till Bolagsverket" (services/taxDeadlineService.js:60-107),
 * egna datum som återkommer varje år (models/TenantFiscalSettings.js:18-21),
 * påminnelse via mejl 7 dagar och 1 dag före (cron/taxDeadlineCron.js:41-93) och
 * datumen i kalendern (taxDeadlineService.js:221-251). Preliminärskatt finns inte
 * i portalen och visas inte. Datumen är exempel.
 */
export const foretagMyndighetsdatum = {
  id: 'myndighetsdatum',
  eyebrow: 'MYNDIGHETSDATUM',
  title: 'Håll koll på viktiga datum',
  body: [
    'Fyll i bolagsform och momsperiod en gång, så får du påminnelser om moms, arbetsgivardeklaration och – för aktiebolag – årsredovisning i din kalender.',
    'Lägg till egna datum och flytta eller dölj dem som inte gäller dig.',
  ],
  deadlines: {
    label: 'Exempel: kommande myndighetsdatum med påminnelse, och ett eget datum som läggs till',
    title: 'Viktiga datum',
    subtitle: 'Kommande deadlines',
    manageLabel: 'Hantera',
    daysLabel: '{n} dagar',
    dayLabel: '{n} dag',
    nextLabel: 'Nästa',
    deadlines: [
      { id: 'agi', title: 'Arbetsgivardeklaration oktober', date: '12 okt', daysLeft: 5 },
      { id: 'moms', title: 'Momsdeklaration Q3', date: '12 nov', daysLeft: 36 },
      { id: 'ar', title: 'Årsredovisning till Bolagsverket', date: '30 nov', daysLeft: 54 },
    ],
    reminder: 'påminnelse via mejl 7 dagar och 1 dag före',
    addLabel: 'Lägg till eget datum',
    custom: { id: 'eget', title: 'Förnya företagsförsäkringen', date: '15 dec', daysLeft: 69, pill: 'Eget datum, varje år' },
    calendarNote: 'Datumen finns också i kalendern',
  } satisfies DeadlinesWidgetContent,
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
    { icon: LifebuoyIcon, title: 'Hjälp när du behöver den', body: 'AI-support i portalen och livechatt varje dag 08–20.' },
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

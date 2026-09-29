/*
 * Innehåll för /logistik (nya sektioner efter befintlig retursektion).
 *
 * Varje påstående här finns i kundportalens kod (source.database, origin/develop
 * e2fd2455, kontrollerad 2026-09-29; de citerade filerna är oförändrade sedan
 * 427da104 – se CC-RAPPORT-logistik-recon.md punkt 3 och CC-RAPPORT-logistik-bygge.md
 * punkt 6). Bara PostNord är en riktig transportör i portalen, så ingen annan nämns.
 *
 * Nämns inte (finns inte, är attrapper eller avstängda som standard): andra transportörer,
 * viktbaserad frakt, plockassistent och skanner, "i realtid", "synkar automatiskt",
 * leveranstider, flera lager, plocklistor och lagerplatser. Inga paketnamn.
 *
 * Exempeldata är neutral. Priserna i kassan är portalens standardpriser
 * (services/shipping/deliveryPricing.js 20–26), som handlaren kan ändra.
 */
import {
  ArrowDownTrayIcon,
  BanknotesIcon,
  ClockIcon,
  CubeIcon,
  HomeModernIcon,
  ReceiptPercentIcon,
  TruckIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type { LogisticsFlowContent } from '@/components/sections/tjanster/widgets/LogisticsFlow';

/*
 * ────────────────────────────────────────────────────────────────────────────
 * FLAGGOR – slå på här när portalens funktionsflaggor är bekräftade i produktion.
 * Båda är AV tills vidare (utils/featureFlags.js 4 och 9 är av som standard).
 *
 *   returer        FEATURE_RETURNS. På: lägger till kortet "Returer" i karusellen
 *                  (logistikFeatures nedan). Belägg: services/shipping/routes/returns.js
 *                  193–199, 261; public/js/return-case.js 52–80.
 *   statushamtning FEATURE_TRACKING_POLLING eller en konfigurerad PostNord-webhook.
 *                  På: mejlet i bokningsflödet visar statusarna Bokad, På väg och
 *                  Levererad (logistikFlode.mail.statuses). Belägg: public/js/
 *                  logistics-readonly.js 1195–1204; cron/trackingPollCron.js 16.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const FLAGGOR = {
  returer: false,
  statushamtning: false,
};

const IMG = '/tjanster/logistik/logistik';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];

export const logistikImages = {
  // S1 – lagret utifrån i solsken, en truck i den öppna porten.
  lager: {
    base: `${IMG}-lager`,
    alt: 'Ett lager med öppen port i solsken. Innanför står pallställ med kartonger och en person vid en gaffeltruck.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '58% 55%',
    portraitFocus: '50% 60%',
  },
  // S2 – händer håller ett tomt kort över en kartong med fraktsedel.
  fraktsedel: {
    base: `${IMG}-fraktsedel`,
    alt: 'Två händer vid en tejpad kartong med en fraktsedel, och ett tomt kort som hålls upp ovanför.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '45% 55%',
    portraitFocus: '50% 55%',
  },
  // S6 – två kollegor på knä vid en inplastad pall.
  skala: {
    base: `${IMG}-skala`,
    alt: 'Två kollegor på knä vid en pall med kartonger i ett stort lager, en gaffeltruck i bakgrunden.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '62% 55%',
    portraitFocus: '50% 55%',
  },
  // S8 – skiftledare på väg mot lastkajen, en kollega med vagn.
  avslut: {
    base: `${IMG}-avslut`,
    alt: 'En skiftledare går mot lastkajen och pratar med en kollega som drar en vagn med en stor kartong.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '42% 55%',
    portraitFocus: '50% 55%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * S1 – inledning. Belägg: leveransval i kassan (services/storefrontCheckoutService.js 390–396),
 * bokning hos PostNord (services/shipping/routes/shipments.js 68), fraktsedel som PDF
 * (shipments.js 579–594), mejl till kunden (shipments.js 531–532; services/emailTemplateEngine.js 485).
 */
export const logistikIntro = {
  eyebrow: 'LOGISTIK',
  title: 'Frakten på ett ställe',
  body: [
    'Från lagret hela vägen till kunden: leveranssätt i kassan, bokning hos PostNord, fraktsedel och spårningslänk – i samma portal, oavsett hur stor verksamheten är.',
  ],
};

/*
 * S2 – fraktsedeln. Belägg: "Skapa och boka" (public/order-details.html 305), bokning via
 * POST /api/shipping/:orderId/book (shipments.js 68), fraktsedeln hämtas som PDF via
 * GET /api/shipping/labels/:shipmentId (shipments.js 579–594) och "Ladda ner etikett"
 * (public/js/order-details.js 565).
 */
export const logistikFraktsedel = {
  eyebrow: 'FRAKTSEDEL',
  title: 'Fraktsedeln är klar när du bokar',
  body: ['Boka leveransen hos PostNord, så skapas fraktsedeln som PDF. Ladda ner den och sätt den på paketet.'],
};

/*
 * S3 – hela flödet (motion design). Belägg per steg:
 *   1 leveranssätt och priser – storefrontCheckoutService.js 390–396; deliveryPricing.js 20–26;
 *     "Fri frakt över belopp" – public/postnord-konfiguration-layout2.html 303
 *   2 ordern – "Beställningar" i logistiksidan (public/logistik-layout2.html 548)
 *   3 bokning – stegen Paketdetaljer, Granska, Boka leverans och "Skapa och boka"
 *     (order-details.html 189–199, 305); paketprofil med mått och vikt (logistik-layout2.html
 *     1455–1518); "Leverans bokad" (order-details.html, steg 3)
 *   4 fraktsedel som PDF – shipments.js 579–594; "Ladda ner etikett" (order-details.js 565)
 *   5 mejl – "Din order har skickats" med spårningsnummer och "Spåra din leverans"
 *     (emailTemplateEngine.js 470–485), skickas vid bokning (shipments.js 531–532)
 * Inga statusar efter bokningen så länge FLAGGOR.statushamtning är av.
 */
export const logistikFlode = {
  eyebrow: 'SÅ GÅR DET TILL',
  title: 'Från kassan till kundens inkorg',
  intro: 'Kunden väljer hur paketet ska komma, du bokar hos PostNord med ett klick, och fraktsedeln och mejlet med spårningslänken följer med.',
  label: 'Exempel: en beställning går från leveransval i kassan till bokning, fraktsedel och mejl med spårningslänk',
  steps: ['Leveranssätt', 'Order', 'Bokning', 'Fraktsedel', 'Spårningslänk'],
  checkout: {
    title: 'Välj leveranssätt',
    options: [
      { label: 'Brevlåda', price: 49 },
      { label: 'Utlämningsställe', price: 59 },
      { label: 'Paketbox', price: 59 },
      { label: 'Hemleverans', price: 79 },
      { label: 'Express till brevlåda', price: 99 },
    ],
    selected: 1,
    cart: { label: 'Varukorg', amount: 640 },
    freeShipping: { label: 'Fri frakt över', threshold: 600, applied: 'Fri frakt' },
  },
  order: {
    title: 'Ny beställning',
    status: { idle: 'Ny', done: 'Att boka' },
    rows: [
      ['Artiklar', 'Produkt × 2'],
      ['Leveranssätt', 'Utlämningsställe'],
      ['Frakt', 'Fri frakt'],
    ],
  },
  booking: {
    title: 'Boka hos PostNord',
    status: { idle: 'Ej bokad', done: 'Leverans bokad' },
    profile: { label: 'Paketprofil', value: 'Mellan · 30 × 20 × 15 cm · 1,2 kg' },
    button: 'Skapa och boka',
    note: 'Bokningen dras från din logistikbalans.',
  },
  shippingLabel: {
    title: 'Fraktsedel',
    file: 'fraktsedel.pdf',
    download: 'Ladda ner etikett',
  },
  mail: {
    title: 'Mejl till kunden',
    to: 'Till kunden',
    subject: 'Din order har skickats',
    trackingLabel: 'Spårningsnummer',
    button: 'Spåra din leverans',
    statuses: FLAGGOR.statushamtning ? ['Bokad', 'På väg', 'Levererad'] : undefined,
  },
} satisfies LogisticsFlowContent;

/*
 * S4 – spårningslänken. Belägg: mejlet "Din order har skickats" med "Spårningsnummer" och
 * "Spåra din leverans" (emailTemplateEngine.js 470–485), skickas vid bokning (shipments.js
 * 531–532). "Skapa leverans utan bokning" skickar inget mejl (order-details.html 304).
 */
export const logistikSparning = {
  eyebrow: 'SPÅRNINGSLÄNK',
  title: 'Kunden får länken direkt',
  body: [
    'När leveransen är bokad får kunden ett mejl med spårningsnummer och en länk för att följa paketet hos PostNord.',
  ],
};

/*
 * S6 – skala. Belägg: paketprofiler med namn, mått, vikt och antal kollin (logistik-layout2.html
 * 1455–1518), orderstopptid (postnord-konfiguration-layout2.html 283), logistikbalans med
 * förbetalning (logistik-layout2.html 538). Inga påståenden om flera lager eller plocklistor.
 */
export const logistikSkala = {
  eyebrow: 'NÄR DET VÄXER',
  title: 'Samma flöde, fler paket',
  body: [
    'Spara paketprofiler med mått, vikt och antal kollin, sätt en orderstopptid och fyll på logistikbalansen i förväg. Varje order bokas på samma sätt, oavsett hur många de är.',
  ],
};

/*
 * S7 – karusellen. Belägg per kort:
 *   leveranssätt i kassan – storefrontCheckoutService.js 390–396
 *   priser per leveranssätt – deliveryPricing.js 20–26
 *   fri frakt över belopp – postnord-konfiguration-layout2.html 303–311
 *   paketprofiler – logistik-layout2.html 1455–1518
 *   orderstopptid – postnord-konfiguration-layout2.html 283
 *   kräv frakt i kassan – logistik-layout2.html 526
 *   logistikbalans – logistik-layout2.html 538
 *   fraktsedel som PDF – shipments.js 579–594
 *   returer (bara med FLAGGOR.returer) – returns.js 193–199, 261; return-case.js 52–80
 */
const baseFeatures: FeatureItem[] = [
  { icon: TruckIcon, title: 'Leveranssätt i kassan', body: 'Brevlåda, utlämningsställe, paketbox, hemleverans eller express till brevlådan – kunden väljer.' },
  { icon: BanknotesIcon, title: 'Pris per leveranssätt', body: 'Du sätter priset för varje leveranssätt.' },
  { icon: ReceiptPercentIcon, title: 'Fri frakt över ett belopp', body: 'Ge kunden fri frakt när varukorgen passerar ett belopp du väljer.' },
  { icon: CubeIcon, title: 'Paketprofiler', body: 'Spara mått, vikt och antal kollin för de paket du skickar oftast.' },
  { icon: ClockIcon, title: 'Orderstopptid', body: 'Ange en tid på dagen för när beställningar ska vara packade.' },
  { icon: HomeModernIcon, title: 'Frakt i kassan', body: 'Välj om kunden måste välja leveranssätt i kassan.' },
  { icon: ArrowDownTrayIcon, title: 'Fraktsedel som PDF', body: 'Fraktsedeln skapas när du bokar och laddas ner som PDF.' },
];

const returerFeature: FeatureItem = {
  icon: ArrowUturnLeftIcon,
  title: 'Returer',
  body: 'Godkänn returen, skapa returetikett och återbetala i samma ärende.',
};

export const logistikFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'I PORTALEN',
  title: 'Inställningar för frakten',
  items: FLAGGOR.returer ? [...baseFeatures, returerFeature] : baseFeatures,
};

/*
 * S8 – avslut. Belägg: logistiksidan "Hantera leveranser och spårning" (logistik-layout2.html 513)
 * och flikarna Beställningar och Leveranser (548–552).
 */
export const logistikAvslut = {
  eyebrow: 'KOM IGÅNG',
  title: 'Logistiken i samma portal som butiken',
  body: ['Beställningar och leveranser samlas på ett ställe, med bokning, fraktsedel och spårningslänk.'],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
  packageNote: { text: 'Vilka funktioner som ingår beror på paket –', linkLabel: 'se priser', href: '/priser' },
};

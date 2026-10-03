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
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type { LogisticsFlowContent } from '@/components/sections/tjanster/widgets/LogisticsFlow';
import type { LogisticsReturnsContent } from '@/components/sections/tjanster/logistik/LogisticsReturnsSection';

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
 * S3 som video (ersätter de fem korten i LogisticsFlowSection; rubrik, överrad och brödtext ovan
 * är oförändrade). Renderad i ~/remotion-source, kompositionen LogistikFlode: 1920 × 1080,
 * 30 bilder per sekund, 20 s, loopar. Samma innehåll och belägg som korten ovan, plus betalningen
 * i kassan (kort, storefrontCheckoutService.js 2327) och notisen om ny beställning i portalen.
 * Inga statusar efter bokningen.
 */
const FLODE = '/tjanster/logistik/logistik-flode';
export const logistikFlodeVideo = {
  sources: [
    { src: `${FLODE}-960.webm`, type: 'video/webm', media: '(max-width: 767px)' },
    { src: `${FLODE}-960.mp4`, type: 'video/mp4', media: '(max-width: 767px)' },
    { src: `${FLODE}-1920.webm`, type: 'video/webm' },
    { src: `${FLODE}-1920.mp4`, type: 'video/mp4' },
  ],
  poster: { src: `${FLODE}-poster-1920.webp`, smallSrc: `${FLODE}-poster-960.webp`, srcSet: `${FLODE}-poster-960.webp 960w, ${FLODE}-poster-1920.webp 1920w` },
  end: { src: `${FLODE}-slut-1920.webp`, smallSrc: `${FLODE}-slut-960.webp`, srcSet: `${FLODE}-slut-960.webp 960w, ${FLODE}-slut-1920.webp 1920w` },
} satisfies { sources: ServiceVideoSource[]; poster: ServiceVideoStill; end: ServiceVideoStill };

/*
 * Retursektionen under flödesvideon – renderas bara med FLAGGOR.returer, som dagens retursektion.
 * Bara det som är live i kundportalen (source.database origin/develop):
 *   ärendelistan, fliken "Alla returer" – public/logistik-layout2.html 746–981,
 *     GET /api/shipping/returns (services/shipping/routes/returns.js 774)
 *   statusarna – models/ReturnRequest.js 19, etiketter returns.js 8–17 (Begärd, Godkänd,
 *     Mottagen, Avvisad)
 *   ärendet med Konversation, Returartiklar, Anledning och Statushistorik – public/return-case.html 188–254
 *   "Godkänn retur" – public/js/return-case.js 52 → PATCH /:id/status (returns.js 1771)
 *   statusmejlet till kunden – "Uppdatering om din retur — Godkänd", "Status på din retur har
 *     uppdaterats", "Vi återkommer med en returetikett inom kort." (services/emailTemplateEngine.js
 *     687–712, 1570; returns.js 23–24, 1850)
 * Inte: att kunden skickar bilder (kan inte, publicReturnRoutes.js 592–602), returetikett (manuellt
 * steg), att etiketten mejlas automatiskt (finns inte), återbetalning och någon återbetalningsvy.
 * Exempeldata är neutral och påhittad. Returer ingår i Growth (config/packageTiers.js 71, 74), inga
 * paketnamn på sidan.
 */
const RETUR = '/tjanster/logistik/logistik-returer';
export const logistikReturer = {
  eyebrow: 'RETURER',
  title: 'Varje retur blir ett ärende',
  body: [
    'Returerna samlas i logistiken, med kundens meddelanden, artiklarna och anledningen i samma ärende.',
    'Godkänn returen, så får kunden ett mejl om att den är godkänd.',
  ],
  list: {
    title: 'Returer',
    subtitle: 'Exempel på ärenden',
    label: 'Exempel: returärenden med status',
    columns: ['Order', 'Kund', 'Artikel', 'Anledning', 'Status'],
    cases: [
      { order: '1042', customer: 'Sara L.', item: 'Vas', reason: 'Skadad vid leverans', status: 'Begärd', tone: 'requested' },
      { order: '1039', customer: 'Johan B.', item: 'Bordslampa', reason: 'Ångrat köp', status: 'Begärd', tone: 'requested' },
      { order: '1035', customer: 'Mira K.', item: 'Termos', reason: 'Fel artikel', status: 'Godkänd', tone: 'approved' },
      { order: '1031', customer: 'Oskar N.', item: 'Förvaringskorg', reason: 'Saknar del', status: 'Mottagen', tone: 'received' },
      { order: '1027', customer: 'Elin H.', item: 'Hörlurar', reason: 'Ångrat köp', status: 'Avvisad', tone: 'rejected' },
    ],
  },
  video: {
    label: 'Exempel: ett returärende öppnas, returen godkänns och kunden får ett mejl om att den är godkänd',
    sources: [
      { src: `${RETUR}-960.webm`, type: 'video/webm', media: '(max-width: 767px)' },
      { src: `${RETUR}-960.mp4`, type: 'video/mp4', media: '(max-width: 767px)' },
      { src: `${RETUR}-1920.webm`, type: 'video/webm' },
      { src: `${RETUR}-1920.mp4`, type: 'video/mp4' },
    ],
    poster: { src: `${RETUR}-poster-1920.webp`, smallSrc: `${RETUR}-poster-960.webp`, srcSet: `${RETUR}-poster-960.webp 960w, ${RETUR}-poster-1920.webp 1920w` },
    end: { src: `${RETUR}-slut-1920.webp`, smallSrc: `${RETUR}-slut-960.webp`, srcSet: `${RETUR}-slut-960.webp 960w, ${RETUR}-slut-1920.webp 1920w` },
  },
} satisfies LogisticsReturnsContent;

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
 * S5 – brevlådevideon, hela källan (bildruta 0–120, 0–5,04 s; stängt lock och tom bild de sista
 * 1,08 s). Skruvhuvudets mönster på fronten är godkänt som osynligt i uppspelningsstorleken
 * (CC-RAPPORT-logistik-brevlada.md punkt 2). Belägg för texten: leveranssätten i kassan
 * (storefrontCheckoutService.js 390–396), valet sparas på ordern (storefrontCheckoutService.js
 * 1437–1445) och bokningen hos PostNord görs med valets servicekod (services/shipping/adapters/
 * postnord.js 232–238; services/shipping/bookingReadiness.js 10–13, 32–38). Inga leveranstider
 * och inga statusar så länge FLAGGOR.statushamtning är av.
 */
const VID = '/tjanster/logistik/logistik-brevlada';
export const logistikLeverans = {
  eyebrow: 'LEVERANS',
  title: 'Paketet kommer som kunden valde',
  body: [
    'Kunden väljer i kassan om paketet ska till brevlådan, ett utlämningsställe, en paketbox eller hem. Valet sparas på ordern, och leveransen bokas hos PostNord för just det leveranssättet.',
  ],
  label: 'En hand lägger ett paket i en brevlåda och stänger locket.',
  sources: [
    { src: `${VID}-960.webm`, type: 'video/webm', media: '(max-width: 767px)' },
    { src: `${VID}-960.mp4`, type: 'video/mp4', media: '(max-width: 767px)' },
    { src: `${VID}-1920.webm`, type: 'video/webm' },
    { src: `${VID}-1920.mp4`, type: 'video/mp4' },
  ],
  poster: { src: `${VID}-poster-1920.webp`, smallSrc: `${VID}-poster-960.webp`, srcSet: `${VID}-poster-960.webp 960w, ${VID}-poster-1920.webp 1920w` },
  end: { src: `${VID}-slut-1920.webp`, smallSrc: `${VID}-slut-960.webp`, srcSet: `${VID}-slut-960.webp 960w, ${VID}-slut-1920.webp 1920w` },
} satisfies {
  eyebrow: string;
  title: string;
  body: string[];
  label: string;
  sources: ServiceVideoSource[];
  poster: ServiceVideoStill;
  end: ServiceVideoStill;
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

/*
 * Innehåll för /privat-vaxande (Privat Växande).
 *
 * "Privat" är en person som driver sin egen verksamhet eller sitt varumärke och säljer till
 * privatpersoner. Copy med du-tilltal, om hennes eller hans varumärke, kunder och tid – inte
 * om team och flöden mellan företag. Varje påstående ska finnas i kundportalens kod – belägg
 * per sektion nedan och i ~/cc-rapporter/privat-plan.md, punkt 3.1 (northlab-io/source.database
 * origin/develop 907a8e2). Skriv inga resultat, inga paketnamn, inga priser på Source och inga
 * användarantal. Bara PostNord, och frakt "bokas", aldrig automatiskt. Exempeldata är fiktiv och
 * branschneutral, utan siffror utöver kundens egna priser.
 */
import {
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  EyeIcon,
  GlobeEuropeAfricaIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import type { GettingStartedStep } from '@/components/sections/for-dig/GettingStartedSection';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';
import type { CheckoutWidgetContent } from '@/components/sections/for-dig/interactive/CheckoutWidget';
import type {
  GiftCardContent,
  ReviewCardContent,
  StatusCardContent,
  StatusRowContent,
} from '@/lib/data/for-dig/foretag-vaxa';

const money = { currency: 'SEK', locale: 'sv-SE' } as const;
export const privatVaxandeMoney = money;

/* Bilder – skapade med scripts/tjanster-bilder.mjs privat-vaxande. */
const IMG = '/for-dig/privat-vaxande/privat-vaxande';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const privatVaxandeImages = {
  // En kvinna i mössa lägger ett paket i ett paketskåp på en stadsgata en höstdag. Ansiktet sitter
  // till vänster, så texten står till höger från lg.
  frakt: {
    base: `${IMG}-frakt`,
    alt: 'En kvinna i mössa och mörk kappa står vid ett paketskåp på en gata och lägger in ett paket.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // En man packar upp en låda på ett trapplan i ett ljust trapphus, vid ett fönster.
  kunder: {
    base: `${IMG}-kunder`,
    alt: 'En man sitter på ett trapplan i ett ljust trapphus och packar upp en kartong vid ett fönster.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // Ägaren vid disken i en liten studio, sedd genom en dörröppning, medan en kund hänger av sig
  // vid dörren. Fokus till höger håller texten borta från båda ansiktena från lg.
  boka: {
    base: `${IMG}-boka`,
    alt: 'En kvinna står vid disken i en liten studio och tittar på telefonen medan en besökare hänger av sig vid dörren.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '97% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * 1 – Skicka dina beställningar. Belägg: logistik och paketprofiler
 * (config/packageTiers.js:71-77), bokning och spårning i PostNord-adaptern
 * (services/shipping/adapters/postnord.js:386). Bara PostNord, "boka". Returer kräver
 * FEATURE_RETURNS, som är av som standard (utils/featureFlags.js:4), och nämns inte.
 */
// No eyebrow and one paragraph: the teal eyebrow reached only 2.2:1 on the grey street, and the shorter
// block ends above her hand on the locker door at 1366 × 768 and 1440 × 900.
export const privatVaxandeFrakt = {
  id: 'skicka',
  title: 'Skicka dina beställningar',
  body: [
    'Boka frakten med PostNord direkt från ordern, så kan kunden följa paketet på vägen.',
  ],
  card: {
    label: 'Beställning',
    value: 'Skickad',
    pill: 'PostNord',
    row: { title: 'Frakt bokad', note: 'Paketet kan spåras' },
  } satisfies StatusCardContent,
};

/*
 * 2 – Kassan i ditt utseende. Belägg: checkout med logotyp och färg (config/packageTiers.js:80,
 * routes/checkoutSettingsRoutes.js:229-309), presentkort (config/packageTiers.js:110,
 * routes/giftCardRoutes.js:418, 751, 1010). Samma widget och belägg som Företag Växa
 * (lib/data/for-dig/foretag-vaxa.ts, vaxaKassa): kort som enda betalsätt, rabattkod i
 * kassan, presentkortet löses in före kassan. Klarna och Swish nämns inte.
 */
export const privatVaxandeKassa = {
  id: 'kassan',
  eyebrow: 'KASSAN',
  title: 'Kassan i ditt utseende',
  body: [
    'Din logotyp och din accentfärg följer med ända till betalningen, så känner kunden igen din butik.',
    'Kunden betalar med kort och kan ange en rabattkod i kassan. Sälj presentkort som dina kunder kan ge bort.',
  ],
  checkout: {
    label: 'Exempel: kassan med din logotyp och färg, där en rabattkod läggs till',
    shopName: 'Ditt varumärke',
    summaryTitle: 'Din beställning',
    lines: [
      { id: 'c1', name: 'Startpaket', quantity: 1, unitPrice: 590 },
      { id: 'c2', name: 'Tillbehör', quantity: 1, unitPrice: 100 },
    ],
    subtotalLabel: 'Delsumma',
    code: { label: 'Rabattkod', placeholder: 'Lägg till rabattkod', value: 'VALKOMMEN10', rate: 0.1, applyLabel: 'Lägg till', appliedLabel: 'Rabatt' },
    totalLabel: 'Att betala',
    payment: { title: 'Betalning', method: 'Kort', cardNumber: '1234 1234 1234 1234', expiry: 'MM / ÅÅ', cvc: 'CVC' },
    payLabel: 'Betala',
    secureNote: 'Säker kortbetalning',
  } satisfies CheckoutWidgetContent,
  giftCard: {
    title: 'Presentkort',
    code: { label: 'Kod', value: 'GAVA-3K8P' },
  } satisfies GiftCardContent,
};

/*
 * 3 – Kunderna kommer tillbaka. Belägg: e-post med utskick och egen avsändardomän
 * (config/packageTiers.js:97), kundomdömen med publicering på webbplatsen
 * (routes/productReviewRoutes.js:36), nyheter i butiken (config/packageTiers.js:69).
 * Segmenten ur egna kunder: leadssidans B2C-läge visar vilande kunder, engångsköpare och
 * toppkunder ur kundens egna ordrar, utan AI och utan extern källa (kundportalen origin/develop
 * 59816137, routes/leadsRoutes.js:531-596, public/leads-layout2.html:576-580, spärrat till
 * paketet i server.js:3279). Inga gränser i dagar eller procent i texten.
 * Köp- och återköpsbekräftelse och påminnelser nämns inte. Omdömet har inget citat.
 */
export const privatVaxandeKunder = {
  id: 'kunderna',
  eyebrow: 'DINA KUNDER',
  title: 'Kunderna kommer tillbaka',
  body: [
    'Skicka nyhetsbrev från din egen avsändaradress och berätta om det som är nytt direkt i butiken.',
    'Samla kundernas omdömen och visa dem på din webbplats.',
    'Se vilka kunder som inte har handlat på ett tag, vilka som bara har handlat en gång och vilka som handlar mest, så vet du vem du ska höra av dig till.',
  ],
  review: {
    title: 'Nytt omdöme',
    stars: 5,
    outOf: 5,
    starsLabel: 'Betyg i exemplet',
    status: 'Visas på webbplatsen',
  } satisfies ReviewCardContent,
};

/*
 * 4 – Låt kunderna boka tid. Belägg: bokningssystemet med kortbetalning vid bokning
 * (config/packageTiers.js:112). Meddelande och samtal från bokningen nämns inte.
 */
export const privatVaxandeBoka = {
  id: 'boka-tid',
  eyebrow: 'BOKNINGAR',
  title: 'Låt kunderna boka tid',
  body: [
    'Säljer du tjänster kan kunden välja en tid och betala med kort direkt när bokningen görs.',
    'Du slipper boka in kunderna i telefon, och tiden är betald redan när de kommer.',
  ],
  card: { title: 'Bokning bekräftad', note: 'Betald med kort' } satisfies StatusRowContent,
};

/*
 * 5 – Se vad som säljer. Belägg: AI-insikter (config/packageTiers.js:94-95), analyser med
 * geografisk vy och övergivna kassor (config/packageTiers.js:89-92). Inga kvoter, inga siffror.
 */
export const privatVaxandeInsikter = {
  id: 'insikter',
  eyebrow: 'INSIKTER',
  title: 'Se vad som säljer',
  body: [
    'AI-insikterna sammanfattar vad som händer i din butik och föreslår vad du kan göra härnäst.',
    'Se var dina kunder finns och hur många som lämnar kassan innan de har betalat.',
  ],
  insight: {
    label: 'AI-insikt',
    category: 'Försäljning',
    title: 'En produkt säljer mer än vanligt',
    body: 'Den har fått fler beställningar den senaste tiden än under perioden innan.',
    recommendationLabel: 'Förslag',
    recommendation: 'Lyft fram den i nästa nyhetsbrev och på startsidan.',
    updated: 'Uppdaterad i dag',
  },
};

/*
 * 6 – Mer som ingår. Belägg: bokföring med Fortnox (config/packageTiers.js:107-108), analyser,
 * geografi och övergivna kassor (89-92), konkurrentbevakning (87), inköpsförslag med
 * AI-sammanfattning (routes/inventoryRoutes.js:862), nyheter (config/packageTiers.js:69).
 */
export const privatVaxandeMer = {
  id: 'mer-som-ingar',
  eyebrow: 'MER SOM INGÅR',
  title: 'Allt runt omkring din butik',
  items: [
    { icon: DocumentCheckIcon, title: 'Bokföring med Fortnox', body: 'Det du säljer och får betalt för hamnar i bokföringen som verifikat.' },
    { icon: ShoppingCartIcon, title: 'Övergivna kassor', body: 'Se hur många som lämnar kassan innan de har betalat.' },
    { icon: GlobeEuropeAfricaIcon, title: 'Analyser och geografi', body: 'Se hur försäljningen utvecklas och var dina kunder finns.' },
    { icon: ArrowTrendingUpIcon, title: 'Inköpsförslag med AI', body: 'Få en sammanfattning av vad som är klokt att köpa in härnäst.' },
    { icon: EyeIcon, title: 'Konkurrentbevakning', body: 'Följ de konkurrenter du vill hålla koll på, samlat på ett ställe.' },
    { icon: MegaphoneIcon, title: 'Nyheter i butiken', body: 'Berätta om det som är nytt, direkt för kunderna i din butik.' },
  ] satisfies FeatureItem[],
};

/*
 * 7 – Så kommer du igång. Manuell aktivering (middleware/requireAuth.js:237-255). Ingen ledtid.
 * Bilden är Privat-sidornas egen (samma som /privat-start).
 */
export const privatVaxandeKomIgang = {
  id: 'sa-kommer-du-igang',
  eyebrow: 'KOM IGÅNG',
  title: 'Så kommer du igång',
  steps: [
    { number: '01', title: 'Prata med oss', body: 'Berätta om ditt varumärke och vad du vill göra härnäst.' },
    { number: '02', title: 'Vi aktiverar funktionerna', body: 'Vi slår på det som ingår på ditt konto.' },
    { number: '03', title: 'Koppla PostNord och din kassa', body: 'Ställ in frakten och kassans utseende i portalen.' },
    { number: '04', title: 'Fortsätt växa', body: 'Sälj, skicka och håll kontakten med dina kunder på ett ställe.' },
  ] satisfies GettingStartedStep[],
  image: {
    src: '/images/for-dig/privat/08-sa-kommer-du-igang.webp',
    alt: 'En kvinna i tjock stickad tröja sitter i en grön soffa och skriver på en laptop, i ett ljust vardagsrum med en vägg full av inramade konstverk och en monstera.',
  },
  cta: { label: 'Prata med oss', href: '/kontakt' },
};

/* 8 – Avslutande CTA. Boka demo primär, priser sekundär. */
export const privatVaxandeAvslut = {
  id: 'kom-igang-cta',
  title: 'Väx i din egen takt',
  body: ['Boka en demo så visar vi hur det fungerar för dig, eller se vad som ingår och vad det kostar.'],
  primary: { label: 'Boka demo', href: '/kontakt' },
  secondary: { label: 'Se priser', href: '/priser' },
};

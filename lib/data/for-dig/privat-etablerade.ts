/*
 * Innehåll för /privat-etablerad (Privat Etablerade).
 *
 * "Privat" är en person som driver sin egen etablerade verksamhet eller sitt varumärke. Copy med
 * du-tilltal, om hennes eller hans varumärke, kunder och tid. Varje påstående ska finnas i
 * kundportalens kod – belägg per sektion nedan och i ~/cc-rapporter/privat-plan.md, punkt 3.2
 * (northlab-io/source.database origin/develop 907a8e2). Livechatt formuleras "även utanför
 * kontorstid", aldrig dygnet runt eller tidslöften. Ingen webbtrafik, export, PDF, schemalagda
 * statistikrapporter, direkt publicering, tilldelning av ärenden eller kvoter. Inga paketnamn,
 * priser på Source eller användarantal. Exempeldata är fiktiv, branschneutral och utan siffror.
 */
import {
  CreditCardIcon,
  DocumentCheckIcon,
  GiftIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import type { GettingStartedStep } from '@/components/sections/for-dig/GettingStartedSection';
import type { SectionImage } from '@/components/sections/for-dig/types';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';
import type { StatsOverviewContent } from '@/lib/data/for-dig/foretag-etablerade';
import type { StatusCardContent, StatusRowContent } from '@/lib/data/for-dig/foretag-vaxa';

/* Bilder – skapade med scripts/tjanster-bilder.mjs privat-etablerade. */
const IMG = '/for-dig/privat-etablerade/privat-etablerade';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const privatEtableradeImages = {
  // Två kvinnor vid ett köksbord med en surfplatta, tom bordsyta i förgrunden. Fokus till vänster
  // håller texten på fönstret och växterna, till vänster om ansiktena.
  studio: {
    base: `${IMG}-studio`,
    alt: 'Två kvinnor sitter tätt ihop vid ett köksbord i trä och skrattar åt något på en surfplatta.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '0% 50%',
    portraitFocus: '50% 50%',
  },
  // En kvinna i soffan med en bärbar dator, bokhylla och växter bakom.
  inkorg: {
    base: `${IMG}-inkorg`,
    alt: 'En kvinna sitter i en ljus soffa med en bärbar dator i knät och en kopp te bredvid sig.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // En man vid köksbänken en kväll med telefonen. Fokus till höger håller texten på köksfläkten och
  // kylskåpet, till höger om ansiktet.
  hjalp: {
    base: `${IMG}-hjalp`,
    alt: 'En man i röd tröja lutar sig mot köksbänken en kväll och skriver på sin telefon.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '100% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * 1 – En studio för ditt varumärke. Belägg: /marknadsforing är enterprise
 * (config/packageTiers.js:122-132); kampanjassistenten tar fram plan och skapar kanaler
 * (routes/campaignRoutes.js:1881, 1987, 2057, 2635, 2692); bilder per kanal (2853-3024) och
 * bildbiblioteket (routes/creativeLibraryRoutes.js:61, 135-563); annonsöversikter för anslutna
 * konton (server.js:3192-3195). Inte: direkt publicering, annonser som Source sköter, LinkedIn.
 */
export const privatEtableradeStudio = {
  id: 'studio',
  title: 'En studio för ditt varumärke',
  body: [
    'Beskriv vad du vill uppnå, så tar AI-assistenten fram en plan med kanaler och budskap.',
    'Skapa bilder till varje kanal, spara dem i ditt bildbibliotek och följ resultatet från dina anslutna konton hos Google, Meta och TikTok.',
  ],
  card: {
    label: 'Kampanjplan',
    value: 'Klar',
    pill: 'AI-assistent',
    row: { title: 'Tre kanaler', note: 'E-post, Meta och Google Ads' },
  } satisfies StatusCardContent,
  // Compact version below md, where the full card would reach their hands.
  row: { title: 'Kampanjplan klar', note: 'E-post, Meta och Google Ads' } satisfies StatusRowContent,
};

/*
 * 2 – Svara dina kunder från en inkorg. Belägg: /support-inbox är enterprise
 * (config/packageTiers.js:135, server.js:3163); status, prioritet och svar via e-post
 * (routes/supportInboxRoutes.js:226, 248, 309, 336); egen inkommande domän och egen avsändare
 * (828-861, 978-1028). Inte: tilldelning av ärenden.
 */
export const privatEtableradeInkorg = {
  id: 'inkorg',
  eyebrow: 'SUPPORT-INKORG',
  title: 'Svara dina kunder från en inkorg',
  body: [
    'Kundernas mejl hamnar på ett ställe, på din egen domän.',
    'Svara från din egen adress och håll ordning med status och prioritet.',
  ],
  card: {
    label: 'Inkorg',
    value: 'Besvarat',
    pill: 'Prioriterat',
    row: { title: 'Svar skickat', note: 'Från hej@dittvarumarke.se' },
  } satisfies StatusCardContent,
};

/*
 * 3 – Se vad som driver försäljningen. Belägg: /statistik är enterprise
 * (config/packageTiers.js:118-119); försäljning, ordrar, bokningar och konvertering
 * (routes/statisticsRoutes.js:596, 1081, 1182, 1389); anpassa moduler
 * (public/statistik-layout2.html:1215). Inte: webbtrafik, export, PDF, schemalagda rapporter.
 */
export const privatEtableradeStatistik = {
  id: 'statistik',
  eyebrow: 'STATISTIK',
  title: 'Se vad som driver försäljningen',
  body: [
    'Följ försäljning, ordrar, bokningar och konvertering över tid på ett ställe.',
    'Välj själv vilka delar som visas, så ser du det som betyder mest för ditt varumärke.',
  ],
  card: {
    title: 'Försäljningen över tid',
    period: 'Över tid',
    rows: [
      { id: 'forsaljning', label: 'Försäljning', trend: [3, 3.6, 3.4, 4.4, 4.2, 5.2, 5.8] },
      { id: 'ordrar', label: 'Ordrar', trend: [3.6, 3.4, 4.2, 4, 4.8, 4.6, 5.4] },
      { id: 'bokningar', label: 'Bokningar', trend: [2.8, 3.2, 3, 3.6, 4.2, 4, 4.6] },
      { id: 'konvertering', label: 'Konvertering', trend: [3, 3.3, 3.1, 3.6, 3.5, 4, 4.3] },
    ],
  } satisfies StatsOverviewContent,
};

/*
 * 4 – Hjälp när det gäller. Belägg: AI-supporten och eskalering till livechatt, alltid för
 * paketet, övriga vardagar 08–20 (config/packageTiers.js:288-290, routes/aiSupportRoutes.js:117-143).
 * Formulering: "även utanför kontorstid", inga tidslöften.
 */
export const privatEtableradeHjalp = {
  id: 'hjalp',
  title: 'Hjälp när det gäller',
  body: [
    'AI-supporten svarar direkt i portalen.',
    'Behöver du en person kopplas du vidare till livechatt, även utanför kontorstid.',
  ],
  card: { title: 'Livechatt', note: 'Kopplad till supporten' } satisfies StatusRowContent,
};

/* 5 – Allt från Växande. Belägg i privat-plan.md punkt 3.1 och lib/data/for-dig/privat-vaxande.ts. */
export const privatEtableradeMer = {
  id: 'allt-fran-vaxande',
  eyebrow: 'ALLT FRÅN VÄXANDE',
  title: 'Och allt du redan växer med',
  items: [
    { icon: CreditCardIcon, title: 'Kassan i ditt utseende', body: 'Din logotyp och dina färger i kassan, med Klarna och Swish.' },
    { icon: GiftIcon, title: 'Presentkort', body: 'Sälj presentkort som dina kunder kan ge bort.' },
    { icon: TruckIcon, title: 'Frakt och returer', body: 'Boka frakt med PostNord och ta emot returer där ordern finns.' },
    { icon: StarIcon, title: 'Kundomdömen', body: 'Samla omdömen och visa dem på din webbplats.' },
    { icon: SparklesIcon, title: 'AI-insikter', body: 'Insikter om försäljning och kunder som uppdateras oftare.' },
    { icon: DocumentCheckIcon, title: 'Bokföring med Fortnox', body: 'Det du säljer och får betalt för hamnar i bokföringen som verifikat.' },
  ] satisfies FeatureItem[],
};

/*
 * 6 – Så kommer du igång. Manuell aktivering (middleware/requireAuth.js:237-255), Source kopplar
 * betalkontot vid provisioneringen (routes/adminTenantProvision.js:96-100). Ingen ledtid. Bilden är
 * en stillbild ur hero-videon (public/greenetablerade.mp4, 5 s).
 */
export const privatEtableradeKomIgang = {
  id: 'sa-kommer-du-igang',
  eyebrow: 'KOM IGÅNG',
  title: 'Så kommer du igång',
  steps: [
    { number: '01', title: 'Boka en demo', body: 'Berätta om ditt varumärke och vad du vill göra härnäst.' },
    { number: '02', title: 'Vi går igenom dina behov', body: 'Vi visar hur studio, inkorg och statistik passar dig.' },
    { number: '03', title: 'Vi aktiverar kontot', body: 'Vi öppnar kontot och kopplar betalningarna.' },
    { number: '04', title: 'Koppla dina konton', body: 'Koppla annonskontona och din kassa i portalen.' },
  ] satisfies GettingStartedStep[],
  image: {
    src: '/for-dig/privat-etablerade/privat-etablerade-kom-igang-1920.webp',
    alt: 'Abstrakt spiral av tunna gröna lameller mot en vit bakgrund.',
  } satisfies SectionImage,
  cta: { label: 'Prata med oss', href: '/kontakt' },
};

/* 7 – Avslutande CTA. Boka demo primär, priser sekundär. */
export const privatEtableradeAvslut = {
  id: 'kom-igang-cta',
  title: 'Ditt varumärke, på ett ställe',
  body: ['Boka en demo så visar vi hur det fungerar för dig, eller se vad som ingår och vad det kostar.'],
  primary: { label: 'Boka demo', href: '/kontakt' },
  secondary: { label: 'Se priser', href: '/priser' },
};

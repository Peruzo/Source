/*
 * Innehåll för /foretag-etablerad (Företag Etablerade, paketet för etablerade företag).
 *
 * Varje påstående ska finnas i kundportalens kod – belägg per sektion nedan och i
 * ~/cc-rapporter/foretag-etablerade-plan.md, punkt 1 (northlab-io/source.database
 * origin/develop ad061f50e). Beslut för detta pass: livechatt "även utanför
 * kontorstid", aldrig dygnet runt eller tidslöften; ingen webbtrafik eller
 * spårningskod; inga annonser som Source sköter; inga roller som paketfunktion.
 * Skriv inga resultat, inga paketnamn, inga priser på Source, inga användarantal
 * och inga siffror i widgetarna – de visar hur gränssnittet ser ut, inte vad en
 * kund uppnår.
 */
import {
  CreditCardIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  SparklesIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import type { GettingStartedStep } from '@/components/sections/for-dig/GettingStartedSection';
import type { SectionImage } from '@/components/sections/for-dig/types';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';
import type { StatusCardContent } from '@/lib/data/for-dig/foretag-vaxa';

export type StatsOverviewContent = {
  title: string;
  period: string;
  /** One row per module. `trend` only draws the line – it is shape, not data. */
  rows: { id: string; label: string; trend: readonly number[] }[];
};

export type StudioScreenContent = {
  label: string;
  section: string;
  campaign: string;
  status: string;
  tabs: readonly string[];
  activeTab: string;
  plan: {
    title: string;
    goal: { label: string; value: string };
    channels: { id: string; channel: string; idea: string }[];
    action: string;
    followUp: string;
  };
  images: {
    title: string;
    formats: readonly string[];
    note: string;
  };
};

export type ChatCardContent = {
  label: string;
  title: string;
  messages: { id: string; from: 'kund' | 'ai'; text: string }[];
  handoff: { title: string; note: string };
};

/* Bilder – skapade med scripts/tjanster-bilder.mjs foretag-etablerade. */
const IMG = '/for-dig/foretag-etablerade/foretag-etablerade';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const etableradeImages = {
  // Svarta kromade bågar som stiger åt höger; den tomma övre vänstra ytan bär texten från lg.
  statistik: {
    base: `${IMG}-statistik`,
    alt: 'Abstrakt form i svart krom: blanka bågar som stiger i höjd från vänster till höger mot svart bakgrund.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // Händer håller en surfplatta rakt uppifrån mot mörk sten. Visas hel (16:9 och 3:4), så
  // skärmytans procent gäller vid varje bredd – se STUDIO_SCREEN.
  studio: {
    base: `${IMG}-studio`,
    alt: 'Två händer håller en surfplatta ovanför en mörk stenskiva, sedd rakt uppifrån.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
  // En person i mörk kavaj tittar på sin telefon i en hög hall av ljus betong i skymningsljus.
  support: {
    base: `${IMG}-support`,
    alt: 'En person i mörk kavaj står i en hög hall av betong och läser på sin telefon.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Surfplattans skärmyta i procent av fotot, uppmätt på originalet 2048 × 1152
 * (_research/originals/foretag-etablerade/studio-A.png): skärmen innanför den svarta
 * ramen går x 632–1399, y 273–862. Porträttet är x 583–1447 ur samma original.
 */
export const STUDIO_SCREEN = {
  landscape: { left: 30.86, top: 23.7, width: 37.45, height: 51.13 },
  portrait: { left: 5.67, top: 23.7, width: 88.77, height: 51.13 },
} as const;

/*
 * 1 – Statistik för ledningen. Belägg: /statistik är enterprise
 * (config/packageTiers.js:118-119, server.js:3174-3180); ledningsöversikt, konvertering,
 * ordrar och bokningar (routes/statisticsRoutes.js:596, 1081, 1182, 1389); diagram över
 * tid (public/statistik-layout2.html:429, 815, 897); anpassa moduler (rad 1215).
 * Inte: webbtrafik, export, PDF, schemalagda rapporter, detaljvy.
 */
export const etableradeStatistik = {
  id: 'statistik',
  eyebrow: 'STATISTIK',
  title: 'Hela verksamheten på en skärm',
  body: [
    'Följ försäljning, ordrar, bokningar och konvertering samlat, och se hur de utvecklas över tid.',
    'Välj vilka moduler som visas, så ser ledningen det som betyder mest för er.',
  ],
  card: {
    title: 'Ledningsöversikt',
    period: 'Över tid',
    rows: [
      { id: 'forsaljning', label: 'Försäljning', trend: [3, 4, 3.6, 5, 4.8, 6, 6.4] },
      { id: 'ordrar', label: 'Ordrar', trend: [4, 3.8, 4.6, 4.2, 5.2, 5, 5.8] },
      { id: 'bokningar', label: 'Bokningar', trend: [2.6, 3.4, 3.2, 3.8, 4.4, 4.2, 5] },
      { id: 'konvertering', label: 'Konvertering', trend: [3.2, 3.4, 3.1, 3.9, 3.7, 4.3, 4.6] },
    ],
  } satisfies StatsOverviewContent,
};

/*
 * 2 – Marknadsföringsstudion. Belägg: /marknadsforing är enterprise
 * (config/packageTiers.js:122-132, server.js:3237, 3298-3302); flikar
 * (public/js/marknadsforing.js:33); kampanjassistenten plan, skapa kanaler och chatt
 * (routes/campaignRoutes.js:1881, 1987, 2057, 2635, 2692, 2724); bilder per kanal
 * (2853-3024); bildbiblioteket (routes/creativeLibraryRoutes.js:61, 135-563);
 * kanaltyper (models/Campaign.js:55); annonsöversikter för anslutna konton
 * (server.js:3192-3195). Inte: publicering direkt (public/js/marknadsforing.js:673),
 * annonser som Source sköter, LinkedIn, kvoter.
 */
export const etableradeStudio = {
  id: 'marknadsforing',
  eyebrow: 'MARKNADSFÖRING',
  title: 'En studio för hela kampanjen',
  body: [
    'Beskriv målet, så tar AI-assistenten fram en plan med kanaler och budskap som ni bygger kampanjen på.',
    'Skapa bilder till varje kanal, spara dem i bildbiblioteket och följ resultatet från era anslutna konton hos Google, Meta och TikTok på samma ställe.',
  ],
  screen: {
    label: 'Exempel: en kampanjplan från AI-assistenten i marknadsföringsstudion',
    section: 'Marknadsföring',
    campaign: 'Ny säsong',
    status: 'Utkast',
    tabs: ['Översikt', 'Kanaler', 'Assistent', 'Bilder'],
    activeTab: 'Assistent',
    plan: {
      title: 'Plan från assistenten',
      goal: { label: 'Mål', value: 'Nå befintliga kunder inför en ny säsong' },
      channels: [
        { id: 'epost', channel: 'E-post', idea: 'Nyhetsbrev till befintliga kunder' },
        { id: 'meta', channel: 'Meta', idea: 'Bildannons i flödet' },
        { id: 'google', channel: 'Google Ads', idea: 'Sökannons' },
      ],
      action: 'Skapa kanaler',
      followUp: 'Ställ en följdfråga om planen',
    },
    images: {
      title: 'Bilder',
      formats: ['Kvadrat', 'Stående', 'Story', 'Liggande'],
      note: 'Sparas i bildbiblioteket',
    },
  } satisfies StudioScreenContent,
};

/*
 * 3 – Support-inkorgen. Belägg: /support-inbox är enterprise (config/packageTiers.js:135,
 * server.js:3163); status, prioritet, interna anteckningar och svar via e-post
 * (routes/supportInboxRoutes.js:226, 248, 267-336); egen inkommande domän och egen
 * avsändare (828-861, 978-1028). Inte: tilldelning av ärenden (ingen route).
 */
export const etableradeSupportInkorg = {
  id: 'support-inkorg',
  eyebrow: 'SUPPORT-INKORG',
  title: 'Kundernas mejl i en inkorg',
  body: [
    'Mejl till er supportadress hamnar i en gemensam inkorg på er egen domän.',
    'Svara från er egen adress, sätt status och prioritet och lämna interna anteckningar till kollegorna.',
  ],
  card: {
    label: 'Support-inkorg',
    value: 'Besvarat',
    pill: 'Prioriterat',
    row: { title: 'Svar skickat', note: 'Från support@dittforetag.se' },
  } satisfies StatusCardContent,
};

/*
 * 4 – Hjälp när det gäller. Belägg: AI-supporten i portalen, eskalering till livechatt
 * alltid för paketet, övriga vardagar 08–20 (config/packageTiers.js:288-290,
 * routes/aiSupportRoutes.js:117-143). Beslut: "även utanför kontorstid", inga tidslöften.
 */
export const etableradeHjalp = {
  id: 'hjalp',
  eyebrow: 'SUPPORT',
  title: 'Hjälp när det gäller',
  body: [
    'AI-supporten svarar direkt i portalen.',
    'Behöver ni en person kopplas ni vidare till livechatt, även utanför kontorstid.',
  ],
  chat: {
    label: 'Exempel: AI-supporten kopplar vidare till livechatt',
    title: 'Support',
    messages: [
      { id: 'm1', from: 'kund', text: 'Jag behöver hjälp med en inställning.' },
      { id: 'm2', from: 'ai', text: 'Jag hjälper gärna till. Vill du prata med någon i supporten?' },
      { id: 'm3', from: 'kund', text: 'Ja, tack.' },
    ],
    handoff: { title: 'Livechatt', note: 'Kopplad till supporten' },
  } satisfies ChatCardContent,
};

/*
 * 5 – Allt från Växa. Belägg i ~/cc-rapporter/foretag-start-bygge-4.md, punkt 2.1, och
 * lib/data/for-dig/foretag-vaxa.ts. Tätare AI-insikter: uppdatering per timme mot per dygn
 * (config/packageTiers.js:233, 263) – utan siffror.
 */
export const etableradeMer = {
  id: 'allt-fran-vaxa',
  eyebrow: 'ALLT FRÅN VÄXA',
  title: 'Och allt ni redan växer med',
  items: [
    { icon: SparklesIcon, title: 'AI-insikter', body: 'Insikter om försäljning och kunder som uppdateras oftare.' },
    { icon: DocumentChartBarIcon, title: 'Schemalagda rapporter', body: 'Rapporter om försäljning och kunder som kommer till er automatiskt.' },
    { icon: DocumentCheckIcon, title: 'Bokföring med Fortnox', body: 'Det ni säljer och får betalt för hamnar i bokföringen som verifikat.' },
    { icon: TruckIcon, title: 'Frakt och returer', body: 'Boka frakt med PostNord och ta emot returer där ordern finns.' },
    { icon: DocumentTextIcon, title: 'Offerter', body: 'Gör om en offert till en faktura eller en betalningslänk.' },
    { icon: CreditCardIcon, title: 'Kassan i ert utseende', body: 'Egen logotyp och färg i kassan, med Klarna och Swish.' },
  ] satisfies FeatureItem[],
};

/*
 * 6 – Så kommer du igång. Följer onboardingflödet: manuell aktivering
 * (middleware/requireAuth.js:237-255) och Source kopplar betalkontot vid provisioneringen
 * (routes/adminTenantProvision.js:96-100). Ingen ledtid. Bilden är en stillbild ur
 * hero-videon (public/etablerade.mp4, 10 s), inte en fjärde helskärmsbild.
 */
export const etableradeKomIgang = {
  id: 'sa-kommer-ni-igang',
  eyebrow: 'KOM IGÅNG',
  title: 'Så kommer ni igång',
  steps: [
    { number: '01', title: 'Boka en demo', body: 'Berätta om verksamheten och vad teamet behöver.' },
    { number: '02', title: 'Vi går igenom behoven', body: 'Vi visar hur statistik, studio och inkorg passar er.' },
    { number: '03', title: 'Vi aktiverar kontot', body: 'Vi öppnar kontot och kopplar betalningarna.' },
    { number: '04', title: 'Koppla era tjänster', body: 'Koppla Fortnox, PostNord och annonskontona i portalen.' },
  ] satisfies GettingStartedStep[],
  image: {
    src: '/for-dig/foretag-etablerade/foretag-etablerade-kom-igang-1920.webp',
    alt: 'Abstrakt våg av svart, blank krom mot svart bakgrund.',
  } satisfies SectionImage,
  cta: { label: 'Prata med oss', href: '/kontakt' },
};

/* 7 – Avslutande CTA. Boka demo primär, priser sekundär (beslut för detta pass). */
export const etableradeAvslut = {
  id: 'kom-igang-cta',
  title: 'Kontroll, skala och trygghet',
  body: ['Boka en demo så visar vi hur det fungerar för er, eller se vad som ingår och vad det kostar.'],
  primary: { label: 'Boka demo', href: '/kontakt' },
  secondary: { label: 'Se priser', href: '/priser' },
};

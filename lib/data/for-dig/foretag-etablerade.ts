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
 * kund uppnår. Undantag (beslut 2026-10-03): statistikwidgeten i sektion 1 visar
 * tydligt märkta exempelsiffror och de statistikområden som finns i portalen, även
 * trafik – se etableradeStatistik.widget.
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
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import type { StatusCardContent } from '@/lib/data/for-dig/foretag-vaxa';

/** Ett område i statistikwidgeten: nyckeltal, en liten graf och vid behov en kort lista. */
export type StatsArea = {
  id: string;
  /** Fliken, som portalens rubrik för modulen. */
  tab: string;
  kpis: { label: string; value: string }[];
  chart?: { kind: 'line' | 'bars'; title: string; unit?: string; points: { label: string; value: number }[] };
  list?: { title: string; columns: string[]; rows: string[][] };
};

export type StatsAreasContent = {
  label: string;
  title: string;
  note: string;
  areas: StatsArea[];
};

export type StatsOverviewContent = {
  title: string;
  period: string;
  /** One row per module. `trend` only draws the line – it is shape, not data. */
  rows: { id: string; label: string; trend: readonly number[] }[];
};

/** Kundportalens marknadsföringssida som den visas på surfplattans skärm. */
export type StudioScreenContent = {
  label: string;
  title: string;
  subtitle: string;
  goals: { title: string; chips: readonly string[]; active: string };
  campaigns: {
    title: string;
    items: { id: string; name: string; purpose: string; status: string; tone: 'active' | 'planned' | 'done'; period: string }[];
  };
  images: { title: string; formats: readonly { label: string; ratio: number }[] };
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
  // Händer håller en surfplatta med blank, ljus skärm mot mörk sten (scripts/tjanster-bilder/
  // foretag-etablerade-marknad.mjs). Visas hel (16:9 och ett kvadratiskt utsnitt under md), så
  // skärmytans procent gäller vid varje bredd – se STUDIO_SCREEN.
  studio: {
    base: `${IMG}-marknad-studio`,
    alt: 'Två händer håller en surfplatta ovanför en mörk stenyta, sedd rakt uppifrån.',
    widths: LANDSCAPE,
    portraitWidths: [480, 720, 920],
    focus: '50% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Surfplattans skärmyta i procent av fotot, uppmätt på originalet 2048 × 1152
 * (_research/originals/design-omg2/ipad-0.png): den blanka skärmen innanför ramen går
 * x 578–1465, y 207–861 (888 × 655). Mobilutsnittet är kvadratiskt, x 446–1598, eftersom
 * skärmen inte ryms i ett 3:4-utsnitt i full höjd. Vänster tumme går in över skärmen (upp till
 * 13 px, rad 563–820), så UI:t maskas med skärmens egen form – se scripts/foretag-etablerade-skarm-mask.mjs.
 */
export const STUDIO_SCREEN = {
  landscape: { left: 28.22, top: 17.97, width: 43.36, height: 56.86 },
  portrait: { left: 11.46, top: 17.97, width: 77.08, height: 56.86 },
  mask: '/for-dig/foretag-etablerade/foretag-etablerade-marknad-skarm-mask.png',
} as const;

/*
 * 1 – Statistik för ledningen. Belägg: /statistik är enterprise
 * (config/packageTiers.js:118-119, server.js:3174-3180); ledningsöversikt, konvertering,
 * ordrar och bokningar (routes/statisticsRoutes.js:596, 1081, 1182, 1389); diagram över
 * tid (public/statistik-layout2.html:429, 815, 897); anpassa moduler (rad 1215).
 * Texten nämner inte webbtrafik, export, PDF, schemalagda rapporter eller detaljvy; widgeten
 * nedan visar portalens statistikområden, även trafik.
 */
export const etableradeStatistik = {
  id: 'statistik',
  eyebrow: 'STATISTIK',
  title: 'Hela verksamheten på en skärm',
  body: [
    'Följ försäljning, ordrar, bokningar och konvertering samlat, och se hur de utvecklas över tid.',
    'Välj vilka moduler som visas, så ser ledningen det som betyder mest för er.',
  ],
  /*
   * Statistikwidgeten (ersätter den lilla "Ledningsöversikt", beslut 2026-10-03). Bara de områden
   * och mått som finns i portalens statistik (public/statistik-layout2.html och public/js/
   * statistics.js, origin/develop i source.database), med exempelsiffror – undantag från
   * beslutet om inga siffror, bara för den här widgeten. Delvis befintliga områden visar bara
   * det som finns:
   *   Trafik & förvärv – sessioner, unika användare (statistics.js 1414–1421), trafik per kanal
   *     och enhetstyp (statistik-layout2.html 451–511).
   *   Källa & kampanj – bara tabellen Källa, Medium, Kampanj, Sessioner (515–535); ingen
   *     konvertering per kampanj i statistiken.
   *   Beteende & UX – avvisningsfrekvens och snittid per sida i Toppsidor (539–551); inga
   *     siffror för hela sajten (dolda, routes/statisticsRoutes.js 1022–1034), inga värmekartor.
   *   Konvertering & intäkter – leadbaserad: totala leads, konverteringsgrad, andel vunna och
   *     leads per källa (699–753).
   *   Ordrar & intäkter – intäkter, bekräftade ordrar, snittordervärde, över tid (764–815).
   *   Bokningar – bokningar, genomförda besök, avbokningar, per dag (829–897).
   *   Retention & kohorter – återkommande gäster och prenumerationsretention per månad
   *     (911, statistics.js 2053–2056, 2117–2147); ingen kohortmatris (visas inte i portalen).
   */
  widget: {
    label: 'Exempel: statistiken i kundportalen, ett område i taget',
    title: 'Statistik',
    note: 'Exempeldata',
    areas: [
      {
        id: 'trafik',
        tab: 'Trafik & förvärv',
        kpis: [
          { label: 'Sessioner', value: '4 820' },
          { label: 'Unika användare', value: '3 260' },
        ],
        chart: {
          kind: 'bars',
          title: 'Trafik per kanal',
          points: [
            { label: 'Direkt', value: 1480 },
            { label: 'Sök', value: 1320 },
            { label: 'Sociala', value: 890 },
            { label: 'E-post', value: 610 },
            { label: 'Hänvisning', value: 520 },
          ],
        },
        list: { title: 'Enhetstyp', columns: ['Enhet', 'Andel'], rows: [['Mobil', '64 %'], ['Dator', '31 %'], ['Surfplatta', '5 %']] },
      },
      {
        id: 'kalla',
        tab: 'Källa & kampanj',
        kpis: [],
        list: {
          title: 'Källa & kampanj',
          columns: ['Källa', 'Medium', 'Kampanj', 'Sessioner'],
          rows: [
            ['google', 'cpc', 'varens-nyheter', '820'],
            ['facebook', 'paid', 'varens-nyheter', '540'],
            ['nyhetsbrev', 'email', 'april', '310'],
            ['instagram', 'social', '–', '260'],
          ],
        },
      },
      {
        id: 'beteende',
        tab: 'Beteende & UX',
        kpis: [],
        list: {
          title: 'Toppsidor',
          columns: ['Sida', 'Avvisningsfrekvens', 'Snittid'],
          rows: [
            ['/', '38 %', '1:42'],
            ['/produkter', '31 %', '2:10'],
            ['/om-oss', '44 %', '0:58'],
            ['/kontakt', '41 %', '1:05'],
          ],
        },
      },
      {
        id: 'konvertering',
        tab: 'Konvertering & intäkter',
        kpis: [
          { label: 'Totala leads', value: '128' },
          { label: 'Konverteringsgrad', value: '18 %' },
          { label: 'Andel vunna', value: '24 %' },
        ],
        chart: {
          kind: 'bars',
          title: 'Leads per källa',
          points: [
            { label: 'Formulär', value: 52 },
            { label: 'E-post', value: 31 },
            { label: 'Telefon', value: 24 },
            { label: 'Sociala', value: 21 },
          ],
        },
      },
      {
        id: 'ordrar',
        tab: 'Ordrar & intäkter',
        kpis: [
          { label: 'Intäkter', value: '184 300 kr' },
          { label: 'Bekräftade ordrar', value: '412' },
          { label: 'Snittordervärde', value: '447 kr' },
        ],
        chart: {
          kind: 'line',
          title: 'Intäkter över tid',
          points: [
            { label: 'v 9', value: 19800 },
            { label: 'v 10', value: 21400 },
            { label: 'v 11', value: 20100 },
            { label: 'v 12', value: 23600 },
            { label: 'v 13', value: 22900 },
            { label: 'v 14', value: 25200 },
            { label: 'v 15', value: 24700 },
            { label: 'v 16', value: 26600 },
          ],
        },
      },
      {
        id: 'bokningar',
        tab: 'Bokningar',
        kpis: [
          { label: 'Bokningar', value: '236' },
          { label: 'Genomförda besök', value: '214' },
          { label: 'Avbokningar', value: '12' },
        ],
        chart: {
          kind: 'bars',
          title: 'Bokningar per dag',
          points: [
            { label: 'Mån', value: 38 },
            { label: 'Tis', value: 42 },
            { label: 'Ons', value: 35 },
            { label: 'Tor', value: 46 },
            { label: 'Fre', value: 40 },
            { label: 'Lör', value: 24 },
            { label: 'Sön', value: 11 },
          ],
        },
      },
      {
        id: 'retention',
        tab: 'Retention & kohorter',
        kpis: [
          { label: 'Unika gäster', value: '980' },
          { label: 'Andel återkommande', value: '34 %' },
          { label: 'Snittbesök per gäst', value: '1,6' },
        ],
        chart: {
          kind: 'bars',
          title: 'Prenumerationsretention',
          unit: '%',
          points: [
            { label: 'Mån 1', value: 100 },
            { label: 'Mån 2', value: 86 },
            { label: 'Mån 3', value: 78 },
            { label: 'Mån 4', value: 72 },
            { label: 'Mån 5', value: 68 },
            { label: 'Mån 6', value: 65 },
          ],
        },
      },
    ],
  } satisfies StatsAreasContent,
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
  /*
   * Skärmen följer portalens marknadsföringssida (public/marknadsforing-layout2.html 686–719):
   * rubrik och underrubrik (686–687), målen (PURPOSE_CHOICE, public/js/marknadsforing.js 38),
   * kampanjkorten med syfte, status och period (29, 37, 80–83, 351–355) och bildformaten
   * (CREATIVE_FORMAT, 44–49). Kampanjnamnen är neutrala exempel.
   */
  screen: {
    label: 'Exempel: marknadsföringssidan i kundportalen med mål, kampanjer och bilder',
    title: 'Marknadsföring',
    subtitle: 'Välj vad du vill uppnå, få en plan, och följ vad varje kanal ger.',
    goals: {
      title: 'Vad vill du uppnå?',
      chips: ['Göra företaget känt', 'Lansera en produkt eller tjänst', 'Sälja mer', 'Fylla bokningar', 'Få fler leads', 'Ett event'],
      active: 'Sälja mer',
    },
    campaigns: {
      title: 'Din marknadsföring',
      items: [
        { id: 'var', name: 'Vårens nyheter', purpose: 'Försäljning', status: 'Aktiv', tone: 'active', period: '3 mar – 30 mar · 3 kanaler' },
        { id: 'lansering', name: 'Ny tjänst', purpose: 'Produktlansering', status: 'Planerad', tone: 'planned', period: '7 apr – 4 maj · 2 kanaler' },
        { id: 'kanne', name: 'Lokal synlighet', purpose: 'Kännedom', status: 'Avslutad', tone: 'done', period: '3 feb – 28 feb · 2 kanaler' },
      ],
    },
    images: {
      title: 'Dina bilder',
      formats: [
        { label: 'Kvadrat', ratio: 1 },
        { label: 'Stående', ratio: 4 / 5 },
        { label: 'Story', ratio: 9 / 16 },
        { label: 'Liggande', ratio: 1200 / 628 },
      ],
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
 * 3 – Support-inkorgen som video i stället för fotot (beslut 2026-10-03). 4K-mastern
 * (_research/originals/support-video/support-master.mp4, 3840 × 2160, 24 fps) visar en blank kula
 * som rullar på två skenor mot en mörkgrön studiobakgrund, utan text och märken. Loopen är bildruta
 * 0–119 (5,0 s); de sista 11 bildrutorna tonas mot bildruta 0 så att staven inte hoppar.
 * Kulans och skenornas bana ligger inom 27–69 % av höjden; ytan under, 72–100 %, är tom
 * bakgrund (#142d22), och där ligger kortet från lg. Kantfärgerna är uppmätta i bildruta 0:
 * överkanten #1d2f24, nederkanten #112a20.
 *
 * Källorna väljs i ordning: 960 på telefon, 3840 bara på skärmar som är minst 2560 px breda med
 * hög pixeltäthet (det finns bara som MP4), annars 1920 – WebM före MP4.
 */
const SUPPORT_VID = '/for-dig/foretag-etablerade/support-video';
export const etableradeSupportVideo = {
  label: 'En blank metallkula rullar fram och tillbaka på två skenor mot en mörkgrön bakgrund.',
  edgeTop: '#1d2f24',
  edgeBottom: '#112a20',
  /** Kortet från lg, i procent av videorutan: på den tomma bakgrunden under skenorna, till höger. */
  cardAnchor: { x: 74, y: 85 },
  sources: [
    { src: `${SUPPORT_VID}-960.webm`, type: 'video/webm', media: '(max-width: 767px)' },
    { src: `${SUPPORT_VID}-960.mp4`, type: 'video/mp4', media: '(max-width: 767px)' },
    { src: `${SUPPORT_VID}-3840.mp4`, type: 'video/mp4', media: '(min-width: 2560px) and (min-resolution: 2dppx)' },
    { src: `${SUPPORT_VID}-1920.webm`, type: 'video/webm' },
    { src: `${SUPPORT_VID}-1920.mp4`, type: 'video/mp4' },
  ],
  poster: { src: `${SUPPORT_VID}-poster-1920.webp`, smallSrc: `${SUPPORT_VID}-poster-960.webp`, srcSet: `${SUPPORT_VID}-poster-960.webp 960w, ${SUPPORT_VID}-poster-1920.webp 1920w` },
  end: { src: `${SUPPORT_VID}-slut-1920.webp`, smallSrc: `${SUPPORT_VID}-slut-960.webp`, srcSet: `${SUPPORT_VID}-slut-960.webp 960w, ${SUPPORT_VID}-slut-1920.webp 1920w` },
} satisfies { label: string; edgeTop: string; edgeBottom: string; cardAnchor: { x: number; y: number }; sources: ServiceVideoSource[]; poster: ServiceVideoStill; end: ServiceVideoStill };

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
    { icon: TruckIcon, title: 'Frakt med PostNord', body: 'Boka frakten från ordern och skicka kunden en länk för att följa paketet.' },
    { icon: DocumentTextIcon, title: 'Offerter', body: 'Gör om en offert till en faktura eller en betalningslänk.' },
    { icon: CreditCardIcon, title: 'Kassan i ert utseende', body: 'Egen logotyp och accentfärg i kassan, där kunden betalar med kort.' },
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

/*
 * Innehåll för /analys (nya sektioner efter heron).
 *
 * Varje påstående här ska finnas i kundportalens kod (source.database,
 * origin/develop 80022cbb, kontrollerad 2026-09-28 – se
 * CC-RAPPORT-analys-recon.md punkt 4 och CC-RAPPORT-analys-bygge.md punkt 4).
 * Skriv inga resultat, inga paketnamn, och nämn inte export, heatmaps,
 * A/B-test eller e-postutskick (finns inte eller fungerar inte i portalen).
 * Exempeldata i widgetarna är generisk och visar hur gränssnittet ser ut.
 */
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  GlobeEuropeAfricaIcon,
  SignalIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';

const IMG = '/tjanster/analys/analys';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];

export const analysImages = {
  // F1 – händer med en telefon (släckt skärm) på marmor.
  period: {
    base: `${IMG}-period`,
    alt: 'Två händer håller en telefon över en marmorbänk i eftermiddagsljus.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 40%',
    portraitFocus: '50% 40%',
  },
  // R8 – en surfplatta i knät vid ett fönster.
  nyckeltal: {
    base: `${IMG}-nyckeltal`,
    alt: 'En person sitter med en surfplatta i knät i solljus från ett fönster.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '55% 45%',
    portraitFocus: '50% 45%',
  },
  // F3 – en bärbar dator på svart botten, skärmen släckt.
  sidor: {
    base: `${IMG}-sidor`,
    alt: 'En bärbar dator med släckt skärm mot svart bakgrund.',
    widths: LANDSCAPE,
  },
  // R4 – skrivbord med ett blankt anteckningsblock, penna, glasögon och ett vattenglas.
  insikter: {
    base: `${IMG}-insikter`,
    alt: 'Ett skrivbord i solljus med ett anteckningsblock, en penna, ett par glasögon och ett glas vatten.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    portraitFocus: '50% 55%',
  },
  // F5 – person i kappa med en surfplatta under armen. Fast utsnitt utan pappmuggen.
  rapporter: {
    base: `${IMG}-rapporter`,
    alt: 'En person i mörk kappa håller en surfplatta under armen.',
    widths: [640, 1024, 1100],
    focus: '50% 40%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Sektion 2 – periodjämförelse. Belägg: routes/statisticsRoutes.js 636–638
 * (föregående period av samma längd), 842–845 (förändring i procent),
 * 1284–1292 (daglig serie), 1352–1356 (intäkter, ordrar, snittorder);
 * routes/analytics.js 179–274 (besökare per dag med förändring mot föregående period).
 */
export const analysPeriod = {
  eyebrow: 'Översikt',
  title: 'Se hur det går – och hur det gick förra perioden',
  body: [
    'Försäljning, ordrar och besökare samlas i kundportalen, och siffrorna jämförs med perioden innan.',
  ],
};

/*
 * Sticky scroll. Belägg:
 * steg 1 – statisticsRoutes.js 1352–1356 (intäkter, ordrar, snittorder) och 842–845 (förändring);
 * steg 2 – services/customerReportService.js 20–24 och 179–195 (aktiva, nya, återkommande);
 * steg 3 – routes/analytics.js 1201–1420 (mest sålda produkter, förändring och placering).
 */
export const analysSteps = {
  eyebrow: 'Så fungerar det',
  title: 'Förstå dina siffror',
  steps: [
    {
      title: 'Se läget',
      body: 'Intäkter, ordrar och snittorder visas bredvid samma period innan, så att du ser vad som har förändrats.',
    },
    {
      title: 'Se vilka som kommer tillbaka',
      body: 'Följ hur många kunder som handlar för första gången och hur många som har handlat förut.',
    },
    {
      title: 'Se vad som säljer',
      body: 'Se vilka produkter som säljer mest och hur de har flyttat sig sedan förra perioden.',
    },
  ],
} as const;

/*
 * Besökare just nu. Belägg: routes/analytics.js 384–396 (unika besökare de senaste
 * 15 minuterna), 313 (aktiva sidor); analyser-layout2.html 1123–1162 (uppdateras löpande).
 */
export const analysPages = {
  eyebrow: 'Besökare',
  title: 'Se vad besökarna tittar på just nu',
  body: [
    'Besökare just nu visar hur många som har varit inne på din sajt de senaste 15 minuterna och vilka sidor de besöker.',
  ],
};

/*
 * Karusell – sju belagda funktioner. Belägg per kort:
 * försäljning över tid – statisticsRoutes.js 1284–1292; jämförelse – 842–845;
 * besökare just nu – analytics.js 384–396; geografi – analytics.js 1501;
 * trafikkällor och kampanjer – statisticsRoutes.js 1701–1905, campaignAttributionService.js 34–42;
 * nya och återkommande kunder – customerReportService.js 20–24, 179–195;
 * rapporter som PDF – cron/reportGenerationCron.js 503–593, reportRoutes.js 1545.
 */
export const analysFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'Funktioner',
  title: 'Allt du kan följa',
  items: [
    { icon: ChartBarIcon, title: 'Försäljning över tid', body: 'Se intäkter och ordrar dag för dag.' },
    { icon: ArrowsRightLeftIcon, title: 'Jämför med perioden innan', body: 'Nyckeltalen visar förändringen mot samma period tidigare.' },
    { icon: SignalIcon, title: 'Besökare just nu', body: 'Se hur många som är inne på din sajt och vilka sidor de tittar på.' },
    { icon: GlobeEuropeAfricaIcon, title: 'Geografi', body: 'Besökare, köp och intäkter per land och stad.' },
    { icon: ArrowTrendingUpIcon, title: 'Trafikkällor och kampanjer', body: 'Se varifrån besökarna kommer och vad kampanjerna ger tillbaka.' },
    { icon: UserGroupIcon, title: 'Nya och återkommande kunder', body: 'Följ hur många som köper för första gången och hur många som kommer tillbaka.' },
    { icon: DocumentChartBarIcon, title: 'Rapporter som PDF', body: 'Försäljning, kunder och marknadsföring sammanställs automatiskt.' },
  ],
};

/*
 * AI-insikter. Belägg: cron/insightCron.js 141 och 178 ('0 3 * * *', nattlig körning),
 * services/insightPrompts.js 20–23 (sektioner) samt 77 och 94 (rekommendation),
 * services/insightCategories.js 44 (kategorin Kunder & beteende), routes/insightChat.js 17 (chatt).
 */
export const analysInsights = {
  eyebrow: 'AI-insikter',
  title: 'En sammanfattning av det som hänt – och ett förslag på vad du kan göra',
  body: [
    'Varje natt går AI-insikterna igenom försäljning, kunder, kampanjer och lager och lyfter det som sticker ut. Har du en fråga ställer du den direkt i chatten.',
  ],
};

/*
 * Rapporter. Belägg: cron/reportGenerationCron.js 159–166 (standardfrekvenser, kunder
 * månadsvis) och 503–593 (dagligen, veckovis, månadsvis), routes/reportRoutes.js 36
 * (sektioner) och 1545 (PDF). Rapporterna finns i kundportalen; de skickas inte med e-post.
 */
export const analysReports = {
  eyebrow: 'Rapporter',
  title: 'Rapporter som tas fram åt dig',
  body: [
    'Försäljning, kunder, fakturor och marknadsföring sammanställs automatiskt – dagligen, veckovis eller månadsvis.',
    'Rapporterna finns som PDF i kundportalen.',
  ],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
  packageNote: { text: 'Vilka funktioner som ingår beror på paket –', linkLabel: 'se priser', href: '/priser' },
};

/*
 * Widgetdata. Neutral exempeldata som hänger ihop:
 * intäkter 48 600 kr mot 45 000 kr = +8 %, ordrar 312 mot 297 = +5 %,
 * snittorder 156 kr mot 151,5 kr = +3 %; kunder 250 aktiva = 160 nya + 90 återkommande;
 * besökare just nu 12 = 5 + 4 + 2 + 1.
 */
export const analysWidgets = {
  trend: {
    title: 'Intäkter',
    period: 'Senaste 30 dagarna',
    value: '48 600 kr',
    change: 8,
    current: [1480, 1560, 1510, 1620, 1580, 1700, 1650, 1600, 1720, 1680, 1760, 1640, 1740, 1800, 1760],
    previous: [1420, 1470, 1400, 1500, 1460, 1520, 1480, 1450, 1530, 1490, 1560, 1470, 1540, 1580, 1500],
    legend: { current: 'Den här perioden', previous: 'Perioden innan' },
  },
  kpi: {
    title: 'Nyckeltal',
    period: 'Senaste 30 dagarna',
    items: [
      { label: 'Intäkter', value: '48 600 kr', change: 8 },
      { label: 'Ordrar', value: '312', change: 5 },
      { label: 'Snittorder', value: '156 kr', change: 3 },
    ],
  },
  customers: {
    title: 'Kunder',
    period: 'Senaste 30 dagarna',
    total: 250,
    totalLabel: 'aktiva',
    newCount: 160,
    returning: 90,
    labels: { new: 'Nya', returning: 'Återkommande' },
  },
  topProducts: {
    title: 'Mest sålda',
    period: 'Senaste 30 dagarna',
    items: [
      { name: 'Förvaringsbox', value: '6 240 kr', move: 'up' },
      { name: 'Presentkort', value: '5 900 kr', move: 'down' },
      { name: 'Kaffekopp', value: '4 180 kr', move: 'same' },
      { name: 'Anteckningsbok', value: '2 950 kr', move: 'new' },
    ],
  },
  pages: {
    title: 'Mest besökta sidor',
    nowLabel: 'Just nu',
    now: 12,
    pages: [
      { label: 'Startsida', path: '/', count: 5 },
      { label: 'Produkter', path: '/produkter', count: 4 },
      { label: 'Kontakt', path: '/kontakt', count: 2 },
      { label: 'Om oss', path: '/om-oss', count: 1 },
    ],
  },
  insight: {
    label: 'AI-insikt',
    category: 'Kunder & beteende',
    title: 'Fler återkommande kunder',
    body: 'Återkommande kunder står för en större andel av ordrarna än perioden innan.',
    recommendationLabel: 'Förslag',
    recommendation: 'Visa de mest sålda produkterna tydligare på startsidan.',
    updated: 'Uppdaterad i natt',
  },
  report: {
    title: 'Kundrapport',
    frequency: 'Månad',
    schedule: 'Tas fram automatiskt den 1:a varje månad',
    sections: ['Aktiva kunder', 'Nya', 'Återkommande'],
    action: 'Öppna PDF',
  },
} as const;

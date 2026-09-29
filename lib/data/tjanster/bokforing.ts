/*
 * Innehåll för /bokforing (nya sektioner efter befintlig sektion 4).
 *
 * Bokföring har juridisk tyngd. Varje påstående här finns i kundportalens kod
 * (source.database, origin/develop 53f34ba7, kontrollerad 2026-09-29; de citerade
 * filerna är oförändrade sedan 907a8e2d – se CC-RAPPORT-bokforing-recon.md punkt 4
 * och CC-RAPPORT-bokforing-bygge.md punkt 5). Tonen är portalens egen: Source
 * föreslår, du granskar och skickar, och kunden ansvarar alltid för att
 * bokföringen är korrekt.
 *
 * Nämns inte (finns inte eller fungerar inte): momsdeklaration, SIE-export,
 * sändning till Spiris, betald-status från Fortnox. Inga ord om "utan manuellt
 * arbete", "realtid", tidsbesparing i siffror, lagefterlevnad eller att tjänsten
 * ersätter redovisningskonsult eller revisor. Årsredovisningen är alltid en mall
 * att granska, aldrig "färdig" eller "klar att lämna in". Inga paketnamn.
 *
 * Exempeldata i widgetarna är neutral och balanserar: en utbetalning på
 * 1 220 kr av en försäljning på 1 250 kr inklusive 25 % moms och 30 kr i avgift.
 */
import {
  AdjustmentsHorizontalIcon,
  ArrowUturnLeftIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowDownIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import type {
  FiscalYearDemoContent,
  FortnoxSendDemoContent,
  VoucherDemoContent,
} from '@/components/sections/tjanster/widgets/BookkeepingDemos';

const IMG = '/tjanster/bokforing/bokforing';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];

export const bokforingImages = {
  // E1 – en man som gnuggar ögonen vid ett skrivbord.
  kvall: {
    base: `${IMG}-kvall`,
    alt: 'En man vid ett skrivbord tar av sig glasögonen och gnuggar ögonen, med en kaffekopp framför sig.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '45% 40%',
    portraitFocus: '50% 40%',
  },
  // E2 – en man i soffan med telefonen, en hund sover bredvid.
  lattnad: {
    base: `${IMG}-lattnad`,
    alt: 'En man sitter avslappnad i en soffa och ler mot sin telefon medan en hund sover bredvid honom.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '54% 45%',
    portraitFocus: '50% 45%',
  },
  // E3 – två personer som skrattar vid ett bord med en kanelbulle. Fast, nästan kvadratiskt utsnitt.
  avslut: {
    base: `${IMG}-avslut`,
    alt: 'Två personer skrattar vid ett bord med två stängda bärbara datorer och en kanelbulle på ett fat.',
    widths: [640, 1024, 1536],
    focus: '50% 50%',
  },
  // J2r – en familj runt ett klosstorn, sett ovanifrån (redigerad: inget tryck på kläder eller klossar).
  familj: {
    base: `${IMG}-familj`,
    alt: 'En familj sitter på golvet runt ett högt torn av träklossar medan en man försiktigt lägger handen på toppen.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '33% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * S3 – vågskålsvideon, klippt till bildruta 0–67 (0–2,79 s) av källan: ett gem läggs i den
 * högra skålen, vågen gungar och vilar i sista bildrutan (se CC-RAPPORT-bokforing-bygge-2.md punkt 1).
 * Belägg för texten: balansspärr när dokument skapas (services/accountingEngine.js 44–57) och
 * före sändning (services/accounting/voucherDispatch.js 49, 134).
 */
const VID = '/tjanster/bokforing/bokforing-vagskal';
export const bokforingBalans = {
  eyebrow: 'BALANS',
  title: 'Debet och kredit ska gå jämnt ut',
  body: [
    'Innan något skickas kontrolleras att varje verifikat balanserar. Ett verifikat som inte går jämnt ut stoppas och kan inte skickas.',
  ],
  label: 'Ett gem läggs i den högra skålen på en våg, och vågen gungar in mot balans.',
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
 * S5 – allt hänger ihop. Belägg: kontoinställningarna och de aktiva bokföringsreglerna används
 * när underlaget tas fram (services/accountantAgent.js 129–136, 202–204, 580–587; konton i
 * models/TenantAccountingConfig.js 23–36); egna verifikat måste ligga i ett öppet räkenskapsår
 * och använda konton som finns i kontoplanen (routes/ledgerRoutes.js 213–239).
 */
export const bokforingSammanhang = {
  eyebrow: 'SAMMANHANG',
  title: 'Allt hänger ihop',
  body: [
    'Dina kontoinställningar och bokföringsregler används när underlaget tas fram.',
    'Egna verifikat bokförs i ett öppet räkenskapsår och med konton som finns i kontoplanen.',
  ],
};

/*
 * Portalens egen ansvarsmening, ordagrant (public/bokforing-layout2.html 277–278).
 * Visas vid räkenskapsåret och vid slut-CTA:n.
 */
export const bokforingAnsvar = {
  lead: 'Source automatiserar och föreslår bokföring baserat på tillgänglig data.',
  text: 'Kunden ansvarar alltid för att bokföringen är korrekt.',
};

/*
 * S1 – det tunga. Belägg: underlaget tas fram vid utbetalning (routes/stripePaymentWebhook.js
 * 7681, 7695, 7714), verifikaten ska balansera (services/accountingEngine.js 44–57),
 * användaren granskar och skickar (accountingRoutes.js 777–785, 761).
 */
export const bokforingKvall = {
  eyebrow: 'BOKFÖRING',
  title: 'Det som brukar ta kvällarna',
  body: [
    'Varje utbetalning ska bli verifikat, och varje verifikat ska gå jämnt ut. Source tar fram ett förslag – du granskar och skickar.',
  ],
};

/*
 * S2 – verifikat från en utbetalning (A1), med balanskontrollen från S3.
 * Belägg:
 *   underlaget tas fram när Stripe betalar ut – stripePaymentWebhook.js 7681, 7695, 7714
 *   verifikat skapas när du bekräftar – bokforing-layout2.html 1313; accountingRoutes.js 1437
 *   två verifikat, "Försäljning & Moms" och "Avgifter & Utbetalning" – services/accountantAgent.js 900–910, 930–1013, 1033–1122
 *   förvalda konton 1580, 3001, 2611, 6040, 2645, 2614, 1930 – models/TenantAccountingConfig.js 23–36;
 *     etiketter bokforing-layout2.html 563–623
 *   balans i tre steg – validateBalancing (accountantAgent.js 1170), spärr när dokument skapas
 *     (accountingEngine.js 44–57), spärr före sändning (services/accounting/voucherDispatch.js 49, 134)
 *   verifikat börjar som utkast – accountingEngine.js 164; "Markera som klara" – bokforing-layout2.html 496;
 *     accountingRoutes.js 777–785
 */
export const bokforingVerifikat = {
  eyebrow: 'VERIFIKAT',
  title: 'Från utbetalning till verifikat',
  body: [
    'När Stripe gör en utbetalning tar Source fram ett underlag. När du bekräftar blir det två verifikat: försäljning och moms i det ena, avgifter och utbetalning i det andra.',
    'Debet och kredit ska gå jämnt ut. Det kontrolleras när underlaget tas fram, när verifikaten skapas och en gång till innan något skickas. Verifikat som inte balanserar kan inte skapas.',
  ],
  label: 'Exempel: två verifikat från en Stripe-utbetalning kontrolleras och markeras som klara',
  demo: {
    title: 'Verifikat',
    status: { idle: 'Utkast', done: 'Klara' },
    payout: { label: 'Stripe-utbetalning', amount: 1220, report: 'Underlag klart' },
    headers: { account: 'Konto', debit: 'Debet, kr', credit: 'Kredit, kr' },
    vouchers: [
      {
        title: 'Försäljning & Moms',
        rows: [
          { account: 1580, label: 'Stripe clearing', debit: 1250 },
          { account: 3001, label: 'Intäkt 25 % moms', credit: 1000 },
          { account: 2611, label: 'Utgående moms 25 %', credit: 250 },
        ],
      },
      {
        title: 'Avgifter & Utbetalning',
        rows: [
          { account: 1580, label: 'Stripe clearing', credit: 1250 },
          { account: 6040, label: 'Stripe-avgifter', debit: 30 },
          { account: 2645, label: 'Omvänd skatt in', debit: 7.5 },
          { account: 2614, label: 'Omvänd skatt ut', credit: 7.5 },
          { account: 1930, label: 'Bank', debit: 1220 },
        ],
      },
    ],
    checksTitle: 'Balanskontroll',
    checks: ['Balanserar när underlaget tas fram', 'Kontrolleras när verifikaten skapas', 'Kontrolleras igen före sändning'],
    markReady: 'Markera som klara',
  } satisfies VoucherDemoContent,
};

/*
 * S4 – sändning till Fortnox (A2). Belägg:
 *   "Testa kopplingen" – bokforing-layout2.html 294, 1732–1741
 *   förkontrollen: konton finns och är aktiva, verifikatserien finns, ett räkenskapsår täcker
 *     dagens datum – services/fortnoxPreflightService.js 30–43, 51–64, 70–75, 82–90
 *   klara verifikat skickas av användaren, ett i taget eller flera – accountingRoutes.js 761;
 *     verifikatet skickas med serie, datum och rader – services/fortnoxService.js 518–530
 *   fliken "Skickat till Fortnox" – bokforing-layout2.html 256
 * Betald-status från Fortnox finns inte och visas inte.
 */
export const bokforingFortnox = {
  eyebrow: 'FORTNOX',
  title: 'Skicka när du har granskat',
  body: [
    'Koppla Fortnox och testa kopplingen. Source kontrollerar att kontona finns och är aktiva, att verifikatserien finns och att ett räkenskapsår täcker dagens datum.',
    'Sedan skickar du de verifikat som är klara – ett i taget eller flera samtidigt.',
  ],
  label: 'Exempel: kopplingen till Fortnox testas och två klara verifikat skickas',
  demo: {
    title: 'Fortnox',
    status: { idle: 'Ansluten', done: 'Skickat' },
    test: 'Testa kopplingen',
    checks: ['Kontona finns och är aktiva', 'Verifikatserien finns', 'Räkenskapsår täcker dagens datum'],
    listTitle: 'Klara verifikat',
    vouchers: [
      { title: 'Försäljning & Moms', ready: 'Klar', sent: 'Skickad' },
      { title: 'Avgifter & Utbetalning', ready: 'Klar', sent: 'Skickad' },
    ],
    send: 'Skicka',
    sentNote: 'Syns under Skickat till Fortnox',
  } satisfies FortnoxSendDemoContent,
};

/*
 * S6 – räkenskapsåret (A3). Belägg:
 *   räkenskapsår och stängning, "Inga nya verifikat kan då bokföras i perioden" –
 *     bokforing-layout2.html 908, 984, 4601; routes/ledgerRoutes.js 70, 105, 213–214
 *   "Resultaträkning", "Balansräkning" med balansmärke, "Huvudbok" – bokforing-layout2.html 946–954;
 *     ledgerRoutes.js 375–416
 *   årsredovisning som utkast enligt K2-mall, "MALL — måste granskas mot Bolagsverkets krav och
 *     BFNAR 2016:10 (K2) innan inlämning." – bokforing-layout2.html 970; ledgerRoutes.js 419–531;
 *     models/AnnualReport.js 9–11
 * Demon stannar på "Utkast": fastställande visas inte, så att inget ser färdigt ut.
 */
export const bokforingArsbokslut = {
  eyebrow: 'RÄKENSKAPSÅR',
  title: 'Stäng året och se hur det ser ut',
  body: [
    'Följ resultaträkning, balansräkning och huvudbok för räkenskapsåret. När året stängs kan inga nya verifikat bokföras i perioden.',
    'Årsredovisningen tas fram som ett utkast enligt en mall för K2, att granska – av dig eller din redovisningskonsult – innan den lämnas in.',
  ],
  label: 'Exempel: ett räkenskapsår stängs och årsredovisningen visas som ett utkast att granska',
  demo: {
    title: 'Räkenskapsår 2025',
    status: { idle: 'Öppet', done: 'Stängt' },
    reports: ['Resultaträkning', 'Balansräkning', 'Huvudbok'],
    income: {
      title: 'Resultaträkning',
      rows: [
        { label: 'Intäkter', amount: 480000 },
        { label: 'Kostnader', amount: -395000 },
      ],
      result: 'Resultat',
    },
    balance: { title: 'Balansräkning', assets: 'Tillgångar', equity: 'Eget kapital och skulder', amount: 212000, balanced: 'Balanserar' },
    close: 'Stäng räkenskapsåret',
    closedNote: 'Inga nya verifikat kan bokföras i perioden.',
    annual: { title: 'Årsredovisning (K2)', status: 'Utkast', hint: 'Mall – granskas innan den lämnas in.' },
  } satisfies FiscalYearDemoContent,
};

/*
 * S7 – karusellen. Belägg per kort:
 *   kontoinställningar enligt BAS   – models/TenantAccountingConfig.js 23–40; bokforing-layout2.html 554–643;
 *                                     accountingRoutes.js 1760–1795
 *   egna bokföringsregler           – bokforing-layout2.html 679, 1066–1100; accountingRoutes.js 1928–2064
 *   moms per momssats               – accountantAgent.js 930–1013
 *   bokslutsverifikat               – ledgerRoutes.js 188, 213–239, 255
 *   rättelse med motverifikat       – ledgerRoutes.js 294, 347; bokforing-layout2.html 4496
 *   export som CSV eller JSON       – accountingRoutes.js 1699–1746
 *   AI-assistenten för bokföring    – bokforing-layout2.html 239; models/AIAssistantConsent.js 54–55
 */
export const bokforingFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'I PORTALEN',
  title: 'Konton, regler och räkenskapsår på samma ställe',
  items: [
    { icon: TableCellsIcon, title: 'Konton enligt BAS', body: 'Förvalda BAS-konton för försäljning, moms, avgifter och bank som du kan ändra, och en egen verifikatserie.' },
    { icon: AdjustmentsHorizontalIcon, title: 'Egna bokföringsregler', body: 'Välj konto och momssats efter produkttyp, betalningsmetod, belopp eller valuta.' },
    { icon: ReceiptPercentIcon, title: 'Moms per momssats', body: 'Försäljning och utgående moms bokförs per momssats: 25, 12, 6 och 0 procent.' },
    { icon: PencilSquareIcon, title: 'Bokslutsverifikat', body: 'Bokför egna verifikat. De måste balansera, ligga i ett öppet räkenskapsår och använda konton som finns i kontoplanen.' },
    { icon: ArrowUturnLeftIcon, title: 'Rättelse med motverifikat', body: 'Makulera skapar ett motverifikat med spegelvända rader. Originalet ligger kvar.' },
    { icon: DocumentArrowDownIcon, title: 'Export', body: 'Hämta bokföringsrapporten som CSV eller JSON.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Hjälp i portalen', body: 'Fråga assistenten hur bokföringen i portalen fungerar. Den ger allmän vägledning om systemet, inte rådgivning om din bokföring – ansvaret är ditt.' },
  ],
};

/*
 * S8 – lättnad. Belägg: underlaget tas fram när utbetalningen kommer
 * (stripePaymentWebhook.js 7681, 7695, 7714) och granskas av användaren (accountingRoutes.js 777–785).
 */
export const bokforingLattnad = {
  eyebrow: 'FÖRBERETT',
  title: 'Förslaget ligger redo när du vill granska',
  body: ['Underlaget tas fram när utbetalningen kommer. Du går igenom det när det passar dig.'],
};

/*
 * S9 – avslut. Belägg: underlaget kommer från utbetalningarna (stripePaymentWebhook.js 7681–7714)
 * och produkternas momssatser (accountantAgent.js 930–1013); ansvarsmeningen ovan.
 */
export const bokforingAvslut = {
  eyebrow: 'KOM IGÅNG',
  title: 'Bokföringen i samma portal som försäljningen',
  body: ['Underlaget kommer från samma utbetalningar och produkter som resten av Source.'],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
  packageNote: { text: 'Vilka funktioner som ingår beror på paket –', linkLabel: 'se priser', href: '/priser' },
};

/*
 * Innehåll för /ai-assistent.
 *
 * Varje påstående ska finnas i kundportalens kod (northlab-io/source.database, origin/develop
 * c28cecc9, kontrollerad 2026-09-30) – underlag i ~/cc-rapporter/ai-assistent-plan.md och
 * ~/cc-rapporter/leads-recon.md. Paketet står per sektion. Inga kvoter, siffror, tider eller
 * resultatlöften. Nämn inte AI på supportärenden, agentchatt eller MCP, konkurrentbevakning eller
 * bokföringsförslag som AI, eller bildgenerering i kampanjassistenten (modellen byts). Överlämning
 * till en person är "även utanför kontorstid" i Enterprise, aldrig dygnet runt. Exempeldata i
 * widgetarna är generisk och visar hur gränssnittet ser ut, inte vad en kund uppnår.
 */
import { BoltIcon, DocumentTextIcon, PaintBrushIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type {
  AdvisorChatContent,
  BookkeepingHelpContent,
  CampaignAssistantDemoContent,
  LeadListContent,
  PackageListContent,
  SourceAiAnswerContent,
  WeekListContent,
} from '@/components/sections/tjanster/widgets/AiAssistantDemos';

/* Bilder – skapade med scripts/tjanster-bilder.mjs ai-assistent (3:4 för mobil). */
const IMG = '/tjanster/ai-assistent/ai-assistent';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const aiImages = {
  // Kvinna i en fönsternisch en kväll med telefonen, en kopp vid fötterna. Koppens kant har ett
  // litet halvläsbart tryck (x 36–42 %, y 69–77 % i 16:9) – sektionens kort ligger över den.
  sourceai: {
    base: `${IMG}-sourceai`,
    alt: 'En kvinna sitter i en fönsternisch en kväll med knäna uppdragna och läser på sin telefon, med en kopp bredvid sig.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    // 40 %: moves her face right, away from the text column, at 1366 and 1440.
    focus: '40% 50%',
    portraitFocus: '50% 50%',
  },
  // Kvinna på en balkong med en surfplatta och en kopp, tak och skorstenar bakom. I StickySteps
  // fotoruta (nästan kvadratisk) håller fokus 30 % henne och händerna till höger om stegkortet,
  // som ligger nere till vänster över växterna (40 % lät kortet nudda handen vid 1366 × 768).
  insikter: {
    base: `${IMG}-insikter`,
    alt: 'En kvinna i stickad kofta sitter på en balkong och läser på en surfplatta medan hon dricker ur en kopp.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '30% 50%',
    portraitFocus: '50% 50%',
  },
  // Man på en parkbänk som pratar i telefon med en anteckningsbok på knät (variant B). Texten står
  // mitt till vänster över hans mörka jacka, kortet till höger över gräset.
  leads: {
    base: `${IMG}-leads`,
    alt: 'En man sitter på en parkbänk en höstdag och pratar i telefon, med en anteckningsbok på knät och gula löv i gräset.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    // 10 %: keeps his head right of the text column and leaves the grass right of him in frame.
    focus: '10% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Heron – layouten, bilden, overline och H1 är orörda. Faktafelen i texten är rättade enligt
 * planens ersättningstext (ai-assistent-plan.md 3.1): Source AI läser översikt, fakturor, ärenden,
 * ordrar, lager, betalningar, kampanjer, försändelser och utbetalningar, men inte bokningar
 * (routes/aiSupportRoutes.js:391-406), finns på alla portalsidor (server.js:1688) och kan
 * koppla in supporten (routes/aiSupportRoutes.js:117-144). AI-insikterna ger en sammanfattning
 * och en rekommenderad åtgärd per insikt (routes/insights.js:190-206, fälten på :202-204).
 */
export const aiHero = {
  overline: 'FRÅGA SOURCE AI',
  title: 'Hur får jag ut mer av mina pengar?',
  lead: 'Source AI svarar med din egen data, på varje sida i kundportalen. Behöver du en människa kopplar den in vår support.',
  body: 'Fråga Source AI om dina fakturor, ordrar, betalningar och lager, direkt i kundportalen. Med AI-insikterna får du dessutom en sammanfattning av det som hänt och ett förslag på vad du kan göra.',
  chat: {
    name: 'Source AI',
    status: 'Aktiv',
    question: 'Vilka fakturor är obetalda?',
    answers: [
      'En faktura har passerat förfallodagen. Vill du att jag visar den i fakturalistan?',
      'Behöver du hjälp av en människa kan jag koppla in vår support.',
    ],
  },
  primary: { label: 'Boka demo', href: '/kontakt' } satisfies ServiceCta,
  secondary: 'Se hur det fungerar',
};

/*
 * 1 – Source AI i portalen. Mål för herons "Se hur det fungerar". Belägg: chattbubblan på alla
 * portalsidor (server.js:1688, public/js/ai-support.js:554), svar med kontots egen data –
 * översikt, fakturor, ärenden, ordrar, lågt lager, betalningar, kampanjer, försändelser och
 * utbetalningar (routes/aiSupportRoutes.js:391-406, lågt lager :399), överlämning till supporten
 * (routes/aiSupportRoutes.js:117-144), utan paketkrav (:148), överlämning till livechatt även
 * utanför kontorstid bara i Enterprise (config/packageTiers.js:288-290). Inga tider i texten.
 */
export const aiSourceAi = {
  id: 'source-ai',
  eyebrow: 'SOURCE AI',
  title: 'Svar med din egen data',
  body: [
    'Fråga Source AI om fakturor, ordrar, lager, betalningar, kampanjer eller leveranser, var du än är i kundportalen.',
    'Behöver du en människa kopplar Source AI in vår support.',
    'Ingår i alla paket. Överlämning till en person även utanför kontorstid ingår i Enterprise.',
  ],
  card: {
    label: 'Exempel: Source AI svarar om lagret',
    name: 'Source AI',
    question: 'Vilka produkter håller på att ta slut?',
    row: { title: 'Förvaringsbox', note: 'Mellan, grå', status: 'Lågt saldo' },
  } satisfies SourceAiAnswerContent,
};

/*
 * 2 – AI-insikter med rådgivare. Belägg: AI går igenom tolv sektioner (services/insightPrompts.js:20),
 * nattlig körning för paketet (cron/insightCron.js:178), fynd, underlag och rekommenderad åtgärd
 * per insikt (routes/insights.js:190-206), "Att göra denna vecka" med högst en insikt per område
 * (public/js/layout2.js:1191), "Fråga rådgivaren" (layout2.js:1258) och rådgivarens intro
 * "Hej! Jag är …" (public/insight-chat-layout2.html:563), kategorierna och rådgivarna
 * (services/insightCategories.js:26-62), paketet (config/packageTiers.js:94). Rådgivarnamnen får
 * visas (beslut 2026-09-30), porträtten visas inte. Inga kvoter och inga siffror.
 */
export const aiInsikter = {
  id: 'ai-insikter',
  eyebrow: 'AI-INSIKTER',
  title: 'Insikter och en rådgivare att fråga',
  intro:
    'Varje natt går AI-insikterna igenom försäljning, kunder, kampanjer och lager. Du får det viktigaste att göra den här veckan och kan fråga rådgivaren om varje insikt. Ingår i Growth och Enterprise.',
  steps: [
    {
      title: 'Insikterna tas fram',
      body: 'AI:n lyfter det som sticker ut i varje område, med ett förslag på vad du kan göra.',
    },
    {
      title: 'Att göra denna vecka',
      body: 'Det viktigaste samlas i en lista, en insikt per område.',
    },
    {
      title: 'Fråga rådgivaren',
      body: 'Varje område har sin rådgivare. Fråga vidare om en insikt, så svarar rådgivaren utifrån din data.',
    },
  ],
  insight: {
    label: 'AI-insikt',
    category: 'Betalningar & fakturor',
    title: 'Fler betalar via betalningslänken',
    body: 'Betalningslänkarna står för en större andel av betalningarna än perioden innan.',
    recommendationLabel: 'Förslag',
    recommendation: 'Lägg till en betalningslänk i fler av dina fakturor.',
    updated: 'Uppdaterad i natt',
  },
  week: {
    label: 'Exempel: veckans insikter, en per område',
    title: 'Att göra denna vecka',
    rows: [
      { id: 'betalningar', advisor: 'Johan', area: 'Betalningar & fakturor', action: 'Påminn om fakturor som har passerat förfallodagen.' },
      { id: 'kunder', advisor: 'Amira', area: 'Kunder & beteende', action: 'Visa de mest sålda produkterna tydligare på startsidan.' },
      { id: 'lager', advisor: 'Maja', area: 'Lager & leveranser', action: 'Beställ varianter som snart tar slut.' },
    ],
  } satisfies WeekListContent,
  chat: {
    label: 'Exempel: en följdfråga till rådgivaren',
    advisor: 'Johan',
    role: 'Ekonomirådgivare',
    intro: 'Hej! Jag är Johan, ekonomirådgivare. Vad vill du veta om insikten?',
    question: 'Vilka fakturor borde få en betalningslänk?',
    answer: 'Börja med fakturorna som har passerat förfallodagen. Med en betalningslänk kan kunden betala direkt från fakturan.',
  } satisfies AdvisorChatContent,
};

/*
 * Bokföringshjälpen. Belägg: Source AI i bokföringsläge med knappen på bokföringssidan
 * (public/bokforing-layout2.html:239) och godkännande en gång per session (:4755,
 * models/AIAssistantConsent.js:49), paketet (config/packageTiers.js:108 och
 * routes/aiSupportRoutes.js:160-220). Den ger allmän vägledning om systemet, inte rådgivning
 * (models/AIAssistantConsent.js:54, 61). Svaret i exemplet återger Bokföring-sidans belagda
 * text om Fortnox-kopplingen (lib/data/tjanster/bokforing.ts:213). Bokföringsförslagen på
 * bokföringssidan är en regelmotor och nämns inte som AI.
 */
export const aiBokforing = {
  id: 'bokforingshjalpen',
  eyebrow: 'BOKFÖRINGSHJÄLPEN',
  title: 'Fråga hur bokföringen fungerar',
  body: [
    'Undrar du hur bokföringen eller Fortnox-kopplingen fungerar i Source? Fråga assistenten direkt på bokföringssidan.',
    'Den ger allmän vägledning om systemet – ansvaret för bokföringen är ditt.',
  ],
  packageNote: 'Ingår i Growth och Enterprise.',
  widget: {
    label: 'Exempel: en fråga till bokföringshjälpen',
    name: 'Source AI',
    mode: 'Bokföringshjälpen',
    entry: 'Få hjälp med din bokföring och vårt system',
    question: 'Hur testar jag kopplingen till Fortnox?',
    answer:
      'Koppla Fortnox och testa kopplingen under Bokföring. Source kontrollerar att kontona finns och är aktiva, att verifikatserien finns och att ett räkenskapsår täcker dagens datum.',
    // Portalens egen korta ansvarsrad, ordagrant (models/AIAssistantConsent.js:61).
    disclaimer: 'Allmän vägledning om systemet. Du ansvarar för din bokföring; Source Solutions tar inget ansvar för innehållet.',
  } satisfies BookkeepingHelpContent,
};

/*
 * Kampanjassistenten. Belägg: startvyn "Vad vill du uppnå?" (public/marknadsforing-layout2.html:695)
 * med syftena (public/js/marknadsforing.js:38), briefen med "Vad säljer ni" och "Vem vill ni nå"
 * (marknadsforing.js:885-886 och 1045-1046), "Ta fram plan", planen med plattformar, passning och
 * budskap per kanal (marknadsforing.js:846-866, 882) och "Starta marknadsföringen" som gör
 * markerade plattformar till kanaler med spårningslänk (marknadsforing.js:1087-1088,
 * routes/campaignRoutes.js:1987, 2057). Paketet
 * (routes/campaignRoutes.js:1881, config/packageTiers.js:123). Ingen bildgenerering, ingen
 * publicering (marknadsforing.js:673), inga budgetandelar i exemplet.
 */
export const aiKampanj = {
  id: 'kampanjassistenten',
  eyebrow: 'KAMPANJASSISTENTEN',
  title: 'En plan för din marknadsföring',
  body: [
    'Beskriv vad du säljer och vem du vill nå, så föreslår assistenten plattformar, budskap per kanal och hur budgeten kan fördelas.',
    'Välj de plattformar du vill ha, så blir de kanaler med egen spårningslänk.',
  ],
  packageNote: 'Ingår i Enterprise.',
  label: 'Exempel: kampanjassistenten tar fram en plan och skapar kanalerna',
  demo: {
    title: 'Assistent',
    status: { idle: 'Brief', done: 'Kanaler skapade' },
    purpose: { label: 'Vad vill du uppnå?', value: 'Sälja mer' },
    fields: [
      { label: 'Vad säljer ni', value: 'En ny tjänst' },
      { label: 'Vem vill ni nå', value: 'Befintliga kunder' },
    ],
    planButton: 'Ta fram plan',
    planTitle: 'Plan',
    channels: [
      { id: 'email', label: 'E-post', fit: 'Passning hög' },
      { id: 'meta', label: 'Meta', fit: 'Passning medel' },
      { id: 'google', label: 'Google Ads', fit: 'Passning medel' },
    ],
    apply: 'Starta marknadsföringen',
    applyNote: 'Markerade plattformar blir kanaler med spårningslänk.',
  } satisfies CampaignAssistantDemoContent,
};

/*
 * Mer AI i portalen. Belägg: sammanfattningen av rekommenderade inköp (routes/inventoryRoutes.js:862,
 * public/inventarier-layout2.html:243-251), AI-designassistenten för kategorier
 * (public/produkter-layout2.html:1163, routes/storefrontPresentationRoutes.js:173-178, kategoriytan
 * utan paketkrav enligt config/packageTiers.js:185-187), verksamhetssammandraget "Föreslå med AI"
 * (public/js/marknadsforing.js:797-801, routes/campaignRoutes.js:1929, enterprise via :1881),
 * snabbval i Source AI (public/installningar-layout2.html:826, routes/aiSupportRoutes.js:647-649,
 * utan paketkrav :148). Inga antal.
 */
export const aiMer = {
  id: 'mer-ai',
  eyebrow: 'MER AI I PORTALEN',
  title: 'AI där du redan arbetar',
  items: [
    {
      icon: SparklesIcon,
      title: 'Sammanfattning av inköpen',
      body: 'Rekommenderade inköp får en kort sammanfattning i klartext. Ingår i Growth och Enterprise.',
    },
    {
      icon: PaintBrushIcon,
      title: 'AI-designassistent',
      body: 'Beskriv hur dina kategorier ska se ut i butiken, så föreslår assistenten ett upplägg som du sparar. Ingår i alla paket.',
    },
    {
      icon: DocumentTextIcon,
      title: 'Verksamhetssammandrag',
      body: 'AI föreslår en kort beskrivning av verksamheten som kampanjassistenten läser som bakgrund. Ingår i Enterprise.',
    },
    {
      icon: BoltIcon,
      title: 'Snabbval i Source AI',
      body: 'Lägg in egna snabbval, så når du det du frågar om oftast med ett klick. Ingår i alla paket.',
    },
  ] satisfies FeatureItem[],
};

/*
 * 6 – Leads. Belägg (~/cc-rapporter/leads-recon.md, kundportalen c28cecc9): sidan och API:erna
 * kräver paketet (config/packageTiers.js:85, server.js:3279, routes/leadsRoutes.js:76), kunden
 * väljer branscher och orter (public/leads-layout2.html:522-559), förslagen hämtas från flera
 * källor (services/aiLeadGeneration.js:955-1088) med betyg och motivering (models/Lead.js:29-34),
 * pitchanalys per lead (routes/leadsRoutes.js:1200, knappen public/leads-layout2.html:3563),
 * status från nytt lead till vunnen (public/leads-layout2.html:1406-1409, routes/leadsRoutes.js:1042).
 * Samma widget som LeadList på Företag Växa (finns på develop men inte på grenens bas), med en
 * rad – kortet över ett foto har högst en rad. Inga källnamn, ingen schemaläggning, inga siffror.
 */
export const aiLeads = {
  id: 'leads',
  eyebrow: 'LEADS',
  title: 'Hitta nya kunder',
  body: [
    'Välj vilka kunder du vill nå, efter bransch och ort, så letar Source fram företag som passar från flera källor – med ett betyg och en kort motivering för varje.',
    'Be om en pitchanalys innan du hör av dig och följ varje lead från nytt till vunnen affär.',
    'Ingår i Growth och Enterprise.',
  ],
  card: {
    label: 'Exempel: ett lead med betyg, motivering och status',
    title: 'Leads',
    ratingLabel: 'Betyg',
    leads: [
      {
        id: 'l1',
        company: 'Exempel Nord AB',
        place: 'Umeå',
        rating: 'A',
        motivation: 'Samma bransch och ort som i din profil.',
        stage: 'new',
        status: 'Nytt lead',
      },
    ],
    action: 'Analysera & pitch',
  } satisfies LeadListContent,
};

/*
 * Avslut – vad som ingår per paket. Belägg: Source AI utan paketkrav (routes/aiSupportRoutes.js:148),
 * överlämning till livechatt även utanför kontorstid bara i Enterprise (config/packageTiers.js:288-290,
 * routes/aiSupportRoutes.js:117-144), AI-insikter (config/packageTiers.js:94), bokföringshjälpen
 * (config/packageTiers.js:108), leads (config/packageTiers.js:85, routes/leadsRoutes.js:76),
 * kampanjassistenten (routes/campaignRoutes.js:1881). Samma paket som på /priser
 * (lib/data/pricing-features.ts).
 */
export const aiAvslut = {
  id: 'ai-i-paketen',
  eyebrow: 'PAKET',
  title: 'Vad som ingår i ditt paket',
  body: [
    'Source AI finns i alla paket. De andra AI-funktionerna följer paketet, så du ser vad som ingår innan du väljer.',
  ],
  list: {
    label: 'AI-funktionerna och paketen de ingår i',
    title: 'AI i Source',
    rows: [
      { id: 'source-ai', name: 'Source AI i kundportalen', plans: 'Alla paket' },
      { id: 'overlamning', name: 'Överlämning till en person även utanför kontorstid', plans: 'Enterprise' },
      { id: 'insikter', name: 'AI-insikter och rådgivare', plans: 'Growth och Enterprise' },
      { id: 'bokforing', name: 'Bokföringshjälpen', plans: 'Growth och Enterprise' },
      { id: 'leads', name: 'Leads', plans: 'Growth och Enterprise' },
      { id: 'kampanj', name: 'Kampanjassistenten', plans: 'Enterprise' },
    ],
  } satisfies PackageListContent,
  primary: { label: 'Se priser', href: '/priser' } satisfies ServiceCta,
  secondary: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
};

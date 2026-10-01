// Funktionerna på /priser: en källa för både paketkorten och funktionsöversikten.
// Varje rad är byggd och öppen i kundportalen från det paket som anges (minsta paket,
// högre paket ingår). Belägg i kommentaren: fil:rad i kundportalens origin/develop
// (427da104). Lägg bara till rader som går att belägga på samma sätt.

export type PlanId = 'core' | 'growth' | 'enterprise';

export const PLAN_ORDER: PlanId[] = ['core', 'growth', 'enterprise'];

export const PLAN_NAMES: Record<PlanId, string> = {
  core: 'Core',
  growth: 'Growth',
  enterprise: 'Enterprise',
};

export type PricingFeature = {
  name: string;
  detail?: string;
  from: PlanId;
};

export type PricingFeatureCategory = {
  title: string;
  features: PricingFeature[];
};

export const pricingFeatureCategories: PricingFeatureCategory[] = [
  {
    title: 'Sälj och betalning',
    features: [
      // server.js:1290 (page:produkter), omappad i config/packageTiers.js:48-50 = core
      { name: 'Produkter och kategorier', detail: 'med varianter och bilder', from: 'core' },
      // server.js:1295 (page:inventarier), core
      { name: 'Lager och inventarier', detail: 'lagersaldo och förslag på inköp', from: 'core' },
      // server.js:1228 (page:betalningar), core. Kassan tar bara kort
      // (b25b58c1 services/storefrontCheckoutService.js:2327) och Stripe-anslutningen är core
      // (b25b58c1 server.js:3307-3316).
      { name: 'Kortbetalningar och återbetalningar', detail: 'kassan tar betalt med kort', from: 'core' },
      // server.js:1260-1261 och 3503 (page:betalningslank), core
      { name: 'Betalningslänk', from: 'core' },
      // server.js:1293 (page:prenumerationer), core
      { name: 'Prenumerationer', detail: 'återkommande köp för dina kunder', from: 'core' },
      // server.js:1296 (page:kampanjer), core
      { name: 'Kampanjer och rabattkoder', from: 'core' },
      // config/packageTiers.js:80 och 168
      { name: 'Kassa i ditt utseende', from: 'growth' },
      // config/packageTiers.js:110 och 162
      { name: 'Presentkort', from: 'growth' },
      // config/packageTiers.js:114 och 164, server.js:3455
      { name: 'Offerter', from: 'growth' },
      // config/packageTiers.js:112 och 163, server.js:3544
      { name: 'Bokningar', detail: 'tjänster, resurser och bokning online', from: 'growth' },
    ],
  },
  {
    title: 'Kunder och kommunikation',
    features: [
      // server.js:1223 (page:kunder), core
      { name: 'Kundregister med kundprofiler', from: 'core' },
      // server.js:1301, 1326 och 3164 (page:kundmeddelanden), core
      { name: 'Meddelanden och chatt med dina kunder', from: 'core' },
      // config/packageTiers.js:97 och 167
      { name: 'Automatiska mejl och utskick', detail: 'med mallar och egen avsändardomän', from: 'growth' },
      // routes/productReviewRoutes.js:36
      { name: 'Produktomdömen', from: 'growth' },
      // config/packageTiers.js:69 och 152, server.js:3558
      { name: 'Nyheter', from: 'growth' },
      // Kundportalen 59816137: config/packageTiers.js:85 och 155, server.js:3279,
      // routes/leadsRoutes.js:76 (growth och enterprise), pitchanalys routes/leadsRoutes.js:1200.
      // Se ~/cc-rapporter/leads-recon.md.
      { name: 'Leads', detail: 'förslag på nya kunder med betyg och pitchanalys', from: 'growth' },
      // config/packageTiers.js:135 och 172, server.js:3185
      { name: 'Support-inkorg', detail: 'dina kunders mejl samlade som ärenden', from: 'enterprise' },
    ],
  },
  {
    title: 'Frakt och logistik',
    features: [
      // config/packageTiers.js:71-72, server.js:3094
      { name: 'Ordrar och plock', from: 'growth' },
      // config/packageTiers.js:75-76, services/shipping/adapters/index.js:6
      { name: 'Frakt med PostNord', detail: 'sändningar och spårning', from: 'growth' },
      // config/packageTiers.js:74
      { name: 'Returer', from: 'growth' },
    ],
  },
  {
    title: 'Ekonomi och bokföring',
    features: [
      // server.js:1232 (page:fakturor), core
      { name: 'Fakturor', detail: 'även till företag, med moms per rad', from: 'core' },
      // config/packageTiers.js:56-60, server.js:1248, medvetet core
      { name: 'Fakturarapport', from: 'core' },
      // routes/taxDeadlineRoutes.js:16, ingen paketgate
      { name: 'Skattekalender', detail: 'datum för moms och andra deklarationer', from: 'core' },
      // config/packageTiers.js:107-108 och 161, server.js:3510
      { name: 'Bokföring med Fortnox', detail: 'verifikat och huvudbok', from: 'growth' },
      // Kundportalen e2fd2455: routes/tenantInvoiceRoutes.js:604-616 anropar
      // services/spiris/spirisInvoiceService.js:252 som skapar fakturan i Spiris (412) och
      // mejlar den därifrån (498). Anslutningen görs under Integrationer, growth
      // (config/packageTiers.js:82-83, routes/spirisRoutes.js:34). Bara fakturor: verifikat
      // skickas inte till Spiris (services/accounting/providers/registered.js:13-16).
      { name: 'Fakturor via Spiris', detail: 'skapas och mejlas från ditt Spiris-konto', from: 'growth' },
      // config/packageTiers.js:105 och 160, server.js:3353
      { name: 'Utbetalningsrapporter', from: 'growth' },
    ],
  },
  {
    title: 'Insikter',
    features: [
      // server.js:1453, /dashboard omappad i config/packageTiers.js:48 = core
      { name: 'Översikt', detail: 'dagens läge på en sida', from: 'core' },
      // config/packageTiers.js:99-104
      { name: 'Rapporter', detail: 'försäljning, kunder, marknadsföring och support', from: 'growth' },
      // config/packageTiers.js:94-95, server.js:3180-3181
      { name: 'AI-insikter och insiktschatt', from: 'growth' },
      // config/packageTiers.js:89-92
      { name: 'Analyser', detail: 'övergivna kundvagnar och var dina kunder finns', from: 'growth' },
      // config/packageTiers.js:87, server.js:3473
      { name: 'Konkurrentbevakning', from: 'growth' },
      // config/packageTiers.js:118-119, server.js:3197
      { name: 'Statistik', from: 'enterprise' },
    ],
  },
  {
    title: 'Marknadsföring',
    features: [
      // config/packageTiers.js:122-124, server.js:3324
      { name: 'Kampanjstudio med AI-assistent', detail: 'planer, texter och bildbibliotek', from: 'enterprise' },
      // config/packageTiers.js:125-130, routes/adsRoutes.js:42-54, beställning som Source hanterar
      { name: 'Annonser som vi sköter åt dig', detail: 'i Google, Meta och TikTok', from: 'enterprise' },
    ],
  },
  {
    title: 'Support och konto',
    features: [
      // routes/aiSupportRoutes.js:148 och 336, server.js:3166, alla paket
      { name: 'AI-support i portalen', from: 'core' },
      // routes/aiSupportRoutes.js:140-143 och 507, alla paket
      { name: 'Livechatt och ärenden med oss', from: 'core' },
      // config/permissions.js:154-157, server.js:1460 (/profil)
      { name: 'Roller och behörigheter per person', from: 'core' },
    ],
  },
];

// Hemsidan som vi bygger åt kunden: tjänster som Source levererar, inte funktioner i
// kundportalen, och därför inte med i funktionsöversikten. Formulering och paket som på
// origin/develop (a886898) app/priser/page.tsx:18-19 för Core och 37 och 39 för Growth.
// Enterprise hade "Allt i Growth, plus:" och får därför samma som Growth.
export const websiteServicesTitle = 'Hemsida som vi bygger åt dig';

export const websiteServices: Record<PlanId, string[]> = {
  core: ['Responsiv design', 'Upp till 5 sidor'],
  growth: ['Responsiv design', 'Obegränsat antal sidor och design', 'Kontaktformulär på hemsida till kundportal'],
  enterprise: ['Responsiv design', 'Obegränsat antal sidor och design', 'Kontaktformulär på hemsida till kundportal'],
};

export function includedIn(feature: PricingFeature, plan: PlanId): boolean {
  return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(feature.from);
}

// Paketkortens listor: det som tillkommer i varje paket, i översiktens ordning.
export function featuresAddedIn(plan: PlanId): PricingFeature[] {
  return pricingFeatureCategories.flatMap((c) => c.features.filter((f) => f.from === plan));
}

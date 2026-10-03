// NY STARTSIDA: innehåll för kategorisektionen (sektion 4) och bildspelet (sektion 5),
// från redesign 1 i experimentet. Bilderna ligger i public/ny-startsida/ som WebP.
//
// PASS 4: kategorisektionen har nya widgetar (r1/CategoryWidgets.tsx). Varje påstående är
// verifierat read-only mot kundportalen source.database origin/develop (5ff29490) eller,
// för hemsidetjänsten, mot den här sajtens egen onboarding – belägg vid varje kategori.
// Ingen konkurrent nämns. Inga siffror, belopp eller resultat.

import { GROWTH } from './content';

/* ---------- Kategorisektionen ---------- */
export type WidgetId = 'paths' | 'marketing' | 'payout' | 'support';

export type Category = {
  number: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  /** PASS 5: develops originalbild för kategorin (components/sections/WhatWeDo.tsx på 49f3724). */
  imageSrc: string;
  /** PASS 6: bubblorna som kod ovanpå fotot (PhotoBubbles.tsx). Saknas = inga bubblor. */
  bubbleSet?: 'hemsida' | 'marknadsforing' | 'logistik';
  widget: WidgetId;
  widgetLabel: string;
};

export const WHAT_R1 = {
  overline: 'BYGGT FÖR ATT FORMAS',
  titleA: 'Inte en mall.',
  titleB: 'Ditt system.',
  lead: 'Source formas efter din verksamhet, inte tvärtom. Du väljer vad som syns, hur det ser ut och vad det heter.',
  categories: [
    /*
     * Design & E-handel – tre vägar till kundportalen.
     * Vi bygger hemsidan: tjänst från Source (lib/data/pricing-features.ts:149-155, websiteServices).
     * Förbättra din nuvarande: sajtens onboarding frågar om befintlig hemsida och tar emot dess
     * kod (app/onboarding/questions/questions-form.tsx:33-35 och :142, app/onboarding/code/
     * code-upload-form.tsx:501-505), och FAQ:n lovar att förbättra eller migrera den
     * (components/sections/FAQ.tsx:27). Det är en tjänst, ingen portalfunktion.
     * Behåll och koppla: kundportalen kopplar en befintlig hemsida via dess URL under
     * Inställningar → Integrationer (source.database public/produkter-layout2.html:5427-5428).
     * AI-hemsidebyggaren: kommande, märkt "Kommer snart" enligt uppdraget.
     * Kassan tar kort: services/storefrontCheckoutService.js:2327.
     */
    {
      number: '01',
      title: 'Design & E-handel',
      tagline: 'Vi bygger, du formar.',
      description:
        'Tre vägar till samma kundportal. Vi bygger din hemsida, förbättrar den du har, eller kopplar in din befintliga precis som den är.',
      details: [
        'Hemsida som vi bygger åt dig',
        'Din nuvarande, förbättrad',
        'Din befintliga, kopplad till kundportalen',
        'Kassa med kortbetalning',
      ],
      imageSrc: '/ny-startsida/hemsida.webp',
      bubbleSet: 'hemsida',
      widget: 'paths',
      widgetLabel: 'Tre vägar till hemsidan, och AI-hemsidebyggaren som kommer snart',
    },
    /*
     * Marknadsföring & Tillväxt – AI-assistenten och samlad data.
     * AI-assistenten: "Låt AI hjälpa dig skapa den perfekta marknadsföringsstrategin" med
     * målgrupp, budget, kanaler, mål och lansering (public/kampanj-marknadsforing-layout2.html:26-27,
     * :61-193, kanalerna :135-166). Assistentpanel med brief, plankort och chatt
     * (public/marknadsforing-layout2.html:319). Sidorna kräver enterprise
     * (config/packageTiers.js:123-124).
     * Samlat på ett ställe: Marknadsföring med Din marknadsföring, Dina bilder, Skapa
     * annonsmaterial och Kalender (public/marknadsforing-layout2.html:686-804), kampanjer
     * (server.js:1327), kampanjutskick (public/epost-layout2.html:875) och rapporten för
     * marknadsföring (config/packageTiers.js:103, growth).
     */
    {
      number: '02',
      title: 'Marknadsföring & Tillväxt',
      tagline: 'Vi optimerar, du växer.',
      description:
        'En AI-assistent tar fram planen med dig: målgrupp, kanaler och mål. Kampanjer, utskick, bilder och rapporter finns på ett ställe.',
      details: ['AI-assistent för marknadsföring', 'Kampanjer och rabattkoder', 'Utskick till dina kunder', 'Rapport för marknadsföring'],
      imageSrc: '/ny-startsida/marknadsforing.webp',
      bubbleSet: 'marknadsforing',
      widget: 'marketing',
      widgetLabel: 'Exempel: AI-assistenten föreslår en plan, och marknadsföringen samlas på ett ställe',
    },
    /*
     * Ekonomi & Logistik – utbetalning → rapport → verifikat → Fortnox.
     * Stripe-webhooken payout.paid skapar bokföringsrapporten automatiskt
     * (routes/stripePaymentWebhook.js:7868-7905, accountantAgent.processPayout med
     * userEmail 'system@webhook'). Rapporten bygger verifikaten och kontrollerar att de
     * balanserar (services/accountantAgent.js:282-335, vouchersPreview, validateBalancing).
     * Du godkänner och verifikaten skapas (routes/accountingRoutes.js:1482-1498) och skickas
     * till Fortnox (routes/accountingRoutes.js:1016 och :777, fortnoxProvider.js:28).
     * Kräver growth (server.js:3573). PostNord: services/shipping/carrierPolicy.js:46.
     */
    {
      number: '03',
      title: 'Ekonomi & Logistik',
      tagline: 'Vi bokför, du skickar.',
      description:
        'När en utbetalning kommer in tas bokföringsrapporten fram med färdiga verifikat. Du godkänner, och de skickas till Fortnox.',
      details: ['Bokföringsrapport per utbetalning', 'Verifikat med balanskontroll', 'Skickas till Fortnox', 'Frakt med PostNord'],
      imageSrc: '/ny-startsida/logistik.webp',
      bubbleSet: 'logistik',
      widget: 'payout',
      widgetLabel: 'Exempel: en utbetalning blir verifikat som skickas till Fortnox',
    },
    /*
     * Support & Utveckling – chatt med en supportperson från Source.
     * AI-supporten svarar först (server.js:3212, /api/ai). Vid överlämning får kunden
     * livechatt med en människa under supporttid, och dygnet runt i enterprise; annars blir
     * det ett ärende (routes/aiSupportRoutes.js:133-145, resolveEscalationMode; :501 /escalate).
     * Behörigheter per person: config/permissions.js:19-28.
     */
    {
      number: '04',
      title: 'Support & Utveckling',
      tagline: 'Vi svarar, du fortsätter.',
      description:
        'Ställ en fråga i portalen så svarar AI-supporten direkt. Behöver du en människa kopplas du till oss på Source i livechatten.',
      details: ['AI-support i portalen', 'Livechatt med oss på Source', 'Ärende när vi inte är på plats', 'Behörigheter per person'],
      imageSrc: '/ny-startsida/support.webp',
      widget: 'support',
      widgetLabel: 'Illustrerad dialog: en kund chattar med en supportperson från Source',
    },
  ] satisfies Category[],
};

/*
 * Bildspelet (sektion 5) i redesign 1: develops två bilder oförändrade, plus en tredje.
 * Den tredje fanns tidigare på startsidan (commit 2c2946a) men togs bort från develop i
 * 0c49546, eftersom dess text ("kopplar bokningar till Fortnox") inte går att belägga.
 * Här återinförd med samma bild och en text som bara påstår det koden gör:
 *   utbetalning → bokföringsrapport: routes/accountingRoutes.js:1560-1574 och
 *     routes/stripePaymentWebhook.js:7892 (accountantAgent.processPayout)
 *   rapport → verifikat: routes/accountingRoutes.js:1482-1496
 *     (accountingEngine.createDocumentsFromBookkeepingReport, redigerbara verifikat)
 *   verifikat → Fortnox: routes/accountingRoutes.js:1016 och :777 (send-to-fortnox,
 *     action:bokforing), services/accounting/providers/fortnoxProvider.js:28 (vouchers: true)
 *   aktivt: /api/accounting kräver growth (server.js:3573). Flaggan FEATURE_ACCOUNTING
 *     (utils/featureFlags.js:6) läses inte av någon produktionskod och stänger inte av flödet.
 * Bilden (public/ny-startsida/bokforing.webp, tidigare public/newbooking.webp): två kollegor
 * som går igenom något på en skärm – passar granskning av bokföring och betalningar.
 */
export const GROWTH_R1 = {
  ...GROWTH,
  slides: [
    ...GROWTH.slides,
    {
      id: 'bokforing',
      image: '/ny-startsida/bokforing.webp',
      title: 'Bokföring direkt från dina utbetalningar',
      body: 'Varje utbetalning blir en bokföringsrapport med färdiga verifikat – du granskar och skickar dem till Fortnox i stället för att skriva in allt för hand.',
    },
  ],
};

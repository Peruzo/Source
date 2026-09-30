/*
 * Innehåll för /integrationer (nya sektioner efter heron).
 *
 * Varje påstående här finns i kundportalens kod (source.database, origin/develop
 * 4a82b17a, kontrollerad 2026-09-29 – se CC-RAPPORT-integrationer-recon.md punkt 4 och
 * CC-RAPPORT-integrationer-bygge.md punkt 5). Filsökvägarna nedan är relativa till
 * portalens rot.
 *
 * Portalens integrationssida visar bara Spiris, Fortnox, Stripe, PayPal och PostNord
 * (public/js/integrations.js 6), PayPal som "Kommer snart" (10). Annonsplattformarna och
 * Klarna är dolda (15) och nämns inte här. Spiris ligger bakom FLAGGOR.spiris nedan.
 *
 * Nämns inte (finns inte, är manuellt eller avstängt): "automatiskt", "i realtid", synk åt
 * båda håll, verifikat till Spiris, betald-status från Fortnox eller Spiris, automatisk
 * bokning av frakt, spårningsstatusar, returer. Inga paketnamn.
 */
import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  LinkSlashIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type {
  FortnoxConnectDemoContent,
  IntegrationListContent,
  InvoiceProviderContent,
  PayoutChainDemoContent,
  PostNordSettingsContent,
} from '@/components/sections/tjanster/widgets/IntegrationDemos';

/*
 * ────────────────────────────────────────────────────────────────────────────
 * FLAGGOR – slå på här när det är bekräftat i produktion.
 *
 *   spiris   AV tills Spiris-kopplingen är bekräftad i produktion (plattformens
 *            Spiris-konfiguration; utan den visar portalen "inte konfigurerad",
 *            public/js/integrations.js 1426–1427). På: Spiris läggs till som
 *            koppling för FAKTUROR – aldrig verifikat, som inte skickas till Spiris
 *            (services/accounting/providers/registered.js 13–16). Det som ändras
 *            listas i CC-RAPPORT-integrationer-bygge.md punkt 4: i1 (rubrik, text,
 *            listan), i4 (text och valen i fakturakortet), i7 (två kort) och i8 (text).
 * ────────────────────────────────────────────────────────────────────────────
 */
export const FLAGGOR = {
  spiris: false,
};

const S = FLAGGOR.spiris;

// Photos (scripts/tjanster-bilder/integrationer.mjs). Both sit beside the text, never under it.
const IMG = '/tjanster/integrationer/integrationer';

export const integrationerImages = {
  // I4 – two colleagues going through papers at a table.
  faktura: {
    base: `${IMG}-faktura`,
    alt: 'Två kollegor lutar sig över ett bord och går igenom papper tillsammans.',
    widths: [640, 1024, 1536, 2048],
    portraitWidths: [480, 720, 920],
    // Between the two faces, on the paper they hold, so both people stay in the tall column.
    focus: '52% 50%',
    portraitFocus: '50% 50%',
  },
  // I8 – a potter fixing a handle to a cup; a fixed crop, used at every width.
  avslut: {
    base: `${IMG}-avslut`,
    alt: 'En keramiker fäster ett öra på en kopp vid arbetsbordet, med hyllor fulla av koppar bakom sig.',
    widths: [640, 1024, 1536],
    // The face and the hands at the cup (x 25–45 %), with the cup at the bottom kept in view.
    focus: '28% 100%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * The widgets on the photos, from xl (ImageAnchoredCard, anchored to the photo). Below xl
 * they stack under the photo. Coordinates are percent of the photo file.
 *   faktura – top-left corner at x 921, y 23 of P4 (2048×1152): right of the man's face
 *             (it ends at x ≈ 900) and over the top row of box labels (x 905–1275,
 *             y 25–65). The card is compact so it ends above the woman's face (y 350).
 *   avslut  – top-left corner at x 559, y 29 of the P2 crop (1748×960): the shelves right
 *             of the potter's head (it ends at x ≈ 512). The list grows downwards over his
 *             shoulder, never to his hands (y ≥ 785), also with Spiris switched on.
 */
export const integrationerKort = {
  faktura: { anchor: { x: 45, y: 2 }, origin: 'top-left' as const },
  avslut: { anchor: { x: 32, y: 3 }, aspect: 1748 / 960, origin: 'top-left' as const },
};

/*
 * I1 – inledning. Belägg: vitlistan och "Kommer snart" (integrations.js 6, 10), kortens
 * beskrivningar Stripe "Kortbetalningar och utbetalningar" (41), Fortnox "Bokföring,
 * fakturor och kundreskontra" (51), PostNord "Fraktetiketter, spårning, returer" (125).
 * Spiris: bara fakturor (routes/tenantInvoiceRoutes.js 604–647; registered.js 13–16).
 * Knappen Anslut (integrations.js 633) och Ansluten (628), som i avslutet (I8).
 */
export const integrationerIntro = {
  eyebrow: 'INTEGRATIONER',
  title: S ? 'Fyra kopplingar, var och en med sitt jobb' : 'Tre kopplingar, var och en med sitt jobb',
  body: [
    S
      ? 'Stripe för kortbetalningar och utbetalningar, Fortnox för bokföring och fakturor, Spiris för fakturor och PostNord för frakt. PayPal kommer snart.'
      : 'Stripe för kortbetalningar och utbetalningar, Fortnox för bokföring och fakturor och PostNord för frakt. PayPal kommer snart.',
  ],
  list: {
    title: 'Integrationer',
    connect: 'Anslut',
    connected: 'Ansluten',
    comingSoon: 'Kommer snart',
    items: [
      { id: 'stripe', name: 'Stripe', description: 'Kortbetalningar och utbetalningar' },
      { id: 'fortnox', name: 'Fortnox', description: 'Bokföring och fakturor', logo: '/fortnoxlogo.png' },
      ...(S ? [{ id: 'spiris', name: 'Spiris', description: 'Fakturor' }] : []),
      { id: 'postnord', name: 'PostNord', description: 'Bokning och fraktsedlar' },
      { id: 'paypal', name: 'PayPal', description: 'Betalningar', comingSoon: true },
    ],
  } satisfies IntegrationListContent,
};

/*
 * I2 – anslut Fortnox (scen). Belägg:
 *   Anslut Fortnox och OAuth-inloggning hos Fortnox – integrations.js 1376–1378;
 *     routes/fortnoxRoutes.js 49 (connect)
 *   behörigheterna som godkänns – fortnoxRoutes.js 26 (companyinformation bookkeeping customer
 *     invoice payment article)
 *   ägare och administratörer som standard – config/permissions.js 53 (page:integrationer är
 *     begränsad), 154–157 (owner allt, admin alla sidor); "Kräver administratörsbehörighet"
 *     (integrations.js 1376)
 *   kontomappning, försäljningskonto per momssats med portalens förslag 3001–3004 och 3231 –
 *     integrations.js 1466–1471, 1481; fortnoxRoutes.js 584 (vat25, vat12, vat6, vat0,
 *     reverseCharge); kontot måste finnas och vara aktivt i Fortnox (fortnoxRoutes.js 656–663)
 */
export const integrationerFortnox = {
  eyebrow: 'FORTNOX',
  title: 'Anslut med ditt eget Fortnox-konto',
  body: [
    'Klicka på Anslut, logga in hos Fortnox och godkänn. Sedan väljer du vilket försäljningskonto varje momssats ska bokas på.',
    'Som standard är det ägare och administratörer som kan ansluta.',
  ],
  label: 'Exempel: Fortnox ansluts och ett försäljningskonto väljs för varje momssats',
  demo: {
    title: 'Fortnox',
    logo: '/fortnoxlogo.png',
    description: 'Bokföring och fakturor',
    status: { idle: 'Ej ansluten', done: 'Ansluten' },
    connect: 'Anslut Fortnox',
    consent: {
      title: 'Logga in hos Fortnox och godkänn åtkomst till',
      scopes: ['Företagsuppgifter', 'Bokföring', 'Kunder', 'Fakturor', 'Betalningar', 'Artiklar'],
    },
    mapping: {
      title: 'Försäljningskonto per momssats',
      rows: [
        { label: 'Moms 25 %', account: '3001' },
        { label: 'Moms 12 %', account: '3002' },
        { label: 'Moms 6 %', account: '3003' },
        { label: 'Moms 0 %', account: '3004' },
        { label: 'Omvänd byggmoms', account: '3231' },
      ],
      save: 'Spara kontomappning',
      saved: 'Kontomappningen sparad',
    },
  } satisfies FortnoxConnectDemoContent,
};

/*
 * I3 – från Stripe till Fortnox (scen). Belägg:
 *   portalen tar emot händelserna från Stripe – routes/stripePaymentWebhook.js 174
 *     (checkout.session.completed), 226 (payment_intent.succeeded), 563 (charge.refunded),
 *     866 (payout.paid)
 *   bokföringsunderlaget tas fram vid utbetalning – stripePaymentWebhook.js 866–878, 7623,
 *     7690–7706 (handlePayoutPaid → accountantAgent.processPayout); ingen flagga
 *   verifikaten skapas när du bekräftar – routes/accountingRoutes.js 1437 (create-documents)
 *   bara klara verifikat som balanserar skickas – services/accounting/voucherDispatch.js 127–141
 *   du skickar till Fortnox – accountingRoutes.js 761, 769 (kräver action:bokforing)
 * Samma exempelbelopp som på /bokforing (lib/data/tjanster/bokforing.ts).
 */
export const integrationerStripe = {
  eyebrow: 'STRIPE OCH FORTNOX',
  title: 'Från Stripe till Fortnox',
  body: [
    'Portalen tar emot betalningar, återbetalningar och utbetalningar från Stripe. När Stripe gör en utbetalning tas ett bokföringsunderlag fram.',
    'Du skapar verifikaten när du har granskat underlaget och skickar dem till Fortnox när de är klara. Ett verifikat som inte balanserar skickas inte.',
  ],
  label: 'Exempel: en utbetalning från Stripe blir underlag, verifikat och till sist verifikat i Fortnox',
  demo: {
    title: 'Från utbetalning till Fortnox',
    status: { idle: 'Pågår', done: 'Skickat' },
    who: { portal: 'Portalen', you: 'Du' },
    steps: [
      { system: 'Stripe', title: 'Utbetalning', detail: 'Stripe-utbetalning', amount: 1220 },
      { system: 'Source', title: 'Bokföringsunderlag klart', detail: 'Tas fram när utbetalningen kommer', by: 'portal' },
      { system: 'Source', title: 'Verifikat skapade', detail: 'Klara och balanserar', by: 'you', action: 'Skapa verifikat' },
      { system: 'Fortnox', title: 'Skickat till Fortnox', detail: 'Två verifikat', by: 'you', action: 'Skicka' },
    ],
  } satisfies PayoutChainDemoContent,
};

/*
 * I4 – välj var fakturan skapas (widget). Belägg:
 *   val per faktura, Stripe som standard – routes/tenantInvoiceRoutes.js 29
 *   Fortnox och Spiris syns bara när de är anslutna – tenantInvoiceRoutes.js 406–442
 *   fakturan skapas i Fortnox – tenantInvoiceRoutes.js 546–601; betalningen med företagets
 *     egna uppgifter ur Fortnox, ingen Stripe-länk – services/fortnoxInvoiceService.js 7–10
 *   kunden läggs upp i Fortnox om den saknas där – services/fortnoxCustomerSync.js 1–14
 *   Spiris (bara med FLAGGOR.spiris): tenantInvoiceRoutes.js 604–647;
 *     services/spiris/spirisInvoiceService.js 5–9; services/spiris/spirisCustomerSync.js 1–16
 */
export const integrationerFaktura = {
  eyebrow: 'FAKTUROR',
  title: 'Välj var fakturan skapas',
  body: [
    S
      ? 'För varje faktura väljer du om den ska gå via Stripe, Fortnox eller Spiris. Går den via Fortnox eller Spiris skapas fakturan där, med ditt företags egna betaluppgifter, och kunden läggs upp där om den saknas.'
      : 'För varje faktura väljer du om den ska gå via Stripe eller Fortnox. Går den via Fortnox skapas fakturan där, med ditt företags egna betaluppgifter, och kunden läggs upp där om den saknas.',
  ],
  card: {
    title: 'Ny faktura',
    customer: { label: 'Kund', value: 'Befintlig kund' },
    providerLabel: 'Skapa via',
    providers: S ? ['Stripe', 'Fortnox', 'Spiris'] : ['Stripe', 'Fortnox'],
    selected: 'Fortnox',
    note: 'Fakturan skapas i Fortnox med ditt företags betaluppgifter.',
    submit: 'Skapa faktura',
  } satisfies InvoiceProviderContent,
};

/*
 * I5 – PostNord (widget). Belägg:
 *   inställningarna – public/postnord-konfiguration-layout2.html 234 (Customer Key), 240
 *     (lageradress), 283 (Orderstopptid), 294 (Fraktpriser per leveranstyp), 303 (Fri frakt
 *     över belopp); sparas via PATCH /admin/tenant/:tenantId/postNord
 *     (routes/tenantConfigRoutes.js 437–543); kortet leder dit (integrations.js 1786–1789)
 *   boka från ordern – services/shipping/routes/shipments.js 68; fraktsedeln som PDF –
 *     shipments.js 579–594; "Ladda ner etikett" (public/js/order-details.js 591)
 */
export const integrationerPostNord = {
  eyebrow: 'POSTNORD',
  title: 'PostNord ställer du in en gång',
  body: [
    'Fyll i kundnummer, lageradress, orderstopptid och fraktpriser i PostNord-inställningarna. Sedan bokar du leveransen och laddar ner fraktsedeln direkt från ordern.',
  ],
  link: { label: 'Mer om frakten', href: '/logistik' } satisfies ServiceCta,
  card: {
    title: 'PostNord-inställningar',
    enabled: 'Aktiverad',
    filled: 'Ifyllt',
    fields: ['Kundnummer hos PostNord', 'Lageradress', 'Orderstopptid', 'Fraktpriser per leveranstyp'],
    optional: { label: 'Fri frakt över belopp', value: 'Valfritt' },
  } satisfies PostNordSettingsContent,
};

/*
 * I7 – karusellen. Belägg per kort:
 *   Stripe-händelser – stripePaymentWebhook.js 174, 226, 563, 866
 *   underlag vid utbetalning – stripePaymentWebhook.js 866–878, 7690–7706
 *   verifikat till Fortnox – accountingRoutes.js 761, 769; voucherDispatch.js 127–141
 *   fakturor i Fortnox – tenantInvoiceRoutes.js 546–601; fortnoxCustomerSync.js 1–14
 *   konto per momssats – integrations.js 1466–1471; fortnoxRoutes.js 584
 *   bokning och fraktsedel – shipments.js 68, 579–594
 *   fakturor i Spiris (bara med FLAGGOR.spiris) – spirisInvoiceService.js 411 (skapas i Spiris),
 *     496–498 (mejlas av Spiris)
 *   koppla från – fortnoxRoutes.js 760; integrations.js 1408; Spiris: routes/spirisRoutes.js 536
 */
const baseFeatures: FeatureItem[] = [
  { icon: CreditCardIcon, title: 'Betalningar från Stripe', body: 'Portalen tar emot betalningar, återbetalningar och utbetalningar från ditt Stripe-konto.' },
  { icon: BanknotesIcon, title: 'Underlag vid utbetalning', body: 'När Stripe betalar ut tas ett bokföringsunderlag fram.' },
  { icon: DocumentCheckIcon, title: 'Verifikat till Fortnox', body: 'Skicka verifikat som är klara och balanserar, ett i taget eller flera.' },
  { icon: DocumentTextIcon, title: 'Fakturor i Fortnox', body: 'Skapa fakturan i Fortnox. Kunden läggs upp där om den saknas.' },
  { icon: TableCellsIcon, title: 'Konto per momssats', body: 'Välj vilket försäljningskonto i Fortnox varje momssats ska bokas på.' },
  { icon: ArrowDownTrayIcon, title: 'Bokning och fraktsedel', body: 'Boka leveransen hos PostNord och ladda ner fraktsedeln som PDF.' },
];

const spirisFeature: FeatureItem = {
  icon: ArrowsRightLeftIcon,
  title: 'Fakturor i Spiris',
  body: 'Skapa fakturan i Spiris och låt Spiris mejla den till kunden.',
};

const disconnectFeature: FeatureItem = {
  icon: LinkSlashIcon,
  title: 'Koppla från',
  body: S ? 'Du kan koppla från Fortnox och Spiris i portalen när du vill.' : 'Du kan koppla från Fortnox i portalen när du vill.',
};

export const integrationerFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'I PORTALEN',
  title: 'Det här gör kopplingarna',
  items: S ? [...baseFeatures, spirisFeature, disconnectFeature] : [...baseFeatures, disconnectFeature],
};

/*
 * I8 – avslut. Belägg: vitlistan (integrations.js 6); integrationssidan är paketstyrd
 * (config/packageTiers.js 82–83), därför paketraden utan paketnamn. CTA som på /logistik.
 */
export const integrationerAvslut = {
  eyebrow: 'KOM IGÅNG',
  title: 'Koppla ihop det du redan använder',
  body: [
    S
      ? 'Stripe, Fortnox, Spiris och PostNord ansluts i samma portal som resten av verksamheten.'
      : 'Stripe, Fortnox och PostNord ansluts i samma portal som resten av verksamheten.',
  ],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
  packageNote: { text: 'Vilka funktioner som ingår beror på paket –', linkLabel: 'se priser', href: '/priser' },
};

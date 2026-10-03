/*
 * Innehåll för /tjanster/betalningar (tidigare /tjanster/betalningar-hosting).
 *
 * Plan: ~/cc-rapporter/betalningar-hosting-plan.md, med Valentins beslut: hosting tas bort
 * från sidan, sidan heter Betalningar, heron rättas och kassan beskrivs som kortbetalning.
 * Belägg i kundportalen (northlab-io/source.database, origin/develop b25b58c1) per block.
 *
 * Nämns inte: Klarna, Swish eller PayPal i kassan, autogiro, hosting, domän, SSL, CDN,
 * säkerhetskopior, drifttid, avgifter och siffror. Inga beloppsgränser, inga nyckeltal som
 * ser ut som resultat, inga kortmärken. Belopp i widgetarna är exempelpriser hos en
 * påhittad butik, aldrig Sources priser.
 *
 * Paket: kort i kassan, Stripe-anslutning, betalningslänk, fakturor, prenumerationer,
 * återbetalningar och Betalningar-sidan ingår i alla paket (config/packageTiers.js:48-50,
 * Stripe-anslutningen server.js:3307-3316). Presentkort, offerter, utbetalningsrapporter
 * och kassans utseende ingår i Growth och Enterprise (lib/data/pricing-features.ts).
 */
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  GiftIcon,
  PaintBrushIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import type { CardAnchor, FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type { SettingsCardContent } from '@/components/sections/tjanster/widgets/BookingDemos';
import type { PackageListContent } from '@/components/sections/tjanster/widgets/AiAssistantDemos';
import type {
  InvoicePaidCardContent,
  PaymentReceivedCardContent,
  PaymentsRefundDemoContent,
  SubscriptionDemoContent,
} from '@/components/sections/tjanster/widgets/PaymentDemos';

/*
 * Heron. Layout och video är orörda, texten är rättad enligt planens punkt 6.1: kassan tar
 * bara kort (services/storefrontCheckoutService.js:2327), debiteringen sker direkt på
 * tenantens anslutna Stripe-konto (:2452-2455, public/js/stripe-connect-card.js:18).
 * Betalningslänk (routes/paymentLinks.js:264), faktura (services/invoiceService.js:496-536),
 * prenumeration (models/Product.js:279-295) och Betalningar-sidan
 * (public/betalningar-layout2.html) ingår i alla paket.
 */
export const betalningarHero = {
  overline: 'BETALNINGAR',
  title: 'Ta betalt och se varje betalning',
  lead: 'Ta betalt med kort i din butik, via betalningslänk, faktura eller prenumeration – och se alla betalningar på ett ställe.',
  body: 'Pengarna går till ditt eget Stripe-konto.',
  primary: { label: 'Kom igång', href: '/kontakt' } satisfies ServiceCta,
  back: { label: 'Tillbaka till tjänster', href: '/tjanster' } satisfies ServiceCta,
};

/*
 * Fotosektionerna. En sektion renderas när dess `image` finns (ServiceImage från
 * scripts/tjanster-bilder.mjs, sidan betalningar), annars ingenting.
 *
 *   kort     – Kortbetalningar till ditt eget konto (ServiceFullBleed med kort): kvinnan på
 *              bryggan med telefonen (betalningar-b, beskuren utan båtnumret – se
 *              scripts/tjanster-bilder/betalningar.mjs). Kortet ligger på bryggan nere till
 *              vänster, under texten och fritt från ansikte och händer.
 *   fakturor – Fakturor (StickySteps): mannen vid datorn på stugverandan, datorn strikt från
 *              sidan (betalningar-a2). Stegkorten ligger nere till vänster i bildrutan, över
 *              ryggen och filten, fritt från ansikte och händer.
 *
 * Den första bilden till fakturor (betalningar-a) kasserades: datorlocket visar en tydlig
 * logotyp intill händerna (x 38,1–39,4 %, y 57,8–62,1 % i 16:9), som inget stegkort kan täcka.
 *
 * Bild 3 (Hemsidan) byggs inte: sektionen hör till hosting, som är borttaget.
 */
export const betalningarImages: Record<'kort' | 'fakturor', ServiceImage | null> = {
  kort: {
    base: '/tjanster/betalningar/betalningar-kort',
    alt: 'En kvinna i ljus kappa sitter på en träbrygga i kvällssol och ler mot sin telefon, med båtar på vattnet bakom sig.',
    widths: [640, 1024, 1536],
    portraitWidths: [480, 720],
    focus: '28% 50%',
    portraitFocus: '50% 50%',
  },
  fakturor: {
    base: '/tjanster/betalningar/betalningar-fakturor',
    alt: 'En man i stickad tröja sitter på en stugveranda och skriver på en bärbar dator, med en kaffemugg på bordet och skog bakom sig.',
    widths: [640, 1024, 1536, 2048],
    portraitWidths: [480, 720],
    focus: '20% 50%',
    portraitFocus: '50% 50%',
  },
};

/*
 * Fotosektion 1 – Kortbetalningar till ditt eget konto. Renderas när betalningarImages.kort
 * finns. Belägg: kort i kassan (storefrontCheckoutService.js:2327), direkt på det anslutna
 * kontot (:2452-2455), Stripe-anslutningen i alla paket (server.js:3307-3316), ingen
 * plattformsavgift (services/sourceStripeContext.js:15). Kassans utseende: Growth
 * (config/packageTiers.js:80, 168).
 */
export const betalningarKort = {
  id: 'kortbetalningar',
  eyebrow: 'KORTBETALNINGAR',
  title: 'Kortbetalningar till ditt eget konto',
  // Avgifter nämns inte på sidan (beslut), så meningen om att Source inte tar någon avgift är borttagen.
  body: [
    'Koppla ditt eget Stripe-konto, så tar din butik betalt med kort och pengarna går till ditt konto.',
    'Ingår i alla paket. Kassan i ditt utseende ingår i Growth och Enterprise.',
  ],
  // Procent av bilden: på bryggplankorna nere till vänster (landskap), nedtill över kappan och
  // bryggan (porträtt). Ansiktet ligger kring x 45–54 %, y 16–31 % och händerna med telefonen
  // kring x 56–64 %, y 30–51 % i den beskurna bilden.
  cardAnchor: { x: 22, y: 76 } satisfies CardAnchor,
  cardAnchorPortrait: { x: 50, y: 84 } satisfies CardAnchor,
  card: {
    label: 'Exempel: en kortbetalning har kommit in',
    title: 'Betalning mottagen',
    status: 'Betald',
    orderLine: 'Startpaket · Order 1024',
    amount: 450,
    method: 'Kort · till ditt Stripe-konto',
  } satisfies PaymentReceivedCardContent,
};

/*
 * Fotosektion 2 – Fakturor som går att betala med en länk. Renderas när
 * betalningarImages.fakturor finns. Belägg: skapa faktura (routes/tenantInvoiceRoutes.js:487),
 * utfärdas via Stripe med send_invoice (services/invoiceService.js:496-536), mejl med PDF
 * (services/invoiceEmailService.js:1-16, tenantInvoiceRoutes.js:762-811), betalningslänk på
 * öppen faktura (:1025-1100), markera betald (:915-924). Fortnox och Spiris: Growth.
 * Påminnelser nämns inte – de är avstängda som standard (cron/invoiceReminderCron.js:44-48).
 */
export const betalningarFakturor = {
  id: 'fakturor',
  eyebrow: 'FAKTUROR',
  title: 'Fakturor som går att betala med en länk',
  intro: 'Ingår i alla paket. Fakturor via Fortnox eller Spiris ingår i Growth och Enterprise.',
  steps: [
    { title: 'Skapa fakturan', body: 'Lägg till kund, rader och förfallodag. Momsen räknas per rad.' },
    { title: 'Skicka med PDF', body: 'Fakturan mejlas till kunden med PDF, och kunden kan betala via en länk.' },
    { title: 'Se när den är betald', body: 'Betalar kunden på annat sätt markerar du fakturan som betald.' },
  ],
  // Kompakta stegkort (tre rader): ett helt fakturadokument blir så högt att det når mannens
  // ansikte i bildrutan.
  create: {
    title: 'Ny faktura',
    rows: [
      { label: 'Kund', value: 'Exempel AB' },
      { label: 'Rad', value: 'Startpaket' },
      { label: 'Förfaller', value: '30 okt' },
    ],
  } satisfies SettingsCardContent,
  sent: {
    title: 'Faktura 1024',
    rows: [
      { label: 'Skickad till', value: 'Exempel AB' },
      { label: 'Bilaga', value: 'PDF' },
      { label: 'Betala via', value: 'Betalningslänk' },
    ],
  } satisfies SettingsCardContent,
  paid: {
    title: 'Faktura 1024',
    recipient: 'Exempel AB',
    status: { unpaid: 'Obetald', paid: 'Betald' },
    link: 'Betalningslänk',
    markPaid: 'Markera som betald',
  } satisfies InvoicePaidCardContent,
};

/*
 * Sektion 4 – Prenumerationer. Belägg: produkt av typen prenumeration med intervall dag,
 * vecka, månad eller år (models/Product.js:279-295), i kassan via Stripe Billing med kort
 * (storefrontCheckoutService.js:847-851, 2323-2329), pausa, återuppta och avsluta vid
 * periodens slut (routes/adminTenantCustomerActions.js:417-1174). Alla paket.
 */
export const betalningarPrenumeration = {
  id: 'prenumerationer',
  eyebrow: 'PRENUMERATIONER',
  title: 'Sälj det du erbjuder som prenumeration',
  body: [
    'Välj om kunden ska betala per vecka, månad eller år. Kunden betalar med kort och dragningen sker automatiskt.',
    'Du kan pausa, återuppta eller avsluta en prenumeration vid periodens slut.',
  ],
  packageNote: 'Ingår i alla paket.',
  label: 'Exempel: en prenumeration skapas och en kunds prenumeration pausas',
  demo: {
    title: 'Prenumeration',
    status: { idle: 'Utkast', done: 'Sparad' },
    product: { label: 'Produkt', value: 'Månadsleverans' },
    intervalLabel: 'Betalas',
    intervals: ['Vecka', 'Månad', 'År'],
    selected: 'Månad',
    method: { label: 'Betalsätt', value: 'Kort' },
    save: 'Spara',
    listTitle: 'Prenumeranter',
    customer: 'Robin Ek',
    active: 'Aktiv',
    paused: 'Pausad',
    actions: ['Pausa', 'Återuppta', 'Avsluta vid periodens slut'],
  } satisfies SubscriptionDemoContent,
};

/*
 * Sektion 5 – Alla betalningar och återbetalningar. Belägg: periodval och lista
 * (public/betalningar-layout2.html:308-397, public/all-payments-layout2.html:338-373),
 * återbetalning av hela eller valda rader (routes/payments.js:2065, 344-401,
 * public/payment-details-layout2.html:651-731), kvitto som PDF per betalning
 * (routes/payments.js:2615). Alla paket. Export av listan nämns inte (kommer snart,
 * public/js/all-payments.js:514-517), inte heller beloppsgränsen för godkännande.
 */
export const betalningarOversikt = {
  id: 'alla-betalningar',
  eyebrow: 'ÖVERSIKT',
  title: 'Alla betalningar på ett ställe',
  body: [
    'Se dina betalningar per dag, vecka eller månad, sök fram en betalning och betala tillbaka hela eller delar av den.',
    'Ladda ner ett kvitto för varje betalning.',
  ],
  packageNote: 'Ingår i alla paket.',
  label: 'Exempel: en betalning väljs och en av två rader betalas tillbaka',
  demo: {
    title: 'Betalningar',
    periods: ['Idag', 'Vecka', 'Månad'],
    selectedPeriod: 'Vecka',
    rows: [
      { id: 'p1', customer: 'Robin Ek', amount: 450, status: 'Lyckad' },
      { id: 'p2', customer: 'Exempel AB', amount: 1200, status: 'Lyckad' },
      { id: 'p3', customer: 'Kim Berg', amount: 300, status: 'Lyckad' },
    ],
    receipt: 'Kvitto',
    refund: {
      title: 'Återbetala',
      lines: [
        { label: 'Startpaket', amount: 300, checked: true },
        { label: 'Tillägg', amount: 150, checked: false },
      ],
      button: 'Återbetala valda rader',
      done: 'Delvis återbetald',
    },
  } satisfies PaymentsRefundDemoContent,
};

/*
 * Sektion 6 – Mer för växande företag. Paketet står i varje korts text. Belägg:
 *   presentkort i kassan och inlösen – storefrontCheckoutService.js:807-817, 1135-1274,
 *     config/packageTiers.js:198-200
 *   offerter – routes/offerRoutes.js:479, 565, 662, server.js:3471
 *   utbetalningsrapporter – routes/payoutReports.js:11, 166, 273, server.js:3363
 *   kassan i ditt utseende – config/packageTiers.js:80, 168
 *   fakturor via Fortnox eller Spiris – tenantInvoiceRoutes.js:553-657
 *   betalning vid bokning – models/BookingSettings.js:127-135, routes/bookingSystem.js:5336
 */
export const betalningarMer: { id: string; eyebrow: string; title: string; items: FeatureItem[] } = {
  id: 'mer-betalningar',
  eyebrow: 'GROWTH OCH ENTERPRISE',
  title: 'Mer för växande företag',
  items: [
    { icon: GiftIcon, title: 'Presentkort', body: 'Sälj presentkort i kassan och låt kunderna lösa in dem när de handlar. Ingår i Growth och Enterprise.' },
    { icon: DocumentTextIcon, title: 'Offerter', body: 'När en offert är accepterad kan kunden betala via kassan eller en betalningslänk, eller så gör du om den till en faktura. Ingår i Growth och Enterprise.' },
    { icon: ArrowDownTrayIcon, title: 'Utbetalningsrapporter', body: 'Se utbetalningarna från Stripe till ditt konto och exportera rapporterna. Ingår i Growth och Enterprise.' },
    { icon: PaintBrushIcon, title: 'Kassan i ditt utseende', body: 'Ge kassan samma utseende som resten av din butik. Ingår i Growth och Enterprise.' },
    { icon: ReceiptPercentIcon, title: 'Fakturor via Fortnox eller Spiris', body: 'Skapa fakturorna i ditt bokföringsprogram när det är kopplat. Ingår i Growth och Enterprise.' },
    { icon: CalendarDaysIcon, title: 'Betalning vid bokning', body: 'Ta betalt eller en handpenning med kort när kunden bokar. Ingår i Growth och Enterprise.' },
  ],
};

/*
 * Sektion 8 – Avslut. Samma paket som på /priser (lib/data/pricing-features.ts) och som
 * belägg ovan. Sektion 7 (Hemsidan) byggs inte – hosting är borttaget från sidan.
 */
export const betalningarAvslut = {
  id: 'betalningar-i-paketen',
  eyebrow: 'PAKET',
  title: 'Vad som ingår i ditt paket',
  body: ['Vilka betalningsfunktioner som ingår beror på paket. Här ser du vad som ingår i vilket.'],
  list: {
    label: 'Betalningsfunktionerna och paketen de ingår i',
    title: 'Betalningar i Source',
    rows: [
      { id: 'kort', name: 'Kortbetalningar i kassan', plans: 'Alla paket' },
      { id: 'stripe', name: 'Koppla ditt Stripe-konto', plans: 'Alla paket' },
      { id: 'lank', name: 'Betalningslänkar', plans: 'Alla paket' },
      { id: 'fakturor', name: 'Fakturor med betalningslänk', plans: 'Alla paket' },
      { id: 'prenumerationer', name: 'Prenumerationer', plans: 'Alla paket' },
      { id: 'aterbetalning', name: 'Återbetalningar och kvitton', plans: 'Alla paket' },
      { id: 'presentkort', name: 'Presentkort', plans: 'Growth och Enterprise' },
      { id: 'offerter', name: 'Offerter', plans: 'Growth och Enterprise' },
      { id: 'utbetalningar', name: 'Utbetalningsrapporter', plans: 'Growth och Enterprise' },
      { id: 'utseende', name: 'Kassan i ditt utseende', plans: 'Growth och Enterprise' },
    ],
  } satisfies PackageListContent,
  primary: { label: 'Se priser', href: '/priser' } satisfies ServiceCta,
  secondary: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
};

/*
 * Innehåll för /bokningssystem.
 *
 * Plan: ~/cc-rapporter/bokningssystem-plan.md, med Valentins beslut: heron rättas om
 * automatiserade betalningar, "byggt för alla branscher" står kvar. Belägg i kundportalen
 * (northlab-io/source.database, origin/develop b25b58c1) per block.
 *
 * Paket: bokningssystemet ingår i Growth och Enterprise (config/packageTiers.js:112, 163,
 * server.js:3559-3568), bokningsstatistiken bara i Enterprise (server.js:3197).
 *
 * Nämns inte: påminnelser, väntelista, kalendersynk, SMS, inbäddningsbar widget, notis om
 * nya bokningar, veckovy, manuella mejl från en bokning, statistik utanför Enterprise.
 * Inga branschexempel, inga procentsatser, inga påhittade resultat. Belopp i widgetarna
 * är exempelpriser hos ett påhittat företag.
 */
import {
  ArrowRightEndOnRectangleIcon,
  BellAlertIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  MapIcon,
  NoSymbolIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import type { CardAnchor, FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type { BookingWidgetContent } from '@/components/sections/for-dig/interactive/BookingWidget';
import type { ServiceBookingContent } from '@/components/sections/for-dig/product-widgets/content';
import type { PackageListContent } from '@/components/sections/tjanster/widgets/AiAssistantDemos';
import type {
  BookingEmailCardContent,
  BookingPaymentDemoContent,
  DayTimelineDemoContent,
  SettingsCardContent,
} from '@/components/sections/tjanster/widgets/BookingDemos';

export const BOOKING_CURRENCY = 'SEK';
export const BOOKING_LOCALE = 'sv-SE';

/*
 * Heron. Layout och video är orörda. Rubriken står kvar (beslut). Brödtexten är rättad:
 * betalning vid bokning är avstängd som standard (models/BookingSettings.js:127-128) och
 * påminnelser skickas inte, så "automatisera betalningar och flöden" är borttaget.
 * Kunden bokar via hemsidan (routes/bookingSystem.js:3151-4229), med tjänster, tider,
 * personal och resurser (2.1-2.3 i planen).
 */
export const bokningHero = {
  overline: 'Bokningssystem',
  title: 'Ett bokningssystem byggt för alla branscher',
  body: 'Låt kunderna boka på din hemsida, med dina tjänster, tider, personal och resurser – och ta betalt vid bokningen om du vill.',
};

/*
 * Fotosektionerna. Bilderna läggs in i nästa pass – fyll i `image` (ServiceImage från
 * scripts/tjanster-bilder.mjs) så renderas sektionen, utan annan ändring. Så länge `image`
 * är null renderas ingenting. Briefen för varje bild står i planens punkt 4.2 och i
 * ~/cc-rapporter/betalningar-bokning-bygge-1.md.
 *
 *   tjanster – bild 1, Tjänster och tider (ServiceFullBleed med kort). Kortet landar på
 *              ytterväggens träpanel, i högra tredjedelen.
 *   personal – bild 2, bakgrund till Personal, scheman och resurser (StickySteps).
 *              Stegkorten landar på golvets öppna yta i nedre halvan.
 *   mejl     – bild 3, Mejl till kunden och avbokning (ServiceFullBleed med kort). Kortet
 *              landar i himlen, till vänster om personen.
 */
export const bokningImages: Record<'tjanster' | 'personal' | 'mejl', ServiceImage | null> = {
  tjanster: null,
  personal: null,
  mejl: null,
};

/*
 * Fotosektion 1 – Tjänster och tider. Renderas när bokningImages.tjanster finns. Belägg:
 * tjänster med längd och pris från kopplad produkt (models/Service.js:8-29), öppettider,
 * intervall och stängda perioder (models/BookingSettings.js:104-108, 170-180), bara lediga
 * tider visas (routes/bookingSystem.js:3446).
 */
export const bokningTjanster = {
  id: 'tjanster-och-tider',
  eyebrow: 'TJÄNSTER OCH TIDER',
  title: 'Dina tjänster, dina tider',
  body: [
    'Lägg upp det du erbjuder med längd och pris, sätt öppettider och intervall och stäng dagar när du behöver. Kunden ser bara tider som går att boka.',
    'Ingår i Growth och Enterprise.',
  ],
  // Ankare att justera mot bilden i nästa pass: på träpanelen, högra tredjedelen.
  cardAnchor: { x: 76, y: 50 } satisfies CardAnchor,
  cardAnchorPortrait: { x: 50, y: 78 } satisfies CardAnchor,
  card: {
    name: 'Möte',
    details: '60 min',
    price: 600,
    timesHeading: 'Välj tid',
    times: [
      { id: 't0900', label: '09:00' },
      { id: 't1100', label: '11:00' },
      { id: 't1400', label: '14:00' },
    ],
    defaultTimeId: 't1100',
    bookLabel: 'Boka',
  } satisfies ServiceBookingContent,
  cardLabel: 'Exempel: en tjänst med tre lediga tider',
};

/*
 * Sektion 2 – Kunden bokar på din hemsida. BookingWidget från #129 (oförändrad), med egen
 * neutral data. Belägg: stegen Tjänst, Utförare, Tid, Uppgifter (public/booking-layout2.html:
 * 5943-5960), publikt API (routes/bookingSystem.js:3151-4229), betalning med kort
 * (bookingSystem.js:5336), bekräftelse med avbokningslänk (services/mailService.js:404-427,
 * routes/bookingCancelPublic.js:76-193), designfliken (public/js/bokningsdesign.js:85-119,
 * models/BookingPresentation.js:38-84). Procentsatser är bytta mot ord.
 */
export const bokningHemsida = {
  id: 'boka-pa-hemsidan',
  eyebrow: 'PÅ DIN HEMSIDA',
  title: 'Kunden bokar på din hemsida',
  body: [
    'Kunden väljer tjänst, utförare och tid på din hemsida, fyller i sina uppgifter och får en bekräftelse med en länk för att avboka. Du väljer hur bokningen ska se ut.',
  ],
  packageNote: 'Ingår i Growth och Enterprise.',
  widget: {
    label: 'Exempel: en kund bokar en tid, och inställningarna bakom bokningen',
    tabs: { label: 'Visa', customer: 'Kundens vy', settings: 'Din konfiguration' },
    steps: ['Tjänst', 'Utförare', 'Tid', 'Uppgifter', 'Betalning', 'Bekräftelse'],
    stepOf: 'Steg {n} av {total}',
    services: {
      heading: 'Välj tjänst',
      minutesLabel: 'min',
      selectedId: 's2',
      items: [
        { id: 's1', name: 'Kort samtal', minutes: 30, price: 300 },
        { id: 's2', name: 'Möte', minutes: 60, price: 600 },
        { id: 's3', name: 'Halvdag', minutes: 240, price: 2000 },
      ],
    },
    staff: { heading: 'Välj utförare', options: ['Valfri', 'Alex', 'Sam'], selected: 'Valfri' },
    time: {
      heading: 'Välj tid',
      month: 'Oktober',
      weekdays: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
      offset: 3,
      // 1 okt 2026 är en torsdag. Helger är stängda, den 16:e är ett stängt datum.
      days: [
        'free', 'free', 'closed', 'closed',
        'few', 'free', 'free', 'full', 'free', 'closed', 'closed',
        'free', 'free', 'few', 'free', 'closed', 'closed', 'closed',
        'free', 'few', 'free', 'free', 'free', 'closed', 'closed',
        'free', 'free', 'free', 'few', 'free', 'closed',
      ],
      selectedDay: 22,
      legend: { free: 'Lediga', few: 'Få platser kvar', full: 'Fullbokat', closed: 'Stängt' },
      slotsHeading: 'Torsdag 22 oktober',
      slots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
      selectedSlot: '10:00',
    },
    details: {
      heading: 'Dina uppgifter',
      fields: [
        { label: 'Namn', value: 'Robin Ek' },
        { label: 'E-post', value: 'robin@exempel.se' },
        { label: 'Telefon', value: '070-000 00 00' },
        { label: 'Meddelande', value: 'Vi ses på plats.' },
      ],
      links: 'Genom att boka godkänner du villkoren och integritetspolicyn.',
    },
    payment: {
      heading: 'Betalning',
      rows: [
        { label: 'Tjänst', value: 'Möte, 60 min' },
        { label: 'Tid', value: 'Tor 22 okt kl. 10:00' },
        { label: 'Utförare', value: 'Valfri' },
        { label: 'Pris', value: '600 kr' },
      ],
      deposit: { label: 'Handpenning', amount: 200 },
      payLabel: 'Betala {amount} med kort',
    },
    done: {
      title: 'Bokningen är bekräftad',
      summary: 'Möte, torsdag 22 oktober kl. 10:00. Handpenningen är betald.',
      email: {
        title: 'Bokningsbekräftelse',
        from: 'Från: Ditt företag',
        text: 'Hej Robin! Din bokning av Möte torsdag 22 oktober kl. 10:00 är bekräftad.',
        cancelLink: 'Avboka bokningen',
      },
    },
    settings: [
      {
        id: 'tjanster',
        title: 'Tjänster',
        rows: [
          { label: 'Kort samtal', value: '30 min · 300 kr' },
          { label: 'Möte', value: '60 min · 600 kr' },
          { label: 'Halvdag', value: '4 h · 2 000 kr' },
        ],
      },
      {
        id: 'personal',
        title: 'Personal och resurser',
        rows: [
          { label: 'Alex', value: 'Mån–fre 08–17' },
          { label: 'Rast', value: '12:00–13:00' },
          { label: 'Rum 1', value: 'Resurs, 4 platser' },
        ],
      },
      {
        id: 'oppettider',
        title: 'Öppettider och stängda datum',
        rows: [
          { label: 'Mån–fre', value: '08:00–17:00' },
          { label: 'Lör–sön', value: 'Stängt' },
          { label: 'Stängt datum', value: '16 okt' },
        ],
      },
      {
        id: 'buffert',
        title: 'Bufferttider',
        rows: [
          { label: 'Före varje bokning', value: '0 min' },
          { label: 'Efter varje bokning', value: '15 min' },
          { label: 'Mellan bokningar', value: '0 min' },
        ],
      },
      {
        id: 'betalning',
        title: 'Betalning',
        rows: [
          { label: 'Betalning för bokningar', value: 'På', on: true },
          { label: 'Betalningstyp', value: 'Handpenning' },
          { label: 'Betalning innan bekräftelse', value: 'Krävs', on: true },
          { label: 'Betalsätt', value: 'Kort' },
        ],
      },
      {
        id: 'avbokning',
        title: 'Avbokningsregler',
        rows: [
          { label: 'Kunden kan avboka', value: 'På', on: true },
          { label: 'Senast', value: '24 h före' },
          { label: 'Återbetalning', value: 'Hela beloppet' },
        ],
      },
      {
        id: 'granser',
        title: 'Bokningsgränser',
        rows: [
          { label: 'Boka högst', value: '90 dagar framåt' },
          { label: 'Boka senast', value: '2 h före' },
        ],
      },
      {
        id: 'mejl',
        title: 'Mejl till kunden',
        rows: [
          { label: 'Bokningsbekräftelse', value: 'På', on: true },
          { label: 'Avbokningsbekräftelse', value: 'På', on: true },
          { label: 'Ombokningsbekräftelse', value: 'På', on: true },
        ],
      },
      {
        id: 'design',
        title: 'Utseende på din webbplats',
        rows: [
          { label: 'Onlinebokningar', value: 'På', on: true },
          { label: 'Grundvy', value: 'Kalender' },
          { label: 'Uppdelning', value: 'Ett steg i taget' },
          { label: 'Tema', value: 'Ljust' },
        ],
      },
    ],
  } satisfies BookingWidgetContent,
};

/*
 * Fotosektion 2 – Personal, scheman och resurser. Renderas när bokningImages.personal finns.
 * Belägg: arbetstider, raster och frånvaro (models/Provider.js:14-31), resurser med
 * kapacitet (models/BookingResource.js:6-12), tidslinjer med tilldelad personal och
 * resurser (models/BookingSettings.js:170-180), skydd mot dubbelbokning.
 */
export const bokningPersonal = {
  id: 'personal-och-resurser',
  eyebrow: 'PERSONAL OCH RESURSER',
  title: 'Personal, scheman och resurser',
  intro: 'Systemet visar bara lediga tider och skyddar mot dubbelbokning. Ingår i Growth och Enterprise.',
  steps: [
    { title: 'Arbetstider', body: 'Lägg in vem som jobbar när, med raster.' },
    { title: 'Frånvaro', body: 'Markera semester, sjukdom eller utbildning, så försvinner tiderna.' },
    { title: 'Resurser', body: 'Lägg in rum, platser eller utrustning med kapacitet, så hamnar bokningen på en ledig resurs.' },
  ],
  hours: {
    title: 'Arbetstider · Alex',
    rows: [
      { label: 'Mån–tor', value: '08:00–17:00' },
      { label: 'Fre', value: '08:00–15:00' },
      { label: 'Rast', value: '12:00–13:00' },
    ],
  } satisfies SettingsCardContent,
  absence: {
    title: 'Frånvaro · Alex',
    rows: [
      { label: '2–6 nov', value: 'Semester' },
      { label: '29 okt', value: 'Utbildning' },
    ],
  } satisfies SettingsCardContent,
  resources: {
    title: 'Resurser',
    rows: [
      { label: 'Rum 1', value: '4 platser' },
      { label: 'Rum 2', value: '8 platser' },
      { label: 'Utrustning', value: '1 st' },
    ],
  } satisfies SettingsCardContent,
};

/*
 * Sektion 4 – Dagen i portalen. Belägg: dagvy med tidslinje (public/booking-layout2.html,
 * timelineHoursToShow i models/BookingSettings.js:119), godkänn och neka
 * (routes/bookingSystem.js:2695, 2754), incheckning (:2865), statusar
 * (agent/tools/ekonomi-drift/bookingsList.js:29), ny bokning från portalen (:1229).
 * Ingen veckovy, inget om realtid.
 */
export const bokningDagen = {
  id: 'dagen-i-portalen',
  eyebrow: 'DAGVY',
  title: 'Dagen i portalen',
  body: [
    'Se dagens bokningar på en tidslinje, godkänn eller neka förfrågningar, checka in den som kommer och lägg till en bokning direkt.',
  ],
  packageNote: 'Ingår i Growth och Enterprise.',
  label: 'Exempel: en förfrågan godkänns och en kund checkas in på dagens tidslinje',
  demo: {
    title: 'Torsdag 22 oktober',
    hours: ['08', '10', '12', '14', '16'],
    bookings: [
      { id: 'b1', time: '10:00', name: 'Robin Ek', service: 'Möte', start: 0.2, length: 0.1, from: 'Bekräftad', to: 'Ankommen', action: 'checkIn' },
      { id: 'b2', time: '13:00', name: 'Exempel AB', service: 'Halvdag', start: 0.5, length: 0.4, from: 'Väntar', to: 'Bekräftad', action: 'approve' },
      { id: 'b3', time: '11:00', name: 'Kim Berg', service: 'Kort samtal', start: 0.3, length: 0.05, from: 'Bekräftad', to: 'Bekräftad' },
    ],
    approve: 'Godkänn',
    checkIn: 'Checka in',
    add: 'Ny bokning',
  } satisfies DayTimelineDemoContent,
};

/*
 * Fotosektion 3 – Mejl till kunden och avbokning. Renderas när bokningImages.mejl finns.
 * Belägg: bekräftelse-, avboknings- och ombokningsmejl med reglage
 * (services/mailService.js:277, public/epost-layout2.html:536-647), avbokningslänk
 * (routes/bookingCancelPublic.js), tidsgräns 24 h som standard och andel som betalas
 * tillbaka (models/BookingPolicy.js:7-12). Egen avsändardomän: Growth
 * (services/senderDomainService.js). Inga påminnelser, inga SMS.
 */
export const bokningMejl = {
  id: 'mejl-och-avbokning',
  eyebrow: 'MEJL OCH AVBOKNING',
  title: 'Bekräftelse och avbokning på dina villkor',
  body: [
    'Kunden får en bekräftelse när bokningen är klar och mejl om den bokas om eller avbokas. Du bestämmer hur sent kunden får avboka själv och hur mycket som betalas tillbaka.',
    'Ingår i Growth och Enterprise, med mejl från din egen domän.',
  ],
  // Ankare att justera mot bilden i nästa pass: i himlen, till vänster om personen.
  cardAnchor: { x: 30, y: 30 } satisfies CardAnchor,
  cardAnchorPortrait: { x: 50, y: 78 } satisfies CardAnchor,
  cardLabel: 'Exempel: en bokningsbekräftelse med avbokningslänk',
  email: {
    title: 'Bokningsbekräftelse',
    from: 'Från: Ditt företag',
    text: 'Hej Robin! Din bokning av Möte torsdag 22 oktober kl. 10:00 är bekräftad.',
    cancelLink: 'Avboka bokningen',
    policy: 'Avbokning senast 24 timmar innan.',
  } satisfies BookingEmailCardContent,
};

/*
 * Sektion 6 – Betalning vid bokning. Belägg: paymentSettings avstängt som standard, typerna
 * ingen, handpenning och full betalning (models/BookingSettings.js:127-135), Stripe Checkout
 * med kort (routes/bookingSystem.js:5336), bokningen bekräftas när betalningen är klar
 * (routes/stripePaymentWebhook.js:1681-1692), återbetalning enligt policyn
 * (models/BookingPolicy.js:11).
 */
export const bokningBetalning = {
  id: 'betalning-vid-bokning',
  eyebrow: 'BETALNING',
  title: 'Ta betalt när kunden bokar',
  body: [
    'Välj om kunden ska betala hela beloppet eller en handpenning när bokningen görs. Bokningen bekräftas när betalningen är klar, och vid avbokning betalas pengarna tillbaka enligt dina regler.',
  ],
  packageNote: 'Ingår i Growth och Enterprise. Slås på i inställningarna.',
  label: 'Exempel: betalning vid bokning slås på och en bokning bekräftas efter kortbetalning',
  demo: {
    title: 'Betalning vid bokning',
    toggle: 'Betalning för bokningar',
    typeLabel: 'Betalningstyp',
    types: ['Ingen', 'Handpenning', 'Full betalning'],
    selected: 'Handpenning',
    method: { label: 'Betalsätt', value: 'Kort' },
    booking: { name: 'Robin Ek', service: 'Möte, tor 22 okt 10:00' },
    paid: 'Betald med kort',
    status: { idle: 'Väntar', done: 'Bekräftad' },
  } satisfies BookingPaymentDemoContent,
};

/*
 * Sektion 7 – Mer i bokningssystemet, med statistiken som Enterprise. Belägg per kort:
 *   godkänn bokningar – routes/bookingSystem.js:2695, 2754
 *   incheckning och drop-in – bookingSystem.js:2865, 1229
 *   värdvy med planritning – bookingSystem.js:2806, 6458-7002
 *   utebliven bokning – bookingSystem.js:2923, 3033, models/BookingPolicy.js:30-32
 *   bokningsgränser – models/BookingPolicy.js:15-27
 *   notis vid godkännande och avbokning – models/Notification.js:31,
 *     services/notificationDispatchService.js:83-84
 *   statistik – server.js:3197, config/statisticsModules.js:56, public/js/statistics.js:1238-1243
 */
export const bokningMer: { id: string; eyebrow: string; title: string; items: FeatureItem[] } = {
  id: 'mer-bokning',
  eyebrow: 'I PORTALEN',
  title: 'Mer i bokningssystemet',
  items: [
    { icon: CheckBadgeIcon, title: 'Godkänn bokningar', body: 'Låt vissa bokningar vänta på ditt godkännande innan de bekräftas. Ingår i Growth och Enterprise.' },
    { icon: ArrowRightEndOnRectangleIcon, title: 'Incheckning och drop-in', body: 'Checka in den som kommer och lägg till en bokning på plats. Ingår i Growth och Enterprise.' },
    { icon: MapIcon, title: 'Värdvy med planritning', body: 'Se rum och platser på en planritning och vilka som är bokade. Ingår i Growth och Enterprise.' },
    { icon: NoSymbolIcon, title: 'Utebliven bokning', body: 'Markera en bokning som utebliven och behåll en avgift enligt dina regler. Ingår i Growth och Enterprise.' },
    { icon: UserPlusIcon, title: 'Bokningsgränser', body: 'Bestäm hur långt fram och hur sent kunden får boka, och hur många bokningar en kund får ha. Ingår i Growth och Enterprise.' },
    { icon: BellAlertIcon, title: 'Notis när det behövs', body: 'Få en notis när en bokning väntar på godkännande eller när en kund avbokar. Ingår i Growth och Enterprise.' },
    { icon: ChartBarIcon, title: 'Statistik för bokningar', body: 'Följ bokningar, genomförda besök, avbokningar och uteblivna bokningar över tid. Ingår i Enterprise.' },
  ],
};

/*
 * Sektion 8 – Avslut. Samma paket som på /priser (lib/data/pricing-features.ts:52 Bokningar
 * i Growth, :122 Statistik i Enterprise).
 */
export const bokningAvslut = {
  id: 'bokning-i-paketen',
  eyebrow: 'PAKET',
  title: 'Vad som ingår i ditt paket',
  body: ['Bokningssystemet ingår i Growth och Enterprise. Statistiken för bokningar ingår i Enterprise.'],
  list: {
    label: 'Bokningsfunktionerna och paketen de ingår i',
    title: 'Bokningar i Source',
    rows: [
      { id: 'tjanster', name: 'Tjänster, öppettider och regler', plans: 'Growth och Enterprise' },
      { id: 'personal', name: 'Personal och resurser', plans: 'Growth och Enterprise' },
      { id: 'hemsida', name: 'Bokning på din hemsida', plans: 'Growth och Enterprise' },
      { id: 'mejl', name: 'Bekräftelse och avbokning via mejl', plans: 'Growth och Enterprise' },
      { id: 'betalning', name: 'Betalning vid bokning', plans: 'Growth och Enterprise' },
      { id: 'design', name: 'Utseende med förhandsvisning', plans: 'Growth och Enterprise' },
      { id: 'statistik', name: 'Statistik för bokningar', plans: 'Enterprise' },
    ],
  } satisfies PackageListContent,
  primary: { label: 'Se priser', href: '/priser' } satisfies ServiceCta,
  secondary: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
};

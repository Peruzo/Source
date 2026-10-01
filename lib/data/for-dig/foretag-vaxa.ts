/*
 * Innehåll för /foretag-vaxande (Företag Växa, paketet för företag som redan säljer).
 *
 * Varje påstående ska finnas i kundportalens kod – belägg per sektion nedan och
 * i ~/cc-rapporter/foretag-start-bygge-4.md, punkt 2.1 (northlab-io/source.database).
 * Skriv inga resultat, inga paketnamn, inga priser på Source och inga
 * användarantal. Bara PostNord som fraktbolag, frakt bokas (aldrig
 * "automatiskt"), ingen export av rapporter och inga funktioner som är
 * markerade som på väg. Exempeldata i widgetarna är fiktiv och branschneutral:
 * den visar hur gränssnittet ser ut, inte vad en kund uppnår, och beloppen är
 * kundens egna priser, aldrig våra.
 */
import {
  BanknotesIcon,
  ChartBarIcon,
  EyeIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { GettingStartedStep } from '@/components/sections/for-dig/GettingStartedSection';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';
import type { OfferWidgetContent } from '@/components/sections/for-dig/interactive/OfferWidget';
import type { LeadsWidgetContent } from '@/components/sections/for-dig/interactive/LeadsWidget';
import type { CheckoutWidgetContent } from '@/components/sections/for-dig/interactive/CheckoutWidget';
import type { CustomersWidgetContent } from '@/components/sections/for-dig/interactive/CustomersWidget';
import type { BookingWidgetContent } from '@/components/sections/for-dig/interactive/BookingWidget';

/** One status row: a title and a short line under it. */
export type StatusRowContent = { title: string; note: string };

/** Floating card over a photo: one value, at most one pill, one row. */
export type StatusCardContent = {
  label: string;
  value: string;
  pill?: string;
  row: StatusRowContent;
};

export type GiftCardContent = {
  title: string;
  code: { label: string; value: string };
};

export type ReviewCardContent = {
  title: string;
  /** Filled stars in the example, out of `outOf`. */
  stars: number;
  outOf: number;
  starsLabel: string;
  status: string;
};

const money = { currency: 'SEK', locale: 'sv-SE' } as const;
export const vaxaMoney = money;

/* Bilder – skapade med scripts/tjanster-bilder.mjs foretag-vaxa. */
const IMG = '/for-dig/foretag-vaxa/foretag-vaxa';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720];

export const vaxaImages = {
  // Öppen port till ett lager, en man drar en kärra med kartonger, en kvinna läser på en platta.
  // Fokus på dörröppningen: från 58 % fyller den fotorutan i StickySteps från kvinnan till kärran.
  frakt: {
    base: `${IMG}-frakt`,
    alt: 'En man drar en kärra med kartonger ut genom en öppen port, medan en kvinna läser på en surfplatta bredvid en vit skåpbil.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '58% 50%',
    portraitFocus: '50% 50%',
  },
  // Förare genom sidorutan, telefonhållare vid ratten och telefonen i handen. Ansiktet sitter till
  // höger, så textytan till vänster täcker det inte vid 1280–1440 (steg1-matning.json).
  bokforing: {
    base: `${IMG}-bokforing`,
    alt: 'En man sitter i sin bil i kvällsljus och ler mot telefonen i handen, med ena handen på ratten.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    // Bottom of the 3:4 file: gives the card under the hand 16 px more room on phones.
    portraitFocus: '50% 100%',
  },
  // Kvinna lutad över en köksö med en surfplatta, kaffe och nycklar på bänken, tom vit vägg till vänster.
  insikter: {
    base: `${IMG}-insikter`,
    alt: 'En kvinna lutar sig över en köksö och pekar på en surfplatta, med en kopp kaffe och nycklar bredvid.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 50%',
    // Top of the 3:4 file: moves her face 16 px down on phones, clear of the card on the wall above.
    portraitFocus: '50% 0%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * 1 – Frakt och returer. Belägg: logistiksidorna, ordrar, paketprofiler,
 * returer och PostNord-inställningar (config/packageTiers.js:71-77,
 * server.js:3031, 3168-3192), fraktbokning i PostNord-adaptern
 * (services/shipping/adapters/postnord.js:386) med returbokning och spårning.
 * Bara PostNord, och "boka frakt" – automatisk bokning kräver en flagga.
 */
export const vaxaFrakt = {
  id: 'frakt-och-returer',
  eyebrow: 'FRAKT & RETURER',
  // Short title and intro: at 1366 × 768 the pinned text column (header plus three steps) has to fit in
  // the frame, or the photo box grows past the bottom of the screen and cuts the row card.
  title: 'Frakt och returer',
  intro: 'Boka frakt med PostNord, följ paketet och ta emot returer – där ordern redan finns.',
  steps: [
    {
      title: 'Ordern kommer in',
      body: 'När kunden har betalat ligger ordern i portalen, redo att packas.',
      row: { title: 'Betald', note: 'Ny order' },
    },
    {
      title: 'Boka frakt med PostNord',
      body: 'Välj paketprofil och boka frakten från ordern, så kan kunden följa paketet på vägen.',
      row: { title: 'Frakt bokad med PostNord', note: 'Paketet kan spåras' },
    },
    {
      title: 'Ta emot returer',
      body: 'Registrera returen på samma ställe som ordern, så finns hela historiken samlad.',
      row: { title: 'Retur registrerad', note: 'Kopplad till ordern' },
    },
  ] satisfies { title: string; body: string; row: StatusRowContent }[],
};

/*
 * 2 – Offerter. Belägg: skapa, PDF, skicka, gör om till faktura och
 * betalningslänk (routes/offerRoutes.js:181, 280, 305, 478, 647), sidan är
 * spärrad till paketet (config/packageTiers.js:114, server.js:3388).
 * Widgeten (source.database origin/develop e7f702d6): PDF:ens rubrik, nummer,
 * datum och Giltig till (services/pdfTemplates.js:350-354), Från och Till med
 * org.nr och adress (:233-256), kolumnerna Beskrivning, Antal, À-pris, Moms och
 * Belopp (:368-369), Delsumma, Moms och Att betala (:228-230, 375-377).
 * Åtgärderna per status (public/offert-layout2.html:701-724): Redigera och Ta
 * bort för utkast, Skicka, PDF och Duplicera, Accepterad/Avböjd sätts av dig
 * på en skickad offert, Skapa faktura och Skapa betallänk på en accepterad.
 * Ingen godkännandesida för kunden och ingen e-signering.
 */
export const vaxaOfferter = {
  id: 'offerter',
  eyebrow: 'OFFERTER',
  title: 'Offerter som blir fakturor',
  body: [
    'Skicka en tydlig offert till kunden, som PDF eller direkt från portalen.',
    'När kunden säger ja gör du om offerten till en faktura eller en betalningslänk, utan att skriva in något igen.',
  ],
  offer: {
    label: 'Exempel: en offert som skickas, accepteras och kan göras om till faktura eller betallänk',
    documentTitle: 'Offert',
    sender: 'Ditt företag AB',
    number: { label: 'Offertnummer', value: '2026-031' },
    date: { label: 'Datum', value: '2026-11-02' },
    validUntil: { label: 'Giltig till', value: '2026-12-02' },
    from: {
      label: 'Från',
      name: 'Ditt företag AB',
      lines: ['Exempelgatan 1, 123 45 Småstad', 'Org.nr 559000-0000', 'Momsnr SE559000000001'],
    },
    to: {
      label: 'Till',
      name: 'Kund AB',
      lines: ['Kundvägen 2, 234 56 Exempelstad', 'Org.nr 556000-0000'],
    },
    columns: { description: 'Beskrivning', quantity: 'Antal', unitPrice: 'À-pris', vat: 'Moms', amount: 'Belopp' },
    lines: [
      { id: 'l1', description: 'Uppdrag enligt överenskommelse', quantity: 1, unitPrice: 18000, vatRate: 0.25 },
      { id: 'l2', description: 'Uppföljningsmöte', quantity: 2, unitPrice: 2250, vatRate: 0.25 },
      { id: 'l3', description: 'Material', quantity: 3, unitPrice: 400, vatRate: 0.25 },
    ],
    subtotalLabel: 'Delsumma',
    vatLabel: 'Moms',
    totalLabel: 'Att betala',
    statusLabel: 'Status',
    statuses: { draft: 'Utkast', sent: 'Skickad', accepted: 'Accepterad' },
    markAs: { accepted: 'Accepterad', declined: 'Avböjd' },
    actionsLabel: 'Åtgärder för offerten',
    actions: {
      edit: 'Redigera',
      pdf: 'Ladda ner PDF',
      send: 'Skicka till kund',
      duplicate: 'Duplicera',
      delete: 'Ta bort',
      invoice: 'Skapa faktura',
      paymentLink: 'Skapa betallänk',
    },
  } satisfies OfferWidgetContent,
};

/*
 * 2b – Leads, direkt efter offerterna. Belägg i kundportalen (northlab-io/source.database origin/develop 59816137,
 * ~/cc-rapporter/leads-recon.md): sidan och API:erna kräver paketet (config/packageTiers.js:85,
 * server.js:3279), kunden väljer branscher och orter (public/leads-layout2.html:522-559,
 * routes/leadsRoutes.js:326-478), förslagen hämtas från flera källor
 * (services/aiLeadGeneration.js:955-1088) och får betyg och motivering (models/Lead.js:29-34,
 * services/aiLeadGeneration.js:576-586), pitchanalys per lead (routes/leadsRoutes.js:1200,
 * services/leads/pitchAnalysisService.js), status från nytt lead till vunnen eller ingen affär
 * (routes/leadsRoutes.js:1042-1107, 1113-1158, public/leads-layout2.html:1398-1412), import och
 * export (routes/leadsRoutes.js:598-726). Statusorden och knappen är portalens egna.
 * Nämn inte källornas namn, schemaläggning, ifyllda kontaktuppgifter, tider, antal eller storlek.
 * Exempelföretagen är påhittade och branschneutrala.
 * Widgeten (source.database origin/develop e7f702d6): statusorden Nytt lead,
 * Kontaktad, Vunnen och Ingen affär (public/leads-layout2.html:1400-1410), Ort,
 * betyg A–F och AI-poäng (:2805-2822), Anteckningar (:2791), knappen Analysera &
 * pitch (:3546-3570). Analysen har avsnitten Bakgrund, Relevans, Säljpitch,
 * Samtalsöppningar och Troliga invändningar och ett underlagsmärke
 * (routes/leadsRoutes.js:1252-1262, public/leads-layout2.html:3824-3844).
 * Analysen har inget avsnitt för nästa steg, så widgeten visar inget sådant.
 */
export const vaxaLeads = {
  id: 'leads',
  eyebrow: 'LEADS',
  title: 'Hitta nya kunder',
  body: [
    'Välj vilka kunder du vill nå, efter bransch och ort, så letar Source fram företag som passar från flera källor – med ett betyg och en kort motivering för varje.',
    'Be om en pitchanalys innan du hör av dig och följ varje lead från nytt till vunnen affär. Du kan också importera egna listor och exportera dina leads.',
  ],
  widget: {
    label: 'Exempel: en lead öppnas och analyseras med Analysera & pitch',
    listTitle: 'Leads',
    ratingLabel: 'Betyg',
    leads: [
      { id: 'l1', company: 'Exempel Nord AB', place: 'Umeå', rating: 'A', status: 'Nytt lead', tone: 'outline' },
      { id: 'l2', company: 'Exempel Väst AB', place: 'Göteborg', rating: 'B', status: 'Kontaktad', tone: 'muted' },
      { id: 'l3', company: 'Exempel Syd AB', place: 'Malmö', rating: 'A', status: 'Vunnen', tone: 'paid' },
      { id: 'l4', company: 'Exempel Öst AB', place: 'Uppsala', rating: 'C', status: 'Ingen affär', tone: 'outline' },
    ],
    open: {
      company: 'Exempel Nord AB',
      details: [
        { label: 'Ort', value: 'Umeå' },
        { label: 'Betyg', value: 'A' },
        { label: 'AI-poäng', value: '86/100' },
        { label: 'Status', value: 'Nytt lead' },
      ],
      notesTitle: 'Anteckningar',
      note: { date: '2026-11-02', text: 'Hittad via din profil. Hör av dig före månadsskiftet.' },
      action: 'Analysera & pitch',
      loading: 'Analyserar …',
      answerTitle: 'Analys (exempel)',
      evidence: 'Delvis underbyggd',
      sections: [
        { title: 'Bakgrund', body: 'Etablerat bolag i Umeå som säljer både på plats och via sin webbplats.' },
        { title: 'Relevans', body: 'Samma bransch och ort som i din profil, och de växer i din region.' },
        { title: 'Säljpitch', body: 'Visa hur försäljning, kunder och betalningar samlas på ett ställe, utan fler system att hålla ihop.' },
        { title: 'Samtalsöppningar', body: 'Hur tar ni i dag emot beställningar som kommer in via webbplatsen?' },
      ],
      objection: {
        title: 'Troliga invändningar',
        question: 'Vi har redan ett system.',
        answer: 'Börja med en del, till exempel betalningarna, och flytta resten när det passar.',
      },
    },
  } satisfies LeadsWidgetContent,
};

/*
 * 3 – Bokföring med Fortnox. Belägg: bokföringssidorna och /api/accounting
 * (config/packageTiers.js:107-108, server.js:3443). Fortnox-leverantören
 * kontrollerar anslutningen, skickar verifikat, ställer ut fakturor, hämtar
 * faktura-PDF och synkar kunder (services/accounting/providers/fortnoxProvider.js:30-80).
 * Ingen logotyp: Fortnox nämns i text.
 */
export const vaxaBokforing = {
  id: 'bokforing',
  title: 'Bokföring med Fortnox',
  body: [
    'Koppla Fortnox, så hamnar det du säljer och får betalt för i bokföringen som verifikat.',
    'Fakturor och kunder följer med, så att du slipper föra över något för hand.',
  ],
  card: {
    label: 'Bokföring',
    value: 'Skickat',
    row: { title: 'Verifikat till Fortnox', note: 'Betald order' },
  } satisfies StatusCardContent,
};

/*
 * 4 – Kassan i ditt utseende. Belägg: checkout-inställningar med logotyp och
 * accentfärg (config/packageTiers.js:80, routes/checkoutSettingsRoutes.js:229-309),
 * presentkort (config/packageTiers.js:110, 186, 199; routes/giftCardRoutes.js:418,
 * 751, 1010). Widgeten (source.database origin/develop e7f702d6): en accentfärg och
 * en logotyp (public/checkout-layout2.html:396-423, services/checkoutBrandingService.js:87,
 * 106-122), kort som enda betalsätt (services/storefrontCheckoutService.js:2327),
 * rabattkodsfältet i kassan (:2336-2338). Presentkortet löses in i butiken före kassan
 * (routes/storefrontRoutes.js:1579, 1813-1847). Klarna och Swish är inte kopplade till
 * butikens kassa och nämns inte.
 */
export const vaxaKassa = {
  id: 'kassan',
  eyebrow: 'KASSAN',
  title: 'Kassan i ditt utseende',
  body: [
    'Lägg in din logotyp och din accentfärg, så känner kunden igen dig hela vägen till betalningen.',
    'Kunden betalar med kort och kan ange en rabattkod i kassan. Sälj presentkort i din butik, som kunden löser in innan betalningen.',
  ],
  checkout: {
    label: 'Exempel: kassan med egen logotyp och färg, där en rabattkod läggs till',
    shopName: 'Ditt företag',
    summaryTitle: 'Din order',
    lines: [
      { id: 'c1', name: 'Startpaket Plus', quantity: 1, unitPrice: 1490 },
      { id: 'c2', name: 'Tillbehör', quantity: 2, unitPrice: 149 },
    ],
    subtotalLabel: 'Delsumma',
    code: { label: 'Rabattkod', placeholder: 'Lägg till rabattkod', value: 'VALKOMMEN10', rate: 0.1, applyLabel: 'Lägg till', appliedLabel: 'Rabatt' },
    totalLabel: 'Att betala',
    payment: { title: 'Betalning', method: 'Kort', cardNumber: '1234 1234 1234 1234', expiry: 'MM / ÅÅ', cvc: 'CVC' },
    payLabel: 'Betala',
    secureNote: 'Säker kortbetalning',
  } satisfies CheckoutWidgetContent,
  giftCard: {
    title: 'Presentkort',
    code: { label: 'Kod', value: 'PRESENT-7Q4M' },
  } satisfies GiftCardContent,
};

/*
 * 5 – Bokningar. Bokningssystemet ingår för växande företag (server.js:3559-3566,
 * page:bokning). Belägg i kundportalen (northlab-io/source.database, origin/develop
 * b25b58c1):
 *   - stegen Tjänst → Utförare → Tid → Uppgifter och lediga tider med Lediga /
 *     Få platser kvar (public/booking-layout2.html:5943-5960)
 *   - tjänst med namn och varaktighet (booking-layout2.html:4507-4541); priset kommer
 *     från den kopplade produkten (routes/bookingSystem.js:4981-5008)
 *   - personal med arbetstider, raster och ledighet (models/Provider.js:10-40),
 *     resurser med kapacitet (models/BookingResource.js)
 *   - öppettider och stängda datum (booking-layout2.html:5679-5714)
 *   - bufferttider före, efter och mellan bokningar (booking-layout2.html:5965-6003)
 *   - betalning: handpenning eller full betalning, kräv betalning innan bekräftelse,
 *     kort i Stripe Checkout (booking-layout2.html:5779-5866, bookingSystem.js:5018-5044,
 *     5336-5354)
 *   - avbokningsregler, bokningsgränser och avgift för utebliven bokning
 *     (booking-layout2.html:8135-8224)
 *   - mejl: bokningsbekräftelse med avbokningslänk, avbokning och ombokning
 *     (public/epost-layout2.html:612-650, services/mailService.js:404-427,
 *     routes/bookingCancelPublic.js:76-193)
 *   - utseende och "Tillåt onlinebokningar" (public/js/bokningsdesign.js:85-119,
 *     models/BookingPresentation.js:38-84, bookingSystem.js:4303-4308)
 * Påminnelser skickas inte (inget anrop till booking_reminder) och väntelista,
 * SMS, tillägg, kalendersynk, ombokning av kunden och inbäddningskod finns inte –
 * de nämns inte.
 */
export const vaxaBokningar = {
  id: 'bokningar',
  eyebrow: 'BOKNINGAR',
  title: 'Låt kunderna boka själva',
  body: [
    'Kunden väljer tjänst, utförare och tid på din webbplats, fyller i sina uppgifter och betalar handpenning eller hela beloppet med kort. Sedan kommer bekräftelsen med en länk för att avboka.',
    'Du ställer in tjänster, personal och resurser, öppettider och stängda dagar, bufferttider, betalning och avbokningsregler, och väljer hur bokningen ska se ut.',
  ],
  booking: {
    label: 'Exempel: en kund bokar och betalar en tid, och inställningarna bakom bokningen',
    tabs: { label: 'Visa', customer: 'Kundens vy', settings: 'Din konfiguration' },
    steps: ['Tjänst', 'Utförare', 'Tid', 'Uppgifter', 'Betalning', 'Bekräftelse'],
    stepOf: 'Steg {n} av {total}',
    services: {
      heading: 'Välj tjänst',
      minutesLabel: 'min',
      selectedId: 's2',
      items: [
        { id: 's1', name: 'Konsultation', minutes: 30, price: 450 },
        { id: 's2', name: 'Möte', minutes: 45, price: 650 },
        { id: 's3', name: 'Genomgång', minutes: 60, price: 850 },
      ],
    },
    staff: { heading: 'Välj utförare', options: ['Valfri', 'Alex', 'Sam'], selected: 'Valfri' },
    time: {
      heading: 'Välj tid',
      month: 'Oktober',
      weekdays: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
      offset: 3,
      // 1 okt är en torsdag. Helger är stängda, den 16:e är ett stängt datum.
      days: [
        'few', 'free', 'closed', 'closed',
        'full', 'few', 'free', 'free', 'free', 'closed', 'closed',
        'free', 'few', 'full', 'free', 'closed', 'closed', 'closed',
        'free', 'free', 'few', 'free', 'free', 'closed', 'closed',
        'free', 'free', 'free', 'free', 'free', 'closed',
      ],
      selectedDay: 15,
      legend: { free: 'Lediga', few: 'Få platser kvar', full: 'Fullbokat', closed: 'Stängt' },
      slotsHeading: 'Torsdag 15 oktober',
      slots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
      selectedSlot: '13:00',
    },
    details: {
      heading: 'Dina uppgifter',
      fields: [
        { label: 'Namn', value: 'Kim Andersson' },
        { label: 'E-post', value: 'kim@exempel.se' },
        { label: 'Telefon', value: '070-123 45 67' },
        { label: 'Meddelande', value: 'Gärna ett kort förmöte.' },
      ],
      links: 'Genom att boka godkänner du villkoren och integritetspolicyn.',
    },
    payment: {
      heading: 'Betalning',
      rows: [
        { label: 'Tjänst', value: 'Möte, 45 min' },
        { label: 'Tid', value: 'Tor 15 okt kl. 13:00' },
        { label: 'Utförare', value: 'Valfri' },
        { label: 'Pris', value: '650 kr' },
      ],
      deposit: { label: 'Handpenning 20 %', amount: 130 },
      payLabel: 'Betala {amount} med kort',
    },
    done: {
      title: 'Bokningen är bekräftad',
      summary: 'Möte, torsdag 15 oktober kl. 13:00. Handpenningen är betald.',
      email: {
        title: 'Bokningsbekräftelse',
        from: 'Från: Ditt företag',
        text: 'Hej Kim! Din bokning av Möte torsdag 15 oktober kl. 13:00 är bekräftad.',
        cancelLink: 'Avboka bokningen',
      },
    },
    settings: [
      {
        id: 'tjanster',
        title: 'Tjänster',
        rows: [
          { label: 'Konsultation', value: '30 min · 450 kr' },
          { label: 'Möte', value: '45 min · 650 kr' },
          { label: 'Genomgång', value: '60 min · 850 kr' },
        ],
      },
      {
        id: 'personal',
        title: 'Personal och resurser',
        rows: [
          { label: 'Alex', value: 'Mån–fre 08–17' },
          { label: 'Rast', value: '12:00–13:00' },
          { label: 'Mötesrum', value: 'Resurs, 4 platser' },
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
          { label: 'Betalningstyp', value: 'Handpenning 20 %' },
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
          { label: 'Återbetalning', value: '100 %' },
          { label: 'Avgift vid utebliven bokning', value: '30 %' },
        ],
      },
      {
        id: 'granser',
        title: 'Bokningsgränser',
        rows: [
          { label: 'Boka högst', value: '90 dagar framåt' },
          { label: 'Boka senast', value: '2 h före' },
          { label: 'Aktiva bokningar per kund', value: 'Högst 3' },
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
 * 6 – Insikter och rapporter. Belägg: rapportsidorna (config/packageTiers.js:99-105,
 * server.js:3067, 3288), schemalagda rapporter körs för paketet och uppåt
 * (config/packageTiers.js:281), AI-insikter (config/packageTiers.js:94-95,
 * server.js:3115-3116). Ingen export och inga kvoter.
 */
export const vaxaInsikter = {
  id: 'insikter',
  eyebrow: 'INSIKTER & RAPPORTER',
  title: 'Insikter utan att gräva',
  body: [
    'Schemalägg en rapport om försäljning och kunder, så kommer den till dig utan att du behöver ta fram den.',
    'AI-insikterna sammanfattar vad som händer i butiken och föreslår vad du kan göra härnäst.',
  ],
  card: {
    label: 'Rapport',
    value: 'Skickad',
    pill: 'Schemalagd',
    row: { title: 'Försäljning och kunder', note: 'Sammanställd åt dig' },
  } satisfies StatusCardContent,
};

/*
 * 7 – Håll kunderna nära. Belägg: e-post med utskick, mallar och egen
 * avsändardomän (config/packageTiers.js:97), kundomdömen med publicering på
 * webbplatsen (routes/productReviewRoutes.js:36), nyheter i butiken
 * (config/packageTiers.js:69, server.js:3491). Köp- och återköpsbekräftelse
 * är på väg och nämns inte.
 * Widgeten (source.database origin/develop e7f702d6): produktomdömen med betyg
 * 1–5, kommentar, visningsnamn som "Anna S." och verifierat köp
 * (models/ProductReview.js:47-71), reglaget "Kundnöjdhet på hemsidan" som gäller
 * alla produkter (public/produkter-layout2.html:904-911, models/TenantConfig.js:305-306),
 * omdömena följer med produktsidorna (routes/storefrontRoutes.js:384-416, 795-840).
 * Utskick går till befintliga kunder, med urvalet köpt inom N månader
 * (services/campaignSendService.js:65-95). Portalen har inget registreringsformulär
 * för nyhetsbrev, så widgeten visar ett utskick i stället. Omdömena är exempeltext.
 */
export const vaxaKunder = {
  id: 'hall-kunderna-nara',
  eyebrow: 'KUNDRELATIONER',
  title: 'Håll kunderna nära',
  body: [
    'Skicka nyhetsbrev från din egen avsändaradress och publicera nyheter direkt i butiken.',
    'Samla kundernas omdömen och visa dem på din webbplats.',
  ],
  widget: {
    label: 'Exempel: omdömen visas på webbplatsen och ett utskick skickas till kunderna',
    reviews: {
      title: 'Kundomdömen',
      toggleLabel: 'Kundnöjdhet på hemsidan',
      toggleHint: 'Gäller alla produkter',
      on: 'På',
      off: 'Av',
      offNote: 'Omdömena visas inte på webbplatsen ännu.',
      starsLabel: 'Betyg',
      verifiedLabel: 'Verifierat köp',
      shownLabel: 'Visas på webbplatsen',
      items: [
        {
          id: 'r1',
          stars: 5,
          text: 'Snabb leverans och precis som beskrivet. Jag fick svar direkt när jag hade en fråga.',
          name: 'Anna S.',
          product: 'Startpaket',
        },
        {
          id: 'r2',
          stars: 4,
          text: 'Bra kvalitet och tydliga instruktioner. Hade gärna sett fler färgval, men jag beställer gärna igen.',
          name: 'Johan L.',
          product: 'Tillbehör',
        },
        {
          id: 'r3',
          stars: 3,
          text: 'Fungerar bra, men leveransen tog ett par dagar längre än jag hade räknat med.',
          name: 'Sara K.',
          product: 'Startpaket Plus',
        },
      ],
    },
    mailing: {
      title: 'Utskick',
      recipients: { label: 'Till', value: 'Kunder som har köpt de senaste 6 månaderna' },
      sender: { label: 'Från', value: 'hej@dittforetag.se' },
      subject: { label: 'Ämne', value: 'Nyheter i butiken' },
      sendLabel: 'Skicka',
      draft: 'Utkast',
      sent: 'Skickat',
    },
  } satisfies CustomersWidgetContent,
};

/*
 * 8 – Mer som ingår. Belägg: analyser och geografi med övergivna kassor
 * (config/packageTiers.js:89-92, server.js:3006), konkurrentbevakning
 * (config/packageTiers.js:87, server.js:3406), utbetalningsrapporter
 * (config/packageTiers.js:99-105), AI-sammanfattning av inköpsförslag
 * (routes/inventoryRoutes.js:862), nyheter (config/packageTiers.js:69).
 */
export const vaxaMer = {
  id: 'mer-som-ingar',
  eyebrow: 'MER SOM INGÅR',
  title: 'Verktygen som växer med dig',
  items: [
    { icon: ChartBarIcon, title: 'Analyser och geografi', body: 'Se hur försäljningen utvecklas och var dina kunder finns.' },
    { icon: ShoppingCartIcon, title: 'Övergivna kassor', body: 'Se hur många som lämnar kassan innan de har betalat.' },
    { icon: EyeIcon, title: 'Konkurrentbevakning', body: 'Följ de konkurrenter du vill hålla koll på, samlat på ett ställe.' },
    { icon: BanknotesIcon, title: 'Utbetalningsrapporter', body: 'Se vad som har betalats ut till ditt konto och när.' },
    { icon: SparklesIcon, title: 'Inköpsförslag med AI', body: 'Få en sammanfattning av vad som är klokt att köpa in härnäst.' },
    { icon: MegaphoneIcon, title: 'Nyheter i butiken', body: 'Berätta om det som är nytt, direkt för kunderna i din butik.' },
  ] satisfies FeatureItem[],
};

/* 9 – Så kommer du igång. Samma flöde som planens punkt 2.3, sektion 9. Ingen ledtid. */
export const vaxaKomIgang = {
  id: 'sa-kommer-du-igang',
  eyebrow: 'KOM IGÅNG',
  title: 'Så kommer du igång',
  steps: [
    { number: '01', title: 'Prata med oss', body: 'Berätta vad du säljer och vad du behöver när du växer.' },
    { number: '02', title: 'Vi aktiverar funktionerna', body: 'Vi slår på det som ingår på ditt konto.' },
    { number: '03', title: 'Koppla dina tjänster', body: 'Koppla Fortnox och ställ in PostNord i portalen.' },
    { number: '04', title: 'Fortsätt växa', body: 'Sälj, skicka och följ upp – allt på ett ställe.' },
  ] satisfies GettingStartedStep[],
  image: {
    src: '/images/for-dig/privat/08-sa-kommer-du-igang.webp',
    alt: 'En kvinna i tjock stickad tröja sitter i en grön soffa och skriver på en laptop, i ett ljust vardagsrum med en vägg full av inramade konstverk och en monstera.',
  },
  cta: { label: 'Prata med oss', href: '/kontakt' },
};

/* 10 – Avslutande CTA. */
export const vaxaAvslut = {
  id: 'kom-igang-cta',
  title: 'Väx med allt på ett ställe',
  body: ['Se vad som ingår och vad det kostar, eller boka en demo så visar vi hur det fungerar för dig.'],
  primary: { label: 'Se priser', href: '/priser' },
  secondary: { label: 'Boka demo', href: '/kontakt' },
};

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
import type { ServiceBookingContent } from '@/components/sections/for-dig/product-widgets/content';
import type { FeatureItem, ServiceImage } from '@/components/sections/tjanster/types';
import type { OfferWidgetContent } from '@/components/sections/for-dig/interactive/OfferWidget';

/** One status row: a title and a short line under it. */
export type StatusRowContent = { title: string; note: string };

/** Floating card over a photo: one value, at most one pill, one row. */
export type StatusCardContent = {
  label: string;
  value: string;
  pill?: string;
  row: StatusRowContent;
};

/** The follow-up step a lead is in, drawn as a status pill. */
export type LeadStage = 'new' | 'contacted' | 'won';

export type LeadListContent = {
  label: string;
  title: string;
  ratingLabel: string;
  leads: {
    id: string;
    company: string;
    place: string;
    /** Letter grade as in the portal: A, B, C, D or F. */
    rating: string;
    motivation: string;
    stage: LeadStage;
    status: string;
  }[];
  action: string;
};

export type BrandedCheckoutContent = {
  label: string;
  logoSlot: string;
  orderLine: string;
  amount: number;
  methods: { id: string; label: string; note?: string }[];
  payLabel: string;
};

export type GiftCardContent = {
  title: string;
  code: { label: string; value: string };
};

export type EmailRowContent = {
  title: string;
  sender: string;
  subject: string;
  status: string;
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
 */
export const vaxaLeads = {
  id: 'leads',
  eyebrow: 'LEADS',
  title: 'Hitta nya kunder',
  body: [
    'Välj vilka kunder du vill nå, efter bransch och ort, så letar Source fram företag som passar från flera källor – med ett betyg och en kort motivering för varje.',
    'Be om en pitchanalys innan du hör av dig och följ varje lead från nytt till vunnen affär. Du kan också importera egna listor och exportera dina leads.',
  ],
  list: {
    label: 'Exempel: tre leads med betyg, motivering och status',
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
      {
        id: 'l2',
        company: 'Exempel Väst AB',
        place: 'Göteborg',
        rating: 'B',
        motivation: 'Matchar en av branscherna du har valt.',
        stage: 'contacted',
        status: 'Kontaktad',
      },
      {
        id: 'l3',
        company: 'Exempel Syd AB',
        place: 'Malmö',
        rating: 'A',
        motivation: 'Ligger i en av orterna du har valt.',
        stage: 'won',
        status: 'Vunnen',
      },
    ],
    action: 'Analysera & pitch',
  } satisfies LeadListContent,
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
 * färger (config/packageTiers.js:80, routes/checkoutSettingsRoutes.js:229-309),
 * Klarna i kassan med Swish som betalalternativ (routes/klarnaRoutes.js:1-4,
 * server.js:3231), presentkort (config/packageTiers.js:110, 186, 199;
 * routes/giftCardRoutes.js:418, 751, 1010).
 */
export const vaxaKassa = {
  id: 'kassan',
  eyebrow: 'KASSAN',
  title: 'Kassan i ditt utseende',
  body: [
    'Lägg in din logotyp och dina färger, så känner kunden igen dig hela vägen till betalningen.',
    'Slå på Klarna för fler sätt att betala, bland annat Swish, och sälj presentkort i din butik.',
  ],
  checkout: {
    label: 'Exempel: kassan med egen logotyp och färg',
    logoSlot: 'Din logotyp',
    orderLine: 'Din order',
    amount: 1245,
    methods: [
      { id: 'kort', label: 'Kort' },
      { id: 'klarna', label: 'Klarna' },
      { id: 'swish', label: 'Swish', note: 'via Klarna' },
    ],
    payLabel: 'Betala',
  } satisfies BrandedCheckoutContent,
  giftCard: {
    title: 'Presentkort',
    code: { label: 'Kod', value: 'PRESENT-7Q4M' },
  } satisfies GiftCardContent,
};

/*
 * 5 – Bokningar. Belägg: bokningssystemet (config/packageTiers.js:112,
 * server.js:3477) med kortbetalning vid bokning. Meddelande och samtal från
 * bokningen är på väg och nämns inte.
 */
export const vaxaBokningar = {
  id: 'bokningar',
  eyebrow: 'BOKNINGAR',
  title: 'Låt kunderna boka själva',
  body: [
    'Lägg upp det du erbjuder som tider att boka.',
    'Kunden väljer en tid och betalar med kort direkt i bokningen – utan att någon behöver svara i telefon.',
  ],
  booking: {
    name: 'Möte',
    details: '45 min',
    price: 650,
    timesHeading: 'Välj tid',
    times: [
      { id: 't0900', label: '09:00' },
      { id: 't1300', label: '13:00' },
      { id: 't1530', label: '15:30' },
    ],
    defaultTimeId: 't1300',
    bookLabel: 'Boka och betala',
  } satisfies ServiceBookingContent,
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
 * är på väg och nämns inte. Omdömet visar betyg och status, inget påhittat citat.
 */
export const vaxaKunder = {
  id: 'hall-kunderna-nara',
  eyebrow: 'KUNDRELATIONER',
  title: 'Håll kunderna nära',
  body: [
    'Skicka nyhetsbrev från din egen avsändaradress och publicera nyheter direkt i butiken.',
    'Samla kundernas omdömen och visa dem på din webbplats.',
  ],
  email: {
    title: 'Utskick',
    sender: 'hej@dittforetag.se',
    subject: 'Nyheter i butiken',
    status: 'Skickat',
  } satisfies EmailRowContent,
  review: {
    title: 'Nytt omdöme',
    stars: 5,
    outOf: 5,
    starsLabel: 'Betyg i exemplet',
    status: 'Visas på webbplatsen',
  } satisfies ReviewCardContent,
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

/*
 * Innehåll för /tjanster/kampanjer (nya sektioner efter kollaget).
 *
 * Varje påstående här ska finnas i kundportalens kod (source.database,
 * origin/develop ad061f50, kontrollerad 2026-09-28; de citerade filerna är
 * oförändrade sedan 4d89711d – se CC-RAPPORT-kampanjer-recon.md punkt 4 och
 * CC-RAPPORT-kampanjer-bygge.md punkt 3). Inga paketnamn, inga resultat,
 * inget som är "kommer snart" (publicering till annonsplattformar, koppling
 * mellan e-postkanal och utskick, export) och ingen schemaläggning av utskick.
 * "2 för 1" och kampanjer som startar av sig själv nämns inte (ej verifierade
 * hela vägen till kassan).
 *
 * Exempeldata i widgetarna är neutral och visar hur gränssnittet ser ut –
 * produkten är en omärkt kartong som heter "Produkt" eller "Artikel".
 */
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PauseCircleIcon,
  ReceiptPercentIcon,
  UserMinusIcon,
} from '@heroicons/react/24/outline';
import type { FeatureItem, ServiceCta, ServiceImage } from '@/components/sections/tjanster/types';
import type {
  CampaignPriceDemoContent,
  EmailSendDemoContent,
  PromoCheckoutDemoContent,
  TrackingDemoContent,
} from '@/components/sections/tjanster/widgets/CampaignDemos';

const IMG = '/tjanster/kampanjer/kampanjer';
const LANDSCAPE = [640, 1024, 1536, 2048];
const PORTRAIT = [480, 720, 920];

/** Abstrakta pappersskulpturer – bara pauser mellan demonstrationerna. */
export const kampanjerImages = {
  // S1 – en båge av papper på teal.
  intro: {
    base: `${IMG}-intro`,
    alt: 'En båge av vitt papper står på en teal yta i skarpt solljus.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '70% 50%',
    portraitFocus: '50% 50%',
  },
  // S2 – klot och en skiva på sand.
  koder: {
    base: `${IMG}-koder`,
    alt: 'Vita och gröna klot och en blågrå skiva ligger i skarpt solljus på en sandfärgad yta.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '50% 60%',
    portraitFocus: '50% 60%',
  },
  // S3 – trappsteg från sand till teal mot en ljus vägg.
  uppfoljning: {
    base: `${IMG}-uppfoljning`,
    alt: 'Trappsteg som går från sandfärg till teal längs en ljus vägg.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '60% 60%',
    portraitFocus: '50% 50%',
  },
  // S4 – pappersark i luften på mörk teal.
  avslut: {
    base: `${IMG}-avslut`,
    alt: 'Tre pappersark i sand, vitt och grönt böjer sig i luften mot en mörkgrön bakgrund.',
    widths: LANDSCAPE,
    portraitWidths: PORTRAIT,
    focus: '53% 50%',
    portraitFocus: '50% 50%',
  },
} satisfies Record<string, ServiceImage>;

/*
 * Inledning. Belägg: kampanjpriser (routes/campaignRoutes.js 3600–3606),
 * kampanjkoder i kassan (campaignRoutes.js 775–806; services/storefrontCheckoutService.js
 * 2333–2337), utskick (routes/emailCampaignRoutes.js 454–459) och resultat per
 * kanal (public/js/marknadsforing.js 684–695).
 */
export const kampanjerIntro = {
  eyebrow: 'KAMPANJER',
  title: 'Från erbjudande till kassa',
  body: [
    'Sätt kampanjpriser, ge kunderna en rabattkod och berätta om erbjudandet i ett utskick. Sedan ser du vad varje kanal gav.',
  ],
};

/*
 * A1 – kampanjpris. Belägg: "Skapa ny kampanj" och fälten Rabatttyp, Rabattvärde (%),
 * Startdatum och Slutdatum (public/kampanjer-layout2.html 231, 385–422); produkter ur
 * butikens Stripe-produkter (372–376); rabatttyper (models/Campaign.js 130); ny kampanj
 * är utkast (campaignRoutes.js 2350; status draft/active, Campaign.js 148); vid
 * aktivering skapas kampanjpriser för varje variants baspris (campaignRoutes.js
 * 3600–3606) och vid paus eller utgång inaktiveras de (3706–3710).
 */
export const kampanjerPris = {
  eyebrow: 'KAMPANJPRIS',
  title: 'Sätt ett kampanjpris på det du säljer',
  body: [
    'Välj produkter, rabatt i procent eller kronor och när kampanjen ska börja och sluta.',
    'När du aktiverar kampanjen får varje variant sitt kampanjpris. När den pausas eller tar slut gäller det vanliga priset igen.',
  ],
  label: 'Exempel: en kampanj med 20 procents rabatt aktiveras',
  demo: {
    title: 'Ny kampanj',
    status: { idle: 'Utkast', done: 'Aktiv' },
    product: { label: 'Produkt', name: 'Produkt', note: '2 varianter' },
    discountType: { label: 'Rabatttyp', value: 'Procentuell rabatt' },
    discountValue: { label: 'Rabattvärde (%)', percent: 20 },
    start: { label: 'Startdatum', placeholder: 'Välj datum', value: '2 nov 2026' },
    end: { label: 'Slutdatum', placeholder: 'Välj datum', value: '15 nov 2026' },
    activate: 'Aktivera',
    pricesTitle: 'Priser i butiken',
    priceLabels: { ordinary: 'Ordinarie pris', sale: 'Kampanjpris' },
    variants: [
      { name: 'Produkt, liten', price: 400 },
      { name: 'Produkt, stor', price: 520 },
    ],
  } satisfies CampaignPriceDemoContent,
};

/*
 * Paus före A2. Belägg: kampanjkoder med procent eller fast belopp, max antal
 * användningar samt start- och slutdatum (campaignRoutes.js 775–806;
 * kampanjer-layout2.html 487, 528).
 */
export const kampanjerKoderPaus = {
  eyebrow: 'KAMPANJKODER',
  title: 'En kod med dina regler',
  body: ['Procent eller fast belopp, ett start- och slutdatum och ett tak för hur många gånger koden får användas.'],
};

/*
 * A2 – koden i kassan. Belägg: koder med procent eller fast belopp, max antal
 * användningar och datum (campaignRoutes.js 775–806); kassan tar emot koder
 * (storefrontCheckoutService.js 2333–2337).
 */
export const kampanjerKassa = {
  eyebrow: 'I KASSAN',
  title: 'Kunden skriver in koden i kassan',
  body: [
    'Koden dras av i kassan, som procent eller som ett fast belopp, så länge den gäller och tills taket är nått.',
  ],
  label: 'Exempel: en kampanjkod skrivs in i kassan',
  demo: {
    toggle: { label: 'Visa exempel med', options: { percent: 'Procent', amount: 'Fast belopp' } },
    codes: {
      percent: { code: 'KAMPANJ20', percent: 20, rules: 'Gäller till 15 nov · högst 100 gånger' },
      amount: { code: 'KAMPANJ100', amount: 100, rules: 'Gäller till 15 nov · högst 100 gånger' },
    },
    title: 'Kassa',
    item: { name: 'Artikel', note: 'antal 2', price: 600 },
    codeLabel: 'Rabattkod',
    codePlaceholder: 'Ange kod',
    valid: 'Koden gäller',
    subtotal: 'Delsumma',
    discount: 'Rabatt',
    total: 'Att betala',
  } satisfies PromoCheckoutDemoContent,
};

/*
 * A3 – utskick. Belägg: fliken Kampanjer och kortet Kampanjutskick på E-post
 * (public/epost-layout2.html 426–431); mottagarfiltret "Alla kunder" eller
 * "Handlat senaste 1, 3, 6 eller 12 månaderna" (950–958; routes/emailCampaignRoutes.js
 * 142–149); "Skicka testmail till mig" och "Skicka kampanj" (966–967); kräver
 * verifierad egen e-postdomän (880–884; emailCampaignRoutes.js 454–459);
 * avregistreringslänk i foten och List-Unsubscribe (services/campaignSendService.js
 * 10, 256–259); mall och bildplacering (epost-layout2.html 917–937). Ingen
 * schemaläggning (models/CampaignEmail.js 57) – den visas inte.
 *
 * Filtret heter "Handlat senaste 3 månaderna" i portalen, inte "90 dagarna".
 */
export const kampanjerUtskick = {
  eyebrow: 'UTSKICK',
  title: 'Berätta om kampanjen i kundernas inkorg',
  body: [
    'Skicka till alla kunder eller till dem som handlat den senaste månaden, eller de senaste tre, sex eller tolv månaderna.',
    'Utskicket går från din egen verifierade e-postdomän, och varje mejl har en länk för att avregistrera sig. Skicka ett testmejl till dig själv först.',
  ],
  label: 'Exempel: ett kampanjutskick skickas till kunder som handlat de senaste tre månaderna',
  demo: {
    title: 'Kampanjutskick',
    recipients: { label: 'Mottagare', value: 'Handlat senaste 3 månaderna', count: 248, suffix: 'mottagare matchar' },
    mail: {
      subject: 'Nyheter och erbjudanden',
      button: 'Läs mer',
      fromLabel: 'Från',
      from: 'nyheter@dittforetag.se',
      unsubscribe: 'Avregistrera',
    },
    test: 'Skicka testmail till mig',
    send: 'Skicka kampanj',
    status: { idle: 'Utkast', done: 'Skickad' },
    sent: 'Skickat till 248 mottagare',
  } satisfies EmailSendDemoContent,
};

/*
 * Paus före A4. Belägg: en spårningslänk och QR-kod per kanal (models/Campaign.js
 * 27–34, 54–55; campaignRoutes.js 2544–2566).
 */
export const kampanjerUppfoljningPaus = {
  eyebrow: 'UPPFÖLJNING',
  title: 'Se vad varje kanal ger',
  body: ['Varje kanal får en egen spårningslänk och QR-kod, så att besöken och köpen hamnar på rätt kanal.'],
};

/*
 * A4 – spårningslänk, QR och resultat per kanal. Belägg: spårningsnyckeln blir
 * utm_campaign (Campaign.js 27–34); kanaltyperna E-post, Organiskt och Annat med
 * egen etikett (Campaign.js 54–55; public/js/marknadsforing.js 25); spårningslänk,
 * "Kopiera" och "QR" per kanal (campaignRoutes.js 2544–2566; marknadsforing.js
 * 676–681); sessioner, konverteringar och intäkt per kanal, kostnad manuellt
 * (marknadsforing.js 684–695; services/campaignAttributionService.js 34–44).
 * Inga annonsplattformar och ingen publicering.
 *
 * QR-koden är riktig och leder till den här sidan. Genererad med qrcode 1.5.4
 * (felkorrigering M, version 5, 37 × 37 moduler) och kontrollerad med jsQR.
 */
export const kampanjerSparning = {
  eyebrow: 'SPÅRNINGSLÄNK OCH QR',
  title: 'En länk och en QR-kod per kanal',
  body: [
    'Lägg till kanalerna du använder, som utskick, sociala medier eller tryckt material. Varje kanal får en spårningslänk och en QR-kod.',
    'Du ser sessioner, köp och intäkt per kanal. Kostnaden kan du fylla i själv.',
  ],
  label: 'Exempel: en spårningslänk med QR-kod och sessioner per kanal',
  demo: {
    title: 'Spårningslänk',
    channel: { label: 'Kanal', value: 'Tryckt material' },
    linkLabel: 'Länk',
    link: 'https://sourcesolutions.se/tjanster/kampanjer?utm_campaign=exempel',
    copy: 'Kopiera',
    qrButton: 'QR',
    qr: {
      label: 'QR-kod som leder till sourcesolutions.se/tjanster/kampanjer',
      caption: 'Skanna – koden leder hit.',
      rows: [
        '1111111011110000110111110000101111111',
        '1000001011011010100101011000001000001',
        '1011101010111011100101010110001011101',
        '1011101001100110010011010101101011101',
        '1011101010110100100101000110101011101',
        '1000001000010011000000111010001000001',
        '1111111010101010101010101010101111111',
        '0000000000001101011100110101000000000',
        '1001111111101000000101111011110010111',
        '0101000010100000101000001111000110110',
        '0001011110100011101111111001111101101',
        '1000100010100010111110010001000000111',
        '0101011000111111101000101001001000001',
        '0101000001011001101001011101100011010',
        '0110001010001111001110000111001011111',
        '1100100001000010100111111000011101111',
        '0010111011110101011001111101001000101',
        '1110000000011110000001100011010101000',
        '1000111111010100100100010101000000001',
        '0010000101011111100110100100010001001',
        '1000101111111100110110000010111110000',
        '1101000100100011011100010101010010100',
        '0111111010011011000011011011100101001',
        '0011110111011110101110000001101111110',
        '0110101100001101010011101001101010010',
        '1100110111111100011100110111110011000',
        '1111111111000011011001001111011000111',
        '1001010110111010100100101010111101100',
        '1001001001110101100110111101111110111',
        '0000000010011011011111100000100010110',
        '1111111010111011011100010100101010001',
        '1000001010010000100111010101100010000',
        '1011101010101010101111010011111110010',
        '1011101011001100000011110110011001101',
        '1011101000010000011000010011000011001',
        '1000001001101101010000110010011011111',
        '1111111010100010100110001000111101001',
      ],
    },
    results: {
      title: 'Sessioner per kanal',
      unit: 'sessioner',
      channels: [
        { name: 'E-post', value: 180 },
        { name: 'Organiskt', value: 120 },
        { name: 'Tryckt material', value: 64 },
      ],
    },
  } satisfies TrackingDemoContent,
};

/*
 * Detaljerna. Belägg per kort:
 *   rabatt i procent eller kronor – Campaign.js 130; kampanjer-layout2.html 389–390
 *   start- och slutdatum          – Campaign.js 144–145
 *   tak för användningen          – kampanjer-layout2.html 443–445, 528
 *   pausa och aktivera            – campaignRoutes.js 3563–3564, 3706–3710
 *   kampanjstatistik              – kampanjer-layout2.html 285–304; campaignRoutes.js 569–571
 *   välj bort mottagare           – models/CampaignEmail.js 52–55; epost-layout2.html 958
 *   mallar för utskick            – epost-layout2.html 917–937
 */
export const kampanjerFeatures: { eyebrow: string; title: string; items: FeatureItem[] } = {
  eyebrow: 'ALLT RUNT KAMPANJEN',
  title: 'Detaljerna som gör kampanjen enkel',
  items: [
    { icon: ReceiptPercentIcon, title: 'Procent eller kronor', body: 'Ge rabatt i procent eller med ett fast belopp, på de produkter du väljer.' },
    { icon: CalendarDaysIcon, title: 'Start- och slutdatum', body: 'Kampanjen gäller mellan två datum som du bestämmer.' },
    { icon: AdjustmentsHorizontalIcon, title: 'Tak för användningen', body: 'Bestäm hur många gånger en kod eller kampanj får användas.' },
    { icon: PauseCircleIcon, title: 'Pausa och aktivera', body: 'Pausa en kampanj så gäller det vanliga priset igen, och aktivera den när du vill.' },
    { icon: ChartBarIcon, title: 'Kampanjstatistik', body: 'Se aktiva kampanjer och koder, den genomsnittliga rabatten och kampanjintäkterna.' },
    { icon: UserMinusIcon, title: 'Välj bort mottagare', body: 'Se listan före utskicket och ta bort enskilda mottagare.' },
    { icon: EnvelopeIcon, title: 'Mallar för utskick', body: 'Välj mall, var bilden ska ligga och hur texten ska justeras.' },
  ],
};

/*
 * Avslut. Belägg: kampanjer utgår från butikens produkter (kampanjer-layout2.html
 * 372–376) och utskickens mottagare från kunderna och deras köp
 * (emailCampaignRoutes.js 142–149).
 */
export const kampanjerAvslut = {
  eyebrow: 'KOM IGÅNG',
  title: 'Kampanjerna ligger i samma portal som resten',
  body: ['Kampanjer, koder och utskick utgår från produkterna och kunderna du redan har i Source.'],
  cta: { label: 'Prata med oss', href: '/kontakt' } satisfies ServiceCta,
  packageNote: { text: 'Vilka funktioner som ingår beror på paket –', linkLabel: 'se priser', href: '/priser' },
};

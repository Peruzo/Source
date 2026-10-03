/**
 * Alla kundtexter i flödet "Gör min hemsida" (app/onboarding/hemsida). Samlade här så att de
 * kan granskas på ett ställe. Branschneutrala: branschen är något kunden skriver själv.
 *
 * Värdena (nycklarna) är kundportalens: OnboardingAnswers i
 * services/siteBuilder/onboardingAnswers.js och siteDefinition.js. Ändra inte nycklarna här
 * utan att ändra kontraktet.
 */

export const OFFERINGS = [
  { value: 'products', label: 'Varor', help: 'Fysiska eller digitala produkter som kunden köper.' },
  { value: 'services', label: 'Tjänster', help: 'Arbete eller uppdrag du utför åt kunden.' },
  { value: 'bookings', label: 'Bokningar', help: 'Kunden bokar en tid hos dig.' },
  { value: 'subscriptions', label: 'Prenumerationer', help: 'Återkommande leveranser eller medlemskap.' },
  { value: 'giftCards', label: 'Presentkort', help: 'Kunden köper ett värde att ge bort.' },
] as const;

export const TONES = [
  { value: 'professional', label: 'Professionell', help: 'Saklig och trygg.' },
  { value: 'friendly', label: 'Vänlig', help: 'Varm och personlig.' },
  { value: 'playful', label: 'Lekfull', help: 'Lättsam med glimten i ögat.' },
  { value: 'exclusive', label: 'Exklusiv', help: 'Stilren och påkostad.' },
  { value: 'calm', label: 'Lugn', help: 'Mjuk och avslappnad.' },
] as const;

export const STYLES = [
  { value: 'minimal', label: 'Minimal', help: 'Luftigt och avskalat, med fokus på texten.' },
  { value: 'classic', label: 'Klassisk', help: 'Tidlöst och förtroendeingivande.' },
  { value: 'bold', label: 'Kraftfull', help: 'Stora bilder och tydliga rubriker.' },
  { value: 'warm', label: 'Varm', help: 'Mjuka former och en välkomnande känsla.' },
  { value: 'modern', label: 'Modern', help: 'Rent och samtida.' },
] as const;

// Färgerna är kundportalens färdiga paletter (services/siteBuilder/design.js), för förhandsvisning.
export const PALETTES = [
  { value: 'ocean', label: 'Hav', colors: ['#1d4e89', '#0e7490', '#f1f5f9'] },
  { value: 'forest', label: 'Skog', colors: ['#1f513f', '#a16207', '#f2f5f1'] },
  { value: 'sand', label: 'Sand', colors: ['#7c4a1e', '#9a3412', '#f5efe6'] },
  { value: 'charcoal', label: 'Grafit', colors: ['#111827', '#2563eb', '#f4f4f5'] },
  { value: 'berry', label: 'Bär', colors: ['#7a1f4a', '#a21caf', '#f8eef3'] },
  { value: 'night', label: 'Natt', colors: ['#f2c94c', '#7dd3fc', '#111315'] },
] as const;

export const SECTIONS = [
  { value: 'hero', label: 'Startbild med rubrik' },
  { value: 'features', label: 'Fördelar' },
  { value: 'imageText', label: 'Bild och text' },
  { value: 'text', label: 'Textavsnitt' },
  { value: 'gallery', label: 'Bildgalleri' },
  { value: 'productGrid', label: 'Produkter och tjänster' },
  { value: 'categoryGrid', label: 'Kategorier' },
  { value: 'bookingCta', label: 'Bokning' },
  { value: 'subscriptionGrid', label: 'Prenumerationer' },
  { value: 'giftCardCta', label: 'Presentkort' },
  { value: 'news', label: 'Nyheter' },
  { value: 'testimonials', label: 'Omdömen' },
  { value: 'faq', label: 'Vanliga frågor' },
  { value: 'contact', label: 'Kontakt' },
] as const;

export const SECTION_LABELS: Record<string, string> = {
  ...Object.fromEntries(SECTIONS.map((s) => [s.value, s.label])),
  footer: 'Sidfot',
};

/** Förval av sektioner utifrån vad kunden säljer. Sidfoten kommer alltid med. */
export function defaultSections(offering: string[]): string[] {
  const set = new Set(['hero', 'features', 'imageText', 'testimonials', 'contact']);
  if (offering.includes('products')) { set.add('productGrid'); set.add('categoryGrid'); }
  if (offering.includes('services')) set.add('productGrid');
  if (offering.includes('bookings')) set.add('bookingCta');
  if (offering.includes('subscriptions')) set.add('subscriptionGrid');
  if (offering.includes('giftCards')) set.add('giftCardCta');
  return SECTIONS.map((s) => s.value as string).filter((v) => set.has(v));
}

export const IMPROVEMENTS = [
  { value: 'shorter', label: 'Kortare' },
  { value: 'more_sales', label: 'Mer säljande' },
  { value: 'more_personal', label: 'Mer personlig' },
  { value: 'new_text', label: 'Ny text' },
  { value: 'new_image', label: 'Ny bild' },
  { value: 'other_variant', label: 'Annan layout' },
] as const;

export const SUPPORT_CATEGORIES = [
  { value: 'generation_failed', label: 'Det gick inte att skapa sajten' },
  { value: 'limit_reached', label: 'Jag har använt alla försök' },
  { value: 'content', label: 'Texterna eller innehållet' },
  { value: 'design', label: 'Design och utseende' },
  { value: 'other', label: 'Något annat' },
] as const;

export const LIMITS = {
  companyName: [1, 80],
  industry: [2, 60],
  audience: [3, 300],
  companyDescription: [20, 1500],
  about: [0, 1500],
  uniqueSellingPoints: [0, 600],
  extra: [0, 600],
  note: [0, 300],
  supportMessage: [0, 500],
} as const;

export const T = {
  stepTitles: {
    offering: 'Vad säljer du?',
    company: 'Berätta om företaget',
    tone: 'Hur vill du låta?',
    content: 'Ditt innehåll',
    sections: 'Vad ska finnas på sajten?',
    design: 'Välj stil och färger',
    generate: 'Nu bygger vi din sajt',
    preview: 'Din nya sajt',
  },
  intro: 'Du har ingen hemsida än. Svara på några frågor så bygger vi en åt dig, som du kan förbättra innan du går vidare.',
  offeringHelp: 'Välj allt som stämmer. Du kan ändra senare.',
  companyName: 'Företagets namn',
  industry: 'Bransch',
  industryHelp: 'Med egna ord, till exempel det du själv kallar din verksamhet.',
  audience: 'Vilka är dina kunder?',
  audienceHelp: 'Beskriv kort vilka du vänder dig till och vad de behöver.',
  toneHelp: 'Tonen styr hur texterna på sajten är skrivna.',
  companyDescription: 'Beskriv företaget',
  companyDescriptionHelp: 'Vad gör ni, för vem och varför ska man välja er? Minst 20 tecken.',
  about: 'Om oss (valfritt)',
  aboutHelp: 'Historia, värderingar eller människorna bakom.',
  usp: 'Det som gör er unika (valfritt)',
  extra: 'Något mer vi ska veta? (valfritt)',
  contactInfo: 'Kontaktuppgifter som e-post, telefon och adress lägger du in när ditt konto är klart. Då visas de automatiskt på sajten.',
  sectionsHelp: 'Vi har valt det som brukar passa det du säljer. Ändra fritt; sidfot kommer alltid med.',
  styleLegend: 'Stil',
  paletteLegend: 'Färger',
  customPalette: 'Egna färger',
  primaryColor: 'Huvudfärg',
  accentColor: 'Accentfärg',
  customPaletteHelp: 'Vi justerar färgerna vid behov så att texten alltid går att läsa.',
  seeExample: 'Se exempel',
  exampleTitle: 'Exempel på stilen',
  exampleNote: 'Exemplet visar stilen med påhittat innehåll. Din sajt får dina texter.',
  desktop: 'Dator',
  mobile: 'Mobil',
  close: 'Stäng',
  next: 'Nästa →',
  back: '← Tillbaka',
  saving: 'Sparar...',
  generateIntro: 'Det här tar några minuter. Du kan låta sidan vara öppen, eller komma tillbaka senare – vi fortsätter att bygga.',
  generateStart: 'Bygg min sajt',
  generating: 'Bygger din sajt',
  generatingResumed: 'Din sajt byggs fortfarande. Vi visar den så fort den är klar.',
  generatingElapsed: (s: number) => `Har pågått i ${Math.floor(s / 60)} min ${s % 60} s`,
  stageDone: 'Klart',
  stageNow: 'Pågår',
  stageLater: 'Väntar',
  retry: 'Försök igen',
  generationUnconfirmed: 'Vi kunde inte bekräfta att din sajt blev klar. Försök igen.',
  previewHelp: 'Så här ser din sajt ut. Bläddra mellan sidorna och förbättra det du vill.',
  page: 'Sida',
  improveTitle: 'Förbättra',
  improveSection: 'Välj sektion',
  improveChoice: 'Vad ska ändras?',
  improveNote: 'Kort notering (valfritt)',
  improveNoteHelp: 'Till exempel vad som ska framhävas. Högst 300 tecken.',
  improveSubmit: 'Förbättra sektionen',
  improving: 'Förbättrar...',
  themeTitle: 'Ny stil eller nya färger',
  themeSubmit: 'Byt utseende',
  remaining: (improve: number, site: number) => `Kvar: ${improve} förbättringar och ${site} nya sajter.`,
  limitReached: 'Du har använt alla förbättringar som ingår.',
  contactSupport: 'Kontakta support',
  rebuild: 'Bygg om hela sajten',
  rebuildConfirm: 'Hela sajten byggs om från dina svar. Dina förbättringar försvinner.',
  approve: 'Det här är min sajt',
  approveHelp: 'Du kan fortsätta ändra sajten efter att kontot är klart.',
  skip: 'Hoppa över – jag vill inte ha en sajt nu',
  helpTitle: 'Behöver du hjälp?',
  helpOpen: 'Behöver du hjälp?',
  helpCategory: 'Vad gäller det?',
  helpMessage: 'Beskriv kort (valfritt)',
  helpMessageHelp: 'Skriv inga lösenord eller kortuppgifter. Högst 500 tecken.',
  helpSubmit: 'Skicka till support',
  helpSent: 'Tack! Vi har tagit emot ditt ärende och hör av oss så snart vi kan.',
  loading: 'Laddar...',
  notReady: 'Vi kunde inte starta hemsidebyggaren. Ladda om sidan och försök igen.',
  required: 'Fyll i det här fältet.',
  tooShort: (min: number) => `Skriv minst ${min} tecken.`,
  tooLong: (max: number) => `Högst ${max} tecken.`,
  noAngles: 'Tecknen < och > kan inte användas.',
  pickOne: 'Välj minst ett alternativ.',
  fieldError: 'Kontrollera det här svaret.',
  previewFrameTitle: 'Förhandsvisning av din sajt',
  exampleFrameTitle: 'Exempelsajt',

  // ── PR F: val av väg, offert, helskärm och låst läge ─────────────────────────────────
  choiceTitle: 'Hur vill du få din sajt?',
  choiceIntro: 'Bygg den själv med AI på några minuter, eller låt oss bygga den åt dig.',
  choiceAiTitle: 'Bygg din sajt själv med AI',
  choiceAiText: 'Svara på några frågor, välj stil och färger och se din sajt direkt. Du kan förbättra den innan du går vidare.',
  choiceQuoteTitle: 'Låt Source bygga din sajt',
  choiceQuoteText: 'Berätta vad du behöver så bygger vi sajten åt dig, till ett engångspris enligt offert.',
  choiceAiCta: 'Bygg själv med AI',
  choiceQuoteCta: 'Begär offert',
  quoteTitle: 'Berätta om sajten du vill ha',
  quoteIntro: 'Vi går igenom ditt underlag och återkommer med en offert. Det kostar ingenting att fråga.',
  quoteContent: 'Vad ska sajten innehålla?',
  quoteContentHelp: 'Till exempel vilka sidor du behöver, vad du säljer och vad besökarna ska kunna göra. Minst 10 tecken.',
  quoteReferences: 'Förebilder (valfritt)',
  quoteReferencesHelp: 'Länkar till sajter du gillar, en per rad. Högst 5 länkar, och de måste börja med https://.',
  quoteTimeline: 'Önskad tidplan (valfritt)',
  quoteTimelineHelp: 'Till exempel "inom en månad" eller ett datum.',
  quoteMessage: 'Något mer vi ska veta? (valfritt)',
  quoteMessageHelp: 'Skriv inga lösenord eller kortuppgifter. Högst 500 tecken.',
  quoteSubmit: 'Skicka offertförfrågan',
  quoteSending: 'Skickar...',
  quoteSentTitle: 'Tack, vi har tagit emot din förfrågan',
  quoteSentText: 'Source återkommer med en offert. Under tiden kan du gå vidare i registreringen.',
  quoteContinue: 'Gå vidare',
  switchToAi: 'Bygg sajten själv med AI i stället',
  switchToQuote: 'Hellre att Source bygger den?',
  quoteErrors: {
    required: 'Fyll i det här fältet.',
    too_short: 'Skriv minst 10 tecken.',
    too_long: 'Texten är för lång.',
    invalid_url: 'Varje förebild måste vara en länk som börjar med https://.',
    too_many: 'Högst 5 länkar.',
    angles: 'Tecknen < och > kan inte användas.',
  },
  resultBarLabel: 'Din sajt',
  resultFrameTitle: 'Din sajt i helskärm',
  edit: 'Redigera',
  changeLook: 'Byt utseende',
  improvementsLeft: (n: number) => `Kvar: ${n} förbättringar`,
  approveContinue: 'Det här är min sajt – gå vidare',
  backToFullscreen: 'Visa i helskärm',
  lockedTitle: 'Du har använt alla ändringar som ingår',
  lockedText: 'Bli kund för att fortsätta arbeta med din sajt. Den sparas och följer med till ditt konto.',
  lockedSitesText: 'Du har använt alla nya sajter som ingår. Bli kund för att fortsätta.',
  becomeCustomer: 'Gå vidare och bli kund',
} as const;

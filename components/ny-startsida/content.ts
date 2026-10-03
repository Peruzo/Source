// NY STARTSIDA: innehåll från experimentets redesign (experiment/landing-remodel), som var en
// ordagrann kopia av startsidans texter, bilder och länkar på 49f3724. Varje block anger
// källfilen. Portföljdatan läses direkt från källan. Videon och postern har egna filnamn
// (public/ny-startsida-video*), och bilder över 1 MB ligger som WebP i public/ny-startsida/.

export { portfolioProjects, portfolioKindLabels } from '@/lib/data/portfolioProjects';

// components/sections/Hero.tsx
export const HERO = {
  rotatingWords: ['Starta', 'Växa', 'Skala'] as const,
  staticWord: 'Växa',
  intervalMs: 2500,
  rest: 'online. Verkligen.',
  sub: 'AI som analyserar din verksamhet och ger konkreta råd — inte bara rapporter.',
  image: { src: '/landing.webp', alt: 'Source hero', width: 2048, height: 1152 },
  primary: { label: 'Boka demo', href: '/kontakt' },
  secondary: { label: 'Se hur det fungerar ↓', href: '#next-section' },
};

// components/sections/ValueProposition.tsx
export const VALUE = {
  lines: ['Ett system för butiken.', 'Ett för fakturorna.', 'Ett för bokföringen.', 'Ett för utskicken.'],
  closingBefore: 'Eller ett för ',
  closingAccent: 'allt',
  closingAfter: '.',
};

// components/sections/PlatformRock.tsx och RockHotspots.tsx
export const ROCK = {
  video: '/rock-grow.mp4',
  finalFrame: '/rock-grow-slut.webp',
  ariaLabel: 'Hela din verksamhet, samlad',
  overline: 'Allt på ett ställe',
  title: 'Hela din verksamhet — samlad.',
  hotspots: [
    {
      key: 'ekonomi',
      label: 'Ekonomi',
      mx: 57,
      my: 37,
      side: 'right' as const,
      openDir: 'down' as const,
      items: [
        { name: 'Betalningar', href: 'https://sourceportal.se/betalningar-layout2' },
        { name: 'Rapporter', href: 'https://sourceportal.se/rapporter-layout2' },
        { name: 'Bokföring', href: 'https://sourceportal.se/bokforing-layout2' },
        { name: 'Fakturor', href: 'https://sourceportal.se/fakturor-layout2' },
        { name: 'Betalningslänk', href: 'https://sourceportal.se/betalningslank-layout2' },
        { name: 'Presentkort', href: 'https://sourceportal.se/giftcards-layout2' },
      ],
    },
    {
      key: 'system',
      label: 'System',
      mx: 41,
      my: 53,
      side: 'left' as const,
      openDir: 'down' as const,
      items: [
        { name: 'Inventarier', href: 'https://sourceportal.se/inventarier-layout2' },
        { name: 'Produkter', href: 'https://sourceportal.se/produkter-layout2' },
        { name: 'Bokningssystem', href: 'https://sourceportal.se/booking' },
        { name: 'Inställningar', href: 'https://sourceportal.se/installningar-layout2' },
        { name: 'Kontakt', href: 'https://sourceportal.se/kontakt-layout2' },
      ],
    },
    {
      key: 'main',
      label: 'Main',
      mx: 60,
      my: 64,
      side: 'right' as const,
      openDir: 'up' as const,
      items: [
        { name: 'Dashboard', href: 'https://sourceportal.se/dashboard' },
        { name: 'Kampanjer', href: 'https://sourceportal.se/kampanjer' },
        { name: 'Nyheter', href: 'https://sourceportal.se/nyheter.html' },
        { name: 'Logistik', href: 'https://sourceportal.se/logistik' },
        { name: 'Integrationer', href: 'https://sourceportal.se/integrationer' },
        { name: 'Kunder', href: 'https://sourceportal.se/kunder-layout2' },
        { name: 'Leads', href: 'https://sourceportal.se/leads-layout2' },
        { name: 'Analyser', href: 'https://sourceportal.se/analyser-layout2' },
        { name: 'Statistik', href: 'https://sourceportal.se/statistik-layout2' },
        { name: 'Marknadsföring', href: 'https://sourceportal.se/marknadsforing-layout2' },
      ],
    },
  ],
};

// components/sections/DataGrowthSlideshow.tsx
export const GROWTH = {
  overline: 'FRÅN DATA TILL VERKLIG TILLVÄXT',
  titleA: 'Tillväxt som syns i ',
  titleAccent: 'bokningar och siffror',
  titleB: '.',
  slideDurationMs: 8000,
  slides: [
    {
      id: 'analysis',
      image: '/ny-startsida/analys.webp',
      title: 'Analys av besökare, kunder och köp',
      body: 'Vi följer hela resan – från första besök till genomfört köp – så att du ser exakt vad som driver intäkter och vad som bromsar.',
    },
    {
      id: 'booking',
      image: '/restaurantforbooking.webp',
      title: 'Bokningssystem för alla branscher',
      body: 'Ett flexibelt bokningsflöde som anpassas efter din verklighet – oavsett om du driver salong, byrå eller konsultverksamhet.',
    },
  ],
};

// components/sections/AIAssistant.tsx
export const ASSISTANT = {
  overline: 'SOURCE AI ASSISTENT',
  title: 'Säg hej till Source AI – din digitala assistent i vardagen.',
  body1:
    'En AI-assistent som förstår dina processer, bokningar och kundresor – och hjälper dig ta smartare beslut på några sekunder istället för timmar.',
  body2:
    'Ställ en fråga om dina siffror, be om en rapport eller få ett konkret nästa steg – Source AI går igenom datan åt dig och presenterar ett begripligt svar.',
  cta: { label: 'Utforska Source AI', href: '/ai-assistent' },
  note: 'Beta-version – perfekt för dig som vill ligga steget före.',
  typingMs: 1500,
  repeatMs: 8000,
};

// components/sections/PortfolioTeaser.tsx (+ ProjectCard.tsx)
export const PORTFOLIO = {
  overline: 'PORTFOLIO',
  title: 'Byggt av Source',
  lead: 'Så här kan Source hjälpa olika typer av verksamheter växa online.',
  conceptTitle: 'Koncept',
  conceptLead: 'Demosajter vi byggt för att visa vad som är möjligt i olika branscher.',
  cta: { label: 'Se alla projekt', href: '/portfolio' },
};

// components/sections/AIAgentShowcase.tsx
export const SHOWCASE = {
  overline: 'FÖR ALLA VERKSAMHETER',
  title: 'Ett smartare sätt att driva din verksamhet – oavsett vad du gör.',
  lead: 'Source är byggt för alla typer av företag, oavsett bransch eller teknisk vana. Vår vision är att göra det lika enkelt att driva och utveckla en verksamhet digitalt som att skicka ett sms.',
  video: '/ny-startsida-video.mp4',
  poster: '/ny-startsida-video-poster.webp',
  badge: 'Source AI i praktiken.',
  infoTitle: 'Byggd för företag i alla storlekar och branscher.',
  infoBody:
    'Source är gjort för dig som vill utveckla din verksamhet digitalt utan att drunkna i teknik – oavsett om du precis har börjat eller redan är etablerad.',
};

// components/sections/FAQ.tsx
export const FAQS = {
  title: 'Få svar på dina frågor.',
  primary: { label: 'Kontakta oss', href: '/kontakt' },
  secondary: { label: 'Se alla frågor och svar', href: '/hjalp' },
  items: [
    {
      question: 'Vad är Source?',
      answer:
        'Source är en komplett plattform för hemsidor, e-handel och kundhantering. Allt du behöver för drift, betalningar, marknadsföring och statistik finns samlat på ett ställe.',
    },
    {
      question: 'Hur fungerar plattformen?',
      answer:
        'Du loggar in i vår kundportal där du hanterar produkter, kunder, beställningar, betalningar och marknadsföring. Vi sköter tekniken i bakgrunden så du slipper.',
    },
    {
      question: 'Vem kan använda Source?',
      answer:
        'Alla företag som behöver en hemsida, webshop eller en modern kundportal — från små lokala verksamheter till växande e-handelsbolag.',
    },
    {
      question: 'Behöver jag en egen hemsida?',
      answer:
        'Nej. Vi bygger hemsidan åt dig och kopplar den direkt till din kundportal. Har du redan en hemsida kan vi antingen förbättra den eller migrera den.',
    },
    {
      question: 'Hur snabbt kommer jag igång?',
      answer:
        'De flesta kommer igång samma dag. En ny hemsida kan lanseras inom några dagar beroende på omfattning.',
    },
    {
      question: 'Behövs teknisk kunskap?',
      answer:
        'Nej. Plattformen är byggd för att vara enkel. Du får ett färdigt system där du bara sköter innehåll och val — vi tar hand om allt tekniskt.',
    },
    {
      question: 'Bygger ni hemsidor åt mig?',
      answer:
        'Ja. Vi designar och utvecklar hela din hemsida baserat på dina behov, och kopplar den direkt till din e-handel och kundportal.',
    },
    {
      question: 'Kan ni flytta min nuvarande webbshop?',
      answer:
        'Ja. Vi kan migrera produkter, innehåll och struktur från din nuvarande plattform till Source utan att du tappar något.',
    },
    {
      question: 'Hur funkar betalningar via Stripe?',
      answer:
        'Stripe sköter alla kortbetalningar, utbetalningar och kvitton. Du får dem automatiskt kopplade till din statistik, ekonomi och kunddata i Source.',
    },
    {
      question: 'Vilka betalmetoder stödjer ni?',
      answer:
        'Kassan tar betalt med kort via Stripe, och pengarna går till ditt eget Stripe-konto. Du kan också ta betalt med betalningslänk, faktura och prenumeration.',
    },
  ],
};

// components/sections/PricingTeaser.tsx
export const PRICING = {
  overline: 'TRANSPARENT PRISSÄTTNING',
  titleA: 'Prenumeration.',
  titleB: 'Inte projektpriser.',
  from: 'Från',
  price: '799',
  currency: ' kr',
  period: 'per månad',
  checks: ['Ingen bindningstid', 'Allt inkluderat', 'Inga dolda kostnader'],
  features: ['Design & utveckling', 'AI-analys & insights', 'Hosting & säkerhet', 'Support & uppdateringar'],
  cta: { label: 'Jämför alla planer', href: '/priser' },
  badge: 'Mest valda: Growth',
  footnote: '* Alla priser exklusive moms.',
};

// components/sections/FinalCTA.tsx
export const FINAL = {
  titleA: 'Redo att ',
  titleAccent: 'växa',
  titleB: '?',
  body: 'Boka en kostnadsfri demo och upptäck hur Source kan transformera din online-närvaro med AI-driven tillväxt.',
  primary: { label: 'Boka en demo', href: '/kontakt' },
  secondary: { label: 'Se priser', href: '/priser' },
  stats: [
    { value: '24h', label: 'Svarstid' },
    { value: 'Ingen', label: 'Bindningstid' },
    { value: '100%', label: 'Transparent' },
  ],
};

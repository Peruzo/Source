export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questions: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'kom-igang',
    name: 'Kom igång',
    description: 'Grundläggande frågor om Source och hur du kommer igång',
    icon: '🚀',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    questions: [
      {
        id: 'vad-ar-source',
        question: 'Vad är Source?',
        answer: 'Source är en komplett plattform för hemsidor, e-handel och kundhantering. Allt du behöver för drift, betalningar, marknadsföring och statistik finns samlat på ett ställe.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'hur-fungerar-plattformen',
        question: 'Hur fungerar plattformen?',
        answer: 'Du loggar in i vår kundportal där du hanterar produkter, kunder, beställningar, betalningar och marknadsföring. Vi sköter tekniken i bakgrunden så du slipper.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'vad-ingar-i-paket',
        question: 'Vad ingår i varje paket?',
        answer: 'Varje paket inkluderar olika funktioner baserat på dina behov. Se vår prissida för detaljerad information om vad som ingår i varje paket.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'hur-snabbt-kommer-jag-igang',
        question: 'Hur snabbt kommer jag igång?',
        answer: 'De flesta kommer igång samma dag. En ny hemsida kan lanseras inom några dagar beroende på omfattning.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'behover-jag-teknisk-kunskap',
        question: 'Behöver jag teknisk kunskap?',
        answer: 'Nej. Plattformen är byggd för att vara enkel. Du får ett färdigt system där du bara sköter innehåll och val — vi tar hand om allt tekniskt.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'ar-source-ratt-for-mitt-foretag',
        question: 'Är Source rätt för mitt företag?',
        answer: 'Source passar alla företag som behöver en hemsida, webshop eller en modern kundportal — från små lokala verksamheter till växande e-handelsbolag.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'hur-fungerar-onboarding',
        question: 'Hur fungerar onboardingprocessen?',
        answer: 'Efter att du har valt ett paket guidar vi dig genom en enkel onboardingprocess. Vi hjälper dig att sätta upp ditt konto, konfigurera dina inställningar och komma igång med din hemsida eller webbutik.',
        category: 'kom-igang',
        subcategory: 'Grundläggande frågor',
      },
      {
        id: 'hur-skapar-jag-konto',
        question: 'Hur skapar jag ett Source-konto?',
        answer: 'Du kan skapa ett konto direkt på vår hemsida genom att välja ett paket och följa registreringsprocessen. Vi guidar dig genom varje steg.',
        category: 'kom-igang',
        subcategory: 'Konton & abonnemang',
      },
      {
        id: 'hur-uppgraderar-jag',
        question: 'Hur uppgraderar eller nedgraderar jag mitt abonnemang?',
        answer: 'Du kan ändra ditt abonnemang när som helst från din kundportal. Ändringar träder i kraft från nästa faktureringscykel. Inga avgifter för ändringar.',
        category: 'kom-igang',
        subcategory: 'Konton & abonnemang',
      },
      {
        id: 'hur-avslutar-jag',
        question: 'Hur avslutar jag min tjänst?',
        answer: 'Ingen bindningstid. Säg upp när som helst med en månads uppsägningstid. Du behåller full åtkomst under uppsägningstiden. Vi kan exportera din data vid behov.',
        category: 'kom-igang',
        subcategory: 'Konton & abonnemang',
      },
      {
        id: 'flera-anvandare',
        question: 'Kan flera användare ha åtkomst till samma konto?',
        answer: 'Ja, du kan lägga till personalanvändare med olika behörighetsnivåer. Detta gör det möjligt för ditt team att arbeta tillsammans i samma konto.',
        category: 'kom-igang',
        subcategory: 'Konton & abonnemang',
      },
    ],
  },
  {
    id: 'hemsidor-webbutveckling',
    name: 'Hemsidor & Webbutveckling',
    description: 'Frågor om design, funktioner och innehåll',
    icon: '🌐',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    questions: [
      {
        id: 'bygger-ni-hemsidor',
        question: 'Bygger ni hemsidor åt mig?',
        answer: 'Ja. Vi designar och utvecklar hela din hemsida baserat på dina behov, och kopplar den direkt till din e-handel och kundportal.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'kan-jag-valja-design',
        question: 'Kan jag välja egen design?',
        answer: 'Absolut! Vi arbetar tillsammans med dig för att skapa en design som passar ditt varumärke. Du kan välja mellan våra mallar eller få en helt anpassad design.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'kan-ni-skapa-fran-nuvarande',
        question: 'Kan ni skapa en hemsida från min nuvarande webbplats?',
        answer: 'Ja. Vi kan migrera produkter, innehåll och struktur från din nuvarande plattform till Source utan att du tappar något.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'ar-hemsidorna-mobilanpassade',
        question: 'Är hemsidorna mobilanpassade?',
        answer: 'Ja, alla hemsidor vi bygger är fullt responsiva och mobilanpassade. De fungerar perfekt på alla enheter - mobil, surfplatta och desktop.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'kan-jag-andra-designen',
        question: 'Kan jag ändra designen själv efter lansering?',
        answer: 'Ja, du kan göra många ändringar själv via din kundportal. För större designändringar kan vi hjälpa dig.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'hur-lagger-jag-till-innehall',
        question: 'Hur lägger jag till bilder, text och produkter?',
        answer: 'Du kan enkelt lägga till bilder, text och produkter direkt från din kundportal. Vi guidar dig genom processen och erbjuder support om du behöver hjälp.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Innehåll & språk',
      },
      {
        id: 'stodjer-flera-sprak',
        question: 'Stödjer hemsidorna flera språk?',
        answer: 'Ja, vi kan konfigurera din hemsida för att stödja flera språk. Detta gör det möjligt för dina kunder att välja sitt föredragna språk.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Innehåll & språk',
      },
      {
        id: 'kan-ni-hantera-seo',
        question: 'Kan ni hantera SEO och metadata?',
        answer: 'Ja, vi hjälper dig med SEO-optimering och metadata för att förbättra din sökrankning och synlighet online.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Innehåll & språk',
      },
    ],
  },
  {
    id: 'webbutik-produktadministration',
    name: 'Webbutik & Produktadministration',
    description: 'Produkter, ordrar och frakt',
    icon: '🛒',
    color: 'bg-green-50 border-green-200 text-green-700',
    questions: [
      {
        id: 'hur-lagger-jag-till-produkter',
        question: 'Hur lägger jag till produkter?',
        answer: 'Du kan lägga till produkter direkt från din kundportal. Fyll i produktinformation, bilder, pris och lagerstatus. Processen är enkel och intuitiv.',
        category: 'webbutik-produktadministration',
        subcategory: 'Produkter',
      },
      {
        id: 'stodjer-ni-varianter',
        question: 'Stödjer ni varianter (färg, storlek etc.)?',
        answer: 'Ja, du kan skapa produkter med olika varianter som färg, storlek, material och mer. Varje variant kan ha sitt eget pris och lagerstatus.',
        category: 'webbutik-produktadministration',
        subcategory: 'Produkter',
      },
      {
        id: 'kan-jag-lagga-till-digitala',
        question: 'Kan jag lägga till digitala produkter?',
        answer: 'Ja, vi stödjer digitala produkter. Du kan sälja nedladdningsbara filer, kurser, e-böcker och mer.',
        category: 'webbutik-produktadministration',
        subcategory: 'Produkter',
      },
      {
        id: 'hur-fungerar-lagerhantering',
        question: 'Hur fungerar lagerhantering?',
        answer: 'Vårt system hjälper dig att spåra lagerstatus i realtid. Du får varningar när lagret är lågt och kan enkelt uppdatera kvantiteter.',
        category: 'webbutik-produktadministration',
        subcategory: 'Produkter',
      },
      {
        id: 'hur-ser-jag-bestallningar',
        question: 'Hur ser jag alla beställningar?',
        answer: 'Alla beställningar visas i din kundportal där du kan se orderstatus, kundinformation, betalningsstatus och mer. Du kan också filtrera och söka bland beställningar.',
        category: 'webbutik-produktadministration',
        subcategory: 'Ordrar',
      },
      {
        id: 'hur-hanterar-jag-leveranser',
        question: 'Hur hanterar jag leveranser och orderstatus?',
        answer: 'Du kan uppdatera orderstatus och lägga till spårningsnummer direkt från din kundportal. Kunder får automatiskt uppdateringar via e-post.',
        category: 'webbutik-produktadministration',
        subcategory: 'Ordrar',
      },
      {
        id: 'automatiska-ordermejl',
        question: 'Kan kund få automatiska ordermejl?',
        answer: 'Ja, kunder får automatiskt e-postbekräftelser när de lägger en beställning, när ordern skickas och när den levereras.',
        category: 'webbutik-produktadministration',
        subcategory: 'Ordrar',
      },
      {
        id: 'vilka-fraktleverantorer',
        question: 'Vilka fraktleverantörer kan jag använda?',
        answer: 'Vi stödjer integrationer med PostNord, DHL, Bring och flera andra fraktleverantörer. Du kan också koppla din egen fraktleverantör.',
        category: 'webbutik-produktadministration',
        subcategory: 'Frakt',
      },
      {
        id: 'egna-fraktpriser',
        question: 'Kan jag lägga till egna fraktpriser?',
        answer: 'Ja, du kan konfigurera egna fraktpriser baserat på vikt, värde, destination eller fasta priser. Systemet är flexibelt och anpassningsbart.',
        category: 'webbutik-produktadministration',
        subcategory: 'Frakt',
      },
      {
        id: 'vikt-baserad-frakt',
        question: 'Har ni stöd för vikt-baserad frakt?',
        answer: 'Ja, du kan konfigurera fraktpriser baserat på produktens vikt. Systemet beräknar automatiskt rätt fraktkostnad baserat på totalvikten.',
        category: 'webbutik-produktadministration',
        subcategory: 'Frakt',
      },
    ],
  },
  {
    id: 'kundportal',
    name: 'Kundportal',
    description: 'Kunder, fakturor och betalningslänkar',
    icon: '👥',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    questions: [
      {
        id: 'hur-ser-jag-kunder',
        question: 'Hur ser jag alla kunder?',
        answer: 'Alla dina kunder visas i din kundportal där du kan se deras kontaktinformation, orderhistorik, betalningshistorik och mer.',
        category: 'kundportal',
        subcategory: 'Kunder',
      },
      {
        id: 'vad-kan-jag-gora-fran-profil',
        question: 'Vad kan jag göra från kundens profil?',
        answer: 'Från en kunds profil kan du se deras orderhistorik, skapa fakturor, skicka betalningslänkar, lägga till anteckningar och hantera deras information.',
        category: 'kundportal',
        subcategory: 'Kunder',
      },
      {
        id: 'kan-jag-exportera-kunder',
        question: 'Kan jag exportera eller importera kundlistor?',
        answer: 'Ja, du kan exportera kundlistor i olika format (CSV, Excel) och importera kunder från andra system.',
        category: 'kundportal',
        subcategory: 'Kunder',
      },
      {
        id: 'hur-skapar-jag-fakturor',
        question: 'Hur skapar jag fakturor?',
        answer: 'Du kan skapa fakturor direkt från din kundportal. Fyll i produktinformation, priser och skicka fakturan till kunden via e-post.',
        category: 'kundportal',
        subcategory: 'Fakturor & betalningslänkar',
      },
      {
        id: 'hur-skickar-jag-betalningslankar',
        question: 'Hur skickar jag betalningslänkar?',
        answer: 'Du kan skapa och skicka betalningslänkar direkt från din kundportal. Kunden får en länk via e-post eller SMS och kan betala direkt.',
        category: 'kundportal',
        subcategory: 'Fakturor & betalningslänkar',
      },
      {
        id: 'kan-kunder-se-fakturor',
        question: 'Kan kunderna se sina fakturor på sin portal?',
        answer: 'Ja, kunder kan logga in på sin egen portal och se alla sina fakturor, betalningar och orderhistorik.',
        category: 'kundportal',
        subcategory: 'Fakturor & betalningslänkar',
      },
    ],
  },
  {
    id: 'betalningar-ekonomi',
    name: 'Betalningar & Ekonomi',
    description: 'Stripe, betalmetoder och bokföring',
    icon: '💳',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    questions: [
      {
        id: 'hur-kopplar-jag-stripe',
        question: 'Hur kopplar jag Stripe till Source?',
        answer: 'Vi guidar dig genom processen att koppla ditt Stripe-konto till Source. Det är en enkel process som tar bara några minuter.',
        category: 'betalningar-ekonomi',
        subcategory: 'Stripe & betalmetoder',
      },
      {
        id: 'vilka-betalmetoder',
        question: 'Vilka betalmetoder stödjer ni?',
        answer: 'Kortbetalningar, Apple Pay, Google Pay, Klarna, faktura, Swish, prenumerationer och fler betalalternativ baserat på Stripes utbud.',
        category: 'betalningar-ekonomi',
        subcategory: 'Stripe & betalmetoder',
      },
      {
        id: 'hanterar-ni-prenumerationer',
        question: 'Hanterar ni prenumerationer?',
        answer: 'Ja, vi stödjer prenumerationer och återkommande betalningar. Du kan konfigurera prenumerationsplaner och hantera dem från din kundportal.',
        category: 'betalningar-ekonomi',
        subcategory: 'Stripe & betalmetoder',
      },
      {
        id: 'hur-fungerar-utbetalningar',
        question: 'Hur fungerar utbetalningar?',
        answer: 'Stripe sköter alla kortbetalningar, utbetalningar och kvitton. Du får dem automatiskt kopplade till din statistik, ekonomi och kunddata i Source.',
        category: 'betalningar-ekonomi',
        subcategory: 'Stripe & betalmetoder',
      },
      {
        id: 'hur-funkar-automatiserad-bokforing',
        question: 'Hur funkar automatiserad bokföring?',
        answer: 'Alla transaktioner synkroniseras automatiskt med din bokföring. Du kan koppla Fortnox eller andra bokföringssystem för automatisk import.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'hur-ser-jag-transaktioner',
        question: 'Hur ser jag mina transaktioner?',
        answer: 'Alla transaktioner visas i din kundportal där du kan filtrera, söka och exportera data. Du ser betalningar, utbetalningar och avgifter.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'kan-jag-exportera-bokforing',
        question: 'Kan jag exportera bokföringsunderlag?',
        answer: 'Ja, du kan exportera alla transaktioner och bokföringsunderlag i olika format för import till ditt bokföringssystem.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'hur-fungerar-momsrapportering',
        question: 'Hur fungerar momsrapportering i Source?',
        answer: 'Source hjälper dig att spåra moms på alla transaktioner. Du kan exportera momsrapporter och se moms per period.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
    ],
  },
  {
    id: 'marknadsforing',
    name: 'Marknadsföring',
    description: 'Kampanjer, AI-insights och sociala medier',
    icon: '📢',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    questions: [
      {
        id: 'hur-skapar-jag-kampanj',
        question: 'Hur skapar jag en kampanj?',
        answer: 'Du kan skapa kampanjer direkt från din kundportal. Välj mål, budget, målgrupp och spåra resultat i realtid.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'kan-jag-se-resultat-realtid',
        question: 'Kan jag se resultat i realtid?',
        answer: 'Ja, du kan se kampanjresultat i realtid i din kundportal. Se klick, konverteringar, kostnad per klick och mer.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'hur-fungerar-kampanjsparning',
        question: 'Hur fungerar kampanjspårning och UTM-taggar?',
        answer: 'Vi hjälper dig att konfigurera UTM-taggar för att spåra varje kampanj. Du kan se exakt vilka kampanjer som genererar mest trafik och konverteringar.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'hur-fungerar-ai-rekommendationer',
        question: 'Hur fungerar AI-rekommendationer?',
        answer: 'Vår AI analyserar din data och ger rekommendationer för att förbättra dina kampanjer, öka konverteringar och optimera din marknadsföring.',
        category: 'marknadsforing',
        subcategory: 'AI-Insights',
      },
      {
        id: 'kan-ai-hjalpa-med-annonser',
        question: 'Kan AI hjälpa mig skapa annonser?',
        answer: 'Ja, vår AI kan hjälpa dig att generera annonstexter, förslag på bilder och optimera dina annonser för bättre resultat.',
        category: 'marknadsforing',
        subcategory: 'AI-Insights',
      },
      {
        id: 'vad-betyder-automatisering',
        question: 'Vad betyder "Automatisering sparade X timmar"?',
        answer: 'Detta visar hur många timmar vår AI-automatisering har sparat dig genom att automatiskt hantera uppgifter som annars skulle ta tid att göra manuellt.',
        category: 'marknadsforing',
        subcategory: 'AI-Insights',
      },
      {
        id: 'kan-ni-hjalpa-med-tiktok-meta',
        question: 'Kan ni hjälpa mig med TikTok/Meta-annonser?',
        answer: 'Ja, vi kan hjälpa dig att skapa och optimera annonser för TikTok, Meta (Facebook/Instagram) och andra plattformar.',
        category: 'marknadsforing',
        subcategory: 'Sociala medier & annonsering',
      },
      {
        id: 'hur-kopplar-jag-sociala-kanaler',
        question: 'Hur kopplar jag mina sociala kanaler?',
        answer: 'Du kan koppla dina sociala medier-konton direkt från din kundportal. Vi guidar dig genom processen.',
        category: 'marknadsforing',
        subcategory: 'Sociala medier & annonsering',
      },
      {
        id: 'kan-jag-analysera-kampanjer',
        question: 'Kan jag analysera kampanjer från kundportalen?',
        answer: 'Ja, du kan analysera alla dina kampanjer direkt från din kundportal. Se resultat, jämför kampanjer och få insikter för att förbättra framtida kampanjer.',
        category: 'marknadsforing',
        subcategory: 'Sociala medier & annonsering',
      },
    ],
  },
  {
    id: 'statistik-analys',
    name: 'Statistik & Analys',
    description: 'Dashboard, rapporter och avancerad analys',
    icon: '📊',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    questions: [
      {
        id: 'hur-fungerar-realtidsstatistik',
        question: 'Hur fungerar realtidsstatistiken?',
        answer: 'Din kundportal visar statistik i realtid. Se besökare, sessioner, konverteringar och mer medan de händer.',
        category: 'statistik-analys',
        subcategory: 'Dashboard & rapporter',
      },
      {
        id: 'vad-betyder-visningar-sessioner',
        question: 'Vad betyder visningar, sessioner och klick?',
        answer: 'Visningar är antalet sidvisningar, sessioner är besök på din webbplats och klick är interaktioner med länkar eller knappar.',
        category: 'statistik-analys',
        subcategory: 'Dashboard & rapporter',
      },
      {
        id: 'hur-mats-konverteringsgrad',
        question: 'Hur mäts konverteringsgrad?',
        answer: 'Konverteringsgrad mäts som procent av besökare som utför en önskad åtgärd, som att köpa en produkt eller fylla i ett formulär.',
        category: 'statistik-analys',
        subcategory: 'Dashboard & rapporter',
      },
      {
        id: 'hur-fungerar-kampanjtillvaxt',
        question: 'Hur fungerar kampanjtillväxt och klickspårning?',
        answer: 'Vi spårar alla klick från dina kampanjer och visar hur de bidrar till din tillväxt. Se vilka kampanjer som genererar mest trafik och konverteringar.',
        category: 'statistik-analys',
        subcategory: 'Dashboard & rapporter',
      },
      {
        id: 'vad-ar-attributmodellering',
        question: 'Vad är attributmodellering?',
        answer: 'Attributmodellering hjälper dig att förstå vilka kanaler och kampanjer som bidrar mest till dina konverteringar, även om kunden inte konverterar direkt.',
        category: 'statistik-analys',
        subcategory: 'Avancerad analys',
      },
      {
        id: 'hur-fungerar-pageview-tracking',
        question: 'Hur fungerar Pageview tracking?',
        answer: 'Vi spårar alla sidvisningar på din webbplats för att ge dig detaljerad insikt i hur besökare navigerar och interagerar med din webbplats.',
        category: 'statistik-analys',
        subcategory: 'Avancerad analys',
      },
      {
        id: 'kan-jag-exportera-data',
        question: 'Kan jag exportera datan?',
        answer: 'Ja, du kan exportera all statistikdata i olika format (CSV, Excel, PDF) för vidare analys eller rapportering.',
        category: 'statistik-analys',
        subcategory: 'Avancerad analys',
      },
    ],
  },
  {
    id: 'integrationer',
    name: 'Integrationer',
    description: 'Ekonomi, logistik och API',
    icon: '🔌',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    questions: [
      {
        id: 'kan-jag-koppla-fortnox',
        question: 'Kan jag koppla Fortnox?',
        answer: 'Ja, vi har integration med Fortnox. Du kan automatiskt synkronisera transaktioner och bokföringsdata med ditt Fortnox-konto.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'har-ni-stod-for-bokforing',
        question: 'Har ni stöd för bokföringsintegrationer?',
        answer: 'Ja, vi stödjer integrationer med flera bokföringssystem för automatisk synkronisering av transaktioner och data.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'finns-det-api-atkomst',
        question: 'Finns det API-åtkomst?',
        answer: 'Ja, vi erbjuder API-åtkomst för att integrera Source med dina egna system och automatisera arbetsflöden.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'stodjer-ni-postnord-dhl-bring',
        question: 'Stödjer ni PostNord, DHL eller Bring?',
        answer: 'Ja, vi stödjer integrationer med PostNord, DHL, Bring och flera andra fraktleverantörer för automatisk spårning och hantering av leveranser.',
        category: 'integrationer',
        subcategory: 'Logistik',
      },
      {
        id: 'kan-jag-koppla-egen-frakt',
        question: 'Kan jag koppla min egen fraktleverantör?',
        answer: 'Ja, du kan koppla din egen fraktleverantör via vårt API eller genom att kontakta vår support för att sätta upp en anpassad integration.',
        category: 'integrationer',
        subcategory: 'Logistik',
      },
    ],
  },
  {
    id: 'ai-automatisering',
    name: 'AI & Automatisering',
    description: 'AI-agenter och AI-produktion',
    icon: '🤖',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    questions: [
      {
        id: 'vad-gor-ai-assistenten',
        question: 'Vad gör Source AI-assistenten?',
        answer: 'Source AI-assistenten hjälper dig med allt från att analysera data och generera rapporter till att skapa innehåll och optimera dina kampanjer.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'kan-ai-generera-rapporter',
        question: 'Kan AI generera rapporter?',
        answer: 'Ja, vår AI kan automatiskt generera rapporter baserat på din data. Rapporterna inkluderar insikter, rekommendationer och visuella representationer av din data.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'hur-fungerar-automatiseringar',
        question: 'Hur fungerar automatiseringar?',
        answer: 'Vi erbjuder olika automatiseringar som kan hantera uppgifter automatiskt, som att skicka e-post, uppdatera lagerstatus, generera rapporter och mer.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'kan-ai-skapa-hemsideselement',
        question: 'Kan AI skapa hemsideselement åt mig?',
        answer: 'Ja, vår AI kan hjälpa dig att skapa hemsideselement, förslag på design och innehåll baserat på dina behov och varumärke.',
        category: 'ai-automatisering',
        subcategory: 'AI-produktion',
      },
      {
        id: 'kan-ai-skriva-texter',
        question: 'Kan AI skriva texter eller analysera beteenden?',
        answer: 'Ja, vår AI kan hjälpa dig att skriva texter för din webbplats, analysera kundbeteenden och ge rekommendationer för att förbättra din webbplats.',
        category: 'ai-automatisering',
        subcategory: 'AI-produktion',
      },
    ],
  },
  {
    id: 'gdpr-sakerhet',
    name: 'GDPR & Säkerhet',
    description: 'Dataskydd och säkerhet',
    icon: '🔒',
    color: 'bg-red-50 border-red-200 text-red-700',
    questions: [
      {
        id: 'hur-lagras-min-data',
        question: 'Hur lagras min data?',
        answer: 'Din data lagras säkert i molnet med kryptering och regelbundna säkerhetskopior. Vi följer alla GDPR-regler och säkerhetsstandarder.',
        category: 'gdpr-sakerhet',
        subcategory: 'Dataskydd',
      },
      {
        id: 'ar-source-gdpr-kompatibelt',
        question: 'Är Source GDPR-kompatibelt?',
        answer: 'Ja, Source är fullt GDPR-kompatibelt. Vi följer alla GDPR-regler och hjälper dig att hantera kunddata enligt lagkraven.',
        category: 'gdpr-sakerhet',
        subcategory: 'Dataskydd',
      },
      {
        id: 'hur-hanteras-cookies',
        question: 'Hur hanteras cookies och samtycke?',
        answer: 'Vi hjälper dig att konfigurera cookie-banner och hantera samtycke enligt GDPR. Kunder kan enkelt ge eller återkalla samtycke.',
        category: 'gdpr-sakerhet',
        subcategory: 'Dataskydd',
      },
      {
        id: 'hur-anonymiseras-kunddata',
        question: 'Hur anonymiseras kunddata?',
        answer: 'Vi erbjuder verktyg för att anonymisera kunddata när det behövs, enligt GDPR-krav. Du kan också exportera och radera data vid behov.',
        category: 'gdpr-sakerhet',
        subcategory: 'Dataskydd',
      },
      {
        id: 'ar-betaluppgifter-sakra',
        question: 'Är mina kunders betaluppgifter säkra?',
        answer: 'Ja, alla betalningar hanteras via Stripe som är PCI DSS-certifierad. Vi lagrar aldrig kreditkortsnummer eller känslig betalningsinformation.',
        category: 'gdpr-sakerhet',
        subcategory: 'Säkerhet',
      },
      {
        id: 'har-ni-tvafaktorsinloggning',
        question: 'Har ni tvåfaktorsinloggning?',
        answer: 'Ja, vi erbjuder tvåfaktorsinloggning (2FA) för extra säkerhet. Du kan aktivera det från dina kontoinställningar.',
        category: 'gdpr-sakerhet',
        subcategory: 'Säkerhet',
      },
      {
        id: 'var-finns-era-servrar',
        question: 'Var finns era servrar?',
        answer: 'Våra servrar finns i säkra datacenter i Europa med hög säkerhet och regelbundna säkerhetskopior.',
        category: 'gdpr-sakerhet',
        subcategory: 'Säkerhet',
      },
    ],
  },
  {
    id: 'installningar-konto',
    name: 'Inställningar & Konto',
    description: 'Företagsinställningar och domäner',
    icon: '⚙️',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    questions: [
      {
        id: 'hur-andrar-jag-foretagsinformation',
        question: 'Hur ändrar jag företagsinformation?',
        answer: 'Du kan uppdatera din företagsinformation direkt från din kundportal under inställningar. Ändringar sparas omedelbart.',
        category: 'installningar-konto',
        subcategory: 'Företagsinställningar',
      },
      {
        id: 'hur-lagger-jag-till-logotyp',
        question: 'Hur lägger jag till logotyp och färger?',
        answer: 'Du kan ladda upp din logotyp och välja färger direkt från din kundportal. Ändringarna syns direkt på din webbplats.',
        category: 'installningar-konto',
        subcategory: 'Företagsinställningar',
      },
      {
        id: 'kan-jag-lagga-till-personal',
        question: 'Kan jag lägga till personalanvändare?',
        answer: 'Ja, du kan lägga till personalanvändare med olika behörighetsnivåer. Varje användare kan ha olika åtkomstnivåer.',
        category: 'installningar-konto',
        subcategory: 'Företagsinställningar',
      },
      {
        id: 'kan-jag-anvanda-egen-domän',
        question: 'Kan jag använda min egen domän?',
        answer: 'Ja, du kan använda din egen domän. Vi hjälper dig att konfigurera DNS-inställningar och peka om din domän till Source.',
        category: 'installningar-konto',
        subcategory: 'Domäner',
      },
      {
        id: 'hjalper-ni-att-peka-om-dns',
        question: 'Hjälper ni att peka om DNS?',
        answer: 'Ja, vi guidar dig genom processen att peka om din DNS eller kan hjälpa dig att göra det åt dig om du behöver.',
        category: 'installningar-konto',
        subcategory: 'Domäner',
      },
      {
        id: 'kan-jag-ha-flera-domäner',
        question: 'Kan jag ha flera domäner?',
        answer: 'Ja, du kan koppla flera domäner till ditt konto. Alla domäner kan peka till samma webbplats eller olika webbplatser.',
        category: 'installningar-konto',
        subcategory: 'Domäner',
      },
    ],
  },
  {
    id: 'support-hjalp',
    name: 'Support & Hjälp',
    description: 'Kontakt och vanliga problem',
    icon: '💬',
    color: 'bg-slate-50 border-slate-200 text-slate-700',
    questions: [
      {
        id: 'hur-nar-jag-supporten',
        question: 'Hur når jag supporten?',
        answer: 'Du kan nå vår support via e-post, chatt eller telefon. Supporttider varierar beroende på ditt paket. Se din kundportal för kontaktinformation.',
        category: 'support-hjalp',
        subcategory: 'Kontakt & hjälp',
      },
      {
        id: 'ingar-support-i-priset',
        question: 'Ingår support i priset?',
        answer: 'Ja, support ingår i alla paket. Supportnivån varierar beroende på paket - från e-post till 24/7 chatt och telefon.',
        category: 'support-hjalp',
        subcategory: 'Kontakt & hjälp',
      },
      {
        id: 'har-ni-chatt-telefon-mejl',
        question: 'Har ni chatt, telefon eller mejl?',
        answer: 'Vi erbjuder alla tre kontaktmetoder. Tillgängligheten varierar beroende på ditt paket. Se din kundportal för detaljer.',
        category: 'support-hjalp',
        subcategory: 'Kontakt & hjälp',
      },
      {
        id: 'varfor-fungerar-inte-betalningar',
        question: 'Varför fungerar inte betalningar?',
        answer: 'Kontrollera att ditt Stripe-konto är korrekt kopplat och aktiverat. Om problemet kvarstår, kontakta vår support så hjälper vi dig.',
        category: 'support-hjalp',
        subcategory: 'Vanliga problem',
      },
      {
        id: 'varfor-syns-inte-min-hemsida',
        question: 'Varför syns inte min hemsida?',
        answer: 'Kontrollera att din domän är korrekt konfigurerad och att DNS-inställningarna är korrekta. Om problemet kvarstår, kontakta vår support.',
        category: 'support-hjalp',
        subcategory: 'Vanliga problem',
      },
      {
        id: 'hur-aterstaller-jag-losenord',
        question: 'Hur återställer jag mitt lösenord?',
        answer: 'Klicka på "Glömt lösenord?" på inloggningssidan och följ instruktionerna. Du får en länk via e-post för att återställa ditt lösenord.',
        category: 'support-hjalp',
        subcategory: 'Vanliga problem',
      },
    ],
  },
];

// Helper function to get all questions
export function getAllQuestions(): FAQItem[] {
  return faqCategories.flatMap((category) => category.questions);
}

// Helper function to get category by id
export function getCategoryById(id: string): FAQCategory | undefined {
  return faqCategories.find((cat) => cat.id === id);
}

// Helper function to search questions
export function searchQuestions(query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return getAllQuestions().filter(
    (item) =>
      item.question.toLowerCase().includes(lowerQuery) ||
      item.answer.toLowerCase().includes(lowerQuery)
  );
}



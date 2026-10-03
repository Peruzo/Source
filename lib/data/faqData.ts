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
        answer: 'Efter onboardingen har du din nya hemsida, eller din befintliga hemsida integrerad mot kundportalen, inom 24 timmar.',
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
        id: 'hur-avslutar-jag',
        question: 'Hur avslutar jag min tjänst?',
        answer: 'Ingen bindningstid. Du kan avsluta när som helst. Kontakta oss så hjälper vi dig att exportera eller radera dina uppgifter.',
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
        answer: 'Ja. När hemsidan skapas väljer du stil och färger, antingen en färdig färgpalett eller dina egna färger. Hur många sidor som ingår beror på paketet.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'kan-ni-skapa-fran-nuvarande',
        question: 'Kan ni skapa en hemsida från min nuvarande webbplats?',
        answer: 'Har du redan en hemsida integrerar vi den mot kundportalen i stället för att bygga en ny. Produkter, kassa och kunder hämtas då från kundportalen.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'ar-hemsidorna-mobilanpassade',
        question: 'Är hemsidorna mobilanpassade?',
        answer: 'Ja. Alla hemsidor byggs med responsiv design och anpassar sig efter mobil, surfplatta och dator.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'kan-jag-andra-designen',
        question: 'Kan jag ändra designen själv efter lansering?',
        answer: 'Ja. I kundportalen ändrar du själv ordningen på startsidans sektioner, menyn och hur kategorier, nyheter och prenumerationer visas. Kontakta oss om du vill ändra färger, typsnitt eller grundlayout.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Design & funktioner',
      },
      {
        id: 'hur-lagger-jag-till-innehall',
        question: 'Hur lägger jag till bilder, text och produkter?',
        answer: 'Produkter med bilder lägger du till i kundportalen. Från Growth kan du också publicera nyheter. Kontakta supporten om du vill ändra texter eller bilder på hemsidans sidor.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Innehåll & språk',
      },
      {
        id: 'stodjer-flera-sprak',
        question: 'Stödjer hemsidorna flera språk?',
        answer: 'Inte i dag. Flerspråkiga hemsidor ingår inte i något paket.',
        category: 'hemsidor-webbutveckling',
        subcategory: 'Innehåll & språk',
      },
      {
        id: 'kan-ni-hantera-seo',
        question: 'Kan ni hantera SEO och metadata?',
        answer: 'Det finns inga SEO-verktyg i kundportalen, och SEO ingår inte som en egen tjänst i paketen.',
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
        answer: 'Inte som nedladdningsbara filer. Du kan sälja varor, tjänster, presentkort och prenumerationer.',
        category: 'webbutik-produktadministration',
        subcategory: 'Produkter',
      },
      {
        id: 'hur-fungerar-lagerhantering',
        question: 'Hur fungerar lagerhantering?',
        answer: 'För produkter med lagerspårning dras saldot automatiskt när en order betalas. Du får varningar när lagret är lågt och kan enkelt uppdatera kvantiteter.',
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
        answer: 'I Growth och Enterprise bokar du sändningar med PostNord och följer dem i kundportalen.',
        category: 'webbutik-produktadministration',
        subcategory: 'Ordrar',
      },
      {
        id: 'automatiska-ordermejl',
        question: 'Kan kund få automatiska ordermejl?',
        answer: 'Ja. Kunden får en orderbekräftelse via mejl när beställningen är lagd.',
        category: 'webbutik-produktadministration',
        subcategory: 'Ordrar',
      },
      {
        id: 'vilka-fraktleverantorer',
        question: 'Vilka fraktleverantörer kan jag använda?',
        answer: 'Du kan använda PostNord. I Growth och Enterprise bokar du sändningar med PostNord och följer dem i kundportalen.',
        category: 'webbutik-produktadministration',
        subcategory: 'Frakt',
      },
      {
        id: 'egna-fraktpriser',
        question: 'Kan jag lägga till egna fraktpriser?',
        answer: 'Ja. Du sätter egna priser på PostNords leveranssätt och kan ge fri frakt över ett visst belopp.',
        category: 'webbutik-produktadministration',
        subcategory: 'Frakt',
      },
      {
        id: 'vikt-baserad-frakt',
        question: 'Har ni stöd för vikt-baserad frakt?',
        answer: 'Inte i dag. Fraktpriset sätts per leveranssätt, inte efter vikt.',
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
        answer: 'På kundens profil ser du betalningshistorik och kundens prenumerationer. Du kan pausa, återuppta eller avsluta en prenumeration, byta betalningssätt, skicka en påminnelse om en förfallen faktura och ladda upp avtalsdokument.',
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
        answer: 'Du skapar en betalningslänk i kundportalen och delar den med kunden, som betalar med kort.',
        category: 'kundportal',
        subcategory: 'Fakturor & betalningslänkar',
      },
      {
        id: 'kan-kunder-se-fakturor',
        question: 'Kan kunderna se sina fakturor på sin portal?',
        answer: 'Dina kunder får fakturan via e-post med en betallänk. Kunder med prenumeration kan via en länk i mejlet se sina prenumerationer och kvitton och säga upp prenumerationen själva.',
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
        answer: 'Du kopplar ditt Stripe-konto i onboardingen, och vi guidar dig genom stegen.',
        category: 'betalningar-ekonomi',
        subcategory: 'Stripe & betalmetoder',
      },
      {
        id: 'vilka-betalmetoder',
        question: 'Vilka betalmetoder stödjer ni?',
        answer: 'Kassan tar betalt med kort via Stripe, och pengarna går till ditt eget Stripe-konto. Du kan också ta betalt med betalningslänk, faktura och prenumeration.',
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
        answer: 'I Growth och Enterprise bokförs dina betalningar som verifikat i kundportalen, och du kan skicka dem till Fortnox. Fakturor kan också skapas via Spiris.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'hur-ser-jag-transaktioner',
        question: 'Hur ser jag mina transaktioner?',
        answer: 'Alla betalningar visas i din kundportal, där du kan filtrera och söka bland dem.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'kan-jag-exportera-bokforing',
        question: 'Kan jag exportera bokföringsunderlag?',
        answer: 'Ja. I Growth och Enterprise laddar du ner bokföringsrapporten för varje utbetalning som CSV.',
        category: 'betalningar-ekonomi',
        subcategory: 'Bokföring',
      },
      {
        id: 'hur-fungerar-momsrapportering',
        question: 'Hur hanteras moms i Source?',
        answer: 'Momsen räknas ut per rad på dina fakturor och bokförs på verifikaten i Growth och Enterprise.',
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
        answer: 'I kundportalen skapar du kampanjer med rabattkoder som kunden använder i kassan. Annonser i Google, Meta och TikTok ingår i Enterprise, där vi sköter dem åt dig.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'kan-jag-se-resultat-realtid',
        question: 'Var ser jag kampanjernas resultat?',
        answer: 'I Marknadsföring i din kundportal, som ingår i Enterprise. När du har kopplat ett annonskonto under Integrationer hämtar Source annonsdata från kontot regelbundet. Kopplar du en kanal i din kampanj till en kampanj i annonskontot ser du räckvidd, spend, sessioner, konverteringar, kostnad per konvertering och ROAS för kanalen. Konverteringarna mäts på din egen webbplats.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'hur-fungerar-kampanjsparning',
        question: 'Hur fungerar kampanjspårning och klickspårning?',
        answer: 'När du skapar en kampanj i Marknadsföring får varje kanal en färdig spårningslänk med UTM-taggar och en QR-kod. Besök som kommer via länkarna kopplas till kampanjen. I Marknadsföring ser du sessioner och konverteringar per kampanj och kanal, och i Statistik sessioner per kampanj och trafikkälla. Ingår i Enterprise.',
        category: 'marknadsforing',
        subcategory: 'Kampanjer',
      },
      {
        id: 'hur-fungerar-ai-rekommendationer',
        question: 'Hur fungerar AI-rekommendationer?',
        answer: 'AI-insikter går igenom din data i portalen, till exempel betalningar, kunder, kampanjer och lager, och visar vad de ser, underlaget och en rekommenderad åtgärd. Du kan ställa följdfrågor om en insikt i chatten. Ingår från Growth.',
        category: 'marknadsforing',
        subcategory: 'AI-Insights',
      },
      {
        id: 'kan-ai-hjalpa-med-annonser',
        question: 'Kan AI hjälpa mig skapa annonser?',
        answer: 'Ja, i Enterprise. I Marknadsföring kan AI-assistenten ta fram en kampanjplan med förslag på kanaler, budgetfördelning och rubrik, brödtext och uppmaning per kanal, och skapa annonsbilder utifrån en beskrivning. Du publicerar själv annonserna i respektive annonskonto.',
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
        answer: 'Annonskonton i Google, Meta och TikTok kopplas i Enterprise, där vi sköter annonserna åt dig.',
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
        question: 'Hur fungerar statistiken?',
        answer: 'Statistiken bygger på besöken på din webbplats. Sidvisningar registreras löpande medan besökarna är där, och i din kundportal ser du bland annat besökare, sidvisningar och hur många som har varit aktiva de senaste 15 minuterna.',
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
        id: 'vad-ar-attributmodellering',
        question: 'Vad är attributmodellering?',
        answer: 'Source kopplar varje besök och konvertering till den senaste kampanjen besökaren kom via under besöket. Har besökaren godkänt cookies kan en senare konvertering kopplas till kampanjen som först ledde till webbplatsen. Du ser resultatet per kampanj och kanal i Marknadsföring.',
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
        answer: 'Ja, från Growth. Du kopplar Fortnox under Integrationer. I Bokföring skickar du sedan verifikat som är markerade som klara till Fortnox, ett i taget eller flera samtidigt, och när du skapar en faktura kan du välja att den skapas i Fortnox.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'har-ni-stod-for-bokforing',
        question: 'Har ni stöd för bokföringsintegrationer?',
        answer: 'Ja, i Growth och Enterprise: Fortnox för bokföringen och Spiris för fakturor.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'finns-det-api-atkomst',
        question: 'Finns det API-åtkomst?',
        answer: 'I Enterprise skapar du egna API-nycklar under Statistik.',
        category: 'integrationer',
        subcategory: 'Ekonomi & system',
      },
      {
        id: 'stodjer-ni-postnord-dhl-bring',
        question: 'Vilka fraktbolag stöder ni?',
        answer: 'PostNord. I Growth och Enterprise bokar du sändningar med PostNord och följer dem i kundportalen.',
        category: 'integrationer',
        subcategory: 'Logistik',
      },
      {
        id: 'kan-jag-koppla-egen-frakt',
        question: 'Kan jag koppla min egen fraktleverantör?',
        answer: 'Inte i dag. Frakten i Source fungerar med PostNord.',
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
        answer: 'I kundportalen finns AI-support som svarar på frågor om hur portalen fungerar. I Growth och Enterprise får du också AI-insikter och en chatt där du kan fråga om din egen data.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'kan-ai-generera-rapporter',
        question: 'Kan AI generera rapporter?',
        answer: 'Rapporterna tas fram automatiskt utifrån din data i portalen. De visar nyckeltal jämfört med föregående period, korta noteringar om förändringar och diagram. Ingår från Growth.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'hur-fungerar-automatiseringar',
        question: 'Hur fungerar automatiseringar?',
        answer: 'Flera saker sker automatiskt i portalen. Mejl går till dina kunder vid till exempel order, bokning och faktura, och du slår på och av varje typ. Lagersaldot dras när en order betalas och du får notis vid lågt lager. Rapporter tas fram enligt schema.',
        category: 'ai-automatisering',
        subcategory: 'AI-agenter',
      },
      {
        id: 'kan-ai-skriva-texter',
        question: 'Kan AI skriva texter eller analysera beteenden?',
        answer: 'AI kan skriva förslag på rubrik, brödtext och uppmaning för dina kampanjkanaler i Marknadsföring. AI-insikter analyserar bland annat kunddata och besöksdata och ger rekommendationer utifrån det.',
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
        answer: 'Kontakta oss så hjälper vi dig att exportera eller radera dina uppgifter.',
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
        answer: 'Inloggningen till kundportalen sköts via en säker inloggningstjänst. Har du frågor om tvåfaktorsinloggning är du välkommen att kontakta vår support.',
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
        answer: 'Från Growth laddar du upp logotyp och väljer accentfärg i kundportalen. De används i kassan, i dina mejl och på sidorna där dina kunder gör returer eller hanterar sina prenumerationer. Kontakta oss om du vill ändra logotyp eller färger på själva hemsidan.',
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
        answer: 'Ja. Domänen köper och äger du själv, och vi hjälper dig med domän och DNS när vi kopplar din hemsida i onboardingen. Har du frågor efteråt når du supporten på support@sourcesolutions.se eller 010-641 31 14.',
        category: 'installningar-konto',
        subcategory: 'Domäner',
      },
      {
        id: 'hjalper-ni-att-peka-om-dns',
        question: 'Hjälper ni att peka om DNS?',
        answer: 'Ja. Vid onboardingen hjälper vi dig att peka din domän till hemsidan. För e-post från din egen domän visar kundportalen från Growth vilka DNS-poster du ska lägga in och kontrollerar att de stämmer. Vid frågor når du supporten på support@sourcesolutions.se eller 010-641 31 14.',
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
        answer: 'Via livechatt i kundportalen varje dag 08–20. Därefter skickar du ett ärende därifrån. Enterprise har livechatt även utanför kontorstid.',
        category: 'support-hjalp',
        subcategory: 'Kontakt & hjälp',
      },
      {
        id: 'ingar-support-i-priset',
        question: 'Ingår support i priset?',
        answer: 'Ja, support ingår i alla paket. Alla har livechatt med oss i kundportalen varje dag 08–20 och kan därefter skicka ett ärende. Enterprise har livechatt även utanför kontorstid.',
        category: 'support-hjalp',
        subcategory: 'Kontakt & hjälp',
      },
      {
        id: 'har-ni-chatt-telefon-mejl',
        question: 'Har ni chatt, telefon eller mejl?',
        answer: 'Du når oss via livechatt i kundportalen varje dag 08–20, på växelnumret 010-641 31 14 och på support@sourcesolutions.se.',
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
        answer: 'Kontakta supporten på support@sourcesolutions.se eller 010-641 31 14, så felsöker vi domän och DNS tillsammans med dig.',
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








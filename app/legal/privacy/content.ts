// Integritetspolicyns text som data. Markeringarna [VERIFIERA: …], [KRÄVER FIX], [RUTIN]
// och [BESLUT: …] står kvar ordagrant tills de är åtgärdade; se hasDraftMarkers().

export type PrivacySection = {
  number: number;
  title: string;
  paragraphs: string[];
};

export const privacyTitle = 'Integritetspolicy';

export const privacySubtitle =
  'Source Solutions AB, org.nr 559556-3551 — Senast uppdaterad: [VERIFIERA: publiceringsdatum]';

export const privacySections: PrivacySection[] = [
  {
    number: 1,
    title: 'Om policyn och vem som ansvarar',
    paragraphs: [
      'Den här policyn beskriver hur Source Solutions AB ("Source", "vi"), org.nr 559556-3551, [VERIFIERA: postadress], behandlar personuppgifter och vilka rättigheter du har. Frågor och begäranden skickar du till legal@sourcesolutions.se [VERIFIERA: tar emot post].',
    ],
  },
  {
    number: 2,
    title: 'Vår roll',
    paragraphs: [
      'Vi är personuppgiftsansvariga för uppgifter om besökare på vår webbplats, den som ansöker om konto, kunder och användare av kundportalen och admin-portalen, den som kontaktar vår support, vår egen fakturering, säkerhet och loggar, analys av tjänsten samt leadfunktionen. När våra kunder använder Source för att hantera sina egna kunders uppgifter – till exempel beställningar, bokningar, fakturor, supportärenden och besöksstatistik – är kunden personuppgiftsansvarig och vi personuppgiftsbiträde. Då gäller kundens integritetspolicy och vårt personuppgiftsbiträdesavtal på /legal/dpa.',
    ],
  },
  {
    number: 3,
    title: 'Besökare på webbplatsen',
    paragraphs: [
      'Vi behandlar tekniska uppgifter som IP-adress, webbläsare och vilka sidor som efterfrågas för att visa webbplatsen, skydda den och felsöka, och det du skickar om du kontaktar oss. Rättslig grund: berättigat intresse; behandlingen är begränsad, förväntad och påverkar dig i liten grad. Driftloggar sparas [VERIFIERA: 30 dagar]; förfrågningar medan ärendet pågår och högst 12 månader därefter [RUTIN]. Om kakor, se §16.',
    ],
  },
  {
    number: 4,
    title: 'Om du ansöker om ett konto',
    paragraphs: [
      'Vi behandlar det du anger i ansökan: namn, e-postadress, telefonnummer, företagsnamn, organisationsnummer och adress [VERIFIERA: fält enligt hemsidans inventering]. För enskilda näringsidkare är organisationsnumret detsamma som personnumret. Kontroll av identitet och utbetalningskonto görs av Stripe, som då är självständigt personuppgiftsansvarig enligt sin egen policy. [VERIFIERA: GitHub-koppling och koduppladdning enligt hemsidans inventering.] Ändamål: pröva ansökan och skapa kontot. Rättslig grund: åtgärder innan avtal, eller berättigat intresse när du ansöker för ett företag. Uppgifterna behövs; annars kan vi inte skapa ett konto. Ansökningar som inte godkänns raderas senast 90 dagar efter beslut eller avbrott [RUTIN].',
    ],
  },
  {
    number: 5,
    title: 'Kunder och användare av portalerna',
    paragraphs: [
      'Vi behandlar kontouppgifter som namn, e-post, telefon, roll, behörigheter, inställningar och det företag du representerar. Inloggning sker via Auth0. Ändamål: tillhandahålla tjänsten, hantera konton och skicka meddelanden om tjänsten. Rättslig grund: avtal, eller berättigat intresse när du är användare hos en kund. Uppgifterna sparas medan avtalet gäller och raderas senast 90 dagar efter att det upphört [RUTIN], utom det vi måste spara enligt lag (§7).',
    ],
  },
  {
    number: 6,
    title: 'Support',
    paragraphs: [
      'Vi behandlar kontaktuppgifter, ärendet och vår kommunikation för att hjälpa dig. Rättslig grund: avtal eller berättigat intresse. Sparas under ärendet och högst 24 månader därefter [RUTIN].',
    ],
  },
  {
    number: 7,
    title: 'Fakturering och bokföring',
    paragraphs: [
      'Vi behandlar fakturerings- och betalningsuppgifter för våra egna abonnemang. Kortuppgifter hanteras av Stripe; vi lagrar inga kortnummer. Rättslig grund: avtal och bokföringslagen. Räkenskapsinformation sparas i sju år efter utgången av det kalenderår då räkenskapsåret avslutades.',
    ],
  },
  {
    number: 8,
    title: 'Säkerhet och inloggningar',
    paragraphs: [
      'För att skydda tjänsten och utreda incidenter för vi en säkerhetslogg över viktiga händelser i konton, där IP-adresser bara sparas i hashad form med en hemlig nyckel. Den sparas i två år [KRÄVER FIX]. Vi sparar också inloggningshändelser – IP-adress, webbläsare och enhet samt ungefärligt land, stad och nätoperatör som vi slår upp via tjänsten ipapi.co – i 90 dagar [KRÄVER FIX]. Rättslig grund: berättigat intresse av säkerhet och den skyldighet att skydda uppgifter som GDPR ställer. Uppgifterna används inte till något annat.',
    ],
  },
  {
    number: 9,
    title: 'Analys av tjänsten',
    paragraphs: [
      'Vi analyserar hur tjänsten används – till exempel vilka funktioner som används och var fel uppstår – för att förbättra den, så långt möjligt på sammanställd nivå. Rättslig grund: berättigat intresse; analysen leder inte till beslut om dig och du kan invända enligt §14. [VERIFIERA: lagringstid.]',
    ],
  },
  {
    number: 10,
    title: 'Leadfunktionen',
    paragraphs: [
      '[BESLUT: texten gäller väg a] För att hjälpa kunder att hitta affärskontakter hämtar vi uppgifter om aktiebolag och andra juridiska personer från offentliga register som SCB, till exempel namn, organisationsnummer, bransch och adress. Uppgifter om enskilda firmor och om namngivna kontaktpersoner hämtas inte. Om en uppgift ändå rör dig kan du invända och få den borttagen via legal@sourcesolutions.se. Vi respekterar SCB:s reklamspärr.',
    ],
  },
  {
    number: 11,
    title: 'AI',
    paragraphs: [
      'Vi använder AI som stöd för analyser, insikter och textförslag. Uppgifter kan då behandlas av våra AI-leverantörer (§12). Inga beslut som enbart bygger på automatiserad behandling och som har rättsliga eller liknande betydande följder fattas.',
    ],
  },
  {
    number: 12,
    title: 'Mottagare',
    paragraphs: [
      'Vi säljer aldrig personuppgifter. Leverantörer som behandlar uppgifter för vår räkning: Google Cloud (drift, lagring och AI via Vertex AI, i EU, europe-north1 [VERIFIERA: Vertex-region]), MongoDB Atlas (databas) [VERIFIERA: region], Auth0/Okta (inloggning), Stripe (betalningar och kontroll av konton), Mailchimp/Mandrill (e-post), Anthropic (AI), OpenAI (AI i bokningsassistenten), ipapi.co (uppslag av ort för IP-adress vid inloggning), PostNord (frakt), Fortnox och Spiris (bokföring när kunden kopplar tjänsten). Vi lämnar ut uppgifter till myndigheter när lag kräver det. Listan uppdateras när vi byter leverantör.',
    ],
  },
  {
    number: 13,
    title: 'Överföring utanför EU/EES',
    paragraphs: [
      'När en leverantör behandlar uppgifter utanför EU/EES, till exempel i USA, sker det med stöd av EU-US Data Privacy Framework där leverantören är certifierad, annars med EU-kommissionens standardavtalsklausuler. Information om skyddsåtgärderna lämnas på begäran.',
    ],
  },
  {
    number: 14,
    title: 'Dina rättigheter',
    paragraphs: [
      'Du har rätt till tillgång, rättelse, radering, begränsning, dataportabilitet, att invända mot behandling som grundar sig på berättigat intresse och att återkalla samtycke. Du har alltid rätt att invända mot direktmarknadsföring. Skicka din begäran till legal@sourcesolutions.se; vi svarar inom en månad, som kan förlängas med högst två månader om begäran är omfattande – då meddelar vi dig. Vi kan behöva bekräfta din identitet. Gäller begäran uppgifter där vi är biträde hänvisar vi dig till företaget i fråga och hjälper det.',
    ],
  },
  {
    number: 15,
    title: 'Klagomål',
    paragraphs: [
      'Kontakta oss gärna först. Du har alltid rätt att klaga hos Integritetsskyddsmyndigheten, imy.se.',
    ],
  },
  {
    number: 16,
    title: 'Kakor',
    paragraphs: ['Se vår cookiepolicy på /legal/cookies.'],
  },
  {
    number: 17,
    title: 'Ändringar',
    paragraphs: [
      'Den aktuella versionen finns alltid här, med datum. Vid väsentliga ändringar informerar vi kunder och användare i förväg.',
    ],
  },
];

const DRAFT_MARKERS = ['[VERIFIERA', '[KRÄVER FIX', '[RUTIN', '[BESLUT'];

/** True så länge någon text i policyn innehåller en oifylld markering. */
export function hasDraftMarkers(): boolean {
  const texts = [
    privacyTitle,
    privacySubtitle,
    ...privacySections.flatMap((s) => [s.title, ...s.paragraphs]),
  ];
  return texts.some((t) => DRAFT_MARKERS.some((m) => t.includes(m)));
}

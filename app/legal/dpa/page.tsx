'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = [
  { number: 1, title: 'Parter och roller' },
  { number: 2, title: 'Föremål och varaktighet' },
  { number: 3, title: 'Behandlingens natur och syfte' },
  { number: 4, title: 'Kategorier av personuppgifter' },
  { number: 5, title: 'Registrerade' },
  { number: 6, title: 'Instruktioner' },
  { number: 7, title: 'Säkerhet (Art. 32 GDPR)' },
  { number: 8, title: 'Underbiträden (Sub-processors)' },
  { number: 9, title: 'Överföringar till tredje land' },
  { number: 10, title: 'Bistånd till Kunden' },
  { number: 11, title: 'Personuppgiftsincidenter' },
  { number: 12, title: 'Audit (Art. 28(3)(h))' },
  { number: 13, title: 'Radering och återlämning' },
  { number: 14, title: 'Sekretess' },
  { number: 15, title: 'Ansvar' },
  { number: 16, title: 'Prioritet' },
  { number: 17, title: 'Gällande lag' },
  { number: 18, title: 'Processor Warranties' },
  { number: 19, title: 'Art. 30 Records' },
  { number: 20, title: 'Ikraftträdande' },
];

export default function DPAPage() {
  const [activeSection, setActiveSection] = useState<number>(1);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ number }) => {
      const el = document.getElementById(`section-${number}`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(number);
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (number: number) => {
    const el = document.getElementById(`section-${number}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* Navbar */}
      <nav
        style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1e293b' }}
        className="sticky top-0 z-50 px-6 py-4"
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-tight hover:text-green-400 transition-colors">
            Source
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tillbaka
          </Link>
        </div>
      </nav>

      {/* Main layout */}
      <div className="max-w-[1100px] mx-auto px-4 py-12 flex gap-10 items-start">

        {/* Sidebar */}
        <aside
          className="hidden lg:block flex-shrink-0"
          style={{ width: '260px', position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
        >
          <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">Innehåll</p>
          <nav className="space-y-0.5">
            {sections.map(({ number, title }) => {
              const isActive = activeSection === number;
              return (
                <button
                  key={number}
                  onClick={() => scrollTo(number)}
                  className="w-full text-left flex items-baseline gap-2 px-2 py-1.5 rounded text-sm transition-colors"
                  style={{
                    color: isActive ? '#22c55e' : '#94a3b8',
                    backgroundColor: isActive ? 'rgba(34,197,94,0.08)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#86efac';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  }}
                >
                  <span
                    className="text-xs tabular-nums flex-shrink-0"
                    style={{ color: isActive ? '#22c55e' : '#475569', minWidth: '28px' }}
                  >
                    §{number}
                  </span>
                  <span className="truncate">{title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* Mobile TOC */}
          <details className="lg:hidden mb-8 border border-slate-800 rounded-xl overflow-hidden">
            <summary
              className="px-5 py-4 cursor-pointer text-sm font-semibold text-green-400 select-none"
              style={{ backgroundColor: '#111827' }}
            >
              Innehåll (§1–§20)
            </summary>
            <div className="px-5 py-4 grid grid-cols-2 gap-1" style={{ backgroundColor: '#0f172a' }}>
              {sections.map(({ number, title }) => (
                <button
                  key={number}
                  onClick={() => {
                    scrollTo(number);
                    const details = document.querySelector('details');
                    if (details) details.removeAttribute('open');
                  }}
                  className="text-left text-xs py-1 px-1 text-slate-400 hover:text-green-400 transition-colors flex gap-1.5 items-baseline"
                >
                  <span className="text-slate-600 flex-shrink-0">§{number}</span>
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
          </details>

          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3" style={{ color: '#f0fdf4' }}>
              Personuppgiftsbiträdesavtal{' '}
              <span className="text-green-500">(DPA)</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Source Solutions AB, org.nr 559556-3551 &mdash; Senast uppdaterad: 2026-04-10
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Kunden är den juridiska person som registrerat konto i Tjänsten.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-0">

            {/* §1 */}
            <section id="section-1" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§1</span> Parter och roller
              </h2>
              <p className="text-slate-300 mb-2">
                Detta personuppgiftsbiträdesavtal (&quot;DPA&quot;) ingås mellan:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>Kunden (personuppgiftsansvarig)</li>
                <li>Source Solutions AB (&quot;Bolaget&quot;, personuppgiftsbiträde)</li>
              </ul>
              <p className="text-slate-300 mb-2">
                Bolaget behandlar personuppgifter endast för Kundens räkning i samband med tillhandahållandet av Tjänsten.
              </p>
              <p className="text-slate-300 mb-2">Bolaget agerar dock som självständig personuppgiftsansvarig för:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>säkerhetsloggar</li>
                <li>autentisering</li>
                <li>fakturering</li>
                <li>intern analys</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §2 */}
            <section id="section-2" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§2</span> Föremål och varaktighet
              </h2>
              <p className="text-slate-300 mb-2">Detta DPA gäller så länge Bolaget behandlar personuppgifter för Kundens räkning.</p>
              <p className="text-slate-300 mb-2">Behandling får inte påbörjas innan detta DPA är ingånget.</p>
              <p className="text-slate-300">Detta DPA upphör att gälla när behandlingen av Kundens personuppgifter avslutas i samband med att Tjänsten upphör enligt ToS.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §3 */}
            <section id="section-3" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§3</span> Behandlingens natur och syfte
              </h2>
              <p className="text-slate-300 mb-2">Behandling sker för att:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>tillhandahålla kundportal, webbplats och tjänstefunktioner</li>
                <li>hantera kommunikation och meddelanden</li>
                <li>analysera användning och förbättra tjänsten</li>
                <li>möjliggöra marknadsföring och annonsering (om aktiverat av Kunden)</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §4 */}
            <section id="section-4" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§4</span> Kategorier av personuppgifter
              </h2>
              <p className="text-slate-300 mb-2">Innefattar normalt:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>namn, e-post, kontaktuppgifter</li>
                <li>IP-adress och enhetsdata</li>
                <li>användarbeteende (pageviews, interaktioner)</li>
                <li>meddelandeinnehåll</li>
                <li>kundspecifik data som Kunden själv tillför inom ramen för Tjänsten</li>
              </ul>
              <p className="text-slate-300">
                Behandling av känsliga personuppgifter enligt GDPR artikel 9 kräver separat skriftlig överenskommelse och särskilda skyddsåtgärder.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §5 */}
            <section id="section-5" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§5</span> Registrerade
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Kundens anställda, administratörer och kontaktpersoner</li>
                <li>Kundens kunder/slutanvändare</li>
                <li>webbplatsbesökare</li>
                <li>användare av Kundens tjänster</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §6 */}
            <section id="section-6" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§6</span> Instruktioner
              </h2>
              <p className="text-slate-300 mb-2">Bolaget behandlar endast personuppgifter:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>enligt detta avtal</li>
                <li>enligt Kundens dokumenterade instruktioner</li>
              </ul>
              <p className="text-slate-300 mb-2">Kunden ansvarar för att instruktionerna är lagliga.</p>
              <p className="text-slate-300 mb-2">
                Om Bolaget anser att en instruktion strider mot GDPR eller annan tillämplig dataskyddslagstiftning ska Bolaget utan dröjsmål underrätta Kunden.
              </p>
              <p className="text-slate-300">
                Om Bolaget är skyldigt enligt unionsrätt eller nationell rätt att behandla personuppgifter utan Kundens instruktion ska Kunden informeras om detta innan behandlingen sker, om inte sådan information är förbjuden enligt lag.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §7 */}
            <section id="section-7" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§7</span> Säkerhet (Art. 32 GDPR)
              </h2>
              <p className="text-slate-300 mb-2">Bolaget implementerar lämpliga tekniska och organisatoriska åtgärder, inklusive:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>åtkomstkontroller</li>
                <li>kryptering av personuppgifter där det är tekniskt och organisatoriskt lämpligt</li>
                <li>loggning och övervakning</li>
                <li>redundans och incidenthantering</li>
              </ul>
              <p className="text-slate-300 mb-2">Säkerhetsnivån motsvarar ISO/IEC 27001, SOC 2 Type II eller motsvarande standard.</p>
              <p className="text-slate-300 mb-2">Bolaget säkerställer:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>pseudonymisering där lämpligt</li>
                <li>kontinuerlig konfidentialitet, integritet, tillgänglighet och motståndskraft</li>
                <li>förmåga att återställa tillgänglighet i rimlig tid vid incident</li>
                <li>regelbunden testning och utvärdering av säkerhetsåtgärder</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §8 */}
            <section id="section-8" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§8</span> Underbiträden (Sub-processors)
              </h2>
              <p className="text-slate-300 mb-2">Bolaget använder följande underbiträden:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>Stripe – betalningar</li>
                <li>Auth0 – autentisering</li>
                <li>Fortnox – bokföring</li>
                <li>Google (Analytics/Ads) – analys och annonsering</li>
                <li>Meta – annonsering</li>
                <li>
                  TikTok – annonsering{' '}
                  <span className="text-slate-500 text-xs">
                    (TikTok kan innebära regulatorisk risk. Bolaget kan avsluta denna integration utan förvarning om rättsläget kräver det.)
                  </span>
                </li>
                <li>LinkedIn – annonsering</li>
                <li>SendGrid – e-post</li>
              </ul>
              <p className="text-slate-300 mb-2">
                Bolaget säkerställer att samtliga underbiträden är bundna av dataskyddsförpliktelser som motsvarar de dataskyddsförpliktelser som framgår av detta DPA, i enlighet med GDPR artikel 28(4).
              </p>
              <p className="text-slate-300 mb-2">Ändringar:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Kunden informeras minst 14 dagar i förväg</li>
                <li>Kunden har rätt att invända</li>
                <li>Vid invändning har Kunden rätt att säga upp avtalet</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §9 */}
            <section id="section-9" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§9</span> Överföringar till tredje land
              </h2>
              <p className="text-slate-300 mb-2">Överföringar sker endast via:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>EU Standard Contractual Clauses (SCC)</li>
                <li>EU-US Data Privacy Framework (DPF)</li>
              </ul>
              <p className="text-slate-300">Information om skyddsåtgärder tillhandahålls på begäran.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §10 */}
            <section id="section-10" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§10</span> Bistånd till Kunden (Art. 28(3)(e) &amp; (f))
              </h2>
              <p className="text-slate-300 mb-2">Bolaget bistår Kunden med:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>hantering av registrerades rättigheter (Art. 12–22)</li>
                <li>konsekvensbedömningar (DPIA)</li>
                <li>konsultation med tillsynsmyndighet</li>
                <li>säkerhetsincidenter (Art. 34)</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §11 */}
            <section id="section-11" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§11</span> Personuppgiftsincidenter (Art. 33)
              </h2>
              <p className="text-slate-300 mb-2">
                Bolaget ska utan onödigt dröjsmål och senast inom 48 timmar från det att Bolaget fått kännedom om incidenten meddela Kunden.
              </p>
              <p className="text-slate-300 mb-2">Meddelandet ska innehålla:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>incidentens art</li>
                <li>kategorier av uppgifter</li>
                <li>antal registrerade (om möjligt)</li>
                <li>konsekvenser</li>
                <li>vidtagna åtgärder</li>
              </ul>
              <p className="text-slate-300 mb-2">Bolaget ska tillhandahålla uppdaterad information allteftersom undersökningen fortskrider.</p>
              <p className="text-slate-300">
                Föranmälan kan ske utan fullständig information om sådan information inte är tillgänglig inom 48 timmar. Saknad information ska tillhandahållas utan ytterligare onödigt dröjsmål.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §12 */}
            <section id="section-12" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§12</span> Audit (Art. 28(3)(h))
              </h2>
              <p className="text-slate-300 mb-2">Kunden har rätt att granska Bolagets efterlevnad enligt följande:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>30 dagars varsel</li>
                <li>max 1 gång per år</li>
                <li>max 2 arbetsdagar</li>
              </ul>
              <p className="text-slate-300 mb-2">Revision:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>omfattas av sekretess</li>
                <li>får inte inkludera andra kunders data</li>
              </ul>
              <p className="text-slate-300 mb-2">Bolaget kan ersätta revision med: ISO 27001 eller SOC 2 Type II rapport.</p>
              <p className="text-slate-300 mb-2">
                Kunden ska säkerställa att revisorer eller representanter som genomför revision är bundna av sekretess och inte lämnar ut information om Bolagets system, processer eller teknik till tredje part.
              </p>
              <p className="text-slate-300 mb-2">Kostnad:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>Standard GDPR-skyldigheter är kostnadsfria</li>
                <li>Extra revision utanför normal omfattning kräver förhandsgodkännande och kommunicerad kostnad</li>
              </ul>
              <p className="text-slate-300 mb-2">Utökad revision tillåts vid:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>myndighetskrav</li>
                <li>legitima compliance-behov</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §13 */}
            <section id="section-13" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§13</span> Radering och återlämning
              </h2>
              <p className="text-slate-300 mb-2">Efter avtalets upphörande:</p>
              <p className="text-slate-300 mb-2">
                På Kundens begäran ska Bolaget, i stället för radering, återlämna samtliga personuppgifter i ett maskinläsbart format (t.ex. CSV, JSON eller motsvarande).
              </p>
              <p className="text-slate-300 mb-2">I annat fall raderas data inom 30–90 dagar efter avtalets upphörande.</p>
              <p className="text-slate-300 mb-2">Kunden kan begära bekräftelse på radering.</p>
              <p className="text-slate-300 mb-2">
                Detta inkluderar även säkerhetskopior, som raderas eller skrivs över inom maximalt 90 dagar från det att primär radering genomförts.
              </p>
              <p className="text-slate-300">
                Radering sker med undantag för personuppgifter som Bolaget är skyldigt att behålla enligt lag. I sådana fall ska Kunden informeras om vilka uppgifter som bevaras, på vilken rättslig grund och under vilken tidsperiod.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §14 */}
            <section id="section-14" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§14</span> Sekretess
              </h2>
              <p className="text-slate-300 mb-2">Bolaget säkerställer att personal som behandlar personuppgifter:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>är bundna av sekretess</li>
                <li>endast har tillgång vid behov</li>
              </ul>
              <p className="text-slate-300 mb-2">Sekretess gäller även efter avtalets upphörande.</p>
              <p className="text-slate-300">
                Bolaget säkerställer att även underbiträden och deras personal omfattas av motsvarande sekretesskrav.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §15 */}
            <section id="section-15" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§15</span> Ansvar
              </h2>
              <p className="text-slate-300 mb-2">Detta DPA kompletterar ToS. Ansvar regleras enligt ToS, inklusive:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>ansvarsbegränsning</li>
                <li>indemnification</li>
              </ul>
              <p className="text-slate-300 mb-2">Regulatoriska böter omfattas inte av avtalsmässiga ansvarsbegränsningar.</p>
              <p className="text-slate-300 mb-2">Detta påverkar inte ansvar enligt GDPR artikel 82.</p>
              <p className="text-slate-300">
                Om Bolaget hålls ansvarigt för skada enligt GDPR artikel 82(4) som helt eller delvis beror på Kundens agerande eller underlåtenhet, har Bolaget rätt att kräva ersättning av Kunden i motsvarande mån.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §16 */}
            <section id="section-16" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§16</span> Prioritet
              </h2>
              <p className="text-slate-300">
                Vid konflikt mellan detta DPA och ToS gäller detta DPA för personuppgiftsfrågor.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §17 */}
            <section id="section-17" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§17</span> Gällande lag
              </h2>
              <p className="text-slate-300">
                Detta DPA regleras av svensk lag i enlighet med ToS, med beaktande av GDPR.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §18 */}
            <section id="section-18" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§18</span> Processor Warranties
              </h2>
              <p className="text-slate-300 mb-2">Bolaget garanterar att:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>behandling sker i enlighet med detta DPA och GDPR</li>
                <li>lämpliga säkerhetsåtgärder upprätthålls</li>
                <li>Bolaget informerar Kunden utan onödigt dröjsmål om väsentliga förändringar som påverkar efterlevnaden av detta DPA eller GDPR</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §19 */}
            <section id="section-19" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§19</span> Art. 30 Records
              </h2>
              <p className="text-slate-300">
                Bolaget ska föra register över behandlingsaktiviteter i enlighet med GDPR artikel 30(2), inklusive kategorier av behandling, mottagare samt, i tillämpliga fall, överföringar till tredje land, säkerhetsåtgärder och tillhandahålla dessa på begäran.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §20 */}
            <section id="section-20" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§20</span> Ikraftträdande
              </h2>
              <p className="text-slate-300">
                Detta DPA anses ingånget när Kunden accepterar Tjänstens allmänna villkor, förutsatt att Kunden haft möjlighet att ta del av detta DPA, varvid detta DPA utgör en bindande del av avtalet mellan parterna i enlighet med GDPR artikel 28(9).
              </p>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-4">Relaterade dokument:</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/legal/terms" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                Allmänna Villkor (ToS)
              </Link>
              <Link href="/legal/privacy" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                Integritetspolicy
              </Link>
            </div>
            <p className="text-slate-600 text-xs mt-8">
              &copy; {new Date().getFullYear()} Source Solutions AB. Alla rättigheter förbehållna.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}

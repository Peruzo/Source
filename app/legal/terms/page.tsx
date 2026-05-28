'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = [
  { number: 1, title: 'Definitioner' },
  { number: 2, title: 'Avtalets omfattning' },
  { number: 3, title: 'Konto' },
  { number: 4, title: 'Användning' },
  { number: 5, title: 'Multi-tenant' },
  { number: 6, title: 'Dataskydd' },
  { number: 7, title: 'Spårning och profilering' },
  { number: 8, title: 'AI' },
  { number: 9, title: 'Betalningar' },
  { number: 10, title: 'Avgifter' },
  { number: 11, title: 'Tredjepart' },
  { number: 12, title: 'Underbiträden' },
  { number: 13, title: 'Dataöverföring' },
  { number: 14, title: 'Hosting och DNS' },
  { number: 15, title: 'DSA och innehåll' },
  { number: 16, title: 'Säkerhet' },
  { number: 17, title: 'Incidenter' },
  { number: 18, title: 'Ansvarsbegränsning' },
  { number: 19, title: 'Skadeslöshet' },
  { number: 20, title: 'Uppsägning' },
  { number: 21, title: 'Data' },
  { number: 22, title: 'Ändringar' },
  { number: 23, title: 'Lag' },
  { number: 24, title: 'Slutbestämmelser' },
  { number: 25, title: 'Revision' },
  { number: 26, title: 'Force majeure' },
  { number: 27, title: 'Konfidentialitet' },
  { number: 28, title: 'Överlåtelse' },
  { number: 29, title: '"As is" disclaimer' },
];

export default function TermsPage() {
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

          {/* Mobile sidebar TOC */}
          <details className="lg:hidden mb-8 border border-slate-800 rounded-xl overflow-hidden">
            <summary
              className="px-5 py-4 cursor-pointer text-sm font-semibold text-green-400 select-none"
              style={{ backgroundColor: '#111827' }}
            >
              Innehåll (§1–§29)
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
              Allmänna Villkor{' '}
              <span className="text-green-500">(Terms of Service)</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Source Solutions AB &mdash; Senast uppdaterad: 2026-04-10
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-0">

            {/* §1 */}
            <section id="section-1" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§1</span> Definitioner
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><span className="text-slate-100 font-medium">"Bolaget"</span>: Source Solutions AB</li>
                <li><span className="text-slate-100 font-medium">"Tjänsten"</span>: SaaS-plattform inklusive kundportal, analys, kommunikation, hosting, domän och betalningar</li>
                <li><span className="text-slate-100 font-medium">"Kund"</span>: användare av Tjänsten</li>
                <li><span className="text-slate-100 font-medium">"Slutanvändare"</span>: individ vars data behandlas av Kunden via Tjänsten</li>
                <li><span className="text-slate-100 font-medium">"Personuppgifter"</span>: enligt GDPR</li>
                <li><span className="text-slate-100 font-medium">"Tredjepartstjänster"</span>: externa integrationer</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §2 */}
            <section id="section-2" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§2</span> Avtalets omfattning
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Bolaget tillhandahåller teknisk infrastruktur.</li>
                <li>Kunden ansvarar för användning och laglighet.</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §3 */}
            <section id="section-3" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§3</span> Konto
              </h2>
              <p className="text-slate-300">Kunden ansvarar för konto, åtkomst och säkerhet.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §4 */}
            <section id="section-4" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§4</span> Användning
              </h2>
              <p className="text-slate-300 mb-2">Förbjudet:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>olaglig användning</li>
                <li>behandling utan laglig grund</li>
                <li>intrång</li>
              </ul>
              <p className="text-slate-300">Kunden ansvarar för att följa tillämplig lagstiftning vid användning av Tjänsten.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §5 */}
            <section id="section-5" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§5</span> Multi-tenant
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>Kunden = personuppgiftsansvarig</li>
                <li>Bolaget = personuppgiftsbiträde</li>
              </ul>
              <p className="text-slate-300 mb-2">Säkerhet enligt ISO/IEC 27001 och SOC 2 Type II eller motsvarande.</p>
              <p className="text-slate-300">Kunden accepterar att delad infrastruktur innebär inneboende risker och att Bolaget inte ansvarar för obehörig åtkomst som uppstår trots implementerade skyddsåtgärder.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §6 */}
            <section id="section-6" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§6</span> Dataskydd
              </h2>
              <p className="text-slate-300 mb-2">DPA enligt GDPR art. 28 måste vara ingånget innan behandling av personuppgifter påbörjas. DPA utgör en integrerad del av avtalet.</p>
              <p className="text-slate-300 mb-2">Bolaget agerar som självständig personuppgiftsansvarig för:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>säkerhetsloggar</li>
                <li>autentisering</li>
                <li>fakturering</li>
                <li>intern analys</li>
              </ul>
              <p className="text-slate-300 mb-2">Bolaget bistår Kunden enligt GDPR, inklusive hantering av registrerades rättigheter enligt artiklarna 12–22 samt skyldigheter enligt artikel 34.</p>
              <p className="text-slate-300">Vid gemensam behandling ska avtal enligt GDPR art. 26 ingås innan sådan behandling.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §7 */}
            <section id="section-7" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§7</span> Spårning och profilering
              </h2>
              <p className="text-slate-300 mb-2">Profilering används för analys.</p>
              <p className="text-slate-300 mb-2">Rättslig grund:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>samtycke</li>
                <li>berättigat intresse</li>
              </ul>
              <p className="text-slate-300 mb-2">Intresseavvägning finns i integritetspolicyn. Profileringens logik, betydelse och konsekvenser framgår av integritetspolicyn.</p>
              <p className="text-slate-300 mb-2">Om profilering används för automatiserade beslut med rättslig eller liknande effekt gäller §8.</p>
              <p className="text-slate-300 mb-2">Kunden ansvarar för:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>CMP</li>
                <li>Google Consent Mode v2</li>
                <li>efterlevnad av GDPR och ePrivacy</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §8 */}
            <section id="section-8" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§8</span> AI
              </h2>
              <p className="text-slate-300 mb-2">AI används som stöd.</p>
              <p className="text-slate-300 mb-2">Vid GDPR art. 22 ska:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>människa kunna påverka beslut</li>
                <li>beslut baseras på tillräcklig information</li>
                <li>granskning inte vara automatiserad</li>
              </ul>
              <p className="text-slate-300 mb-2">Kunden garanterar efterlevnad. Vid brott har Bolaget rätt att:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>begränsa funktioner</li>
                <li>stänga av Tjänsten</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §9 */}
            <section id="section-9" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§9</span> Betalningar
              </h2>
              <p className="text-slate-300 mb-2">Stripe används. Bolaget:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>lagrar inte kortdata</li>
                <li>är inte del av PCI CDE</li>
                <li>behandlar inte kortdata via API/webhooks</li>
              </ul>
              <p className="text-slate-300 mb-2">Stripe är PCI-DSS Level 1-certifierad.</p>
              <p className="text-slate-300 mb-2">Kunden ansvarar för sin egen PCI-DSS efterlevnad där tillämpligt.</p>
              <p className="text-slate-300 mb-2">Kunden ansvarar för att acceptera Stripes villkor innan betalningsfunktioner används.</p>
              <p className="text-slate-300">Kunden ansvarar för chargebacks, återbetalningar och betalningsrelaterade tvister.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §10 */}
            <section id="section-10" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§10</span> Avgifter
              </h2>
              <p className="text-slate-300 mb-2">Abonnemang eller usage. Ej återbetalning om ej annat anges.</p>
              <p className="text-slate-300 mb-2">Vid gratis testperiod:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Kunden informeras innan debitering.</li>
                <li>B2C-kunder måste ge uttryckligt godkännande innan en testperiod övergår till betald tjänst.</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §11 */}
            <section id="section-11" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§11</span> Tredjepart
              </h2>
              <p className="text-slate-300 mb-2">Bolaget ansvarar endast för:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>implementation</li>
                <li>konfiguration</li>
                <li>API</li>
                <li>datamappning</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §12 */}
            <section id="section-12" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§12</span> Underbiträden
              </h2>
              <p className="text-slate-300 mb-2">Följande underbiträden används:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>Stripe – betalningar</li>
                <li>Auth0 – autentisering</li>
                <li>Fortnox – bokföring</li>
                <li>Google – analys och annonsering</li>
                <li>Meta – annonsering</li>
                <li>TikTok – annonsering</li>
                <li>LinkedIn – annonsering</li>
                <li>SendGrid – e-post</li>
              </ul>
              <p className="text-slate-300 mb-2">Bolaget säkerställer motsvarande dataskyddsnivå.</p>
              <p className="text-slate-300 mb-2">TikTok kan innebära regulatorisk risk och kan avslutas utan förvarning om rättsläget kräver det.</p>
              <p className="text-slate-300">Ändringar meddelas minst 14 dagar i förväg. Kunden har rätt att invända och säga upp avtalet.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §13 */}
            <section id="section-13" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§13</span> Dataöverföring
              </h2>
              <p className="text-slate-300 mb-2">Sker via:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>SCC</li>
                <li>EU-US DPF</li>
              </ul>
              <p className="text-slate-300">Information om skyddsåtgärder kan tillhandahållas på begäran.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §14 */}
            <section id="section-14" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§14</span> Hosting och DNS
              </h2>
              <p className="text-slate-300 mb-2">Ingen garanti för tillgänglighet eller funktion.</p>
              <p className="text-slate-300 mb-2">Bolaget ansvarar inte för innehåll publicerat av Kunden.</p>
              <p className="text-slate-300 mb-2">Bolaget ansvarar inte för DNS-fel oavsett orsak, förutsatt att följande åtgärder är implementerade:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>redundans</li>
                <li>övervakning</li>
                <li>ändringskontroller</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §15 */}
            <section id="section-15" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§15</span> DSA och innehåll
              </h2>
              <p className="text-slate-300 mb-2">
                Kontakt:{' '}
                <a href="mailto:legal@sourcesolutions.se" className="text-green-400 hover:text-green-300 underline">
                  legal@sourcesolutions.se
                </a>
              </p>
              <p className="text-slate-300 mb-2">
                Kontaktpunkt för EU-myndigheter:{' '}
                <a href="mailto:legal@sourcesolutions.se" className="text-green-400 hover:text-green-300 underline">
                  legal@sourcesolutions.se
                </a>
              </p>
              <p className="text-slate-300 mb-2">Anmälan ska innehålla: identifiering, beskrivning, kontakt.</p>
              <p className="text-slate-300 mb-2">Åtgärd: 24–72h, omedelbart vid uppenbart olagligt innehåll. Beslut meddelas med motivering.</p>
              <p className="text-slate-300 mb-2">UGC/chat: omfattas av samma regler. Akut innehåll tas bort direkt, övrigt hanteras inom 24–72h från anmälan.</p>
              <p className="text-slate-300 mb-2">Överklagan: 14 dagar, oberoende granskning.</p>
              <p className="text-slate-300">Transparens: enligt DSA art. 15, frivilligt vid undantag enligt art. 15(4).</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §16 */}
            <section id="section-16" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§16</span> Säkerhet
              </h2>
              <p className="text-slate-300">Skydd enligt ISO/IEC 27001 och SOC 2 Type II eller motsvarande.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §17 */}
            <section id="section-17" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§17</span> Incidenter
              </h2>
              <p className="text-slate-300 mb-2">Meddelas inom 48 timmar från det att Bolaget fått kännedom om incidenten. Inkluderar:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>incidentens art</li>
                <li>datakategorier</li>
                <li>antal registrerade</li>
                <li>konsekvenser</li>
                <li>åtgärder</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §18 */}
            <section id="section-18" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§18</span> Ansvarsbegränsning
              </h2>
              <p className="text-slate-300 mb-2">Bolaget ansvarar inte för indirekta, följd-, särskilda eller tillfälliga skador, inklusive dataförlust, intäktsförlust eller affärsavbrott, även om Bolaget informerats om risken.</p>
              <p className="text-slate-300 mb-2">Ansvar begränsas till det högre av:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>avgifter senaste 6 månader</li>
                <li>10 000 SEK</li>
              </ul>
              <p className="text-slate-300 mb-2">Separat ansvarsbegränsning gäller för personuppgiftsrelaterade krav.</p>
              <p className="text-slate-300 mb-2">Gäller inte: lagstadgat ansvar, personskada, grov vårdslöshet.</p>
              <p className="text-slate-300">Gäller inte regulatoriska böter.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §19 */}
            <section id="section-19" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§19</span> Skadeslöshet
              </h2>
              <p className="text-slate-300 mb-2">Kunden ersätter Bolaget för krav inklusive regulatoriska sanktioner.</p>
              <p className="text-slate-300 mb-2">Bolaget informerar inom 10 arbetsdagar från det att Bolaget fått kännedom om kravet. Kunden kontrollerar försvar.</p>
              <p className="text-slate-300 mb-2">Bolaget har rätt att delta i försvar och använda egen rådgivare på egen bekostnad. Bolaget ska samarbeta genom att tillhandahålla dokumentation och möjliggöra tillgång till relevant personal.</p>
              <p className="text-slate-300 mb-2">Bolaget är inte skyldigt att delta i rättsprocesser utanför EU utan särskild överenskommelse.</p>
              <p className="text-slate-300 mb-2">Förlikning får inte ske utan Kundens skriftliga godkännande, vilket inte oskäligt får vägras. Om Kunden oskäligt vägrar godkänna rimlig förlikning begränsas ersättningsskyldigheten till det föreslagna beloppet.</p>
              <p className="text-slate-300">Kundens ersättningsskyldighet enligt denna paragraf är inte begränsad av ansvarsbegränsningen i §18.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §20 */}
            <section id="section-20" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§20</span> Uppsägning
              </h2>
              <p className="text-slate-300 mb-2">Kunden kan avsluta när som helst.</p>
              <p className="text-slate-300 mb-2">Bolaget kan avsluta vid säkerhetsrisk eller lagkrav.</p>
              <p className="text-slate-300 mb-2">Bolaget har rätt att säga upp avtalet med 30 dagars varsel vid avtalsbrott som inte omedelbart måste åtgärdas, eller av affärsmässiga skäl.</p>
              <p className="text-slate-300 mb-2">Vid säkerhetsrisker, lagkrav eller allvarliga överträdelser får uppsägning ske med omedelbar verkan.</p>
              <p className="text-slate-300">Om Bolaget säger upp avtalet av affärsmässiga skäl har konsument rätt till proportionell återbetalning för förbetald period.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §21 */}
            <section id="section-21" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§21</span> Data
              </h2>
              <p className="text-slate-300 mb-2">Raderas inom 30–90 dagar.</p>
              <p className="text-slate-300">Bekräftelse kan begäras.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §22 */}
            <section id="section-22" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§22</span> Ändringar
              </h2>
              <p className="text-slate-300 mb-2">Ändringar meddelas minst 30 dagar i förväg via e-post eller plattform.</p>
              <p className="text-slate-300">Kunden har rätt att säga upp avtalet om ändringarna inte accepteras.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §23 */}
            <section id="section-23" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§23</span> Lag
              </h2>
              <p className="text-slate-300 mb-2">Svensk lag gäller.</p>
              <p className="text-slate-300 mb-2">För konsumenter inom EU gäller tvingande lag i deras hemland i enlighet med Europaparlamentets och rådets förordning (EG) nr 593/2008 (Rom I).</p>
              <p className="text-slate-300">Tvister avgörs av svensk domstol, med undantag för konsumenter inom EU som har rätt att väcka talan i domstol i sitt hemland enligt tillämplig lag.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §24 */}
            <section id="section-24" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§24</span> Slutbestämmelser
              </h2>
              <p className="text-slate-300 mb-2">Om någon bestämmelse är ogiltig ska övriga delar fortsatt gälla. Parterna ska i sådant fall ersätta bestämmelsen med en giltig som så långt som möjligt uppnår samma syfte.</p>
              <p className="text-slate-300">Detta avtal utgör parternas fullständiga reglering av samtliga frågor som avtalet berör och ersätter alla tidigare överenskommelser, diskussioner och utfästelser.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §25 */}
            <section id="section-25" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§25</span> Revision
              </h2>
              <p className="text-slate-300 mb-2">Kunden har rätt att begära revision av Bolagets behandling av personuppgifter i enlighet med GDPR artikel 28(3)(h).</p>
              <p className="text-slate-300 mb-2">Normal omfattning av revision definieras som:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">
                <li>minst 30 dagars skriftligt varsel</li>
                <li>högst en (1) gång per tolvmånadersperiod</li>
                <li>en maximal varaktighet om två (2) arbetsdagar</li>
              </ul>
              <p className="text-slate-300 mb-2">Revision ska: omfattas av sekretess, inte inkludera information som rör andra kunder, genomföras på ett sätt som inte oskäligt stör Bolagets verksamhet.</p>
              <p className="text-slate-300 mb-2">Bolaget kan tillhandahålla tredjepartsgranskningar, såsom ISO/IEC 27001 eller SOC 2 Type II, i stället för direkt revision.</p>
              <p className="text-slate-300 mb-2">Bolagets grundläggande skyldighet att tillhandahålla information och samarbeta enligt GDPR artikel 28(3)(h) är kostnadsfri.</p>
              <p className="text-slate-300 mb-2">Ytterligare revision utöver normal omfattning får ske om det krävs enligt lag eller myndighetsbeslut, eller om Kunden har legitima regulatoriska eller compliance-relaterade behov.</p>
              <p className="text-slate-300">I sådana fall har Bolaget rätt att debitera skäliga interna kostnader i den utsträckning revisionen överstiger normal omfattning. Sådana kostnader ska specificeras och kommuniceras i förväg och godkännas av Kunden innan revision påbörjas.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §26 */}
            <section id="section-26" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§26</span> Force majeure
              </h2>
              <p className="text-slate-300 mb-2">Bolaget ansvarar inte för händelser utanför kontroll såsom: naturkatastrof, krig, myndighetsåtgärder, tredjepartsavbrott.</p>
              <p className="text-slate-300 mb-2">Gäller endast om påverkan inte rimligen kunnat förebyggas enligt ISO/IEC 27001 eller SOC 2 Type II.</p>
              <p className="text-slate-300 mb-2">Part ska utan dröjsmål meddela den andra parten om sådan händelse och dess förväntade varaktighet.</p>
              <p className="text-slate-300">Om händelsen varar längre än 60 dagar har vardera parten rätt att säga upp avtalet utan ansvar.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §27 */}
            <section id="section-27" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§27</span> Konfidentialitet
              </h2>
              <p className="text-slate-300 mb-2">Konfidentiell information avser all icke-offentlig teknisk, kommersiell eller operativ information som part erhåller i samband med avtalet, oavsett form.</p>
              <p className="text-slate-300 mb-2">Parterna förbinder sig att inte utan den andra partens skriftliga godkännande avslöja konfidentiell information, om inte annat följer av lag eller myndighetsbeslut.</p>
              <p className="text-slate-300 mb-2">Skyldigheten gäller under avtalstiden och i tre (3) år efter dess upphörande.</p>
              <p className="text-slate-300">Skyldigheten gäller inte information som: (a) är allmänt känd utan brott mot detta avtal, (b) var känd före mottagandet, (c) utvecklats självständigt, eller (d) erhållits från tredje part utan sekretessförpliktelse.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §28 */}
            <section id="section-28" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§28</span> Överlåtelse
              </h2>
              <p className="text-slate-300 mb-2">Kunden får inte överlåta detta avtal utan Bolagets skriftliga godkännande.</p>
              <p className="text-slate-300 mb-2">Bolaget har rätt att överlåta avtalet till närstående bolag eller i samband med företagsöverlåtelse.</p>
              <p className="text-slate-300">Om överlåtelsen medför en väsentlig negativ påverkan på Kunden har Kunden rätt att säga upp avtalet inom 30 dagar från att sådan överlåtelse meddelats.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §29 */}
            <section id="section-29" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§29</span> &quot;As is&quot; disclaimer
              </h2>
              <p className="text-slate-300">Tjänsten tillhandahålls i befintligt skick (&quot;as is&quot;) utan garantier utöver vad som uttryckligen anges i detta avtal.</p>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-4">Relaterade dokument:</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/legal/privacy" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                Integritetspolicy
              </Link>
              <Link href="/legal/dpa" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                DPA (Personuppgiftsbiträdesavtal)
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

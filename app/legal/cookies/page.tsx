'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = [
  { number: 1, title: 'Vad är cookies?' },
  { number: 2, title: 'Nödvändiga cookies' },
  { number: 3, title: 'Analyscookies' },
  { number: 4, title: 'Marknadsföringscookies' },
  { number: 5, title: 'Tredjepartsleverantörer' },
  { number: 6, title: 'Hantera samtycke' },
  { number: 7, title: 'Kontakt' },
];

export default function CookiesPage() {
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
              Innehåll (§1–§7)
            </summary>
            <div className="px-5 py-4 flex flex-col gap-1" style={{ backgroundColor: '#0f172a' }}>
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
              Cookie<span className="text-green-500">policy</span>
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
                <span className="text-green-500 font-bold">§1</span> Vad är cookies?
              </h2>
              <p className="text-slate-300">
                Cookies är små textfiler som lagras på din enhet när du besöker vår webbplats. Vi använder cookies för att säkerställa att webbplatsen fungerar korrekt, analysera användning och visa relevant marknadsföring.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §2 */}
            <section id="section-2" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§2</span> Nödvändiga cookies
              </h2>
              <p className="text-slate-300 mb-4">
                Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Cookie</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Syfte</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Livslängd</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Typ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'cookie_consent', purpose: 'Lagrar ditt samtyckesbeslut', duration: '12 månader', type: 'First-party' },
                      { name: '__session', purpose: 'Auth0 sessionshantering', duration: 'Session', type: 'First-party' },
                      { name: 'next-auth.session-token', purpose: 'Autentiseringstoken', duration: 'Session', type: 'First-party' },
                    ].map((row) => (
                      <tr key={row.name} style={{ borderBottom: '1px solid #0f172a' }}>
                        <td className="py-3 pr-4 text-green-400 font-mono text-xs">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.purpose}</td>
                        <td className="py-3 pr-4 text-slate-400">{row.duration}</td>
                        <td className="py-3 text-slate-400">{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="border-t border-slate-800" />

            {/* §3 */}
            <section id="section-3" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§3</span> Analyscookies
              </h2>
              <p className="text-slate-300 mb-4">
                Används för att förstå hur besökare använder webbplatsen. Aktiveras endast efter samtycke.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Cookie</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Syfte</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Livslängd</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Typ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '_ga', purpose: 'Google Analytics', duration: '2 år', type: 'Third-party (Google)' },
                      { name: '_ga_XXXX', purpose: 'Google Analytics session', duration: '2 år', type: 'Third-party (Google)' },
                      { name: '_gid', purpose: 'Google Analytics daglig identifierare', duration: '24 timmar', type: 'Third-party (Google)' },
                    ].map((row) => (
                      <tr key={row.name} style={{ borderBottom: '1px solid #0f172a' }}>
                        <td className="py-3 pr-4 text-green-400 font-mono text-xs">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.purpose}</td>
                        <td className="py-3 pr-4 text-slate-400">{row.duration}</td>
                        <td className="py-3 text-slate-400">{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">Google agerar som självständig personuppgiftsansvarig för sina analystjänster.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §4 */}
            <section id="section-4" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§4</span> Marknadsföringscookies
              </h2>
              <p className="text-slate-300 mb-4">
                Används för att visa relevant annonsering. Aktiveras endast efter samtycke.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Cookie</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Syfte</th>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Livslängd</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Typ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '_fbp', purpose: 'Meta Pixel', duration: '90 dagar', type: 'Third-party (Meta)' },
                      { name: 'li_fat_id', purpose: 'LinkedIn Insight Tag', duration: '30 dagar', type: 'Third-party (LinkedIn)' },
                      { name: '_ttp', purpose: 'TikTok Pixel', duration: '13 månader', type: 'Third-party (TikTok)' },
                      { name: '_gcl_au', purpose: 'Google Ads konverteringsspårning', duration: '90 dagar', type: 'Third-party (Google)' },
                    ].map((row) => (
                      <tr key={row.name} style={{ borderBottom: '1px solid #0f172a' }}>
                        <td className="py-3 pr-4 text-green-400 font-mono text-xs">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.purpose}</td>
                        <td className="py-3 pr-4 text-slate-400">{row.duration}</td>
                        <td className="py-3 text-slate-400">{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">Meta, LinkedIn och TikTok agerar som självständiga personuppgiftsansvariga för sina annonseringstjänster.</p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §5 */}
            <section id="section-5" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§5</span> Tredjepartsleverantörer
              </h2>
              <p className="text-slate-300 mb-4">
                Efter samtycke kan tredjepartsleverantörer behandla personuppgifter som egna personuppgiftsansvariga enligt deras egna integritetspolicys. Mer information:
              </p>
              <ul className="space-y-2">
                {[
                  { label: 'Google Privacy Policy', href: 'https://policies.google.com/privacy' },
                  { label: 'Meta Privacy Policy', href: 'https://www.facebook.com/privacy/policy' },
                  { label: 'LinkedIn Privacy Policy', href: 'https://www.linkedin.com/legal/privacy-policy' },
                  { label: 'TikTok Privacy Policy', href: 'https://www.tiktok.com/legal/page/eea/privacy-policy/en' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* §6 */}
            <section id="section-6" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§6</span> Hantera samtycke
              </h2>
              <p className="text-slate-300">
                Du kan när som helst ändra dina cookie-inställningar genom att klicka på &quot;Cookie-inställningar&quot; längst ner på sidan. Du kan också blockera cookies via din webbläsares inställningar, men detta kan påverka webbplatsens funktionalitet.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* §7 */}
            <section id="section-7" style={{ scrollMarginTop: '100px' }} className="py-8">
              <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                <span className="text-green-500 font-bold">§7</span> Kontakt
              </h2>
              <p className="text-slate-300">
                Vid frågor om vår cookiepolicy, kontakta oss på{' '}
                <a
                  href="mailto:legal@sourcesolutions.se"
                  className="text-green-400 hover:text-green-300 underline transition-colors"
                >
                  legal@sourcesolutions.se
                </a>
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

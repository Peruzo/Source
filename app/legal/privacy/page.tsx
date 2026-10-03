'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { privacySections, privacySubtitle, privacyTitle } from './content';

const sections = privacySections.map(({ number, title }) => ({ number, title }));

const TOKEN_RE = /(\[(?:VERIFIERA|KRÄVER FIX|RUTIN|BESLUT)[^\]]*\]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,})/g;

function DraftMarker({ children }: { children: string }) {
  return (
    <mark
      className="rounded px-1 font-medium"
      style={{ backgroundColor: 'rgba(245,158,11,0.25)', color: '#fcd34d', outline: '1px solid rgba(245,158,11,0.6)' }}
    >
      {children}
    </mark>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN_RE).map((part, i) => {
        if (i % 2 === 0) return part;
        if (part.startsWith('[')) return <DraftMarker key={i}>{part}</DraftMarker>;
        return (
          <a key={i} href={`mailto:${part}`} className="text-green-400 hover:text-green-300 underline">
            {part}
          </a>
        );
      })}
    </>
  );
}

export default function PrivacyPage() {
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
              Innehåll (§1–§{sections.length})
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
              {privacyTitle}
            </h1>
            <p className="text-slate-400 text-sm">
              <RichText text={privacySubtitle} />
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-0">
            {privacySections.map(({ number, title, paragraphs }, index) => (
              <div key={number}>
                <section id={`section-${number}`} style={{ scrollMarginTop: '100px' }} className="py-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-baseline gap-3" style={{ color: '#f0fdf4' }}>
                    <span className="text-green-500 font-bold">§{number}</span> {title}
                  </h2>
                  {paragraphs.map((text, i) => (
                    <p key={i} className={i < paragraphs.length - 1 ? 'text-slate-300 mb-2' : 'text-slate-300'}>
                      <RichText text={text} />
                    </p>
                  ))}
                </section>
                {index < privacySections.length - 1 && <div className="border-t border-slate-800" />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-4">Relaterade dokument:</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/legal/terms" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                Allmänna Villkor (ToS)
              </Link>
              <Link href="/legal/dpa" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                DPA (Personuppgiftsbiträdesavtal)
              </Link>
              <Link href="/legal/cookies" className="text-green-400 hover:text-green-300 text-sm underline transition-colors">
                Cookiepolicy
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

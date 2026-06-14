'use client';

import { useState, useEffect } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * RockHotspots — tonar fram tre frostade rutor på stenen (i slutläget) med
 * en linje ut till en klickbar etikett. Klick öppnar en popup-meny med länkar.
 *
 * Renderas inuti sticky-containern i PlatformRock:
 *   <RockHotspots progress={scrollYProgress} />
 *
 * Tuning:
 *  - mx/my = markörens position i % av containern (flytta in mot stenen)
 *  - side  = vilken sida etiketten ligger ('left' | 'right')
 *  - openDir = åt vilket håll popupen öppnas ('down' | 'up')
 *  - REVEAL_AT = hur långt i scrollen rutorna tonar fram
 */

const HOT_GAP = 8;       // % avstånd markör -> etikett (linjens längd)
const REVEAL_AT = 0.9;   // tona fram när scroll-progress passerar detta
const HIDE_AT = 0.8;     // göm igen om man scrollar tillbaka under detta

type HotItem = { name: string; href: string };
type HotCat = {
  key: string;
  label: string;
  mx: number;
  my: number;
  side: 'left' | 'right';
  openDir: 'down' | 'up';
  items: HotItem[];
};

const HOTSPOTS: HotCat[] = [
  {
    key: 'ekonomi', label: 'Ekonomi', mx: 57, my: 37, side: 'right', openDir: 'down',
    items: [
      { name: 'Betalningar',    href: 'https://sourceportal.se/betalningar-layout2' },
      { name: 'Rapporter',      href: 'https://sourceportal.se/rapporter-layout2' },
      { name: 'Bokföring',      href: 'https://sourceportal.se/bokforing-layout2' },
      { name: 'Fakturor',       href: 'https://sourceportal.se/fakturor-layout2' },
      { name: 'Betalningslänk', href: 'https://sourceportal.se/betalningslank-layout2' },
      { name: 'Presentkort',    href: 'https://sourceportal.se/giftcards-layout2' },
    ],
  },
  {
    key: 'system', label: 'System', mx: 41, my: 53, side: 'left', openDir: 'down',
    items: [
      { name: 'Inventarier',    href: 'https://sourceportal.se/inventarier-layout2' },
      { name: 'Produkter',      href: 'https://sourceportal.se/produkter-layout2' },
      { name: 'Bokningssystem', href: 'https://sourceportal.se/booking' },
      { name: 'Inställningar',  href: 'https://sourceportal.se/installningar-layout2' },
      { name: 'Kontakt',        href: 'https://sourceportal.se/kontakt-layout2' },
    ],
  },
  {
    key: 'main', label: 'Main', mx: 60, my: 64, side: 'right', openDir: 'up',
    items: [
      { name: 'Dashboard',      href: 'https://sourceportal.se/dashboard' },
      { name: 'Kampanjer',      href: 'https://sourceportal.se/kampanjer' },
      { name: 'Nyheter',        href: 'https://sourceportal.se/nyheter.html' },
      { name: 'Logistik',       href: 'https://sourceportal.se/logistik' },
      { name: 'Integrationer',  href: 'https://sourceportal.se/integrationer' },
      { name: 'Kunder',         href: 'https://sourceportal.se/kunder-layout2' },
      { name: 'Leads',          href: 'https://sourceportal.se/leads-layout2' },
      { name: 'Analyser',       href: 'https://sourceportal.se/analyser-layout2' },
      { name: 'Statistik',      href: 'https://sourceportal.se/statistik-layout2' },
      { name: 'Marknadsföring', href: 'https://sourceportal.se/marknadsforing-layout2' },
    ],
  },
];

export default function RockHotspots({ progress }: { progress: MotionValue<number> }) {
  const [revealed, setRevealed] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useMotionValueEvent(progress, 'change', (p) => {
    if (p > REVEAL_AT && !revealed) setRevealed(true);
    else if (p < HIDE_AT && revealed) {
      setRevealed(false);
      setOpenKey(null);
    }
  });

  // Esc stänger popupen
  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenKey(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openKey]);

  // Lås sidans scroll när en meny är öppen (så stenen inte scrollar bort under interaktion)
  useEffect(() => {
    if (!openKey) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [openKey]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }} aria-hidden={!revealed}>
      {HOTSPOTS.map((c, i) => {
        const isRight = c.side === 'right';
        const open = openKey === c.key;
        const toggle = () => setOpenKey(open ? null : c.key);
        return (
          <div key={c.key}>
            {/* linje */}
            <div
              style={{
                position: 'absolute',
                top: `${c.my}%`,
                left: isRight ? `${c.mx}%` : `${c.mx - HOT_GAP}%`,
                width: `${HOT_GAP}%`,
                height: 1,
                background: 'rgba(20,24,26,0.32)',
                transformOrigin: isRight ? 'left center' : 'right center',
                transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: `${0.15 + i * 0.12}s`,
                pointerEvents: 'none',
              }}
            />

            {/* markör (frostad ruta) */}
            <button
              onClick={toggle}
              aria-label={c.label}
              style={{
                position: 'absolute',
                top: `${c.my}%`,
                left: `${c.mx}%`,
                transform: `translate(-50%, -50%) scale(${revealed ? 1 : 0.7})`,
                opacity: revealed ? 1 : 0,
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: `${i * 0.12}s`,
                width: 42, height: 42, borderRadius: 8,
                background: 'rgba(255,255,255,0.5)',
                border: `1px solid ${open ? 'var(--color-teal,#00BFA6)' : 'rgba(255,255,255,0.82)'}`,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 4px 16px rgba(10,20,18,0.18)',
                cursor: 'pointer',
                padding: 0,
                pointerEvents: revealed ? 'auto' : 'none',
              }}
            />

            {/* etikett */}
            <button
              onClick={toggle}
              style={{
                position: 'absolute',
                top: `${c.my}%`,
                ...(isRight ? { left: `${c.mx + HOT_GAP}%` } : { right: `${100 - (c.mx - HOT_GAP)}%` }),
                transform: `translateY(-50%) translateX(${revealed ? '0px' : isRight ? '-6px' : '6px'})`,
                opacity: revealed ? 1 : 0,
                transition: 'opacity 0.45s ease, transform 0.45s ease',
                transitionDelay: `${0.25 + i * 0.12}s`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                flexDirection: isRight ? 'row' : 'row-reverse',
                background: 'transparent',
                border: 'none',
                padding: '4px 2px',
                cursor: 'pointer',
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: 600,
                color: '#121212',
                whiteSpace: 'nowrap',
                pointerEvents: revealed ? 'auto' : 'none',
              }}
            >
              {c.label}
              <span
                style={{
                  width: 18, height: 18, borderRadius: 999,
                  border: '1px solid rgba(18,18,18,0.35)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, lineHeight: 1, color: 'rgba(18,18,18,0.6)',
                  transform: open ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              >
                +
              </span>
            </button>

            {/* popup-meny */}
            {open && (
              <>
                <div
                  onClick={() => setOpenKey(null)}
                  style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'transparent' }}
                />
                <div
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    zIndex: 21,
                    ...(isRight ? { left: `${c.mx + HOT_GAP}%` } : { right: `${100 - (c.mx - HOT_GAP)}%` }),
                    ...(c.openDir === 'down'
                      ? { top: `calc(${c.my}% + 26px)` }
                      : { bottom: `calc(${100 - c.my}% + 26px)` }),
                    width: 246,
                    maxHeight: '56vh',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    background: '#ffffff',
                    border: '1px solid rgba(18,18,18,0.08)',
                    borderRadius: 14,
                    boxShadow: '0 18px 50px rgba(12,24,22,0.20)',
                    padding: '14px 8px 10px',
                    pointerEvents: 'auto',
                    animation: 'hotPop 0.22s cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  <div className="text-overline" style={{ color: 'var(--color-teal-dark,#00806D)', padding: '0 10px 8px' }}>
                    {c.label}
                  </div>
                  {c.items.map((it) => (
                    <a
                      key={it.name}
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 10px', borderRadius: 8,
                        textDecoration: 'none', color: '#1f1f1f', fontSize: 15, fontWeight: 500,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-beige,#F4F7F6)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--color-teal,#00BFA6)', flex: 'none' }} />
                      {it.name}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes hotPop {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

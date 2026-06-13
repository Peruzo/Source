'use client';

import { useRef, useEffect, useState, type CSSProperties } from 'react';
import { useInView } from 'framer-motion';
import Link from 'next/link';

// Chip-positioner: --sx/--sy = utspritt (start), --gx/--gy = rutnät 5×3, d = stagger.
// Värdena är hämtade direkt ur source_converge_white.html (source of truth).
type Chip = {
  label: string;
  sx: number;
  sy: number;
  gx: number;
  gy: number;
  d: number;
};

const CHIPS: Chip[] = [
  { label: 'Leads',          sx: -410, sy: -230, gx: -360, gy: -120, d: 0.02 },
  { label: 'Betalningar',    sx: -110, sy: -255, gx: -180, gy: -120, d: 0.10 },
  { label: 'Bokföring',      sx:  230, sy: -245, gx:    0, gy: -120, d: 0.05 },
  { label: 'Logistik',       sx:  405, sy: -175, gx:  180, gy: -120, d: 0.16 },
  { label: 'Kampanjer',      sx:  415, sy:   45, gx:  360, gy: -120, d: 0.22 },
  { label: 'Produkter',      sx: -420, sy:  -25, gx: -360, gy:    0, d: 0.08 },
  { label: 'Bokning',        sx: -285, sy:  165, gx: -180, gy:    0, d: 0.14 },
  { label: 'Fakturor',       sx:   35, sy:  245, gx:    0, gy:    0, d: 0    },
  { label: 'Analyser',       sx:  350, sy:  235, gx:  180, gy:    0, d: 0.18 },
  { label: 'Kunder',         sx:  420, sy:  -50, gx:  360, gy:    0, d: 0.12 },
  { label: 'Marknadsföring', sx: -415, sy:  235, gx: -360, gy:  120, d: 0.20 },
  { label: 'Presentkort',    sx: -170, sy: -140, gx: -180, gy:  120, d: 0.26 },
  { label: 'Statistik',      sx:  170, sy: -150, gx:    0, gy:  120, d: 0.30 },
  { label: 'Inventarier',    sx:  -55, sy:  120, gx:  180, gy:  120, d: 0.24 },
  { label: 'Integrationer',  sx:  285, sy:  150, gx:  360, gy:  120, d: 0.28 },
];

/**
 * Scroll-triggad konvergens: 15 funktions-chips fadar in utspridda, dras ihop
 * till ett rutnät (med plattform-ram), löses upp och fadar bort — varpå
 * budskapet reser sig i tomrummet. Speglar source_converge_white.html.
 * prefers-reduced-motion → slutläget visas direkt (chips borta, budskap synligt).
 */
export function PlatformConverge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  const [phase, setPhase] = useState({
    go: false,
    assembled: false,
    dissolve: false,
    reveal: false,
  });
  const [reduced, setReduced] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setPhase({ go: true, assembled: true, dissolve: true, reveal: true });
      return;
    }

    const timers = timersRef.current;
    timers.push(setTimeout(() => setPhase(p => ({ ...p, go: true })), 60));
    timers.push(setTimeout(() => setPhase(p => ({ ...p, assembled: true })), 1000));
    timers.push(setTimeout(() => setPhase(p => ({ ...p, dissolve: true })), 2750));
    timers.push(setTimeout(() => setPhase(p => ({ ...p, reveal: true })), 3300));

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [inView]);

  const fieldClass = [
    'cvg-field',
    reduced ? 'cvg-noanim' : '',
    phase.go ? 'cvg-go' : '',
    phase.assembled ? 'cvg-assembled' : '',
    phase.dissolve ? 'cvg-dissolve' : '',
    phase.reveal ? 'cvg-reveal' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className="cvg-wrap">
      <div className={fieldClass}>
        {/* Plattform-ram (dekorativ) */}
        <div className="cvg-frame" aria-hidden />

        {/* Funktions-chips (dekorativa — animationen är visuell) */}
        {CHIPS.map((c) => (
          <div
            key={c.label}
            className="cvg-chip"
            aria-hidden
            style={
              {
                '--sx': `${c.sx}px`,
                '--sy': `${c.sy}px`,
                '--gx': `${c.gx}px`,
                '--gy': `${c.gy}px`,
                '--d': `${c.d}s`,
              } as CSSProperties
            }
          >
            <span className="cvg-dot" />
            {c.label}
          </div>
        ))}

        {/* Budskap som reser sig i tomrummet */}
        <div className="cvg-resolve">
          <p className="text-overline text-teal">Allt på ett ställe</p>
          <h3 className="text-[28px] md:text-[34px] font-bold tracking-[-0.02em] text-black mt-3 mb-2.5">
            Hela din verksamhet — samlad.
          </h3>
          <p className="text-body text-gray-600 max-w-[520px] mx-auto mb-6">
            Börja från noll eller flytta in en etablerad e-handel — varje del
            bor på samma ställe.
          </p>
          <Link
            href="/priser"
            className="inline-flex items-center gap-2 rounded-[10px] px-[22px] py-3 text-[15px] font-semibold text-white bg-[#10B981] hover:bg-[#047857] transition-colors duration-200"
          >
            Kom igång
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

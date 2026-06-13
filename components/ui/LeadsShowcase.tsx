'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Data ──────────────────────────────────────────────────────────────────────
const LEADS = [
  {
    initials: 'GH',
    name: 'Glow Hudvård',
    hot: true,
    sub: 'Skönhet · Malmö',
    src: 'hittad via AI-sök',
    srcCompact: 'AI-sök',
    score: 94,
  },
  {
    initials: 'KL',
    name: 'Klippoteket',
    hot: false,
    sub: 'Frisör · Lund',
    src: 'Allabolag',
    srcCompact: 'Allabolag',
    score: 87,
  },
  {
    initials: 'BC',
    name: 'Bryggans Café',
    hot: false,
    sub: 'Restaurang · Helsingborg',
    src: 'hittad via AI-sök',
    srcCompact: 'AI-sök',
    score: 81,
  },
  {
    initials: 'VE',
    name: 'Verkstad 14',
    hot: false,
    sub: 'Bilverkstad · Malmö',
    src: 'Allabolag',
    srcCompact: 'Allabolag',
    score: 74,
  },
] as const;

// Timing — full (standalone) vs compact (detaljvy-kontext, matchar referensen)
const TIMING = {
  full: {
    rowDelays:   [0.9, 1.15, 1.4, 1.65],
    fillDelays:  [1.0, 1.25, 1.5, 1.75],
    countDelays: [1000, 1250, 1500, 1750],
    selectAt:    null as number | null,
  },
  compact: {
    rowDelays:   [0.2, 0.32, 0.44, 0.56],
    fillDelays:  [0.35, 0.47, 0.59, 0.71],
    countDelays: [350, 470, 590, 710],
    selectAt:    1500,
  },
};

export interface LeadsShowcaseProps {
  /** Kompakt detaljvy-läge: döljer sidomeny + AI-kort, statisk status, vald-ring på het rad. */
  compact?: boolean;
  /**
   * Extern trigger. När satt (≠ undefined) styr föräldern uppspelningen genom att
   * ändra detta tal. När osatt använder komponenten sin egen useInView.
   */
  triggerKey?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function LeadsShowcase({ compact = false, triggerKey }: LeadsShowcaseProps = {}) {
  const external = triggerKey !== undefined;
  const timing = compact ? TIMING.compact : TIMING.full;

  const containerRef = useRef<HTMLDivElement>(null);
  // once: false → retrigger every time the element enters the viewport (standalone use)
  const internalInView = useInView(containerRef, { once: false, margin: '-80px' });

  // seq increments on each replay → forces remount of motion elements so they
  // restart cleanly from their initial state.
  const [seq, setSeq] = useState(0);

  // playing: false = snap to initial (hidden); true = animate to visible
  const [playing, setPlaying] = useState(false);
  const [scores, setScores] = useState<number[]>(LEADS.map(() => 0));
  const [statusText, setStatusText] = useState(
    compact ? '47 nya den här veckan · 6 heta' : 'AI söker leads i Skåne…'
  );
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [selectedHot, setSelectedHot] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    rafsRef.current.forEach(cancelAnimationFrame);
    rafsRef.current = [];
  }

  // Count-up for a single score cell
  function countUp(index: number, target: number, delayMs: number) {
    const t = setTimeout(() => {
      const dur = 850;
      const startTime = performance.now();
      function step(ts: number) {
        const p = Math.min((ts - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        setScores(prev => {
          const next = [...prev];
          next[index] = val;
          return next;
        });
        if (p < 1) {
          rafsRef.current.push(requestAnimationFrame(step));
        } else {
          setScores(prev => {
            const next = [...prev];
            next[index] = target;
            return next;
          });
        }
      }
      rafsRef.current.push(requestAnimationFrame(step));
    }, delayMs);
    timersRef.current.push(t);
  }

  function runSequence() {
    clearAll();

    // ── Reduced motion: final state immediately ───────────────────────────────
    if (prefersReducedRef.current) {
      setScores(LEADS.map(l => l.score));
      setStatusText('47 nya den här veckan · 6 heta');
      setSpinnerVisible(false);
      setSelectedHot(compact);
      setPlaying(false);
      return;
    }

    // ── Reset to initial ──────────────────────────────────────────────────────
    setPlaying(false);
    setScores(LEADS.map(() => 0));
    setSelectedHot(false);
    if (compact) {
      // Detaljvy: ingen sök-fas — listan är redan "klar", genererar bara in.
      setStatusText('47 nya den här veckan · 6 heta');
      setSpinnerVisible(false);
    } else {
      setStatusText('AI söker leads i Skåne…');
      setSpinnerVisible(true);
    }
    setSeq(s => s + 1);

    // Start animating after one frame
    const t0 = setTimeout(() => setPlaying(true), 50);
    timersRef.current.push(t0);

    // Count up scores
    LEADS.forEach((lead, i) => countUp(i, lead.score, timing.countDelays[i]));

    if (compact) {
      // Het rad får "vald"-ring
      if (timing.selectAt != null) {
        const ts = setTimeout(() => setSelectedHot(true), timing.selectAt);
        timersRef.current.push(ts);
      }
    } else {
      // Swap status text + hide spinner
      const t2 = setTimeout(() => {
        setStatusText('47 nya den här veckan · 6 heta');
        setSpinnerVisible(false);
      }, 2000);
      timersRef.current.push(t2);
    }
  }

  // Trigger: single effect whose dependency is the *active* signal only.
  // `external` is stable for the component's lifetime, so the dep array length
  // is constant (1) and React is happy.
  useEffect(() => {
    const triggered = external ? (triggerKey ?? 0) > 0 : internalInView;
    if (!triggered) return;
    runSequence();
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external ? triggerKey : internalInView]);

  // ── Eases ──────────────────────────────────────────────────────────────────
  const riseEase = [0.2, 0.7, 0.3, 1] as [number, number, number, number];
  const fillEase = [0.3, 0.6, 0.2, 1] as [number, number, number, number];
  const popEase = [0.2, 0.8, 0.3, 1.2] as [number, number, number, number];

  return (
    <div
      ref={containerRef}
      className="w-full rounded-[18px] overflow-hidden bg-white border border-black/[0.08] shadow-[0_26px_64px_-34px_rgba(16,24,32,0.28)] flex flex-col"
      role="img"
      aria-label="Animerad produktvy: Source Leads — AI söker och rangordnar potentiella kunder"
    >
      {/* ── Topbar ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-[18px] py-[13px] border-b border-black/[0.08]">
        <div className="flex items-start gap-[3px] font-bold text-[16px] leading-none tracking-[-0.015em] text-[#2d3142]">
          source
          <svg
            width="24"
            height="18"
            viewBox="0 0 26 20"
            fill="none"
            aria-hidden="true"
            style={{ marginTop: '-2px' }}
          >
            <path d="M13 3.5 H22 V12" stroke="#00BFA6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 10 H10 V16.5" stroke="#00BFA6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[#9aa1ab] font-medium text-[13px] ml-1.5">
          / <b className="text-[#6b7280] font-semibold">Leads</b>
        </span>
        <span className="flex-1" />
        <span
          className="w-[30px] h-[30px] rounded-[8px] border border-black/[0.08] flex items-center justify-center text-[#6b7280]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
        </span>
        <span className="w-[30px] h-[30px] rounded-full bg-[#E6F7F4] flex items-center justify-center text-[11px] font-semibold text-[#00BFA6]">
          NL
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0">
        {/* ── Sidebar (endast i full-läge, dold < sm) ───────────────────────── */}
        {!compact && (
          <nav
            className="hidden sm:flex flex-none flex-col gap-[3px] border-r border-black/[0.08] bg-[#f7f8f6] px-3 py-[14px]"
            style={{ width: '194px' }}
          >
            <div className="text-[10px] tracking-[0.15em] text-[#9aa1ab] uppercase mx-2 mb-1 mt-1.5 font-semibold">
              Översikt
            </div>
            <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Dashboard
            </div>
            <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#1c2027] text-[13.5px] font-medium bg-[#E6F7F4] relative">
              <div className="absolute left-0 top-[7px] bottom-[7px] w-[3px] rounded-full bg-[#00BFA6]" />
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#00BFA6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3.2" />
                <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8h5M18.5 5.5v5" />
              </svg>
              Leads
            </div>
            <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18M7 14l3-4 3 3 4-6" />
              </svg>
              Marknadsföring
            </div>
            <div className="text-[10px] tracking-[0.15em] text-[#9aa1ab] uppercase mx-2 mb-1 mt-2 font-semibold">
              Ekonomi
            </div>
            <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" />
              </svg>
              Bokföring
            </div>
          </nav>
        )}

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <main className={`flex-1 min-w-0 bg-white ${compact ? 'px-[18px] py-[18px] pb-[20px]' : 'px-5 py-[22px] pb-[26px]'}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-[13px]">
            <div>
              <div className="text-[18px] font-bold tracking-[-0.015em] text-[#1c2027]">
                Leads
              </div>
              <div className="flex items-center gap-[7px] mt-1 min-h-[16px]">
                {!compact && (
                  <span
                    className={`inline-flex transition-opacity duration-200 ${spinnerVisible ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                    style={{ width: spinnerVisible ? 'auto' : 0, overflow: 'hidden' }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="leads-spinner">
                      <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,.12)" strokeWidth="3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="#00BFA6" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
                <span className="text-[12px] text-[#6b7280]">{statusText}</span>
              </div>
            </div>
            <div className="flex items-center gap-[6px] text-[12px] text-[#6b7280] border border-black/[0.13] rounded-full px-3 py-[5px] whitespace-nowrap">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              {compact ? 'Skåne' : 'Skåne · alla branscher'}
            </div>
          </div>

          {/* Scan bar — endast full-läge */}
          {!compact && playing && (
            <div
              key={`scan-${seq}`}
              className="h-[3px] rounded-full mb-[14px] overflow-hidden leads-scanfade"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <div className="leads-scanbar" />
            </div>
          )}
          {!compact && !playing && <div className="h-[3px] mb-[14px]" />}

          {/* Lead rows */}
          <div className={`flex flex-col ${compact ? 'gap-[8px]' : 'gap-[9px]'}`}>
            {LEADS.map((lead, i) => (
              <motion.div
                key={`${seq}-row-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: playing ? 1 : 0,
                  y: playing ? 0 : 12,
                  boxShadow:
                    selectedHot && lead.hot
                      ? '0 0 0 2px #00BFA6'
                      : '0 0 0 0 rgba(0,191,166,0)',
                }}
                transition={{
                  opacity: { duration: 0.5, delay: playing ? timing.rowDelays[i] : 0, ease: riseEase },
                  y: { duration: 0.5, delay: playing ? timing.rowDelays[i] : 0, ease: riseEase },
                  boxShadow: { duration: 0.3, ease: 'easeOut' },
                }}
                className={`flex items-center ${compact ? 'gap-[12px] px-[14px] py-[11px] rounded-[12px]' : 'gap-[13px] px-[15px] py-3 rounded-[14px]'} border ${
                  lead.hot
                    ? 'bg-[#E6F7F4] border-[rgba(0,191,166,0.32)]'
                    : 'bg-white border-black/[0.08]'
                }`}
              >
                <div className={`flex-none ${compact ? 'w-[36px] h-[36px] rounded-[9px] text-[12px]' : 'w-[38px] h-[38px] rounded-[10px] text-[13px]'} bg-[#E6F7F4] text-[#00BFA6] flex items-center justify-center font-semibold`}>
                  {lead.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`${compact ? 'text-[14px] gap-[7px]' : 'text-[14.5px] gap-2'} font-semibold text-[#1c2027] flex items-center flex-wrap leading-snug`}>
                    {lead.name}
                    {lead.hot && (
                      <motion.span
                        key={`${seq}-tag`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={playing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.4, delay: playing ? (compact ? 0.7 : 2.0) : 0, ease: popEase }}
                        className={`font-semibold uppercase text-[#eafff7] bg-[#047857] rounded-[5px] ${compact ? 'text-[9.5px] tracking-[0.05em] px-[6px] py-[2px]' : 'text-[10px] tracking-[0.06em] px-[7px] py-[2px]'}`}
                      >
                        Het lead
                      </motion.span>
                    )}
                  </div>
                  <div className={`${compact ? 'text-[12px] mt-[2px]' : 'text-[12.5px] mt-[3px]'} text-[#6b7280]`}>
                    {lead.sub} ·{' '}
                    <span className="text-[#9aa1ab]">{compact ? lead.srcCompact : lead.src}</span>
                  </div>
                </div>
                <div className="flex-none text-right" style={{ minWidth: compact ? '62px' : '74px' }}>
                  <div className={`${compact ? 'text-[15px]' : 'text-[16px]'} font-bold text-[#00BFA6] tracking-[-0.01em]`}>
                    <span>{scores[i]}</span>
                    <small className={`${compact ? 'text-[10px]' : 'text-[11px]'} text-[#9aa1ab] font-medium ml-[1px]`}>
                      /100
                    </small>
                  </div>
                  <div
                    className="rounded-full overflow-hidden mt-[5px] ml-auto"
                    style={{
                      width: compact ? '62px' : '74px',
                      height: compact ? '4px' : '5px',
                      background: 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <motion.div
                      key={`${seq}-fill-${i}`}
                      className="h-full bg-[#00BFA6] rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={playing ? { scaleX: lead.score / 100 } : { scaleX: 0 }}
                      transition={{ duration: 0.9, delay: playing ? timing.fillDelays[i] : 0, ease: fillEase }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI insight card — endast full-läge */}
          {!compact && (
            <motion.div
              key={`${seq}-insight`}
              initial={{ opacity: 0, y: 12 }}
              animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.55, delay: playing ? 2.3 : 0, ease: riseEase }}
              className="mt-[14px] bg-[#E6F7F4] border border-[rgba(0,191,166,0.28)] rounded-[14px] p-4 flex gap-[14px] items-start relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00BFA6]" />
              <div className="w-10 h-10 flex-none rounded-[11px] bg-white border border-[rgba(0,191,166,0.2)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="#00BFA6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#00BFA6]">
                  AI-rekommendation
                </div>
                <div className="text-[14.5px] leading-[1.5] mt-1.5 text-[#1c2027]">
                  Glow Hudvård liknar dina tre bäst konverterande kunder — nystartad,
                  hög tillväxt, ingen e-handelsplattform.{' '}
                  <b className="font-bold">Börja här.</b>
                </div>
                <span className="text-[13px] font-semibold text-[#00BFA6] mt-2.5 inline-flex items-center gap-[5px]">
                  Kontakta lead
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

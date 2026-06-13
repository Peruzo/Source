'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Data ──────────────────────────────────────────────────────────────────────
const LEADS = [
  {
    initials: 'GH',
    name: 'Glow Hudvård',
    hot: true,
    sub: 'Skönhet · Malmö',
    src: 'hittad via AI-sök',
    score: 94,
  },
  {
    initials: 'KL',
    name: 'Klippoteket',
    hot: false,
    sub: 'Frisör · Lund',
    src: 'Allabolag',
    score: 87,
  },
  {
    initials: 'BC',
    name: 'Bryggans Café',
    hot: false,
    sub: 'Restaurang · Helsingborg',
    src: 'hittad via AI-sök',
    score: 81,
  },
  {
    initials: 'VE',
    name: 'Verkstad 14',
    hot: false,
    sub: 'Bilverkstad · Malmö',
    src: 'Allabolag',
    score: 74,
  },
] as const;

// Row stagger: 0.9 s, 1.15 s, 1.4 s, 1.65 s  (matches reference)
const ROW_DELAYS   = [0.9, 1.15, 1.4, 1.65];
const FILL_DELAYS  = [1.0, 1.25, 1.5, 1.75];   // score bars
const COUNT_DELAYS = [1000, 1250, 1500, 1750];  // ms, for count-up
const STATUS_DELAY = 2000;                       // ms

// ── Component ─────────────────────────────────────────────────────────────────
export function LeadsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // once: false → retrigger every time the element enters the viewport
  const isInView = useInView(containerRef, { once: false, margin: '-80px' });

  // playKey increments on each replay → forces remount of motion elements so
  // Framer and CSS animations restart cleanly from initial.
  const [playKey, setPlayKey] = useState(0);

  // playing: false = snap to initial (hidden); true = animate to visible
  const [playing, setPlaying]           = useState(false);
  const [scores, setScores]             = useState<number[]>(LEADS.map(() => 0));
  const [statusText, setStatusText]     = useState('AI söker leads i Skåne…');
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef   = useRef<number[]>([]);
  // Resolved once on the client – safe to read at any time after mount
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    rafsRef.current.forEach(cancelAnimationFrame);
    rafsRef.current = [];
  }, []);

  // Count-up animation for a single score cell
  function countUp(index: number, target: number, delayMs: number) {
    const t = setTimeout(() => {
      const dur = 850;
      const startTime = performance.now();
      function step(ts: number) {
        const p = Math.min((ts - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
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

  useEffect(() => {
    if (!isInView) return;

    clearAll();

    // ── Reduced-motion: show final state immediately ──────────────────────────
    if (prefersReducedRef.current) {
      setScores(LEADS.map(l => l.score));
      setStatusText('47 nya den här veckan · 6 heta');
      setSpinnerVisible(false);
      setPlaying(false); // no animation needed; render final values statically
      return;
    }

    // ── Full animation sequence ───────────────────────────────────────────────
    // 1. Snap everything to initial (hidden) state
    setPlaying(false);
    setScores(LEADS.map(() => 0));
    setStatusText('AI söker leads i Skåne…');
    setSpinnerVisible(true);
    setPlayKey(k => k + 1); // remount motion elements & CSS scan bar

    // 2. After one frame, start animating
    const t0 = setTimeout(() => setPlaying(true), 50);
    timersRef.current.push(t0);

    // 3. Count up each score at its staggered delay
    LEADS.forEach((lead, i) => {
      countUp(i, lead.score, COUNT_DELAYS[i]);
    });

    // 4. Swap status text & hide spinner
    const t2 = setTimeout(() => {
      setStatusText('47 nya den här veckan · 6 heta');
      setSpinnerVisible(false);
    }, STATUS_DELAY);
    timersRef.current.push(t2);

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  // ── Shared transition eases ────────────────────────────────────────────────
  const riseEase  = [0.2, 0.7, 0.3, 1]  as [number, number, number, number];
  const fillEase  = [0.3, 0.6, 0.2, 1]  as [number, number, number, number];
  const popEase   = [0.2, 0.8, 0.3, 1.2] as [number, number, number, number];

  const rowAnimate = (i: number) => ({
    opacity: playing ? 1 : 0,
    y:       playing ? 0 : 12,
  });
  const rowTransition = (i: number) => ({
    duration: 0.5,
    delay:    playing ? ROW_DELAYS[i] : 0,
    ease:     riseEase,
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="w-full rounded-[20px] overflow-hidden bg-white border border-black/[0.08] shadow-[0_26px_64px_-30px_rgba(16,24,32,0.28)] flex flex-col"
      role="img"
      aria-label="Animerad produktvy: Source Leads — AI söker och rangordnar potentiella kunder"
    >
      {/* ── Topbar ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3.5 px-5 py-[14px] border-b border-black/[0.08]">
        {/* Brand logotype */}
        <div className="flex items-start gap-[3px] font-bold text-[17px] leading-none tracking-[-0.015em] text-[#2d3142]">
          source
          <svg
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
            aria-hidden="true"
            style={{ marginTop: '-2px' }}
          >
            <path
              d="M13 3.5 H22 V12"
              stroke="#00BFA6"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 10 H10 V16.5"
              stroke="#00BFA6"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Breadcrumb */}
        <span className="text-[#9aa1ab] font-medium text-sm ml-2">
          /{' '}
          <b className="text-[#6b7280] font-semibold">Leads</b>
        </span>

        <span className="flex-1" />

        {/* Search icon button */}
        <span
          className="w-[34px] h-[34px] rounded-[9px] border border-black/[0.08] flex items-center justify-center text-[#6b7280]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
        </span>

        {/* User avatar */}
        <span className="w-[34px] h-[34px] rounded-full bg-[#E6F7F4] border border-black/[0.08] flex items-center justify-center text-xs font-semibold text-[#00BFA6]">
          NL
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0">

        {/* ── Sidebar (hidden < sm / ~640 px viewport) ────────────────────── */}
        <nav
          className="hidden sm:flex flex-none flex-col gap-[3px] border-r border-black/[0.08] bg-[#f7f8f6] px-3 py-[14px]"
          style={{ width: '194px' }}
        >
          <div className="text-[10px] tracking-[0.15em] text-[#9aa1ab] uppercase mx-2 mb-1 mt-1.5 font-semibold">
            Översikt
          </div>

          {/* Dashboard */}
          <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Dashboard
          </div>

          {/* Leads — active */}
          <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#1c2027] text-[13.5px] font-medium bg-[#E6F7F4] relative">
            <div className="absolute left-0 top-[7px] bottom-[7px] w-[3px] rounded-full bg-[#00BFA6]" />
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="#00BFA6"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8h5M18.5 5.5v5" />
            </svg>
            Leads
          </div>

          {/* Marknadsföring */}
          <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18M7 14l3-4 3 3 4-6" />
            </svg>
            Marknadsföring
          </div>

          <div className="text-[10px] tracking-[0.15em] text-[#9aa1ab] uppercase mx-2 mb-1 mt-2 font-semibold">
            Ekonomi
          </div>

          {/* Bokföring */}
          <div className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] text-[#6b7280] text-[13.5px] font-medium">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" />
            </svg>
            Bokföring
          </div>
        </nav>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-5 py-[22px] pb-[26px] bg-white">

          {/* Page header */}
          <div className="flex items-start justify-between mb-[13px]">
            <div>
              <div className="text-[19px] font-bold tracking-[-0.015em] text-[#1c2027]">
                Leads
              </div>
              <div className="flex items-center gap-[7px] mt-[5px] min-h-[16px]">
                {/* Spinner */}
                <span
                  className={`inline-flex transition-opacity duration-200 ${
                    spinnerVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                  style={{ width: spinnerVisible ? 'auto' : 0, overflow: 'hidden' }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    className="leads-spinner"
                  >
                    <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,.12)" strokeWidth="3" />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="#00BFA6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-[12.5px] text-[#6b7280]">{statusText}</span>
              </div>
            </div>

            {/* Filter pill */}
            <div className="flex items-center gap-[7px] text-[12.5px] text-[#6b7280] border border-black/[0.13] rounded-full px-[13px] py-1.5 whitespace-nowrap">
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Skåne · alla branscher
            </div>
          </div>

          {/* Scan bar — CSS-animated, remounts on each playKey to restart */}
          {playing && (
            <div
              key={`scan-${playKey}`}
              className="h-[3px] rounded-full mb-[14px] overflow-hidden leads-scanfade"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <div className="leads-scanbar" />
            </div>
          )}
          {/* Spacer so layout doesn't shift when scan bar is absent */}
          {!playing && <div className="h-[3px] mb-[14px]" />}

          {/* Lead rows */}
          <div className="flex flex-col gap-[9px] mb-[14px]">
            {LEADS.map((lead, i) => (
              <motion.div
                key={`${playKey}-row-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={rowAnimate(i)}
                transition={rowTransition(i)}
                className={`flex items-center gap-[13px] rounded-[14px] px-[15px] py-3 border ${
                  lead.hot
                    ? 'bg-[#E6F7F4] border-[rgba(0,191,166,0.32)]'
                    : 'bg-white border-black/[0.08]'
                }`}
              >
                {/* Initials avatar */}
                <div className="w-[38px] h-[38px] flex-none rounded-[10px] bg-[#E6F7F4] text-[#00BFA6] flex items-center justify-center text-[13px] font-semibold">
                  {lead.initials}
                </div>

                {/* Name + sub */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-semibold text-[#1c2027] flex items-center gap-2 flex-wrap leading-snug">
                    {lead.name}
                    {lead.hot && (
                      <motion.span
                        key={`${playKey}-tag`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={
                          playing
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.85 }
                        }
                        transition={{
                          duration: 0.4,
                          delay: playing ? 2.0 : 0,
                          ease: popEase,
                        }}
                        className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[#eafff7] bg-[#047857] rounded-[5px] px-[7px] py-[2px]"
                      >
                        Het lead
                      </motion.span>
                    )}
                  </div>
                  <div className="text-[12.5px] text-[#6b7280] mt-[3px]">
                    {lead.sub} ·{' '}
                    <span className="text-[#9aa1ab]">{lead.src}</span>
                  </div>
                </div>

                {/* Score + fill bar */}
                <div className="flex-none text-right" style={{ minWidth: '74px' }}>
                  <div className="text-[16px] font-bold text-[#00BFA6] tracking-[-0.01em]">
                    <span>{scores[i]}</span>
                    <small className="text-[11px] text-[#9aa1ab] font-medium ml-[1px]">
                      /100
                    </small>
                  </div>
                  <div
                    className="rounded-full overflow-hidden mt-[6px]"
                    style={{
                      width: '74px',
                      height: '5px',
                      background: 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <motion.div
                      key={`${playKey}-fill-${i}`}
                      className="h-full bg-[#00BFA6] rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={
                        playing ? { scaleX: lead.score / 100 } : { scaleX: 0 }
                      }
                      transition={{
                        duration: 0.9,
                        delay: playing ? FILL_DELAYS[i] : 0,
                        ease: fillEase,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI insight card */}
          <motion.div
            key={`${playKey}-insight`}
            initial={{ opacity: 0, y: 12 }}
            animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.55,
              delay: playing ? 2.3 : 0,
              ease: riseEase,
            }}
            className="bg-[#E6F7F4] border border-[rgba(0,191,166,0.28)] rounded-[14px] p-4 flex gap-[14px] items-start relative overflow-hidden"
          >
            {/* Left accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00BFA6]" />

            {/* Lightning badge */}
            <div className="w-10 h-10 flex-none rounded-[11px] bg-white border border-[rgba(0,191,166,0.2)] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
                fill="none"
                stroke="#00BFA6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
              </svg>
            </div>

            {/* Text body */}
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
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}

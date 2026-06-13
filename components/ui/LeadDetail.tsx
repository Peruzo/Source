'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface LeadDetailProps {
  /**
   * Extern trigger. När detta tal ändras (> 0) spelas slide-in + intern stagger.
   * Synkas av föräldern så detaljen glider in NÅGOT EFTER att listan genererat.
   */
  triggerKey?: number;
}

const riseEase = [0.2, 0.7, 0.3, 1] as [number, number, number, number];

/**
 * Detaljvy för en vald lead (Glow Hudvård) — speglar source_leads_detail.html.
 * Glider in från höger när triggerKey ändras; interna delar (åtgärder, status,
 * anteckningar) tonas in i en lätt stagger. prefers-reduced-motion → slutläge direkt.
 */
export function LeadDetail({ triggerKey }: LeadDetailProps = {}) {
  const [playing, setPlaying] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if ((triggerKey ?? 0) <= 0) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (prefersReducedRef.current) {
      setPlaying(true); // delays nollställs nedan när reduced
      return;
    }

    setPlaying(false);
    const t = setTimeout(() => setPlaying(true), 50);
    timersRef.current.push(t);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [triggerKey]);

  const reduced = prefersReducedRef.current;

  // Card slide-in (1.7 s) + inner stagger (2.0 / 2.13 / 2.26 s) — matchar referensen
  const cardDelay = reduced ? 0 : 1.7;
  const drDelays = reduced ? [0, 0, 0] : [2.0, 2.13, 2.26];
  const cardDur = reduced ? 0 : 0.55;
  const drDur = reduced ? 0 : 0.45;

  return (
    <motion.div
      initial={{ opacity: 0, x: 26 }}
      animate={playing ? { opacity: 1, x: 0 } : { opacity: 0, x: 26 }}
      transition={{ duration: cardDur, delay: playing ? cardDelay : 0, ease: riseEase }}
      className="w-full bg-white border border-black/[0.08] rounded-[18px] shadow-[0_26px_64px_-34px_rgba(16,24,32,0.28)] px-[17px] py-4"
      role="img"
      aria-label="Detaljvy för vald lead: Glow Hudvård, score 94 av 100"
    >
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-[11px] pb-[13px] border-b border-black/[0.08]">
        <div className="w-[42px] h-[42px] flex-none rounded-[11px] bg-[#E6F7F4] text-[#00BFA6] flex items-center justify-center text-[14px] font-semibold">
          GH
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-bold text-[#1c2027] flex items-center gap-2">
            Glow Hudvård
            <span className="text-[9.5px] font-semibold tracking-[0.05em] uppercase text-[#eafff7] bg-[#047857] rounded-[5px] px-[6px] py-[2px]">
              Het
            </span>
          </div>
          <div className="text-[12px] text-[#6b7280] mt-[3px]">Skönhet · Malmö</div>
        </div>
        <div className="ml-auto text-right text-[17px] font-bold text-[#00BFA6] leading-none">
          94
          <small className="text-[10px] text-[#9aa1ab] font-medium">/100</small>
        </div>
      </div>

      {/* ── Chips ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-[6px] my-[13px]">
        {[
          ['Bransch', 'Skönhet'],
          ['Region', 'Skåne'],
          ['Källa', 'AI-sök'],
        ].map(([label, value]) => (
          <span
            key={label}
            className="text-[11px] text-[#6b7280] bg-[#f7f8f6] border border-black/[0.08] rounded-[7px] px-[9px] py-[4px]"
          >
            {label}: <b className="text-[#1c2027] font-semibold">{value}</b>
          </span>
        ))}
      </div>

      {/* ── Åtgärder (dr1) ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: drDur, delay: playing ? drDelays[0] : 0, ease: 'easeOut' }}
        className="flex gap-[8px] mb-[14px]"
      >
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-[7px] text-[13px] font-semibold rounded-[9px] px-3 py-[9px] bg-[#00BFA6] text-white"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.6 10.8a13 13 0 0 0 5.6 5.6l1.9-1.9a1.2 1.2 0 0 1 1.2-.3 9 9 0 0 0 2.8.5 1.2 1.2 0 0 1 1.2 1.2V19a1.2 1.2 0 0 1-1.2 1.2A16 16 0 0 1 4 5.2 1.2 1.2 0 0 1 5.2 4H8a1.2 1.2 0 0 1 1.2 1.2 9 9 0 0 0 .5 2.8 1.2 1.2 0 0 1-.3 1.2z" />
          </svg>
          Ring kund
        </button>
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-[7px] text-[13px] font-semibold rounded-[9px] px-3 py-[9px] bg-transparent text-[#1c2027] border border-black/[0.13]"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
          </svg>
          Mejla
        </button>
      </motion.div>

      {/* ── Status-stepper (dr2) ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: drDur, delay: playing ? drDelays[1] : 0, ease: 'easeOut' }}
      >
        <p className="text-[10.5px] tracking-[0.13em] uppercase text-[#9aa1ab] font-semibold mb-[8px]">
          Status
        </p>
        <div className="flex items-center gap-[5px] mb-[15px]">
          {/* Ny — done */}
          <div className="flex-1 text-center text-[10px] text-[#6b7280]">
            <span className="block w-[9px] h-[9px] rounded-full bg-[#00BFA6] mx-auto mb-[5px]" />
            Ny
          </div>
          <div className="h-[2px] flex-1 rounded-[2px] bg-[#00BFA6] mb-[14px]" />
          {/* Kontaktad — current */}
          <div className="flex-1 text-center text-[10px] text-[#00BFA6] font-semibold">
            <span
              className="block w-[9px] h-[9px] rounded-full bg-[#00BFA6] mx-auto mb-[5px]"
              style={{ boxShadow: '0 0 0 3px #E6F7F4' }}
            />
            Kontaktad
          </div>
          <div className="h-[2px] flex-1 rounded-[2px] bg-black/[0.1] mb-[14px]" />
          {/* Möte */}
          <div className="flex-1 text-center text-[10px] text-[#9aa1ab]">
            <span className="block w-[9px] h-[9px] rounded-full bg-black/[0.12] mx-auto mb-[5px]" />
            Möte
          </div>
          <div className="h-[2px] flex-1 rounded-[2px] bg-black/[0.1] mb-[14px]" />
          {/* Vunnen */}
          <div className="flex-1 text-center text-[10px] text-[#9aa1ab]">
            <span className="block w-[9px] h-[9px] rounded-full bg-black/[0.12] mx-auto mb-[5px]" />
            Vunnen
          </div>
        </div>
      </motion.div>

      {/* ── Anteckningar (dr3) ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: drDur, delay: playing ? drDelays[2] : 0, ease: 'easeOut' }}
      >
        <p className="text-[10.5px] tracking-[0.13em] uppercase text-[#9aa1ab] font-semibold mb-[8px]">
          Anteckningar
        </p>
        <div className="bg-[#f7f8f6] border border-black/[0.08] rounded-[10px] px-3 py-[10px] text-[12.5px] text-[#1c2027] leading-[1.45]">
          Ringde 12/6 — intresserad, vill se en demo nästa vecka. Skickar prisförslag.
          <div className="text-[11px] text-[#9aa1ab] mt-[5px]">Niklas · 12 jun</div>
        </div>
        <div className="flex items-center gap-[8px] border border-black/[0.08] rounded-[9px] px-[11px] py-2 mt-[8px] text-[#9aa1ab] text-[12.5px]">
          Lägg till anteckning…
          <span className="ml-auto text-[#00BFA6] inline-flex">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <div className="flex items-center gap-[9px] bg-[#E6F7F4] border border-[rgba(0,191,166,0.24)] rounded-[10px] px-3 py-[10px] mt-[15px] text-[12.5px] text-[#1c2027]">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00BFA6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          <span>
            <b className="font-semibold">Återkoppling 18 jun</b> — skicka demo-länk
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

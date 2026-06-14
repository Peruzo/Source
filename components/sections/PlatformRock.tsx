'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import RockHotspots from './RockHotspots';

/**
 * PlatformRock — scroll-driven sektion.
 * Stenen gror grön mossa mot scrollen, skuggorna i början ljusnar (scenen vaknar),
 * funktionerna flyger in och slår mot stenen (absorberas), budskapet stiger fram.
 *
 * Kräver videon i: /public/rock-grow.mp4
 *
 * Tuning högst upp:
 *  - ROCK_DONE: hur långt in i scrollen stenen är helt grön (resten = budskap)
 *  - ROCK_CENTER_OFFSET: om chipsen inte träffar stenens mitt exakt
 */

const VIDEO_SRC = '/rock-grow.mp4';
const ROCK_DONE = 0.9; // sten helt grön vid 90% scroll; sista 10% = budskap
const ROCK_CENTER_OFFSET = { x: 0, y: 0 }; // fraktion av container; tuna in mot stenens mitt

type ChipDef = { label: string; fx: number; fy: number; start: number; end: number };

// fx/fy = scatter-position (fraktion av container, relativt mitten)
// start/end = när chippet flyger in (i scroll-progress 0–1)
const CHIPS: ChipDef[] = [
  { label: 'Leads',          fx: -0.40, fy: -0.30, start: 0.06, end: 0.34 },
  { label: 'Kampanjer',      fx:  0.42, fy: -0.26, start: 0.10, end: 0.38 },
  { label: 'Betalningar',    fx: -0.46, fy:  0.02, start: 0.08, end: 0.36 },
  { label: 'Analyser',       fx:  0.47, fy:  0.06, start: 0.13, end: 0.41 },
  { label: 'Bokföring',      fx: -0.34, fy:  0.30, start: 0.12, end: 0.40 },
  { label: 'Logistik',       fx:  0.36, fy:  0.32, start: 0.16, end: 0.44 },
  { label: 'Produkter',      fx:  0.02, fy: -0.40, start: 0.14, end: 0.42 },
  { label: 'Kunder',         fx: -0.06, fy:  0.42, start: 0.18, end: 0.46 },
  { label: 'Fakturor',       fx: -0.50, fy: -0.16, start: 0.20, end: 0.48 },
  { label: 'Bokningssystem', fx:  0.50, fy: -0.12, start: 0.22, end: 0.50 },
  { label: 'Marknadsföring', fx: -0.44, fy:  0.22, start: 0.24, end: 0.52 },
  { label: 'Presentkort',    fx:  0.44, fy:  0.22, start: 0.26, end: 0.54 },
  { label: 'Statistik',      fx:  0.22, fy: -0.36, start: 0.28, end: 0.56 },
  { label: 'Inventarier',    fx: -0.22, fy: -0.36, start: 0.30, end: 0.58 },
  { label: 'Integrationer',  fx:  0.24, fy:  0.38, start: 0.32, end: 0.60 },
];

export default function PlatformRock() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingTime = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Mät sticky-containern -> chip-positioner i px (GPU-accelererat, responsivt)
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Vänta på video-metadata (duration), rita första rutan
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      durationRef.current = v.duration || 0;
      try { v.currentTime = reduce ? (v.duration || 0) : 0; } catch {}
    };
    if (v.readyState >= 1 && v.duration) onMeta();
    else v.addEventListener('loadedmetadata', onMeta);
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, [reduce]);

  // Scrubba videon mot scrollen (max en seek per frame)
  const seek = useCallback(() => {
    rafRef.current = null;
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - pendingTime.current) > 0.01) {
      try { v.currentTime = pendingTime.current; } catch {}
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    const dur = durationRef.current;
    if (!dur) return;
    const rockP = Math.min(Math.max(p / ROCK_DONE, 0), 1);
    pendingTime.current = rockP * dur;
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(seek);
  });

  // Skuggorna i början -> ljusnar; svag glow på slutet; budskap stiger fram
  const shadowOpacity = useTransform(scrollYProgress, [0, ROCK_DONE], [1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 0.3]);
  const msgOpacity = useTransform(scrollYProgress, [0.86, 0.97], [0, 1]);
  const msgY = useTransform(scrollYProgress, [0.86, 1], [28, 0]);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: reduce ? '100vh' : '280vh' }}
      aria-label="Hela din verksamhet, samlad"
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // grå vinjett som matchar videons inbakade bakgrund
          background:
            'radial-gradient(circle farthest-corner at 50% 34%, #ecedeb 0%, #d2d3cf 38%, #adada8 70%, #9a9a92 100%)',
        }}
      >
        {/* Stenen (video) med subtil float */}
        <div
          className={reduce ? undefined : 'rock-float'}
          style={{ position: 'relative', width: 'min(92vw, 1040px)' }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              pointerEvents: 'none',
              WebkitMaskImage:
                'radial-gradient(ellipse closest-side at 50% 50%, #000 82%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse closest-side at 50% 50%, #000 82%, transparent 100%)',
            }}
          />
        </div>

        {/* Skuggorna i början (vinjett) som ljusnar */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: reduce ? 0 : shadowOpacity,
            background:
              'radial-gradient(72% 64% at 50% 46%, rgba(6,10,12,0) 32%, rgba(6,10,12,0.34) 64%, rgba(4,7,9,0.74) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Svag ljus-glow på slutet (scenen vaknar) */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: reduce ? 0.3 : glowOpacity,
            background:
              'radial-gradient(58% 54% at 50% 42%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* Funktionerna som slår in mot stenen */}
        {!reduce && size.w > 0 &&
          CHIPS.map((c) => <Chip key={c.label} def={c} size={size} progress={scrollYProgress} />)}

        {/* Budskapet på slutet */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '11%',
            textAlign: 'center',
            padding: '0 24px',
            opacity: reduce ? 1 : msgOpacity,
            y: reduce ? 0 : msgY,
            zIndex: 6,
          }}
        >
          <div
            className="text-overline"
            style={{ color: 'var(--color-teal-dark, #00806D)', marginBottom: 12 }}
          >
            Allt på ett ställe
          </div>
          <h2
            className="text-hero"
            style={{
              margin: 0,
              color: '#121212',
              fontSize: 'clamp(28px, 4.4vw, 52px)',
              lineHeight: 1.08,
            }}
          >
            Hela din verksamhet — samlad.
          </h2>
        </motion.div>

        {/* Klickbara hotspots som tonar fram i slutläget */}
        <RockHotspots progress={scrollYProgress} />
      </div>

      <style>{`
        @keyframes rockFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-13px) rotate(-0.5deg); }
        }
        .rock-float { animation: rockFloat 7s ease-in-out infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .rock-float { animation: none; } }
      `}</style>
    </section>
  );
}

function Chip({
  def,
  size,
  progress,
}: {
  def: ChipDef;
  size: { w: number; h: number };
  progress: MotionValue<number>;
}) {
  const x0 = (def.fx + ROCK_CENTER_OFFSET.x) * size.w;
  const y0 = (def.fy + ROCK_CENTER_OFFSET.y) * size.h;
  const cx = ROCK_CENTER_OFFSET.x * size.w;
  const cy = ROCK_CENTER_OFFSET.y * size.h;

  const x = useTransform(progress, [def.start, def.end], [x0, cx]);
  const y = useTransform(progress, [def.start, def.end], [y0, cy]);
  const scale = useTransform(progress, [def.start, def.end], [1, 0.12]);
  const opacity = useTransform(
    progress,
    [Math.max(def.start - 0.04, 0), def.start, def.end - 0.06, def.end],
    [0, 1, 1, 0]
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <motion.div style={{ x, y, scale, opacity }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(18,18,18,0.08)',
            boxShadow: '0 6px 20px rgba(15,30,28,0.10)',
            backdropFilter: 'blur(4px)',
            whiteSpace: 'nowrap',
            fontSize: 14,
            fontWeight: 600,
            color: '#1f1f1f',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: 'var(--color-teal, #00BFA6)',
              flex: 'none',
            }}
          />
          {def.label}
        </div>
      </motion.div>
    </div>
  );
}

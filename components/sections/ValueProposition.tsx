'use client';

import { motion, useScroll, useTransform, useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { LaptopScene } from '@/components/sections/LaptopScene';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

const SYSTEM_LINES = [
  'Ett system för butiken.',
  'Ett för fakturorna.',
  'Ett för bokföringen.',
  'Ett för utskicken.',
];

/** Scroll progress at which the lid starts to open; before that the sheen sweeps the closed lid. */
const LID_START = 0.25;
/** Scroll progress at which the laptop has finished opening and turning. */
const MOVE_END = 0.55;
/** Progress windows in which each listed line fades in on the screen. */
const LINE_WINDOWS: [number, number][] = [
  [0.62, 0.68],
  [0.68, 0.74],
  [0.74, 0.8],
  [0.8, 0.86],
];
/** The closing line comes after a clear gap, then the rest of the scroll is reading time. */
const CLOSING_WINDOW: [number, number] = [0.88, 0.94];

/** Starting side angle of the whole laptop; the narrow variant keeps the turn inside a phone screen. */
const SIDE_ANGLE_DESKTOP = 50;
const SIDE_ANGLE_MOBILE = 18;
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Camera elevation in degrees above the laptop: high enough at the start to see the closed lid
 * from above, low at the end for a straight-on view of the screen. Applied as a negative
 * rotateX on the scene, since a positive rotateX lifts the near edge and looks up from below.
 */
const ELEV_START = 45;
const ELEV_END = 10;

/** Lid hinge angles: closed just above the base (avoids z-fighting), open ~102° from the base. */
const LID_CLOSED = -89;
const LID_OPEN = 12;

/** Vertical offset of the laptop while the camera is high, so the tipped-up base stays framed. */
const Y_START = '-20%';

/** Section heights: pinned scroll container, breathing tail after it, and the static fallback. */
const PINNED_HEIGHT = '220vh';
const TAIL_HEIGHT = '50vh';
const STATIC_HEIGHT = '100vh';

function ScreenLine({
  progress,
  window,
  isStatic,
  className = '',
  children,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  isStatic: boolean;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, window, [0, 1]);
  const y = useTransform(progress, window, [12, 0]);

  return (
    <motion.span className={`block ${className}`} style={isStatic ? undefined : { opacity, y }}>
      {children}
    </motion.span>
  );
}

export function ValueProposition() {
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
  // Static fallback: laptop open and straight on, all lines visible, no pinned scroll.
  const isStatic = Boolean(reduce) || nofx.laptop;

  const [sideAngle, setSideAngle] = useState(SIDE_ANGLE_DESKTOP);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setSideAngle(mq.matches ? SIDE_ANGLE_MOBILE : SIDE_ANGLE_DESKTOP);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinnedRef,
    offset: ['start start', 'end end'],
  });

  // Laptop motion in two phases: the camera holds high and to the side while the sheen sweeps the
  // closed lid (0 → LID_START), then the lid opens as the camera lowers and turns to the front
  // (LID_START → MOVE_END). All finished by MOVE_END so the screen is still before the text arrives.
  const rotateY = useTransform(scrollYProgress, [0, LID_START, MOVE_END], [sideAngle, sideAngle, 0]);
  const rotateX = useTransform(scrollYProgress, [0, LID_START, MOVE_END], [-ELEV_START, -ELEV_START, -ELEV_END]);
  const scale = useTransform(scrollYProgress, [LID_START, MOVE_END], [0.82, 1]);
  const y = useTransform(scrollYProgress, [LID_START, MOVE_END], [Y_START, '0%']);
  const lidRotateX = useTransform(scrollYProgress, [LID_START, MOVE_END], [LID_CLOSED, LID_OPEN]);
  // Sheen over the closed lid: 0 → 1 during the first phase; pinned at 1 (gone) in the static fallback.
  const sheenProgress = useTransform(scrollYProgress, [0, LID_START], [0, 1]);
  // 0 closed → 1 open, for the screen glow; pinned at 1 in the static fallback.
  const lidProgress = useTransform(scrollYProgress, [LID_START, MOVE_END], [0, 1]);
  const done = useMotionValue(1);
  const shadowOpacity = useTransform(scrollYProgress, [LID_START, MOVE_END], [0.35, 0.55]);

  return (
    <section
      id="next-section"
      className="relative bg-gradient-to-b from-surface-stone from-70% to-surface-stone-deep overflow-visible"
    >
      {/* Behåll #value-proposition för befintliga länkar / SEO */}
      <span id="value-proposition" className="sr-only" aria-hidden />

      {/* Pinned scroll container: the sticky layer stays put while this scrolls through */}
      <div ref={pinnedRef} className="relative" style={{ height: isStatic ? STATIC_HEIGHT : PINNED_HEIGHT }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 pb-[6vh]">
          <LaptopScene
            rotateY={isStatic ? 0 : rotateY}
            rotateX={isStatic ? -ELEV_END : rotateX}
            scale={isStatic ? 1 : scale}
            y={isStatic ? '0%' : y}
            lidRotateX={isStatic ? LID_OPEN : lidRotateX}
            lidProgress={isStatic ? done : lidProgress}
            sheenProgress={isStatic ? done : sheenProgress}
            shadowOpacity={isStatic ? 0.55 : shadowOpacity}
          >
            <h2 className="w-full text-center font-bold tracking-tight text-black text-[clamp(1rem,2.6vw,2rem)] leading-[1.3]">
              {SYSTEM_LINES.map((line, i) => (
                <ScreenLine key={line} progress={scrollYProgress} window={LINE_WINDOWS[i]} isStatic={isStatic}>
                  {line}
                </ScreenLine>
              ))}

              <ScreenLine
                progress={scrollYProgress}
                window={CLOSING_WINDOW}
                isStatic={isStatic}
                className="mt-[0.9em]"
              >
                Eller ett för <span className="text-teal-dark">allt</span>.
              </ScreenLine>
            </h2>
          </LaptopScene>
        </div>
      </div>

      {/* Breathing room after the pinned scroll releases, before PlatformRock */}
      {!isStatic && <div aria-hidden style={{ height: TAIL_HEIGHT }} />}
    </section>
  );
}

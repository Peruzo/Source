'use client';

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { LaptopScene } from '@/components/sections/LaptopScene';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

const SYSTEM_LINES = [
  'Ett system för butiken.',
  'Ett för fakturorna.',
  'Ett för bokföringen.',
  'Ett för utskicken.',
];

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
const SIDE_ANGLE_DESKTOP = 55;
const SIDE_ANGLE_MOBILE = 18;
const MOBILE_QUERY = '(max-width: 767px)';

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

  // Laptop motion, all finished by MOVE_END so the screen is perfectly still before the text arrives.
  const rotateY = useTransform(scrollYProgress, [0, MOVE_END], [sideAngle, 0]);
  const rotateX = useTransform(scrollYProgress, [0, MOVE_END], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, MOVE_END], [0.82, 1]);
  const y = useTransform(scrollYProgress, [0, MOVE_END], ['6%', '0%']);
  const lidRotateX = useTransform(scrollYProgress, [0, MOVE_END], [-85, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, MOVE_END], [0.2, 0.45]);

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
            rotateX={isStatic ? 0 : rotateX}
            scale={isStatic ? 1 : scale}
            y={isStatic ? '0%' : y}
            lidRotateX={isStatic ? 0 : lidRotateX}
            shadowOpacity={isStatic ? 0.45 : shadowOpacity}
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

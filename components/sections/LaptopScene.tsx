'use client';

import { motion, type MotionValue } from 'framer-motion';
import { ReactNode } from 'react';

type Num = MotionValue<number> | number;
type Str = MotionValue<string> | string;

type LaptopSceneProps = {
  /** Whole-laptop turn: side view → straight on. */
  rotateY: Num;
  /** Whole-laptop tilt: seen slightly from above → level. */
  rotateX: Num;
  scale: Num;
  y: Str;
  /** Lid hinge angle: -90 is closed flat on the base, 0 is upright. */
  lidRotateX: Num;
  shadowOpacity: Num;
  /** Rendered on the screen surface, inside the lid. */
  children: ReactNode;
};

/**
 * Generic laptop drawn with CSS 3D: a lid that swings on its bottom edge and a
 * base lying flat in front of it. The perspective lives here, inside the sticky
 * layer, because the sticky layer's overflow:hidden would flatten a 3D context
 * placed any higher up. Only transform and opacity are animated.
 */
export function LaptopScene({
  rotateY,
  rotateX,
  scale,
  y,
  lidRotateX,
  shadowOpacity,
  children,
}: LaptopSceneProps) {
  return (
    <div
      className="relative w-[92vw] max-w-[900px]"
      style={{ perspective: 1400, perspectiveOrigin: '50% 55%' }}
    >
      {/* Flat drop shadow, kept outside the 3D wrapper so it never rotates */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-14%] left-1/2 h-[16%] w-[78%] -translate-x-1/2 rounded-[50%] bg-black blur-2xl"
        style={{ opacity: shadowOpacity }}
      />

      <motion.div
        className="relative"
        style={{
          rotateY,
          rotateX,
          scale,
          y,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Lid: dark frame with a thin light edge, hinged on its bottom edge */}
        <motion.div
          className="relative aspect-[16/10] w-full rounded-2xl border border-white/15 bg-black-secondary p-[2.2%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
          style={{
            rotateX: lidRotateX,
            transformOrigin: '50% 100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Screen surface: real HTML, hidden from behind so nothing mirrors while the lid is closed */}
          <div
            className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white p-[6%] ring-1 ring-black/40"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {children}
          </div>
        </motion.div>

        {/* Base: light grey slab lying flat in front of the hinge, keyboard hinted with a faint grid */}
        <div
          aria-hidden
          className="absolute left-0 top-full w-full aspect-[16/10] rounded-t-md rounded-b-2xl border border-black/10 bg-gray-200"
          style={{
            transform: 'rotateX(90deg)',
            transformOrigin: '50% 0%',
          }}
        >
          <div
            className="absolute inset-x-[7%] top-[10%] h-[48%] rounded-md bg-gray-100"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)',
              backgroundSize: '5.6% 14%',
            }}
          />
          <div className="absolute left-1/2 top-[66%] h-[22%] w-[30%] -translate-x-1/2 rounded-md bg-gray-300/70" />
        </div>
      </motion.div>
    </div>
  );
}

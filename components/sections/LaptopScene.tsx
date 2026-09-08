'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
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
  /** 0 = lid closed, 1 = lid fully open. Drives the sheen on the lid back and the screen glow. */
  lidProgress: MotionValue<number>;
  shadowOpacity: Num;
  /** Rendered on the screen surface, inside the lid. */
  children: ReactNode;
};

/** Lid progress at which the sheen has faded out and the screen glow takes over (~50° from closed). */
const SHEEN_END = 0.45;

const KEY_ROWS = 5;
const KEY_COLS = 14;

/**
 * Generic laptop drawn with CSS 3D: a lid that swings on its bottom edge and a
 * base lying flat in front of it. The perspective lives here, inside the sticky
 * layer, because the sticky layer's overflow:hidden would flatten a 3D context
 * placed any higher up. Only transform and opacity are animated. Materials are
 * plain gradients and box-shadows; no images.
 */
export function LaptopScene({
  rotateY,
  rotateX,
  scale,
  y,
  lidRotateX,
  lidProgress,
  shadowOpacity,
  children,
}: LaptopSceneProps) {
  // Light sliding across the lid back while it opens, gone once the screen takes over.
  const sheenX = useTransform(lidProgress, [0, SHEEN_END], ['-70%', '170%']);
  const sheenOpacity = useTransform(lidProgress, [0, SHEEN_END * 0.7, SHEEN_END], [0.9, 0.75, 0]);
  const sheenWillChange = useTransform(lidProgress, (p) => (p < SHEEN_END ? 'transform, opacity' : 'auto'));
  // The screen reads as lit only once the lid is well past halfway.
  const screenGlow = useTransform(lidProgress, [0.5, 1], [0, 1]);

  return (
    <div
      className="relative w-[92vw] max-w-[900px]"
      style={{ perspective: 1400, perspectiveOrigin: '50% 55%' }}
    >
      {/* Flat drop shadow, kept outside the 3D wrapper so it never rotates */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-18%] left-1/2 h-[22%] w-[88%] -translate-x-1/2 rounded-[50%] bg-black blur-3xl"
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
        {/* Lid: thin dark bezel, hinged on its bottom edge */}
        <motion.div
          className="relative aspect-[16/10] w-full rounded-2xl p-[0.75%]"
          style={{
            rotateX: lidRotateX,
            transformOrigin: '50% 100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            background: 'linear-gradient(180deg, #1c1d1f 0%, #121314 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Soft outward glow so the open screen reads as lit; sits behind the screen surface */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-[2%] rounded-2xl"
            style={{
              opacity: screenGlow,
              boxShadow: '0 0 48px rgba(255,255,255,0.45), 0 0 120px rgba(255,255,255,0.18)',
              backfaceVisibility: 'hidden',
            }}
          />

          {/* Screen surface: real HTML, hidden from behind so nothing mirrors while the lid is closed */}
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-white p-[6%]"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 0 0 2px rgba(0,0,0,0.55)',
            }}
          >
            {children}
          </div>

          {/* Lid back: dark grey-silver metal, only visible from behind. Holds the single sheen element. */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-2xl"
            style={{
              transform: 'rotateY(180deg) translateZ(1px)',
              backfaceVisibility: 'hidden',
              background:
                'linear-gradient(160deg, #4a4d51 0%, #34373b 38%, #26282c 70%, #2e3135 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.5)',
            }}
          >
            <motion.div
              className="absolute inset-y-[-20%] left-0 w-[45%]"
              style={{
                x: sheenX,
                opacity: sheenOpacity,
                willChange: sheenWillChange,
                background:
                  'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0) 100%)',
              }}
            />
          </div>
        </motion.div>

        {/* Base: silver-grey slab lying flat in front of the hinge, with a darker front edge for thickness */}
        <div
          aria-hidden
          className="absolute left-0 top-full w-full aspect-[16/10] rounded-t-md rounded-b-2xl"
          style={{
            transform: 'rotateX(90deg)',
            transformOrigin: '50% 0%',
            background: 'linear-gradient(180deg, #e6e7e9 0%, #d3d5d8 55%, #c3c6ca 100%)',
            borderBottom: '3px solid #9a9da2',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 0 0 1px rgba(0,0,0,0.08)',
          }}
        >
          {/* Keyboard: real key caps, no legends */}
          <div
            className="absolute inset-x-[6%] top-[9%] grid h-[50%] gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${KEY_COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: KEY_ROWS * KEY_COLS }).map((_, i) => {
              const row = Math.floor(i / KEY_COLS);
              const col = i % KEY_COLS;
              // Last row: a wide space bar across the middle columns.
              if (row === KEY_ROWS - 1 && col >= 4 && col <= 9) {
                if (col !== 4) return null;
                return <span key={i} className="rounded-[3px] bg-[#2b2d31]" style={{ gridColumn: 'span 6', ...keyCapStyle }} />;
              }
              return <span key={i} className="rounded-[3px] bg-[#2b2d31]" style={keyCapStyle} />;
            })}
          </div>

          {/* Trackpad: slightly lighter rounded field under the keys */}
          <div
            className="absolute left-1/2 top-[66%] h-[24%] w-[32%] -translate-x-1/2 rounded-md"
            style={{
              background: 'linear-gradient(180deg, #eceef0 0%, #dfe1e4 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

const keyCapStyle = {
  backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 45%)',
  boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.45)',
} as const;

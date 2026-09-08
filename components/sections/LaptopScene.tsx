'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ReactNode } from 'react';

type Num = MotionValue<number> | number;
type Str = MotionValue<string> | string;

type LaptopSceneProps = {
  /** Whole-laptop turn around the vertical axis: side view → straight on. */
  rotateY: Num;
  /**
   * Whole-laptop tilt around the horizontal axis. Negative values look down on the
   * laptop from above (camera elevation); positive values would look up from below.
   */
  rotateX: Num;
  scale: Num;
  y: Str;
  /** Lid hinge angle: -90 is closed flat on the base, 0 is upright, positive leans back. */
  lidRotateX: Num;
  /** 0 = lid closed, 1 = lid fully open. Drives the screen glow. */
  lidProgress: MotionValue<number>;
  /** 0 → 1 sweeps the light across the closed lid back and fades it out. */
  sheenProgress: MotionValue<number>;
  shadowOpacity: Num;
  /** Rendered on the screen surface, inside the lid. */
  children: ReactNode;
};

/** Reference thicknesses in px: the base is a box, the lid a thin slab with a metal rim. */
const BASE_THICKNESS = 12;
const LID_RIM = 5;
/** Side faces stop short of the corners so they do not poke past the rounded edges. */
const BASE_FACE_INSET = 4;
const LID_RIM_INSET = 6;

const KEY_ROWS = 5;
const KEY_COLS = 14;

/**
 * Generic laptop drawn with CSS 3D: a lid that swings on its bottom edge and a
 * base lying flat in front of it. The perspective lives here, inside the sticky
 * layer, because the sticky layer's overflow:hidden would flatten a 3D context
 * placed any higher up. Only transform and opacity are animated; every face that
 * gives the parts thickness is a static child of a preserve-3d wrapper.
 * Materials are plain gradients and box-shadows; no images.
 */
export function LaptopScene({
  rotateY,
  rotateX,
  scale,
  y,
  lidRotateX,
  lidProgress,
  sheenProgress,
  shadowOpacity,
  children,
}: LaptopSceneProps) {
  // Light sliding across the closed lid back, faded out before the lid starts to open.
  const sheenX = useTransform(sheenProgress, [0, 1], ['-70%', '170%']);
  const sheenOpacity = useTransform(sheenProgress, [0, 0.7, 1], [0.9, 0.75, 0]);
  const sheenWillChange = useTransform(sheenProgress, (p) => (p < 1 ? 'transform, opacity' : 'auto'));
  // The screen reads as lit only once the lid is well past halfway.
  const screenGlow = useTransform(lidProgress, [0.5, 1], [0, 1]);

  return (
    <div
      className="relative w-[92vw] max-w-[900px]"
      style={{ perspective: 1400, perspectiveOrigin: '50% 55%' }}
    >
      {/* Ground shadow, kept outside the 3D wrapper so it never rotates: darkest under the base, fading out */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[88%] h-[48%] w-full -translate-x-1/2"
        style={{
          opacity: shadowOpacity,
          background:
            'radial-gradient(ellipse 50% 50% at 50% 38%, rgba(28,26,24,0.75) 0%, rgba(28,26,24,0.35) 38%, rgba(28,26,24,0.10) 62%, rgba(28,26,24,0) 80%)',
        }}
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
          className="relative aspect-[16/10] w-full rounded-[10px] p-[0.75%]"
          style={{
            rotateX: lidRotateX,
            transformOrigin: '50% 100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            background: 'linear-gradient(180deg, #1c1d20 0%, #131416 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Soft outward glow so the open screen reads as lit; sits behind the screen surface */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-[2%] rounded-[10px]"
            style={{
              opacity: screenGlow,
              boxShadow: '0 0 48px rgba(255,255,255,0.45), 0 0 120px rgba(255,255,255,0.18)',
              backfaceVisibility: 'hidden',
            }}
          />

          {/* Screen surface: real HTML, hidden from behind so nothing mirrors while the lid is closed */}
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[8px] bg-white p-[6%]"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 0 0 2px rgba(0,0,0,0.55)',
            }}
          >
            {children}
          </div>

          {/* Lid rim: four dark metal faces folded back from the screen plane to the lid back */}
          <div
            aria-hidden
            className="absolute bottom-full"
            style={{
              ...lidRimStyle,
              left: LID_RIM_INSET,
              right: LID_RIM_INSET,
              height: LID_RIM,
              transform: 'rotateX(90deg)',
              transformOrigin: '50% 100%',
              background: 'linear-gradient(180deg, #2c2e32 0%, #1f2124 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
            }}
          />
          <div
            aria-hidden
            className="absolute top-full"
            style={{
              ...lidRimStyle,
              left: LID_RIM_INSET,
              right: LID_RIM_INSET,
              height: LID_RIM,
              transform: 'rotateX(-90deg)',
              transformOrigin: '50% 0%',
              background: 'linear-gradient(0deg, #2c2e32 0%, #1f2124 100%)',
              boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.16)',
            }}
          />
          <div
            aria-hidden
            className="absolute right-full"
            style={{
              ...lidRimStyle,
              top: LID_RIM_INSET,
              bottom: LID_RIM_INSET,
              width: LID_RIM,
              transform: 'rotateY(-90deg)',
              transformOrigin: '100% 50%',
              background: 'linear-gradient(90deg, #2c2e32 0%, #1f2124 100%)',
              boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.16)',
            }}
          />
          <div
            aria-hidden
            className="absolute left-full"
            style={{
              ...lidRimStyle,
              top: LID_RIM_INSET,
              bottom: LID_RIM_INSET,
              width: LID_RIM,
              transform: 'rotateY(90deg)',
              transformOrigin: '0% 50%',
              background: 'linear-gradient(270deg, #2c2e32 0%, #1f2124 100%)',
              boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.16)',
            }}
          />

          {/* Lid back: dark grey-silver metal one rim-thickness behind the screen, only visible from behind */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-[10px]"
            style={{
              transform: `rotateY(180deg) translateZ(${LID_RIM}px)`,
              backfaceVisibility: 'hidden',
              background:
                'linear-gradient(160deg, #55585d 0%, #3c3f44 40%, #2c2f33 72%, #34373b 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.5)',
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

        {/* Base: warm-grey metal box lying flat in front of the hinge. Top face here, side faces as children. */}
        <div
          aria-hidden
          className="absolute left-0 top-full w-full aspect-[16/10] rounded-[6px]"
          style={{
            transform: 'rotateX(90deg)',
            transformOrigin: '50% 0%',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(180deg, #e2dfda 0%, #d5d1cb 55%, #c8c4be 100%)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.06)',
          }}
        >
          {/* Front face: folded down from the near edge, darker than the top */}
          <div
            className="absolute top-full"
            style={{
              ...baseFaceStyle,
              left: BASE_FACE_INSET,
              right: BASE_FACE_INSET,
              height: BASE_THICKNESS,
              transform: 'rotateX(-90deg)',
              transformOrigin: '50% 0%',
              background: 'linear-gradient(180deg, #bbb6af 0%, #a59f98 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          />
          {/* Left and right faces: folded down from the side edges, darker than the front */}
          <div
            className="absolute right-full"
            style={{
              ...baseFaceStyle,
              top: BASE_FACE_INSET,
              bottom: BASE_FACE_INSET,
              width: BASE_THICKNESS,
              transform: 'rotateY(-90deg)',
              transformOrigin: '100% 50%',
              background: 'linear-gradient(270deg, #9e9992 0%, #8b8680 100%)',
              boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.28)',
            }}
          />
          <div
            className="absolute left-full"
            style={{
              ...baseFaceStyle,
              top: BASE_FACE_INSET,
              bottom: BASE_FACE_INSET,
              width: BASE_THICKNESS,
              transform: 'rotateY(90deg)',
              transformOrigin: '0% 50%',
              background: 'linear-gradient(90deg, #9e9992 0%, #8b8680 100%)',
              boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.28)',
            }}
          />

          {/* Keyboard well: recessed field holding the keys */}
          <div
            className="absolute inset-x-[5.5%] top-[8%] h-[52%] rounded-[6px] p-[1.2%] pb-[1.6%]"
            style={{
              background: '#c9c5bf',
              boxShadow:
                'inset 0 2px 5px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            {/* Keys: light top, 2px darker front edge, no legends */}
            <div
              className="grid h-full gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${KEY_COLS}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: KEY_ROWS * KEY_COLS }).map((_, i) => {
                const row = Math.floor(i / KEY_COLS);
                const col = i % KEY_COLS;
                // Last row: a wide space bar across the middle columns.
                if (row === KEY_ROWS - 1 && col >= 4 && col <= 9) {
                  if (col !== 4) return null;
                  return <span key={i} className="rounded-[3px] bg-[#2f3135]" style={{ gridColumn: 'span 6', ...keyCapStyle }} />;
                }
                return <span key={i} className="rounded-[3px] bg-[#2f3135]" style={keyCapStyle} />;
              })}
            </div>
          </div>

          {/* Trackpad: slightly lighter rounded field under the keys */}
          <div
            className="absolute left-1/2 top-[68%] h-[24%] w-[32%] -translate-x-1/2 rounded-md"
            style={{
              background: 'linear-gradient(180deg, #dcd8d2 0%, #cfcbc5 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

const keyCapStyle = {
  backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 50%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 0 #17181b',
} as const;

const baseFaceStyle = {
  backfaceVisibility: 'hidden',
} as const;

const lidRimStyle = {
  backfaceVisibility: 'hidden',
} as const;

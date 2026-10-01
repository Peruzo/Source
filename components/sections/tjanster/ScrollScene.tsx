'use client';

import { useId, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { usePinnedScrollHint } from '@/components/ui/ScrollHint';

type ScrollSceneProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  /** One paragraph per entry. */
  body: string[];
  /** Accessible name for the demo, e.g. "Exempel: en kampanjkod i kassan". */
  label: string;
  /**
   * The demo. Gets the scene's progress, 0 → 1, and must be fully readable at 1 –
   * that is all a visitor with reduced motion sees. Size it from its content,
   * not from the progress, so nothing moves the layout while it plays.
   */
  children: (progress: MotionValue<number>) => ReactNode;
  /** Side of the demo from `lg`. Default `right`. */
  demoSide?: 'left' | 'right';
  background?: 'white' | 'stone';
  /** Extra content under the text (a note, a toggle). */
  aside?: ReactNode;
};

const backgrounds = {
  white: { section: 'bg-white', stage: 'bg-surface-stone' },
  stone: { section: 'bg-surface-stone', stage: 'bg-white' },
} as const;

/*
 * A scroll-driven UI demo: the page scrolls and a live widget plays forward,
 * one step per stretch of scroll, and rests in its final state.
 *
 * From `lg` the section is 220svh tall and a one-screen frame pins to the top
 * (the sticky pattern from StickySteps), so the demo plays while the text
 * stays put. Below `lg` nothing pins: the demo plays while it scrolls up into
 * full view, so a phone never feels stuck.
 *
 * Scroll is never taken over – no wheel or touch handlers, only position.
 * Under reduced motion the progress is fixed at 1 at every width and there is
 * no pinning, so each demo is shown directly in its final state.
 *
 * Both layouts are in the DOM and swapped with CSS (as in StickySteps), so the
 * server HTML is right at every width; the hidden one is display:none.
 */
export function ScrollScene({
  id,
  eyebrow,
  title,
  body,
  label,
  children,
  demoSide = 'right',
  background = 'white',
  aside,
}: ScrollSceneProps) {
  const b = backgrounds[background];
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { reveal, shouldReduceMotion } = useReveal();

  // Pinned: the first and last stretch of the track are rest, so the demo
  // starts once the frame has settled and ends before the frame leaves.
  const { scrollYProgress: trackProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const pinnedProgress = useTransform(trackProgress, [0.08, 0.86], [0, 1]);
  // Unpinned: from the stage's top at 75 % of the screen until its bottom is on
  // screen too (95 %), so the demo ends as the whole card comes into view.
  const { scrollYProgress: stageProgress } = useScroll({ target: stageRef, offset: ['start 0.75', 'end 0.95'] });
  const done = useMotionValue(1);

  const pinned = !shouldReduceMotion;
  usePinnedScrollHint(trackRef, pinned);

  const text = (withId: boolean) => (
    <div className="max-w-[34rem]">
      {eyebrow ? <p className="text-overline mb-5 text-teal-dark">{eyebrow}</p> : null}
      <h2
        id={withId ? headingId : undefined}
        className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        {body.map((paragraph, i) => (
          <p key={i} className="max-w-[46ch] text-base leading-relaxed text-gray-700 md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
      {aside ? <div className="mt-8">{aside}</div> : null}
    </div>
  );

  const stage = (progress: MotionValue<number>, className: string) => (
    <div role="group" aria-label={label} className={`relative flex items-center justify-center rounded-3xl ${b.stage} ${className}`}>
      <div className="w-full max-w-[25rem]">{children(progress)}</div>
    </div>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={`relative ${b.section}`}>
      {pinned ? (
        <div ref={trackRef} className="hidden lg:block" style={{ height: '220svh' }}>
          <div className="sticky top-0 mx-auto grid h-[100svh] max-w-[1440px] grid-cols-12 items-center gap-16 px-20 pb-10 pt-24">
            <div className={`col-span-5 ${demoSide === 'left' ? 'order-2' : ''}`}>{text(true)}</div>
            {stage(pinnedProgress, `col-span-7 h-full max-h-[46rem] px-10 py-10 ${demoSide === 'left' ? 'order-1' : ''}`)}
          </div>
        </div>
      ) : null}

      {/* Unpinned: below lg, and at every width under reduced motion. */}
      <div className={`mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28 lg:px-20 ${pinned ? 'lg:hidden' : ''}`}>
        <motion.div {...reveal(0)}>{text(!pinned)}</motion.div>
        <div ref={stageRef} className="mt-10">
          {stage(shouldReduceMotion ? done : stageProgress, 'px-4 py-8 sm:px-8 sm:py-12')}
        </div>
      </div>
    </section>
  );
}

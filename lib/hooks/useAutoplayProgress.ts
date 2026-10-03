'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { animate, useMotionValue, type AnimationPlaybackControls, type Easing, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';

/*
 * A 0 → 1 progress that plays by itself in time, as a drop-in replacement for a
 * section's scrollYProgress: every useTransform built on the scroll progress keeps
 * its ranges and only the source changes.
 *
 * - Starts when the element comes into view (IntersectionObserver).
 * - Pauses when it leaves the view.
 * - Coming back into view: 'restart' plays again from 0; 'resume' carries on from
 *   where it paused, or starts over if it had finished. `once` plays a single time
 *   per mount and then stays at 1.
 * - prefers-reduced-motion: the value is set to 1 (the end state) and never animates.
 *
 * The value is 0 on the server and during hydration, so the first client render
 * matches the server HTML; it only moves once the effect has run.
 */

type AutoplayOptions = {
  /** Length of one play, in seconds. */
  duration: number;
  ease?: Easing | Easing[];
  /** What a return into view does. Default 'restart'. */
  reenter?: 'restart' | 'resume';
  /** Play a single time per mount, then stay at the end. */
  once?: boolean;
  /** IntersectionObserver rootMargin. Default '0px'. */
  rootMargin?: string;
  /** IntersectionObserver threshold. Default 0 – any part in view counts (tall sections can never be fully in view). */
  threshold?: number;
  /** false holds the value where it is and observes nothing. Default true. */
  enabled?: boolean;
};

export function useAutoplayProgress(
  ref: RefObject<Element | null>,
  { enabled = true, ...options }: AutoplayOptions,
): MotionValue<number> {
  const progress = useMotionValue(0);
  const reduce = usePrefersReducedMotion();
  // Read on each play, so callers can pass inline objects and arrays without restarting the observer.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    if (reduce) {
      progress.set(1);
      return;
    }

    const { rootMargin = '0px', threshold = 0 } = optionsRef.current;
    let controls: AnimationPlaybackControls | null = null;
    let finished = false;

    const play = () => {
      const { duration, ease, reenter = 'restart', once = false } = optionsRef.current;
      if (finished && once) return;
      if (controls && !finished && reenter === 'resume') {
        controls.play();
        return;
      }
      controls?.stop();
      finished = false;
      progress.set(0);
      controls = animate(progress, 1, {
        duration,
        ease,
        onComplete: () => {
          finished = true;
        },
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else controls?.pause();
      },
      { rootMargin, threshold },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [ref, progress, enabled, reduce]);

  return progress;
}

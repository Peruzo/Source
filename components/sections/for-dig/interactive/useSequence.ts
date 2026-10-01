'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../useReveal';

/**
 * Plays a widget's sequence ONCE, by itself, the first time the widget comes
 * into view – no scroll-driven animation. `durations` is how long each step is
 * shown before the next one (ms); after the last step the sequence stops on the
 * final state. `replay()` starts it again from the beginning (the "Spela igen"
 * button).
 *
 * The server and the first client render show step 0, so the HTML always
 * matches. With reduced motion the widget jumps straight to the final step, and
 * `replay()` keeps it there: nothing moves.
 *
 * The observer needs a third of the widget in view, so a widget that only peeks
 * in at the bottom of the screen does not play out of sight.
 */
export function useSequence(durations: number[]) {
  const reduce = usePrefersReducedMotion();
  const last = durations.length;
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const started = useRef(false);
  const durationsRef = useRef(durations);
  durationsRef.current = durations;

  // Start once, when the widget is in view.
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el || started.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          setRun((r) => r + 1);
          io.disconnect();
        }
      },
      { threshold: 0.33 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Step through the sequence for the current run.
  useEffect(() => {
    if (reduce || run === 0) return;
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 0;
    durationsRef.current.forEach((d, i) => {
      at += d;
      timers.push(setTimeout(() => setStep(i + 1), at));
    });
    return () => timers.forEach(clearTimeout);
  }, [run, reduce]);

  const replay = useCallback(() => {
    if (reduce) return;
    started.current = true;
    setRun((r) => r + 1);
  }, [reduce]);

  const shown = reduce ? last : step;
  return { ref, step: shown, last, done: shown >= last, reduce, replay };
}

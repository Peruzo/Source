'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/**
 * Live `prefers-reduced-motion` state.
 *
 * ScrollTimeline.tsx uses framer-motion's `useReducedMotion()`, but that hook
 * is `useState(prefersReducedMotion.current)` – it freezes the value at first
 * render. There is no `matchMedia` on the server, so for anything server
 * rendered it hydrates as `false` and never updates, and the reduced-motion
 * branch is dead code. `useSyncExternalStore` gives the server `false` and then
 * re-renders with the real value on the client, which is what we need here.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Shared scroll-reveal preset for the "För dig"-sections. Mirrors the inline
 * `whileInView`-pattern used in WhatWeDo.tsx.
 *
 * The reduced branch drives the element with `animate`, not `whileInView`, on
 * purpose. There is no `matchMedia` on the server, so the first client render
 * always takes the motion branch and framer-motion reads `initial` (opacity 0,
 * shifted down) exactly once, on mount. `initial` is not reactive, so when the
 * store flips to `true` a moment later a `whileInView`-only reduced branch
 * would leave the content invisible until it happened to be scrolled into
 * view. `animate` is reactive and pulls it to its final state immediately.
 */
export function useReveal() {
  const shouldReduceMotion = usePrefersReducedMotion();

  const reveal = (delay = 0, distance = 32) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: distance },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-100px' },
          transition: { duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] as const },
        };

  return { reveal, shouldReduceMotion };
}

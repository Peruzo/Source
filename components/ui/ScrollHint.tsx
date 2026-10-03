'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

/*
 * "Scrolla nedåt" – a small hint at the bottom left while the visitor is inside
 * a scroll-driven section.
 *
 * Each scroll-driven section registers an element with `useScrollHint` (pinned
 * sections through the thin `usePinnedScrollHint` wrapper); the single
 * <ScrollHint /> in app/layout.tsx draws the hint, so there is never more than
 * one on the page.
 *
 * The hint shows as soon as the visitor is inside a section, stays while they
 * scroll through it, and fades out once the section's progress passes FADE_AT
 * or the section is left. Scrolling back below FADE_AT shows it again.
 *
 * Two modes:
 * - 'pinned': a track taller than the screen with a sticky frame. Inside means
 *   the track's top has reached the top of the screen and its end is still below
 *   the bottom; progress is how far the visitor has scrolled through the track.
 * - 'flow': a scroll-driven section that does not pin. Inside means it covers
 *   the middle of the screen; progress is the section's own (0 → 1) when it
 *   passes one, otherwise the section has to continue below the bottom of the
 *   screen.
 *
 * And one that is not scroll-driven: `useIdleScrollHint` (the hero). The hint
 * shows there only once the visitor has not scrolled for IDLE_DELAY_MS since the
 * section mounted, goes at the first scroll and does not come back for that visit.
 *
 * Whether a section is scroll-driven is decided by the section itself, never here:
 * - `enabled` is the section's own flag (`!shouldReduceMotion` in ScrollScene,
 *   StickySteps and the flow sections, `!isStatic && !done` in PlatformRock).
 *   Those come from live matchMedia stores, so a changed setting re-renders the
 *   section and re-registers or drops its element.
 * - The width is read from the registered element itself: below the section's
 *   breakpoint it is display:none (`hidden lg:block`, `hidden md:block`) and has
 *   no client rects. A ResizeObserver on the element sees the swap when the
 *   window crosses the breakpoint, without a second copy of it here.
 *
 * One passive scroll listener for the whole page, checked at most once per
 * animation frame. React only re-renders when the hint turns on or off, never
 * per scroll event.
 */

/** The hint fades out once a section's progress reaches this. */
const FADE_AT = 0.85;
/** Length of the fade-out in ms (none under reduced motion). */
const FADE_OUT_MS = 200;
/** useIdleScrollHint: how long the visitor has to leave the page unscrolled, from mount. */
const IDLE_DELAY_MS = 5000;

export type ScrollHintMode = 'pinned' | 'flow';

type TrackEntry = {
  mode: ScrollHintMode | 'idle';
  /** The section's own scroll progress, 0 → 1. A MotionValue fits, or any object with get(). */
  progress?: { get(): number };
  /** 'idle' only: the delay has passed without a scroll. */
  ready?: boolean;
};

const tracks = new Map<Element, TrackEntry>();
const listeners = new Set<() => void>();
let visible = false;
let frame: number | undefined;
let resizeObserver: ResizeObserver | null = null;

function setVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

/** How far the visitor has scrolled through a pinned track, 0 → 1. */
function pinnedProgress(rect: DOMRect, viewportHeight: number) {
  const travel = rect.height - viewportHeight;
  if (travel <= 0) return 1;
  return Math.min(Math.max(-rect.top / travel, 0), 1);
}

function insideTrack(el: Element, entry: TrackEntry, viewportHeight: number) {
  if (el.getClientRects().length === 0) return false; // display:none – this width is not scroll-driven
  const rect = el.getBoundingClientRect();
  if (entry.mode === 'pinned') {
    // The track's top has reached the top of the screen, its end is still below the bottom,
    // and the visitor has not yet scrolled through FADE_AT of it.
    return rect.top <= 1 && rect.bottom > viewportHeight + 1 && pinnedProgress(rect, viewportHeight) < FADE_AT;
  }
  // 'flow' and 'idle': the section covers the middle of the screen, and has animation left
  // ('flow') or the idle delay has passed ('idle').
  const middle = viewportHeight / 2;
  if (rect.top > middle || rect.bottom < middle) return false;
  if (entry.mode === 'idle') return entry.ready === true;
  if (entry.progress) return entry.progress.get() < FADE_AT;
  return rect.bottom > viewportHeight + 1;
}

function insideAnyTrack() {
  const viewportHeight = window.innerHeight;
  for (const [el, entry] of tracks) {
    if (insideTrack(el, entry, viewportHeight)) return true;
  }
  return false;
}

function update() {
  frame = undefined;
  setVisible(insideAnyTrack());
}

function onScroll() {
  if (frame === undefined) frame = window.requestAnimationFrame(update);
}

function registerTrack(el: Element, entry: TrackEntry) {
  if (tracks.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    resizeObserver = new ResizeObserver(update);
  }
  tracks.set(el, entry);
  resizeObserver?.observe(el);
  update();

  return () => {
    tracks.delete(el);
    resizeObserver?.unobserve(el);
    if (tracks.size > 0) {
      update();
      return;
    }
    window.removeEventListener('scroll', onScroll);
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
    setVisible(false);
  };
}

type ScrollHintOptions = {
  /** The section is scroll-driven right now (the section's own reduced-motion and state check). */
  enabled: boolean;
  /** Default 'pinned'. */
  mode?: ScrollHintMode;
  /** 'flow' only: the section's own scroll progress, 0 → 1. Pass a stable object. */
  progress?: { get(): number };
};

/**
 * Registers a scroll-driven section with the hint while `enabled` is true. The
 * element decides the width: when it is display:none (a Tailwind breakpoint class
 * such as `hidden lg:block`) the section counts as not scroll-driven at that width.
 */
export function useScrollHint(ref: RefObject<Element | null>, { enabled, mode = 'pinned', progress }: ScrollHintOptions) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    return registerTrack(el, { mode, progress });
  }, [ref, enabled, mode, progress]);
}

/** Registers a pinned section's tall track while `pinned` is true. */
export function usePinnedScrollHint(trackRef: RefObject<Element | null>, pinned: boolean) {
  useScrollHint(trackRef, { enabled: pinned, mode: 'pinned' });
}

/**
 * For a section that is not scroll-driven but opens the page (the hero): the hint
 * shows once the visitor has not scrolled for IDLE_DELAY_MS since mount, while the
 * section covers the middle of the screen. The first scroll removes it for the
 * rest of the visit – it is not shown here again, even back at the top. The width
 * rule is the same as for the other modes: a display:none element never shows it.
 */
export function useIdleScrollHint(ref: RefObject<Element | null>, enabled: boolean) {
  const spentRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || spentRef.current) return;

    const entry: TrackEntry = { mode: 'idle', ready: false };
    const unregister = registerTrack(el, entry);
    const timer = window.setTimeout(() => {
      entry.ready = true;
      update();
    }, IDLE_DELAY_MS);
    let done = false;

    const stop = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onFirstScroll);
      unregister();
    };
    const onFirstScroll = () => {
      spentRef.current = true;
      stop();
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });

    return stop;
  }, [ref, enabled]);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Rendered once, in app/layout.tsx. `false` on the server and during hydration,
 * so the first client render matches the server HTML (nothing). It glides in with
 * the CSS animation from globals.css and fades out with a short Web Animation
 * before it is removed; under reduced motion it is removed at once.
 */
export function ScrollHint() {
  const show = useSyncExternalStore(subscribe, () => visible, () => false);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  if (show && (!mounted || leaving)) {
    setMounted(true);
    setLeaving(false);
  } else if (!show && mounted && !leaving) {
    setLeaving(true);
  }

  useEffect(() => {
    if (!leaving) return;
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || typeof el.animate !== 'function') {
      setMounted(false);
      setLeaving(false);
      return;
    }
    const fade = el.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(8px)' },
      ],
      { duration: FADE_OUT_MS, easing: 'ease-in', fill: 'forwards' },
    );
    let cancelled = false;
    fade.finished
      .then(() => {
        if (cancelled) return;
        setMounted(false);
        setLeaving(false);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      fade.cancel();
    };
  }, [leaving]);

  if (!mounted) return null;

  return (
    <div ref={ref} aria-hidden="true" className="scroll-reminder">
      <svg className="scroll-reminder__mouse" width="14" height="22" viewBox="0 0 14 22" fill="none">
        <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
        <rect className="scroll-reminder__wheel" x="6" y="5" width="2" height="4" rx="1" fill="currentColor" />
      </svg>
      <span>Scrolla nedåt</span>
    </div>
  );
}

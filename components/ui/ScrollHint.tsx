'use client';

import { useEffect, useSyncExternalStore, type RefObject } from 'react';

/*
 * "Scrolla nedåt" – a small hint at the bottom left while the visitor is inside
 * a scroll-driven section and has not scrolled for a moment.
 *
 * Each scroll-driven section registers an element with `useScrollHint` (pinned
 * sections through the thin `usePinnedScrollHint` wrapper); the single
 * <ScrollHint /> in app/layout.tsx draws the hint, so there is never more than
 * one on the page.
 *
 * Two modes:
 * - 'pinned': a track taller than the screen with a sticky frame. Inside means
 *   the track's top has reached the top of the screen and its end is still below
 *   the bottom.
 * - 'flow': a scroll-driven section that does not pin. Inside means it covers
 *   the middle of the screen and still has animation left: its own progress
 *   (0 → 1) is below FLOW_DONE when the section passes one, otherwise the
 *   section still continues below the bottom of the screen.
 *
 * Whether a section pins is decided by the section itself, never here:
 * - `pinned` is the section's own flag (`!shouldReduceMotion` in ScrollScene,
 *   StickySteps and LogisticsFlowSection, `!isStatic && !done` in PlatformRock).
 *   Those come from the shared usePrefersReducedMotion() and PlatformRock's
 *   useIsMobile(), both live matchMedia stores, so a changed setting re-renders
 *   the section and re-registers or drops its track.
 * - The width is read from the track element itself. The tjänster sections
 *   swap layouts with `hidden lg:block`, so below `lg` the track is display:none
 *   and has no client rects. A ResizeObserver on the track sees the swap when
 *   the window crosses the breakpoint, without a second copy of it here.
 *
 * One passive scroll listener and one timer for the whole page. React only
 * re-renders when the hint turns on or off, never per scroll event.
 */

const IDLE_MS = 2500;
/** A 'flow' section's own progress at or above this counts as finished. */
const FLOW_DONE = 0.98;

export type ScrollHintMode = 'pinned' | 'flow';

type TrackEntry = {
  mode: ScrollHintMode;
  /** The section's own scroll progress, 0 → 1. A MotionValue fits, or any object with get(). */
  progress?: { get(): number };
};

const tracks = new Map<Element, TrackEntry>();
const listeners = new Set<() => void>();
let visible = false;
let timer: number | undefined;
let resizeObserver: ResizeObserver | null = null;

function setVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

function insideTrack(el: Element, entry: TrackEntry, viewportHeight: number) {
  if (el.getClientRects().length === 0) return false; // display:none – this width is not scroll-driven
  const rect = el.getBoundingClientRect();
  if (entry.mode === 'pinned') {
    // The track's top has reached the top of the screen and its end is still below the bottom.
    return rect.top <= 1 && rect.bottom > viewportHeight + 1;
  }
  // 'flow': the section covers the middle of the screen and has animation left.
  const middle = viewportHeight / 2;
  if (rect.top > middle || rect.bottom < middle) return false;
  if (entry.progress) return entry.progress.get() < FLOW_DONE;
  return rect.bottom > viewportHeight + 1;
}

function insideAnyTrack() {
  const viewportHeight = window.innerHeight;
  for (const [el, entry] of tracks) {
    if (insideTrack(el, entry, viewportHeight)) return true;
  }
  return false;
}

function scheduleCheck() {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => setVisible(insideAnyTrack()), IDLE_MS);
}

function onScroll() {
  setVisible(false);
  scheduleCheck();
}

function onLayoutChange() {
  if (insideAnyTrack()) {
    if (!visible) scheduleCheck();
    return;
  }
  window.clearTimeout(timer);
  setVisible(false);
}

function registerTrack(el: Element, entry: TrackEntry) {
  if (tracks.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    resizeObserver = new ResizeObserver(onLayoutChange);
  }
  tracks.set(el, entry);
  resizeObserver?.observe(el);
  onLayoutChange();

  return () => {
    tracks.delete(el);
    resizeObserver?.unobserve(el);
    if (tracks.size > 0) {
      onLayoutChange();
      return;
    }
    window.removeEventListener('scroll', onScroll);
    resizeObserver?.disconnect();
    resizeObserver = null;
    window.clearTimeout(timer);
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

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Rendered once, in app/layout.tsx. `false` on the server and during hydration,
 * so the first client render matches the server HTML (nothing).
 */
export function ScrollHint() {
  const show = useSyncExternalStore(subscribe, () => visible, () => false);
  if (!show) return null;

  return (
    <div aria-hidden="true" className="scroll-reminder">
      <svg className="scroll-reminder__mouse" width="14" height="22" viewBox="0 0 14 22" fill="none">
        <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
        <rect className="scroll-reminder__wheel" x="6" y="5" width="2" height="4" rx="1" fill="currentColor" />
      </svg>
      <span>Scrolla nedåt</span>
    </div>
  );
}

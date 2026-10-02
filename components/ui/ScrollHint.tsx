'use client';

import { useEffect, useSyncExternalStore, type RefObject } from 'react';

/*
 * "Scrolla nedåt" – a small hint at the bottom left while the visitor is inside
 * a pinned, scroll-driven section and has not scrolled for a moment.
 *
 * Each pinned section registers its tall track with `usePinnedScrollHint`; the
 * single <ScrollHint /> in app/layout.tsx draws the hint, so there is never more
 * than one on the page.
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

const tracks = new Set<Element>();
const listeners = new Set<() => void>();
let visible = false;
let timer: number | undefined;
let resizeObserver: ResizeObserver | null = null;

function setVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

/** Inside: the track's top has reached the top of the screen and its end is still below the bottom. */
function insidePinnedTrack() {
  const viewportHeight = window.innerHeight;
  for (const el of tracks) {
    if (el.getClientRects().length === 0) continue; // display:none – this width does not pin
    const rect = el.getBoundingClientRect();
    if (rect.top <= 1 && rect.bottom > viewportHeight + 1) return true;
  }
  return false;
}

function scheduleCheck() {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => setVisible(insidePinnedTrack()), IDLE_MS);
}

function onScroll() {
  setVisible(false);
  scheduleCheck();
}

function onLayoutChange() {
  if (insidePinnedTrack()) {
    if (!visible) scheduleCheck();
    return;
  }
  window.clearTimeout(timer);
  setVisible(false);
}

function registerTrack(el: Element) {
  if (tracks.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    resizeObserver = new ResizeObserver(onLayoutChange);
  }
  tracks.add(el);
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

/** Registers a pinned section's tall track while `pinned` is true. */
export function usePinnedScrollHint(trackRef: RefObject<Element | null>, pinned: boolean) {
  useEffect(() => {
    const el = trackRef.current;
    if (!pinned || !el) return;
    return registerTrack(el);
  }, [trackRef, pinned]);
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
        <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <rect className="scroll-reminder__wheel" x="6" y="5" width="2" height="4" rx="1" fill="currentColor" />
      </svg>
      <span>Scrolla nedåt</span>
    </div>
  );
}

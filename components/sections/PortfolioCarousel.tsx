'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { PortfolioProject } from '@/lib/data/portfolioProjects';

const AUTOPLAY_INTERVAL = 5000;
const RESUME_AFTER_INTERACTION = 5000;
const DRAG_THRESHOLD = 8;
// A throw counts as a flick past any of these, and then carries one card.
const FLICK_MIN_DISTANCE = 36; // px
const FLICK_DISTANCE_RATIO = 0.12; // of card width
const FLICK_VELOCITY = 0.35; // px per ms
/** Fewer cards than this cannot fill both sides of the centre, so the track stays finite. */
const MIN_WRAP_COUNT = 3;
/** The track counts as at rest once no scroll event has arrived for this long. */
const SCROLL_SETTLE_MS = 120;

interface PortfolioCarouselProps {
  projects: PortfolioProject[];
  /** Accessible name for the carousel region */
  label?: string;
}

/**
 * Infinite, centred card carousel on a native scroll-snap track.
 *
 * The cards are rendered in an odd number of identical sets (normally three).
 * The middle set holds the real, focusable cards; the outer sets are clones so
 * there is always something on both sides of the centre. Scrolling is entirely
 * native (touch, wheel, keyboard, smooth scrollTo); the only trick is that once
 * the track comes to rest with the centre card in an outer set, the scroll
 * position is moved by exactly one set width with an instant scroll. The content
 * is identical, so the jump is invisible. It never happens mid-gesture or
 * mid-momentum, which is what iOS cannot cope with.
 */
export function PortfolioCarousel({
  projects,
  label = 'Våra projekt',
}: PortfolioCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const count = projects.length;
  const wrap = count >= MIN_WRAP_COUNT;

  // Normally three sets. On very wide viewports with few cards a single flanking
  // set cannot cover half the track, so more sets are rendered (measured below).
  const [sets, setSets] = useState(wrap ? 3 : 1);
  const homeSet = Math.floor(sets / 2);
  const slotCount = count * sets;
  const toIndex = useCallback(
    (slot: number) => (count ? ((slot % count) + count) % count : 0),
    [count]
  );

  // `slot` is the physical card position on the track; `index` the logical project.
  const [activeSlot, setActiveSlot] = useState(homeSet * count);
  const activeIndex = toIndex(activeSlot);
  const [edgePadding, setEdgePadding] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Reasons to hold the autoplay timer
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeSlotRef = useRef(homeSet * count);
  const resumeTimerRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    isMouse: false,
    pointerId: -1,
    captured: false,
    startX: 0,
    lastX: 0,
    startTime: 0,
    startSlot: 0,
    startScrollLeft: 0,
    distance: 0,
  });

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  /* ---------------------------------------------------------------- motion */

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setIsPageHidden(document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  /* --------------------------------------------------------------- layout */

  const centreOffset = useCallback((slot: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[slot];
    if (!track || !card) return null;
    return card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
  }, []);

  const scrollToSlot = useCallback(
    (slot: number, smooth = true) => {
      const track = trackRef.current;
      const left = centreOffset(slot);
      if (!track || left === null) return;
      track.scrollTo({
        left,
        behavior: (smooth && !prefersReducedMotion ? 'smooth' : 'instant') as ScrollBehavior,
      });
    },
    [centreOffset, prefersReducedMotion]
  );

  // Measure: how many sets are needed so a flanking set covers half the track,
  // and (finite track only) the side padding that lets the end cards centre.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = cardRefs.current[0];
      const second = cardRefs.current[1];
      if (!first) return;

      if (wrap && second) {
        const pitch = second.offsetLeft - first.offsetLeft;
        const setWidth = pitch * count;
        const flanking = Math.max(1, Math.ceil(track.clientWidth / 2 / setWidth));
        setSets(flanking * 2 + 1);
        setEdgePadding(0);
      } else {
        setEdgePadding(Math.max(0, (track.clientWidth - first.clientWidth) / 2));
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [count, wrap]);

  // Start (and re-centre after the set count changes) on the first real card,
  // before paint so the outer clones are never seen as the start of the track.
  useLayoutEffect(() => {
    const slot = homeSet * count + toIndex(activeSlotRef.current);
    activeSlotRef.current = slot;
    setActiveSlot(slot);
    scrollToSlot(slot, false);
    // scrollToSlot only changes with reduced-motion, which is irrelevant for an instant scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sets, homeSet, toIndex]);

  /* -------------------------------------------------------- active tracking */

  const syncActiveSlot = useCallback(() => {
    const track = trackRef.current;
    if (!track) return activeSlotRef.current;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, slot) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = slot;
      }
    });

    // Kept in sync here as well as in the effect above, so callers that need the
    // slot in the same tick (drag release) don't read a stale value.
    activeSlotRef.current = nearest;
    setActiveSlot(nearest);
    return nearest;
  }, []);

  // At rest with the centre card in an outer set: move one set width, instantly.
  const normalize = useCallback(() => {
    if (!wrap || dragRef.current.active) return;
    const track = trackRef.current;
    const first = cardRefs.current[0];
    const firstOfNext = cardRefs.current[count];
    if (!track || !first || !firstOfNext) return;

    const slot = activeSlotRef.current;
    const set = Math.floor(slot / count);
    if (set === homeSet) return;

    const setWidth = firstOfNext.offsetLeft - first.offsetLeft;
    const home = slot + (homeSet - set) * count;
    activeSlotRef.current = home;
    setActiveSlot(home);
    track.scrollTo({
      left: track.scrollLeft + (homeSet - set) * setWidth,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [count, homeSet, wrap]);

  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current === null) {
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        syncActiveSlot();
      });
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      normalize();
    }, SCROLL_SETTLE_MS);
  }, [normalize, syncActiveSlot]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, []);

  /* ------------------------------------------------------------- navigation */

  const clampSlot = useCallback(
    (slot: number) => (wrap ? slot : Math.min(count - 1, Math.max(0, slot))),
    [count, wrap]
  );

  // Dots: go to the copy of that project nearest the current position, so a dot
  // never scrolls the long way round.
  const goToIndex = useCallback(
    (index: number) => {
      const current = activeSlotRef.current;
      let best = homeSet * count + index;
      for (let set = 0; set < sets; set++) {
        const candidate = set * count + index;
        if (Math.abs(candidate - current) < Math.abs(best - current)) best = candidate;
      }
      scrollToSlot(best);
    },
    [count, homeSet, scrollToSlot, sets]
  );

  /* ------------------------------------------------------------- autoplay */

  const markInteraction = useCallback(() => {
    setIsInteracting(true);
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      setIsInteracting(false);
    }, RESUME_AFTER_INTERACTION);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };
  }, []);

  const autoplayPaused =
    prefersReducedMotion ||
    isHovered ||
    isFocused ||
    isInteracting ||
    isPageHidden ||
    count < 2;

  useEffect(() => {
    if (autoplayPaused) return;

    const timer = window.setInterval(() => {
      const next = wrap ? activeSlotRef.current + 1 : (activeSlotRef.current + 1) % count;
      scrollToSlot(next);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [autoplayPaused, count, scrollToSlot, wrap]);

  /* ------------------------------------------------------------ keyboard */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    markInteraction();

    const delta = event.key === 'ArrowRight' ? 1 : -1;
    scrollToSlot(clampSlot(activeSlotRef.current + delta));
  };

  /* ---------------------------------------------------------------- drag */

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    suppressClickRef.current = false;
    markInteraction();

    const isMouse = event.pointerType === 'mouse';

    if (isMouse) {
      // An autoplay smooth scroll may still be animating. Pin the track to where
      // it is right now so the animation is cancelled before we take over —
      // otherwise the drag baseline moves under us and the two scrolls fight.
      track.scrollTo({ left: track.scrollLeft, behavior: 'instant' as ScrollBehavior });
    }

    dragRef.current = {
      active: true,
      isMouse,
      pointerId: event.pointerId,
      captured: false,
      startX: event.clientX,
      lastX: event.clientX,
      startTime: event.timeStamp || performance.now(),
      startSlot: activeSlotRef.current,
      startScrollLeft: track.scrollLeft,
      distance: 0,
    };

    if (isMouse) {
      // Snap points fight a manually driven scrollLeft; restore on release.
      // Pointer capture is taken lazily in pointermove — see below.
      track.style.scrollSnapType = 'none';
      setIsDragging(true);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;

    const dx = event.clientX - drag.startX;
    drag.lastX = event.clientX;
    drag.distance = Math.max(drag.distance, Math.abs(dx));

    // Touch pointers scroll natively; only mouse drag needs to be driven here.
    if (!drag.isMouse) return;

    // Capture only once this is a real drag. Capturing on pointerdown would
    // retarget the following `click` to the track, so a plain click on a card
    // would stop opening the project.
    if (!drag.captured && drag.distance > DRAG_THRESHOLD) {
      try {
        track.setPointerCapture(drag.pointerId);
        drag.captured = true;
      } catch {
        // Best-effort; the drag still works while the pointer stays inside.
      }
    }

    track.scrollLeft = drag.startScrollLeft - dx;
  };

  const endDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;

    drag.active = false;
    suppressClickRef.current = drag.distance > DRAG_THRESHOLD;

    if (!drag.isMouse) return;

    if (drag.captured && drag.pointerId !== -1) {
      try {
        if (track.hasPointerCapture(drag.pointerId)) {
          track.releasePointerCapture(drag.pointerId);
        }
      } catch {
        // Already released (e.g. this is the lostpointercapture handler).
      }
    }
    drag.captured = false;
    drag.pointerId = -1;

    track.style.scrollSnapType = '';
    setIsDragging(false);

    // Where the release actually left us.
    let target = syncActiveSlot();

    // A quick, short throw never moves the centre past the neighbouring card,
    // so nearest-to-centre alone would snap straight back. Carry it one card in
    // the drag direction when the gesture reads as a flick.
    const dx = drag.lastX - drag.startX;
    const elapsed = Math.max((event?.timeStamp || performance.now()) - drag.startTime, 1);
    const velocity = Math.abs(dx) / elapsed; // px per ms
    const cardWidth = cardRefs.current[drag.startSlot]?.clientWidth ?? 0;
    const isFlick =
      Math.abs(dx) > Math.max(FLICK_MIN_DISTANCE, cardWidth * FLICK_DISTANCE_RATIO) ||
      velocity > FLICK_VELOCITY;

    if (isFlick && target === drag.startSlot && Math.abs(dx) > DRAG_THRESHOLD) {
      target = clampSlot(drag.startSlot + (dx < 0 ? 1 : -1));
      activeSlotRef.current = target;
      setActiveSlot(target);
    }

    const landing = target;
    window.requestAnimationFrame(() => scrollToSlot(landing));
  };

  // Safety net: a drag that never grew past the capture threshold gets no
  // pointerup on the track if the button is released elsewhere. Without this the
  // track would stay snap-disabled and stuck in the grabbing state.
  const endDragRef = useRef(endDrag);
  endDragRef.current = endDrag;

  useEffect(() => {
    if (!isDragging) return;
    const finish = () => endDragRef.current();
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return () => {
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
    };
  }, [isDragging]);

  const handleCardClickCapture = (event: React.MouseEvent) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  if (count === 0) {
    return (
      <p className="text-body text-gray-600 text-center py-16">
        Inga projekt i den här kategorin än.
      </p>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="karusell"
        aria-label={label}
        aria-live={autoplayPaused ? 'polite' : 'off'}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onWheel={markInteraction}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        style={{ paddingLeft: edgePadding, paddingRight: edgePadding }}
        // Vertical padding leaves room for the enlarged centre card and its shadow
        // inside the section's overflow-hidden; horizontal overflow is the point.
        className={`carousel-track scrollbar-hide relative flex snap-x snap-mandatory gap-4 overflow-x-auto py-12 md:gap-6 md:py-16 outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-3xl ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        {Array.from({ length: slotCount }, (_, slot) => {
          const index = toIndex(slot);
          const project = projects[index];
          const set = Math.floor(slot / count);
          const isClone = set !== homeSet;
          const isActive = slot === activeSlot;

          return (
            <article
              key={`${project.slug}-${set}`}
              data-card
              ref={(node) => {
                cardRefs.current[slot] = node;
              }}
              role="group"
              aria-roledescription="bild"
              aria-label={`${index + 1} av ${count}: ${project.title}`}
              aria-hidden={isClone || undefined}
              className="w-[72vw] shrink-0 snap-center md:w-[260px]"
            >
              {/* Only the card entering or leaving the centre actually animates; the
                  others hold scale 1 and never start a transition. */}
              <div
                className={`will-change-transform transition-transform duration-500 ease-out motion-reduce:transition-none ${
                  isActive ? 'scale-[1.04] md:scale-[1.12]' : 'scale-100'
                }`}
              >
                <PortfolioCard
                  project={project}
                  index={index}
                  isActive={isActive}
                  isClone={isClone}
                  onClickCapture={handleCardClickCapture}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination dots: one per project, never per clone */}
      <div className="mt-2 flex items-center justify-center gap-2 md:mt-4">
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => {
              markInteraction();
              goToIndex(index);
            }}
            aria-label={`Gå till projekt ${index + 1}: ${project.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className="group flex h-10 w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                index === activeIndex
                  ? 'w-8 bg-teal'
                  : 'w-2.5 bg-gray-300 group-hover:bg-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface PortfolioCardProps {
  project: PortfolioProject;
  index: number;
  isActive: boolean;
  /** Clones are visual only: hidden from assistive tech and out of the tab order. */
  isClone: boolean;
  onClickCapture: (event: React.MouseEvent) => void;
}

const IMAGE_SIZES = '(max-width: 767px) 72vw, 260px';

function PortfolioCard({
  project,
  index,
  isActive,
  isClone,
  onClickCapture,
}: PortfolioCardProps) {
  // Logo by default, site on hover. Where hover does not exist the centre card
  // shows the site instead, so touch users still see it.
  const siteOnActive = isActive ? '[@media(hover:none)]:opacity-100' : '';
  const logoOnActive = isActive ? '[@media(hover:none)]:opacity-0' : '';

  const card = (
    <div
      className={`group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 ${
        isActive
          ? 'shadow-2xl shadow-black/25 ring-1 ring-teal/40'
          : 'shadow-lg shadow-black/10 ring-1 ring-black/5'
      }`}
    >
      {project.logo ? (
        <>
          <Image
            src={project.logo}
            alt={project.title}
            fill
            draggable={false}
            sizes={IMAGE_SIZES}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
              project.siteImage ? `group-hover:opacity-0 ${logoOnActive}` : ''
            }`}
          />
          {project.siteImage && (
            <Image
              src={project.siteImage}
              alt=""
              aria-hidden="true"
              fill
              draggable={false}
              sizes={IMAGE_SIZES}
              className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100 ${siteOnActive}`}
            />
          )}
        </>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-white/10"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      {/* Legibility scrim — darkest at the top where the title sits */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/70"
      />

      {/* Title block — same position and size on every card */}
      <div className="absolute inset-x-0 top-0 p-5 md:p-6">
        <span className="text-overline text-teal">{project.category}</span>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white md:text-xl">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">{project.metric}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 text-sm font-semibold text-white md:p-6">
        {project.ctaLabel}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </div>
  );

  const className =
    'block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2';
  const tabIndex = isClone ? -1 : undefined;

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        tabIndex={tabIndex}
        onClickCapture={onClickCapture}
        className={className}
      >
        {card}
      </a>
    );
  }

  return (
    <Link
      href={project.href}
      draggable={false}
      tabIndex={tabIndex}
      onClickCapture={onClickCapture}
      className={className}
    >
      {card}
    </Link>
  );
}

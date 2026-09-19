'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
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

interface PortfolioCarouselProps {
  projects: PortfolioProject[];
  /** Accessible name for the carousel region */
  label?: string;
}

export function PortfolioCarousel({
  projects,
  label = 'Våra projekt',
}: PortfolioCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [edgePadding, setEdgePadding] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Reasons to hold the autoplay timer
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeIndexRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    isMouse: false,
    pointerId: -1,
    captured: false,
    startX: 0,
    lastX: 0,
    startTime: 0,
    startIndex: 0,
    startScrollLeft: 0,
    distance: 0,
  });

  const count = projects.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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

  // Side padding keeps the first and last card centerable, so every card
  // reaches the exact same position when it snaps.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      setEdgePadding(Math.max(0, (track.clientWidth - card.clientWidth) / 2));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    const firstCard = cardRefs.current[0];
    if (firstCard) observer.observe(firstCard);

    return () => observer.disconnect();
  }, [count]);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      if (!track || !card) return;

      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
        behavior: (smooth && !prefersReducedMotion
          ? 'smooth'
          : 'instant') as ScrollBehavior,
      });
    },
    [prefersReducedMotion]
  );

  /* -------------------------------------------------------- active tracking */

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return activeIndexRef.current;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    // Kept in sync here as well as in the effect below, so callers that need the
    // index in the same tick (drag release) don't read a stale value.
    activeIndexRef.current = nearest;
    setActiveIndex(nearest);
    return nearest;
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      syncActiveIndex();
    });
  }, [syncActiveIndex]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, []);

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
      scrollToIndex((activeIndexRef.current + 1) % count);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [autoplayPaused, count, scrollToIndex]);

  /* ------------------------------------------------------------ keyboard */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    markInteraction();

    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = Math.min(count - 1, Math.max(0, activeIndexRef.current + delta));
    scrollToIndex(next);
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
      startIndex: activeIndexRef.current,
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
    let target = syncActiveIndex();

    // A quick, short throw never moves the centre past the neighbouring card,
    // so nearest-to-centre alone would snap straight back. Carry it one card in
    // the drag direction when the gesture reads as a flick.
    const dx = drag.lastX - drag.startX;
    const elapsed = Math.max((event?.timeStamp || performance.now()) - drag.startTime, 1);
    const velocity = Math.abs(dx) / elapsed; // px per ms
    const cardWidth = cardRefs.current[drag.startIndex]?.clientWidth ?? 0;
    const isFlick =
      Math.abs(dx) > Math.max(FLICK_MIN_DISTANCE, cardWidth * FLICK_DISTANCE_RATIO) ||
      velocity > FLICK_VELOCITY;

    if (isFlick && target === drag.startIndex && Math.abs(dx) > DRAG_THRESHOLD) {
      target = Math.min(count - 1, Math.max(0, drag.startIndex + (dx < 0 ? 1 : -1)));
      activeIndexRef.current = target;
      setActiveIndex(target);
    }

    const landing = target;
    window.requestAnimationFrame(() => scrollToIndex(landing));
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
        className={`carousel-track scrollbar-hide relative flex snap-x snap-mandatory gap-6 overflow-x-auto py-10 md:gap-8 md:py-14 outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-3xl ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={project.slug}
              data-card
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              role="group"
              aria-roledescription="bild"
              aria-label={`${index + 1} av ${count}: ${project.title}`}
              className="w-[260px] shrink-0 snap-center sm:w-[290px] md:w-[320px] lg:w-[340px]"
            >
              <div
                className={`transition-transform duration-500 ease-out will-change-transform ${
                  isActive ? 'scale-[1.08]' : 'scale-100'
                }`}
              >
                <PortfolioCard
                  project={project}
                  index={index}
                  isActive={isActive}
                  onClickCapture={handleCardClickCapture}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="mt-2 flex items-center justify-center gap-2 md:mt-4">
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => {
              markInteraction();
              scrollToIndex(index);
            }}
            aria-label={`Gå till projekt ${index + 1}: ${project.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className="group flex h-10 w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-300 ${
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
  onClickCapture: (event: React.MouseEvent) => void;
}

function PortfolioCard({
  project,
  index,
  isActive,
  onClickCapture,
}: PortfolioCardProps) {
  const card = (
    <div
      className={`group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 transition-shadow duration-500 ${
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
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 340px"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              project.siteImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {project.siteImage && (
            <Image
              src={project.siteImage}
              alt=""
              aria-hidden="true"
              fill
              draggable={false}
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 340px"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
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
      onClickCapture={onClickCapture}
      className={className}
    >
      {card}
    </Link>
  );
}

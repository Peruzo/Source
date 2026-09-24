'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import type { SectionImage } from './types';
import { useReveal } from './useReveal';

export type ScrollPanel = {
  id: string;
  title: string;
  body: string;
  /** Panel photo, shown in the 4:3 box. */
  image?: SectionImage;
  /**
   * Live content for the 4:3 box instead of a photo (e.g. ProductWidgets).
   * Takes precedence over `image`. Must fill the box, not size itself.
   */
  media?: ReactNode;
  /** Optional deep link for the panel. */
  href?: string;
};

type HorizontalScrollSectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  panels: ScrollPanel[];
  /** Accessible name for the scrollable region. */
  regionLabel: string;
  background?: 'white' | 'stone' | 'black';
};

const backgrounds: Record<NonNullable<HorizontalScrollSectionProps['background']>, string> = {
  white: 'bg-white text-black',
  stone: 'bg-surface-stone text-black',
  black: 'bg-black text-white',
};

/**
 * Horizontally scrolled panels – section 3 of the Privat page.
 *
 * CSS scroll-snap only (`overflow-x-auto` + `snap-x snap-mandatory`), the same
 * pattern PortfolioTeaser.tsx uses. No JS pinning, so touch swipe is native.
 *
 * Accessibility: the scroller is a labelled `region` with `tabIndex={0}`, so it
 * takes focus and arrow keys then scroll it natively. Home/End are not handled
 * natively on a scroll container, so `handleKeyDown` wires those up. The arrow
 * buttons are a pointer convenience on top of that (lg and up only) and sit
 * before the scroller in DOM order.
 *
 * `overscroll-x-contain` stops the swipe from chaining out to the page, the
 * scroller clips its own overflow so the `vw`-sized panels never widen the
 * document, and `scroll-pl-*` matches the page gutter so the first panel snaps
 * in line with the rest of the page instead of flush to the edge.
 *
 * Reduced motion: globals.css sets `* { scroll-behavior: smooth }` and its own
 * reduced-motion block never resets it, so both the inline `scroll-behavior`
 * and the `'instant'` scroll options below are needed to actually stop the
 * smooth scrolling.
 */
export function HorizontalScrollSection({
  id,
  eyebrow,
  title,
  intro,
  panels,
  regionLabel,
  background = 'stone',
}: HorizontalScrollSectionProps) {
  const { reveal, shouldReduceMotion } = useReveal();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 1px tolerance – sub-pixel widths otherwise leave the button enabled forever.
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    // Arrow keys scroll the container natively once it has focus, but Home/End
    // do not on a generic scroll container – wire them up so the whole set of
    // panels is reachable from the keyboard.
    if (event.key !== 'Home' && event.key !== 'End') return;
    const el = scrollerRef.current;
    if (!el) return;
    event.preventDefault();
    el.scrollTo({
      left: event.key === 'Home' ? 0 : el.scrollWidth - el.clientWidth,
      behavior: shouldReduceMotion ? 'instant' : 'smooth',
    });
  };

  const scrollByPanel = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    // One panel width per press, derived from the first panel so it stays
    // correct across breakpoints.
    const panelWidth = el.firstElementChild?.clientWidth ?? el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -panelWidth : panelWidth,
      // 'auto' would defer to `* { scroll-behavior: smooth }` in globals.css,
      // which is exactly what reduced motion must avoid – hence 'instant'.
      behavior: shouldReduceMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <section id={id} className={`relative w-full py-24 md:py-32 ${backgrounds[background]}`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <div className="max-w-[40rem]">
          {eyebrow ? (
            <motion.p {...reveal(0)} className="text-overline mb-6 text-teal">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h2 {...reveal(0.1)} className="text-section-title">
            {title}
          </motion.h2>

          {intro ? (
            <motion.p {...reveal(0.2)} className="text-body-large mt-8 text-gray-600">
              {intro}
            </motion.p>
          ) : null}
        </div>
      </div>

      <div className="relative mt-16">
        {/* Pointer convenience. Hidden below lg, where swiping is the norm. */}
        <button
          type="button"
          onClick={() => scrollByPanel('left')}
          disabled={!canScrollLeft}
          aria-label="Visa föregående panel"
          className="absolute left-8 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-lg transition-all duration-300 hover:border-teal hover:bg-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-black lg:flex"
        >
          <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => scrollByPanel('right')}
          disabled={!canScrollRight}
          aria-label="Visa nästa panel"
          className="absolute right-8 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-lg transition-all duration-300 hover:border-teal hover:bg-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-black lg:flex"
        >
          <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div
          ref={scrollerRef}
          role="region"
          aria-label={regionLabel}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={`flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-hide scroll-pl-6 px-6 pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal md:gap-8 md:scroll-pl-10 md:px-10 lg:scroll-pl-20 lg:px-20`}
          style={{
            WebkitOverflowScrolling: 'touch',
            // Set inline rather than via a `motion-reduce:` utility:
            // globals.css declares `* { scroll-behavior: smooth }` outside
            // any cascade layer, and unlayered CSS beats every Tailwind
            // utility no matter the specificity. Inline wins over both.
            scrollBehavior: shouldReduceMotion ? 'auto' : 'smooth',
          }}
        >
          {panels.map((panel, index) => {
            const content = (
              <>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                  {panel.media ??
                    (panel.image ? (
                      <Image
                        src={panel.image.src}
                        alt={panel.image.alt}
                        fill
                        sizes="(min-width: 1024px) 46vw, (min-width: 768px) 60vw, 85vw"
                        className="object-cover"
                      />
                    ) : null)}
                </div>

                <h3 className="mt-8 text-2xl font-bold md:text-3xl lg:text-4xl">
                  {panel.title}
                </h3>
                <p className="text-body mt-4 max-w-[42ch] text-gray-600">{panel.body}</p>
              </>
            );

            return (
              <motion.article
                key={panel.id}
                {...reveal(index * 0.08, 24)}
                className="w-[85vw] flex-shrink-0 snap-start md:w-[60vw] lg:w-[46vw]"
              >
                {panel.href ? (
                  <Link
                    href={panel.href}
                    className="block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </motion.article>
            );
          })}

          {/* Trailing spacer so the last panel can snap clear of the edge. */}
          <div className="w-2 flex-shrink-0 md:w-6 lg:w-16" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

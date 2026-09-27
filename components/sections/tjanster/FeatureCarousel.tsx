'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import type { FeatureItem } from './types';

type FeatureCarouselProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  items: FeatureItem[];
  /** Section background. */
  background?: 'white' | 'beige' | 'stone';
};

const backgrounds = { white: 'bg-white', beige: 'bg-beige', stone: 'bg-surface-stone' } as const;

/*
 * Horizontal row of feature cards (Revolut's card carousel, typ 6).
 *
 * The row is a native scroll container with scroll-snap, so touch, trackpad
 * and a shift-wheel all work without a script. On top of that:
 *   – arrow buttons (aria-controls the list, disabled at the ends),
 *   – ←/→ and Home/End while the list has focus (it is focusable, with a
 *     visible ring, so keyboard users can reach cards that are off screen),
 *   – a plain <ul>/<li>, so screen readers announce "list, 7 items" and read
 *     every card; nothing is hidden from them when it is scrolled away.
 * The row's left edge lines up with the page container at every width, and
 * the last card can scroll fully into view.
 */
export function FeatureCarousel({ id, eyebrow, title, items, background = 'beige' }: FeatureCarouselProps) {
  const { reveal, shouldReduceMotion } = useReveal();
  const listRef = useRef<HTMLUListElement | null>(null);
  const headingId = useId();
  const listId = useId();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = listRef.current;
      const card = el?.querySelector('li');
      if (!el || !card) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: shouldReduceMotion ? 'instant' : 'smooth' });
    },
    [shouldReduceMotion],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const el = listRef.current;
    if (!el) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') { e.preventDefault(); el.scrollTo({ left: 0, behavior: shouldReduceMotion ? 'instant' : 'smooth' }); }
    else if (e.key === 'End') { e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior: shouldReduceMotion ? 'instant' : 'smooth' }); }
  };

  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-default disabled:opacity-35 disabled:hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-dark focus-visible:ring-offset-2';

  // Same inline padding as Container (px-6 / md:px-10 / lg:px-20, max 1440 centred),
  // used both as padding and as scroll-padding so snapped cards line up with the text.
  const inset =
    'px-6 scroll-px-6 md:px-10 md:scroll-px-10 lg:px-[max(5rem,calc((100vw-1440px)/2+5rem))] lg:scroll-px-[max(5rem,calc((100vw-1440px)/2+5rem))]';

  return (
    <section id={id} aria-labelledby={headingId} className={`py-20 md:py-28 lg:py-32 ${backgrounds[background]}`}>
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-6 md:px-10 lg:px-20">
        <motion.div {...reveal(0)} className="max-w-[34rem]">
          {eyebrow ? <p className="text-overline mb-5 text-teal-dark">{eyebrow}</p> : null}
          <h2 id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
        </motion.div>
        <div className="hidden gap-3 md:flex">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={atStart} aria-controls={listId} aria-label="Föregående kort">
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={atEnd} aria-controls={listId} aria-label="Nästa kort">
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        id={listId}
        ref={listRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-labelledby={headingId}
        className={`scrollbar-hide mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-dark md:mt-12 md:gap-5 ${inset}`}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.title}
              {...reveal(Math.min(i, 4) * 0.06)}
              className="flex w-[82%] max-w-[20rem] shrink-0 snap-start flex-col rounded-3xl bg-white p-6 ring-1 ring-gray-200 sm:w-[18rem] md:p-7 lg:w-[19.5rem] lg:max-w-none"
            >
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-light text-teal-dark">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-10 text-lg font-semibold leading-snug text-gray-900">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-gray-700">{item.body}</p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

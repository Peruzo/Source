'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { ReactNode } from 'react';

const SYSTEM_LINES = [
  'Ett system för butiken.',
  'Ett för fakturorna.',
  'Ett för bokföringen.',
  'Ett för utskicken.',
];

/** Stagger between the listed lines, and the longer beat before the closing line. */
const LINE_STAGGER = 0.1;
const CLOSING_DELAY = (SYSTEM_LINES.length - 1) * LINE_STAGGER + 0.35;

/**
 * Övergången till stenen (PlatformRock). Sektionen slutar i surface-stone-deep (#d2d3cf),
 * medan stenens scen börjar i en radiell vinjett som är mörkast i hörnen, så ingen enskild
 * färg matchar hela dess överkant. I stället hänger ett lager ut under sektionen, över
 * stenens översta 20vh: det börjar i exakt #d2d3cf (samma färg som sektionens sista rad)
 * och tonar ut till genomskinligt längs en utjämnad kurva, så att varken en kant eller ett
 * band syns. Lagret följer sektionen och har scrollat bort innan stenens första chips når
 * dit; det ligger under sidhuvudet och tar inga klick.
 */
const ROCK_FADE =
  'linear-gradient(to bottom, rgba(210,211,207,1) 0%, rgba(210,211,207,0.738) 19%, rgba(210,211,207,0.541) 34%, rgba(210,211,207,0.382) 47%, rgba(210,211,207,0.278) 56.5%, rgba(210,211,207,0.194) 65%, rgba(210,211,207,0.126) 73%, rgba(210,211,207,0.075) 80.2%, rgba(210,211,207,0.042) 86.1%, rgba(210,211,207,0.021) 91%, rgba(210,211,207,0.008) 95.2%, rgba(210,211,207,0.002) 98.2%, rgba(210,211,207,0) 100%)';

/**
 * One line of the headline. Fades up in place when the section scrolls into view,
 * or renders straight away when the visitor prefers reduced motion.
 *
 * `initial` is the same on the server and at hydration, so the HTML always matches.
 * Reduced motion is applied through `animate`, which – unlike `initial` – is reactive:
 * usePrefersReducedMotion is false at hydration and flips to true right after, and
 * the line then jumps to its final state with no animation.
 */
function Line({
  children,
  delay,
  className = '',
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.span
      className={`block ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={reduce ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduce ? { duration: 0 } : { delay, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

export function ValueProposition() {
  return (
    <section
      id="next-section"
      className="relative bg-gradient-to-b from-surface-stone from-70% to-surface-stone-deep pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 lg:pb-40 overflow-visible"
      style={{ minHeight: '100vh' }}
    >
      {/* Behåll #value-proposition för befintliga länkar / SEO */}
      <span
        id="value-proposition"
        className="sr-only"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 md:px-10 lg:px-20">
        {/* Size curve is tuned so the longest line still fits on one row at 390px. */}
        <h2 className="mx-auto max-w-[1100px] text-center font-bold tracking-tight text-black text-[clamp(1.625rem,6.4vw,4rem)] leading-[1.3]">
          {SYSTEM_LINES.map((line, i) => (
            <Line key={line} delay={i * LINE_STAGGER}>
              {line}
            </Line>
          ))}

          <Line delay={CLOSING_DELAY} className="mt-[1.1em]">
            Eller ett för <span className="text-teal-dark">allt</span>.
          </Line>
        </h2>
      </div>

      {/* Mjuk övergång in i stenens scen, se ROCK_FADE. Lagret börjar 2px ovanför sektionens
          kant (samma färg där), så att en kant som hamnar på en halv enhetspixel vid 125 %
          skalning inte släpper igenom stenens mörka bakgrund på en rad. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[calc(100%-2px)] z-20 h-[calc(20vh+2px)]"
        style={{ background: ROCK_FADE }}
      />
    </section>
  );
}

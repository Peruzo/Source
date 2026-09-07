'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
 * One line of the headline. Fades up in place when the section scrolls into view,
 * or renders straight away when the visitor prefers reduced motion.
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
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={`block ${className}`}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
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
            Eller ett för <span className="text-accent-700">allt</span>.
          </Line>
        </h2>
      </div>
    </section>
  );
}

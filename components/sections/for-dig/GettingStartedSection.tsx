'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReveal } from './useReveal';

export type GettingStartedStep = {
  /** Displayed as-is, e.g. "01". Keep it two digits for the typographic rhythm. */
  number: string;
  title: string;
  body: string;
};

type GettingStartedSectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  steps: GettingStartedStep[];
  background?: 'white' | 'stone' | 'beige';
  /** CTA under the last step. */
  children?: ReactNode;
};

const backgrounds: Record<NonNullable<GettingStartedSectionProps['background']>, string> = {
  white: 'bg-white',
  stone: 'bg-surface-stone',
  beige: 'bg-beige-light',
};

/**
 * Vertical numbered steps in large type – section 8 of the Privat page.
 * Takes 3 or 4 steps; the layout does not depend on the count.
 */
export function GettingStartedSection({
  id,
  eyebrow,
  title,
  steps,
  background = 'white',
  children,
}: GettingStartedSectionProps) {
  const { reveal } = useReveal();

  return (
    <section id={id} className={`relative w-full py-24 md:py-32 lg:py-40 ${backgrounds[background]}`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <div className="max-w-[40rem]">
          {eyebrow ? (
            <motion.p {...reveal(0)} className="text-overline mb-6 text-teal-dark">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h2 {...reveal(0.1)} className="text-section-title text-black">
            {title}
          </motion.h2>
        </div>

        <ol className="mt-20 lg:mt-28">
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              {...reveal(index * 0.1, 40)}
              className="border-t border-gray-200 py-12 first:border-t-0 first:pt-0 md:py-16 lg:py-20"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                <p
                  className="text-display-number text-teal lg:col-span-3"
                  aria-hidden="true"
                >
                  {step.number}
                </p>

                <div className="lg:col-span-9">
                  <h3 className="text-section-subtitle text-black">{step.title}</h3>
                  <p className="text-body-large mt-6 max-w-[52ch] text-gray-600">
                    {step.body}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        {children ? (
          <motion.div {...reveal(0.2)} className="mt-16 lg:mt-20">
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

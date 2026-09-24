'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import type { SectionImage } from './types';
import { useReveal } from './useReveal';

export type GettingStartedStep = {
  /** Displayed as-is, e.g. "01". Keep it two digits so the column lines up. */
  number: string;
  title: string;
  /** One sentence, ~70 characters – the text sits over the photo on desktop. */
  body: string;
};

type GettingStartedSectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  steps: GettingStartedStep[];
  /** Full-bleed photo. The subject should sit in the right half. */
  image: SectionImage;
  /** CTA under the last step. */
  children?: ReactNode;
};

/**
 * teal-dark mixed 40/60 with black = #00332C. Against it white text is 13.9:1,
 * white/80 9.4:1 and teal 5.95:1. teal-dark on its own only gives white 4.87:1
 * and teal 2.09:1, so it can't carry the text.
 */
const GREEN = 'color-mix(in srgb, var(--color-teal-dark) 40%, black)';

/**
 * Numbered steps over a full-bleed photo – section 8 of the Privat page.
 *
 * From `lg`: the photo covers the section and a dark green gradient runs in
 * from the left – solid to 45 %, gone at 70 % – so the text sits on solid
 * colour and the subject on the right stays clear. `object-left` pushes the
 * subject right, out of the fade. The text column hugs the gradient (48 px
 * from the edge) instead of the page's usual 80 px margin.
 *
 * Below `lg`: photo on top, text underneath on solid green. The photo's bottom
 * edge fades into the green so the two read as one surface. A side gradient
 * would cover the subject at these widths.
 *
 * Contrast is checked against the photo's pixels: at 1440 × 900 white text
 * holds ≥ 4.5:1 up to x ≈ 790 px; the text column ends around 620 px.
 */
export function GettingStartedSection({
  id,
  eyebrow,
  title,
  steps,
  image,
  children,
}: GettingStartedSectionProps) {
  const { reveal } = useReveal();

  return (
    <section
      id={id}
      className="relative isolate w-full overflow-hidden bg-(--steps-green) text-white"
      style={{ '--steps-green': GREEN } as CSSProperties}
    >
      <div className="relative aspect-[4/3] w-full md:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover object-[75%_50%] lg:object-left"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-(--steps-green) to-transparent lg:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-linear-to-r from-(--steps-green) from-45% to-transparent to-70% lg:block"
        />
      </div>

      <div className="relative px-6 pt-4 pb-20 md:px-10 md:pt-8 md:pb-24 lg:flex lg:min-h-svh lg:items-center lg:px-12 lg:py-28">
        <div className="max-w-[36rem]">
          {eyebrow ? (
            <motion.p {...reveal(0)} className="text-overline mb-6 text-teal">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h2 {...reveal(0.1)} className="text-section-title text-white">
            {title}
          </motion.h2>

          <ol className="mt-10 lg:mt-12">
            {steps.map((step, index) => (
              <motion.li
                key={step.number}
                {...reveal(0.15 + index * 0.08, 24)}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-white/15 py-5 md:grid-cols-[3rem_1fr]"
              >
                <p
                  className="text-lg font-semibold tabular-nums text-teal md:text-xl"
                  aria-hidden="true"
                >
                  {step.number}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-white md:text-xl">{step.title}</h3>
                  <p className="mt-1 text-base text-white/80">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          {children ? (
            <motion.div {...reveal(0.5)} className="mt-8 lg:mt-10">
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

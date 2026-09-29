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
 * Near-black with a faint green undertone: teal-dark 15 % + black = #001310.
 * Reads as dark first, green second. teal-dark on its own only gives white
 * 4.87:1 and teal 2.09:1, so it can't carry the text.
 */
const TONE = 'color-mix(in srgb, var(--color-teal-dark) 15%, black)';

/**
 * Numbered steps over a full-bleed photo – section 8 of the Privat page.
 *
 * From `xl`: the photo covers the section and a near-black gradient runs in
 * from the left – solid to 680 px, gone at 1000 px – so the text sits on solid
 * colour and the subject on the right stays clear. The stops are in px, not %,
 * because the text column is fixed-width (48 px + 38rem ≈ 656 px): percentage
 * stops put the text over the fade at narrow widths and the subject under it
 * at wide ones. At 1440 the fade still ends at ~70 % of the width.
 * `object-[30%_50%]` keeps the subject's face just right of the fade from 1280
 * to 1920. The text column hugs the gradient instead of the page's usual 80 px
 * margin.
 *
 * Below `xl`: photo on top, text underneath on the solid tone. The photo's
 * bottom edge fades into it so the two read as one surface. At 1024 there is
 * no room for both the text column and the subject side by side.
 *
 * Contrast is checked on the built page against the rendered pixels at 390,
 * 768, 1024, 1280, 1440 and 1920 – every text line ≥ 4.5:1.
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
      className="relative isolate w-full overflow-hidden bg-(--steps-tone) text-white"
      style={{ '--steps-tone': TONE } as CSSProperties}
    >
      <div className="relative aspect-[4/3] w-full md:aspect-video xl:absolute xl:inset-0 xl:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover object-[75%_50%] xl:object-[30%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-(--steps-tone) to-transparent xl:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-linear-to-r from-(--steps-tone) from-[680px] to-transparent to-[1000px] xl:block"
        />
      </div>

      <div className="relative px-6 pt-4 pb-20 md:px-10 md:pt-8 md:pb-24 xl:flex xl:min-h-svh xl:items-center xl:px-12 xl:py-20">
        <div className="max-w-[38rem]">
          {eyebrow ? (
            <motion.p {...reveal(0)} className="text-overline mb-6 text-teal-dark">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h2 {...reveal(0.1)} className="text-section-title text-white">
            {title}
          </motion.h2>

          <ol className="mt-10">
            {steps.map((step, index) => (
              <motion.li
                key={step.number}
                {...reveal(0.15 + index * 0.08, 24)}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/15 py-5 md:gap-x-6"
              >
                {/* Same scale as the rest of the page: number and title share
                    text-section-subtitle, the body is text-body-large like the
                    body copy in sections 2 and 4. */}
                <p className="text-section-subtitle tabular-nums text-teal" aria-hidden="true">
                  {step.number}
                </p>
                <div>
                  <h3 className="text-section-subtitle text-white">{step.title}</h3>
                  <p className="text-body-large mt-2 text-white/85">{step.body}</p>
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

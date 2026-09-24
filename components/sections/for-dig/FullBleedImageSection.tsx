'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { SectionImage } from './types';
import { useReveal } from './useReveal';

type FullBleedImageSectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  /** One paragraph per array entry. */
  body: string[];
  /**
   * Background photo. Omit it for a plain black section whose visual is the
   * `children` instead – section 3 carries PaymentCards that way.
   */
  image?: SectionImage;
  /** `tall` fills the viewport, `regular` is a calmer band. */
  height?: 'regular' | 'tall';
  /** Extra content under the body – CTA buttons, TODO-markers, UI cards. */
  children?: ReactNode;
};

const heights: Record<NonNullable<FullBleedImageSectionProps['height']>, string> = {
  regular: 'min-h-[70svh] py-28 md:py-36',
  tall: 'min-h-[92svh] py-32 md:py-44',
};

/**
 * Full-bleed section: image covers the whole section, text centred on top.
 * Sections 2, 5, 7 and 9 of the Privat page.
 *
 * Contrast: a flat `bg-black/55` plus a centred radial vignette gives roughly
 * 84% effective black where the text sits. White text clears WCAG AA (~5:1)
 * even against a pure-white photo, which a single overlay would not. Without an
 * image both layers are skipped – white on plain black needs no help.
 */
export function FullBleedImageSection({
  id,
  eyebrow,
  title,
  body,
  image,
  height = 'regular',
  children,
}: FullBleedImageSectionProps) {
  const { reveal } = useReveal();

  return (
    <section
      id={id}
      className={`relative isolate w-full overflow-hidden bg-black text-white ${heights[height]}`}
    >
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
          />

          {/* Layer 1 – flat scrim. */}
          <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden="true" />
          {/* Layer 2 – radial vignette, darkest exactly where the text sits. */}
          <div
            className="absolute inset-0 -z-10"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </>
      ) : null}

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-6 text-center md:px-10 lg:px-20">
        {eyebrow ? (
          <motion.p {...reveal(0)} className="text-overline mb-6 text-teal">
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.h2
          {...reveal(0.1)}
          className="text-section-title max-w-[22ch] text-white"
        >
          {title}
        </motion.h2>

        <div className="mt-8 max-w-[52ch] space-y-6">
          {body.map((paragraph, i) => (
            <motion.p
              key={i}
              {...reveal(0.2 + i * 0.08)}
              className="text-body-large text-white/85"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {children ? (
          <motion.div {...reveal(0.4)} className="mt-12 w-full">
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

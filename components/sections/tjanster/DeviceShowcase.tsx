'use client';

import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { ServicePicture } from './ServicePicture';
import type { CardAnchor, ServiceImage } from './types';

type DeviceShowcaseProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  /** One paragraph per entry. */
  body: string[];
  /** A landscape (16:9) photo of a device on a dark background, shown whole. */
  image: ServiceImage;
  /**
   * UI shown on the device's screen – the same card shape as ServiceFullBleed.
   * `anchor` is the centre of the screen in percent of the photo (shown whole, so
   * this is image-anchored). From md it sits on the screen; below md, where a
   * card would cover the whole device, it sits under the photo.
   */
  card: { content: ReactNode; label: string; anchor: CardAnchor };
};

/*
 * A device on black with real UI on its screen – Revolut's product-shot band.
 * Heading centred above, the photo whole (16:9, no crop, so the screen's
 * position in percent holds at every width), the UI anchored to the screen.
 * Dark only: made for pages with a dark layout and a white header (/analys).
 */
export function DeviceShowcase({ id, eyebrow, title, body, image, card }: DeviceShowcaseProps) {
  const { reveal } = useReveal();
  const headingId = useId();

  return (
    <section id={id} aria-labelledby={headingId} className="bg-black py-20 text-white md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-[44rem] text-center">
          {eyebrow ? (
            <motion.p {...reveal(0)} className="text-overline mb-5 text-teal">
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h2
            {...reveal(0.08)}
            id={headingId}
            className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]"
          >
            {title}
          </motion.h2>
          <div className="mt-5 space-y-4">
            {body.map((paragraph, i) => (
              <motion.p key={i} {...reveal(0.14 + i * 0.06)} className="text-base leading-relaxed text-white/70 md:text-lg">
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div {...reveal(0.2, 48)} className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-[1100px] md:mt-16">
          <ServicePicture image={image} sizes="(min-width: 1180px) 1100px, 100vw" />
          <div
            role="group"
            aria-label={card.label}
            className="absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
            style={{ left: `${card.anchor.x}%`, top: `${card.anchor.y}%` }}
          >
            {card.content}
          </div>
        </motion.div>

        <div role="group" aria-label={card.label} className="mx-auto mt-6 max-w-[22rem] md:hidden">
          {card.content}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import type { ServiceImage } from '@/components/sections/tjanster/types';

type ScreenRect = { left: number; top: number; width: number; height: number };

type StudioScreenSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  body: string[];
  /** A photo of a device seen straight on, shown whole: 16:9 from md, the portrait crop below. */
  image: ServiceImage;
  /** Shape of the portrait crop below md – the same shape the image script writes. */
  portraitShape?: 'square' | 'portrait';
  /**
   * The device's screen in percent of the photo, measured on the original, per crop.
   * `mask`: an alpha PNG of the screen's own shape (rounded corners, a thumb over the edge),
   * stretched over the screen area, so the UI is never drawn over the hands.
   */
  screen: { landscape: ScreenRect; portrait: ScreenRect; mask?: string };
  /** Accessible name for the UI on the screen. */
  label: string;
  /** The UI drawn on the screen. It fills the screen area and sizes itself from it (cqw). */
  children: ReactNode;
};

/*
 * A full-width photo of a tablet with the portal's UI built in code on its blank
 * screen. Heading centred above on black, as on DeviceShowcase, but the photo spans the
 * page and the UI fills the screen instead of floating as a card.
 *
 * The photo box has the photo's own aspect ratio at every width (16:9 from md, below
 * that the portrait shape the image script writes), so object-cover never crops and
 * the screen's position in percent holds exactly. The screen box is its own container:
 * the UI inside scales with it. A faint glass sheen on top keeps it reading as a lit
 * screen behind glass rather than a sticker.
 *
 * Page-local on purpose – no shared component changes.
 */
export function StudioScreenSection({ id, eyebrow, title, body, image, portraitShape = 'portrait', screen, label, children }: StudioScreenSectionProps) {
  const { reveal } = useReveal();
  const headingId = useId();

  const vars = {
    '--sl': `${screen.portrait.left}%`,
    '--st': `${screen.portrait.top}%`,
    '--sw': `${screen.portrait.width}%`,
    '--sh': `${screen.portrait.height}%`,
    '--sl-md': `${screen.landscape.left}%`,
    '--st-md': `${screen.landscape.top}%`,
    '--sw-md': `${screen.landscape.width}%`,
    '--sh-md': `${screen.landscape.height}%`,
  } as CSSProperties;

  const mask: CSSProperties = screen.mask
    ? {
        maskImage: `url(${screen.mask})`,
        WebkitMaskImage: `url(${screen.mask})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }
    : {};

  return (
    <section id={id} aria-labelledby={headingId} className="bg-black pt-24 text-white md:pt-32 lg:pt-40">
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
      </div>

      <motion.div
        {...reveal(0.2)}
        style={vars}
        className={`@container relative mt-12 w-full overflow-hidden md:mt-16 md:aspect-[16/9] ${portraitShape === 'square' ? 'aspect-square' : 'aspect-[3/4]'}`}
      >
        <ServicePicture image={image} sizes="100vw" portraitSizes="100vw" />
        <div
          role="group"
          aria-label={label}
          style={mask}
          className={`@container absolute left-[var(--sl)] top-[var(--st)] h-[var(--sh)] w-[var(--sw)] overflow-hidden md:left-[var(--sl-md)] md:top-[var(--st-md)] md:h-[var(--sh-md)] md:w-[var(--sw-md)] ${
            screen.mask ? '' : 'rounded-[1.85cqw] md:rounded-[0.8cqw]'
          }`}
        >
          {children}
          {/* Glass: a faint sheen from the top left and a soft inner edge. Decoration only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%), linear-gradient(rgba(0,0,0,0.06), rgba(0,0,0,0.06))',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35), inset 0 0 24px rgba(0,0,0,0.18)',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

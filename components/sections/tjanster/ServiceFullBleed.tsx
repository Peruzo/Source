'use client';

import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { ServicePicture } from './ServicePicture';
import type { ServiceCta, ServiceFullBleedCard, ServiceImage } from './types';

type ServiceFullBleedProps = {
  id?: string;
  /** `h1` for the page hero, `h2` everywhere else. */
  headingLevel?: 1 | 2;
  eyebrow?: string;
  title: string;
  /** Larger line under the title (the hero's tagline). */
  subtitle?: string;
  /** One paragraph per entry. */
  body: string[];
  cta?: ServiceCta;
  image: ServiceImage;
  /**
   * `dark` – dark text on a light photo (a light wall, sky). Gets a soft warm
   * veil behind the text and under the header instead of a scrim.
   * `light` – white text on a dark photo. Gets a warm scrim on the text side.
   * Pick from the photo, not from the page: measure the contrast where the
   * text sits (see CC-RAPPORT-inventarier-bygge-2.md, punkt 6).
   */
  tone: 'dark' | 'light';
  /** Where the text sits from `lg` up. Below `lg` it always sits above the photo. */
  textPosition?: 'top-left' | 'center-left';
  /** Hero on top of the page: eager image, room for the fixed header. */
  priority?: boolean;
  /**
   * Optional floating UI card over the photo (see ServiceFullBleedCard). It
   * sits outside the parallax layer, so it follows the page while the photo
   * drifts, and fades in once (0.3 s, no movement). Without it the section
   * renders exactly as before.
   */
  card?: ServiceFullBleedCard;
};

/*
 * Revolut-style full-bleed section (measured in _research/revolut-analys.md):
 * one viewport tall from `lg`, text in the photo's quiet area, and a mild
 * parallax while the section scrolls out – the photo moves at ~0.83 of the
 * page. Below `lg` the text gets its own block above a portrait crop, so
 * legibility never depends on where the photo happens to be quiet.
 *
 * Parallax: the photo layer is 117 % of the section tall and moves down by up
 * to 17 % of the section height (14.5 % of its own) as the section scrolls
 * out, i.e. 0.83 of the scroll. Its top edge is always above the part of the
 * section that is still on screen, so no gap shows. Only from `lg` (the
 * transform sits behind an `lg:` class) and never under reduced motion.
 */
export function ServiceFullBleed({
  id,
  headingLevel = 2,
  eyebrow,
  title,
  subtitle,
  body,
  cta,
  image,
  tone,
  textPosition = 'top-left',
  priority = false,
  card,
}: ServiceFullBleedProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { reveal, shouldReduceMotion } = useReveal();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const shift = useTransform(scrollYProgress, [0, 1], ['0%', '14.5%']);

  const Heading = headingLevel === 1 ? motion.h1 : motion.h2;
  const dark = tone === 'dark';

  const text = {
    eyebrow: dark ? 'text-gray-700' : 'text-teal',
    title: dark ? 'text-gray-900' : 'text-white',
    subtitle: dark ? 'text-gray-800' : 'text-white/90',
    body: dark ? 'text-gray-800' : 'text-white/85',
  };

  const content = (
    <div className="max-w-[36rem]">
      {eyebrow ? (
        <motion.p {...reveal(0)} className={`text-overline mb-5 ${text.eyebrow}`}>
          {eyebrow}
        </motion.p>
      ) : null}
      <Heading
        {...reveal(0.08)}
        className={`font-semibold tracking-tight ${text.title} ${
          headingLevel === 1
            ? 'text-5xl leading-[1.02] md:text-6xl lg:text-7xl'
            : 'text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem]'
        }`}
      >
        {title}
      </Heading>
      {subtitle ? (
        <motion.p
          {...reveal(0.14)}
          className={`mt-5 text-xl font-medium leading-snug md:text-2xl ${text.subtitle}`}
        >
          {subtitle}
        </motion.p>
      ) : null}
      <div className="mt-5 space-y-4">
        {body.map((paragraph, i) => (
          <motion.p
            key={i}
            {...reveal(0.2 + i * 0.06)}
            className={`max-w-[46ch] text-base leading-relaxed md:text-lg ${text.body}`}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
      {cta ? (
        <motion.div {...reveal(0.3)} className="mt-8">
          <AnimatedButton href={cta.href} variant="primary" size="lg">
            {cta.label}
          </AnimatedButton>
        </motion.div>
      ) : null}
    </div>
  );

  const parallaxStyle = shouldReduceMotion ? undefined : ({ '--parallax': shift } as unknown as CSSProperties);

  // Card position as CSS variables, so one element serves every breakpoint:
  // the portrait anchor below md, the landscape anchor from md.
  const cardStyle = card
    ? ({
        '--card-x': `${(card.anchorPortrait ?? card.anchor).x}%`,
        '--card-y': `${(card.anchorPortrait ?? card.anchor).y}%`,
        '--card-x-md': `${card.anchor.x}%`,
        '--card-y-md': `${card.anchor.y}%`,
      } as CSSProperties)
    : undefined;
  // Opacity only, 0.3 s (Revolut: no movement on reveal). The reduced branch
  // uses `animate`, like useReveal, so it never stays hidden after hydration.
  const cardReveal = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-15%' },
        transition: { duration: 0.3, ease: [0.15, 0.5, 0.5, 1] as const },
      };

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative isolate flex flex-col overflow-hidden lg:block lg:min-h-[100svh] ${
        dark ? 'bg-surface-stone' : 'bg-black-secondary'
      }`}
    >
      {/* Photo: a 4:5 / 16:10 box below lg, the whole section from lg. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
        <motion.div
          style={parallaxStyle}
          className={`absolute inset-x-0 top-0 h-full ${
            shouldReduceMotion ? '' : 'lg:h-[117%] lg:[transform:translateY(var(--parallax,0%))]'
          }`}
        >
          <ServicePicture
            image={image}
            sizes="100vw"
            portraitSizes="100vw"
            priority={priority}
          />
        </motion.div>

        {dark ? (
          <>
            {/* Warm light veil under the (transparent, dark-text) header. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-[24%] lg:block"
              style={{ background: 'linear-gradient(180deg, rgba(236,237,235,0.78) 0%, rgba(236,237,235,0) 100%)' }}
            />
            {/* Soft veil behind the text: lifts the darkest wall tones so dark text keeps ≥ 4.5:1. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                background:
                  textPosition === 'top-left'
                    ? 'radial-gradient(ellipse 48% 58% at 22% 36%, rgba(242,238,230,0.62) 0%, rgba(242,238,230,0.35) 50%, rgba(242,238,230,0) 100%)'
                    : 'radial-gradient(ellipse 48% 58% at 22% 50%, rgba(242,238,230,0.62) 0%, rgba(242,238,230,0.35) 50%, rgba(242,238,230,0) 100%)',
              }}
            />
          </>
        ) : (
          /* Warm scrim on the text side, near-black instead of pure black so the photo keeps its warmth. */
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: 'linear-gradient(90deg, rgba(14,11,8,0.55) 0%, rgba(14,11,8,0.22) 45%, rgba(14,11,8,0) 70%)' }}
          />
        )}

        {card ? (
          <motion.div
            role="group"
            aria-label={card.label}
            style={cardStyle}
            {...cardReveal}
            className="absolute left-[var(--card-x)] top-[var(--card-y)] z-10 w-[min(80%,21rem)] -translate-x-1/2 -translate-y-1/2 md:left-[var(--card-x-md)] md:top-[var(--card-y-md)] md:w-[clamp(16rem,34%,24rem)] lg:w-[clamp(18rem,30vw,26rem)]"
          >
            {card.content}
          </motion.div>
        ) : null}
      </div>

      {/* One text block: above the photo on the section colour below lg, over the photo from lg. */}
      <div
        className={`relative z-10 order-first px-6 pb-10 md:px-10 lg:mx-auto lg:flex lg:min-h-[100svh] lg:max-w-[1440px] lg:px-20 lg:pb-0 ${
          priority ? 'pt-28' : 'pt-20'
        } ${textPosition === 'top-left' ? 'lg:items-start lg:pt-[clamp(8rem,20vh,12rem)]' : 'lg:items-center lg:pt-0'}`}
      >
        {content}
      </div>
    </section>
  );
}

'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { LoopingVideo } from '@/components/sections/tjanster/logistik/LoopingVideo';
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';

type SupportVideoSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  body: string[];
  video: {
    label: string;
    /** The clip's colour at its top and bottom edge – the section fades into them. */
    edgeTop: string;
    edgeBottom: string;
    /** Card position from lg, in percent of the video box. */
    cardAnchor: { x: number; y: number };
    sources: ServiceVideoSource[];
    poster: ServiceVideoStill;
    end: ServiceVideoStill;
  };
  /** Accessible name for the card. */
  cardLabel: string;
  card: ReactNode;
};

/*
 * Support-inkorgen on /foretag-etablerad with a looping 16:9 video instead of a photo. Page-local;
 * ServiceFullBleed is untouched. The same overline, title, body and card as before.
 *
 * The section is the clip's own dark green, top edge to bottom edge, so text and video read as one
 * surface – no warm darkening layer. From lg the video runs full width under the text: its empty top
 * fades into the section colour and slides a little under the text block, so the ball and rails
 * (27–69 % of the height) never sit behind the text. The card lies on the empty background under the
 * rails. Below lg the whole video sits in its own box under the text, uncropped, with the card under
 * it.
 *
 * Playback is LoopingVideo's: muted, playsInline, loop, preload="metadata", plays while a third of it
 * is on screen, pauses when it leaves, only the last frame under reduced motion. No parallax.
 */
export function SupportVideoSection({ id, eyebrow, title, body, video, cardLabel, card }: SupportVideoSectionProps) {
  const headingId = useId();
  const { reveal, shouldReduceMotion } = useReveal();

  const vars = {
    background: `linear-gradient(180deg, ${video.edgeTop} 0%, ${video.edgeTop} 45%, ${video.edgeBottom} 100%)`,
    '--card-x': `${video.cardAnchor.x}%`,
    '--card-y': `${video.cardAnchor.y}%`,
  } as CSSProperties;

  // Top fades into the section from lg, so the clip's empty top meets the text without an edge.
  const fade = 'lg:[mask-image:linear-gradient(180deg,transparent_0%,#000_20%,#000_92%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_20%,#000_92%,transparent_100%)]';

  const cardReveal = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: '-15%' }, transition: { duration: 0.3, ease: [0.15, 0.5, 0.5, 1] as const } };

  return (
    <section id={id} aria-labelledby={headingId} style={vars} className="relative overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-20 md:px-10 lg:px-20 lg:pb-0 lg:pt-[clamp(8rem,18vh,11rem)]">
        <div className="max-w-[36rem]">
          <motion.p {...reveal(0)} className="text-overline mb-5 text-teal">
            {eyebrow}
          </motion.p>
          <motion.h2 {...reveal(0.08)} id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            {title}
          </motion.h2>
          <div className="mt-5 space-y-4">
            {body.map((paragraph, i) => (
              <motion.p key={i} {...reveal(0.2 + i * 0.06)} className="max-w-[46ch] text-base leading-relaxed text-white/85 md:text-lg">
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      {/* Video: its own rounded box below lg, full width from lg (pulled up under the text block's foot). */}
      <div className="px-6 md:px-10 lg:-mt-[6.75vw] lg:px-0">
        <div className={`relative mx-auto aspect-video w-full max-w-[44rem] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:max-w-none lg:rounded-none lg:ring-0 ${fade}`}>
          <LoopingVideo sources={video.sources} poster={video.poster} end={video.end} label={video.label} sizes="(min-width: 1024px) 100vw, (min-width: 768px) 44rem, 100vw" />
        </div>
      </div>

      {/* Card: over the empty background under the rails from lg, under the video below lg. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden aspect-video lg:block">
        <motion.div
          role="group"
          aria-label={cardLabel}
          {...cardReveal}
          className="pointer-events-auto absolute left-[var(--card-x)] top-[var(--card-y)] w-[clamp(18rem,24vw,24rem)] -translate-x-1/2 -translate-y-1/2"
        >
          {card}
        </motion.div>
      </div>
      <div role="group" aria-label={cardLabel} className="px-6 pb-16 pt-8 md:px-10 lg:hidden">
        <div className="mx-auto w-full max-w-[22rem]">{card}</div>
      </div>
    </section>
  );
}

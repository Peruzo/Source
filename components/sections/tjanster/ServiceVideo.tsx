'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';

export type ServiceVideoSource = { src: string; type: 'video/webm' | 'video/mp4'; media?: string };
export type ServiceVideoStill = { src: string; srcSet: string; /** Smaller file for phones (below md). */ smallSrc: string };

type ServiceVideoProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  /** One paragraph per entry. */
  body: string[];
  /** Smallest first is not required; a source with `media` is only used when it matches. */
  sources: ServiceVideoSource[];
  /** First frame, shown until the video plays. */
  poster: ServiceVideoStill;
  /** Last frame – what the video rests on, and all that reduced motion shows. */
  end: ServiceVideoStill;
  /** Describes what happens in the clip. */
  label: string;
  background?: 'white' | 'stone';
};

const backgrounds = { white: 'bg-white', stone: 'bg-surface-stone' } as const;

/*
 * A short, silent clip that plays once. Nothing is fetched until the section
 * comes within a screen of the viewport – not the video (preload="none", then
 * "auto") and not the poster, which is only set then, in a phone size below md. It
 * starts when half of it is visible and rests on its last frame – no loop,
 * no controls. Under reduced motion only the last frame is shown, as a still,
 * and the <video> is never rendered.
 *
 * The box has the clip's 16:9 ratio from the first render, so nothing moves
 * when the video loads.
 */
export function ServiceVideo({ id, eyebrow, title, body, sources, poster, end, label, background = 'white' }: ServiceVideoProps) {
  const headingId = useId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { reveal, shouldReduceMotion } = useReveal();
  const [posterSrc, setPosterSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldReduceMotion) return;
    let played = false;

    // Start loading a screen ahead.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPosterSrc(window.matchMedia('(max-width: 767px)').matches ? poster.smallSrc : poster.src);
          video.preload = 'auto';
          near.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    // Play once when half of it is on screen.
    const inView = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played) {
          played = true;
          video.play().catch(() => {});
          inView.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    near.observe(video);
    inView.observe(video);
    return () => {
      near.disconnect();
      inView.disconnect();
    };
  }, [shouldReduceMotion, poster.src, poster.smallSrc]);

  return (
    <section id={id} aria-labelledby={headingId} className={`${backgrounds[background]} py-20 md:py-28 lg:py-32`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <motion.div {...reveal(0)} className="mx-auto max-w-[44rem] text-center">
          {eyebrow ? <p className="text-overline mb-5 text-teal-dark">{eyebrow}</p> : null}
          <h2 id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
          <div className="mt-5 space-y-4">
            {body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-gray-700 md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="relative mx-auto mt-10 aspect-video w-full max-w-[1120px] overflow-hidden rounded-3xl bg-surface-stone md:mt-14">
          {shouldReduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={end.src}
              srcSet={end.srcSet}
              sizes="(min-width: 1200px) 1120px, 100vw"
              alt={label}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="none"
              poster={posterSrc}
              aria-label={label}
              className="absolute inset-0 h-full w-full object-cover"
            >
              {sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} media={source.media} />
              ))}
            </video>
          )}
        </div>
      </div>
    </section>
  );
}

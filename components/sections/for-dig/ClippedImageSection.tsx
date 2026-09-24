'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SectionImage, SectionVideo } from './types';
import { useReveal } from './useReveal';

type ClippedImageSectionProps = {
  id?: string;
  /** Small label above the heading. Optional. */
  eyebrow?: string;
  title: ReactNode;
  /** One paragraph per array entry. */
  body: string[];
  image?: SectionImage;
  /**
   * Looping, muted video for the clipped box instead of a photo. Takes
   * precedence over `image`.
   */
  video?: SectionVideo;
  /**
   * Live content in the clipped shape instead of `image` or `video` (e.g.
   * ProductWidgets). Takes precedence over both. Sets its own height and
   * background – the shape wraps it instead of imposing the tall photo height.
   */
  media?: ReactNode;
  /** Which side the image sits on from `lg` and up. Mirror the layout with this. */
  imageSide?: 'left' | 'right';
  /** Keeps the text column pinned while the taller image column scrolls past. */
  sticky?: boolean;
  background?: 'white' | 'stone' | 'beige';
  /** Extra content under the body – CTA, TODO-markers, list. */
  children?: ReactNode;
};

const backgrounds: Record<NonNullable<ClippedImageSectionProps['background']>, string> = {
  white: 'bg-white',
  stone: 'bg-surface-stone',
  beige: 'bg-beige-light',
};

/**
 * Full-bleed section: an asymmetrically clipped image on one side, the message
 * on the other. Sections 1, 4 and 6 of the Privat page – section 4 mirrors
 * section 1 by flipping `imageSide`.
 *
 * The "sticky text while the image scrolls past" effect is pure CSS: the image
 * column is taller than the viewport, the text column is `position: sticky`.
 * No JS scroll listeners, so it degrades to a normal two-column layout below
 * `lg` and costs nothing on mobile.
 */
export function ClippedImageSection({
  id,
  eyebrow,
  title,
  body,
  image,
  video,
  media,
  imageSide = 'right',
  sticky = true,
  background = 'white',
  children,
}: ClippedImageSectionProps) {
  // shouldReduceMotion comes from usePrefersReducedMotion (useSyncExternalStore).
  const { reveal, shouldReduceMotion } = useReveal();
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  // The <video> is mounted only once the middle of the box – where the subject
  // sits – scrolls into view. Until then, and always under reduced motion, the
  // poster is shown instead. That keeps the file off the initial load and
  // starts the video when it can actually be seen. `inView` is client-only
  // state, so the server HTML never carries an `autoplay` that could start
  // before the reduced-motion preference is known.
  const wantsVideo = Boolean(video) && !shouldReduceMotion;
  const showVideo = wantsVideo && inView;
  // The <video> shows the same poster until it starts, so the swap from
  // <Image> to <video> doesn't flash.
  const still = video ? { src: video.poster, alt: video.alt } : image;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!wantsVideo || inView || !el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [wantsVideo, inView]);

  // Follows the visitor's choice, not the element's events: Chrome pauses
  // muted autoplay off-screen, which must not flip the button. If autoplay is
  // blocked (e.g. iOS Low Power Mode) the button offers Play instead.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) el.pause();
    else el.play().catch(() => setPaused(true));
  }, [showVideo, paused]);
  const imageFirst = imageSide === 'left';

  // Asymmetric rounded clip, mirrored so the deep corner always faces the page
  // centre. Uses raw radii rather than a clip-path polygon so nothing of the
  // image is sliced off at narrow widths.
  const clip = imageFirst
    ? 'rounded-[2rem] lg:rounded-l-none lg:rounded-tr-[10rem] lg:rounded-br-[3rem]'
    : 'rounded-[2rem] lg:rounded-r-none lg:rounded-tl-[3rem] lg:rounded-bl-[10rem]';

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${backgrounds[background]}`}
    >
      <div className="grid grid-cols-1 items-start lg:grid-cols-2">
        {/* Image column – taller than the viewport so the text can stick beside it. */}
        <div
          className={`relative px-6 pt-16 md:px-10 lg:px-0 lg:pt-0 ${
            imageFirst ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <motion.div
            {...reveal(0, 40)}
            // A mounted <video> escapes the border-radius + overflow clip in
            // Chromium (verified on this page; isolation, overflow: clip and
            // translateZ did not help). An opaque mask forces the rounded clip.
            // Only while the video is mounted – image sections are untouched.
            style={
              showVideo
                ? {
                    maskImage: 'radial-gradient(white, black)',
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  }
                : undefined
            }
            className={`relative w-full overflow-hidden ${
              media ? '' : 'h-[60svh] min-h-[380px] lg:h-[150vh] lg:min-h-[900px]'
            } ${clip}`}
          >
            {media ?? (
              <>
                {video && showVideo ? (
                  <video
                    ref={videoRef}
                    src={video.src}
                    poster={video.poster}
                    aria-label={video.alt}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : still ? (
                  <Image
                    src={still.src}
                    alt={still.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : null}

                {wantsVideo ? (
                  <span
                    ref={sentinelRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-0 h-px w-px"
                  />
                ) : null}

                {/* WCAG 2.2.2 – a looping video needs a way to stop it. Bottom
                    corner away from the fixed chat button, inset on lg so it
                    clears the 10rem curve. Quiet at rest, clear on hover/focus. */}
                {showVideo ? (
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? 'Spela videon' : 'Pausa videon'}
                    className="absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white/60 backdrop-blur-sm transition-colors duration-200 hover:bg-black/70 hover:text-white focus-visible:bg-black/70 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:bottom-14 lg:left-14"
                  >
                    {paused ? (
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <rect x="3.5" y="2.5" width="3" height="11" rx="0.75" />
                        <rect x="9.5" y="2.5" width="3" height="11" rx="0.75" />
                      </svg>
                    )}
                  </button>
                ) : null}
              </>
            )}
          </motion.div>
        </div>

        {/* Text column */}
        <div
          className={`px-6 py-20 md:px-10 md:py-28 lg:px-20 lg:py-32 ${
            imageFirst ? 'lg:order-2' : 'lg:order-1'
          } ${sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}`}
        >
          <div className="max-w-[34rem]">
            {eyebrow ? (
              <motion.p {...reveal(0)} className="text-overline mb-6 text-teal-dark">
                {eyebrow}
              </motion.p>
            ) : null}

            <motion.h2 {...reveal(0.1)} className="text-section-title text-black">
              {title}
            </motion.h2>

            <div className="mt-8 space-y-6">
              {body.map((paragraph, i) => (
                <motion.p
                  key={i}
                  {...reveal(0.2 + i * 0.08)}
                  className="text-body-large text-gray-600"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {children ? (
              <motion.div {...reveal(0.4)} className="mt-10">
                {children}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

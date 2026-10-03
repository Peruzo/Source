'use client';

import { useEffect, useRef, useState } from 'react';
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';

type LoopingVideoProps = {
  sources: ServiceVideoSource[];
  /** First frame, shown until the video plays. */
  poster: ServiceVideoStill;
  /** What reduced motion shows instead of the video. */
  end: ServiceVideoStill;
  /** Describes what happens in the clip. */
  label: string;
  /** `sizes` for the still under reduced motion. */
  sizes: string;
  className?: string;
};

/*
 * A silent UI clip that loops while it is on screen (Remotion renders in ~/remotion-source).
 * preload="metadata" until it is near, so a visitor who never scrolls this far only loads the
 * header of the file; the poster is set on mount in the size the screen needs (960 below md).
 * It plays when a third of it is visible and pauses when it leaves. Under reduced motion the
 * <video> is never rendered – only the still. The box keeps the 16:9 ratio from the first
 * render (the parent sets it), so nothing moves when the video loads.
 *
 * Page-local to /logistik on purpose: ServiceVideo plays once and rests, this one loops.
 */
export function LoopingVideo({ sources, poster, end, label, sizes, className = '' }: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const [posterSrc, setPosterSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPosterSrc(window.matchMedia('(max-width: 767px)').matches ? poster.smallSrc : poster.src);
  }, [poster.src, poster.smallSrc]);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.33 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [reduce]);

  if (reduce) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={end.src} srcSet={end.srcSet} sizes={sizes} alt={label} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${className}`} />
    );
  }

  return (
    <video ref={ref} muted playsInline loop preload="metadata" poster={posterSrc} aria-label={label} className={`absolute inset-0 h-full w-full object-cover ${className}`}>
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} media={source.media} />
      ))}
    </video>
  );
}

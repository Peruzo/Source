'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';

// The last frame of the video, shown instead of it under reduced motion.
const STILL = '/tjanster/integrationer/integrationer-hero-slut';

export default function IntegrationerPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const handleEnded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
    };

    // Plays once: pauses while the hero is out of view and continues when it is
    // back, but never starts over – once it has ended it rests on the last frame.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video.ended) video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(section);
    video.addEventListener('ended', handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      video.pause();
    };
  }, [shouldReduceMotion]);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${STILL}-1920.webp`}
          srcSet={`${STILL}-960.webp 960w, ${STILL}-1920.webp 1920w, ${STILL}-2560.webp 2560w`}
          sizes="100vw"
          alt=""
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src="/Integrations.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0)_40%)]" />
      {/* Dark toning over the band the text sits in (it starts at 18vh and is at most
          16rem tall), fading out below it, so the white text reads against the light
          video – at least 4.5:1, measured (CC-RAPPORT-integrationer-bygge.md punkt 7). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.6)_calc(18vh_+_16rem),rgba(0,0,0,0)_calc(18vh_+_28rem))]"
      />

      <div className="relative z-[3] flex h-full items-start justify-center px-6 pt-[18vh] text-center md:px-10">
        <div className="mx-auto max-w-[700px]">
          <h1 className="text-[48px] font-semibold leading-[1.08] tracking-tight text-white md:text-[56px] lg:text-[64px]">
            Integrationer
          </h1>
          <p className="mx-auto mt-6 text-base leading-relaxed text-white/85 md:text-lg">
            Koppla ihop dina system och skapa ett sömlöst flöde mellan din e-handel,
            betalningar och data. Med våra integrationer kopplar du Stripe, Fortnox och
            PostNord till samma portal.
          </p>
        </div>
      </div>
    </section>
  );
}


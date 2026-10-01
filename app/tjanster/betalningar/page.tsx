'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { BetalningarSections } from '@/components/sections/tjanster/betalningar/BetalningarSections';
import { betalningarHero } from '@/lib/data/tjanster/betalningar';
import { useEffect, useRef } from 'react';

export default function PaymentsPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const videoEl = videoRef.current;

    if (!sectionEl || !videoEl) {
      return;
    }

    const resetToStart = () => {
      videoEl.pause();
      videoEl.currentTime = 0;
    };

    const playFromStart = async () => {
      resetToStart();
      try {
        await videoEl.play();
      } catch {
        // Autoplay can be blocked in some contexts; keep first frame.
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void playFromStart();
          } else {
            resetToStart();
          }
        });
      },
      { threshold: 0.55 }
    );

    observer.observe(sectionEl);

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black pt-12 text-white md:min-h-[100svh] md:pt-0"
    >
      <video
        ref={videoRef}
        src="/videoforpayments.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={(e) => {
          const video = e.currentTarget;
          video.pause();
          if (!Number.isNaN(video.duration)) {
            video.currentTime = video.duration;
          }
        }}
        className="pointer-events-none relative aspect-video w-full object-cover object-center md:absolute md:inset-0 md:aspect-auto md:h-full md:object-[70%_50%] lg:inset-y-0 lg:right-[-5%] lg:left-auto lg:w-[120%] lg:object-contain lg:object-right lg:origin-right lg:scale-75 lg:translate-x-[10%]"
      />

      {/* Subtle left fade for text readability (no dark filter over video). */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,191,166,0.08),transparent_60%)]" />

      <Container className="relative z-10 flex items-center md:min-h-[100svh]">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="max-w-xl space-y-8 pt-8 pb-16 md:py-24 lg:py-0">
            {/* Copy rättad enligt betalningar-hosting-plan.md 6.1 (lib/data/tjanster/betalningar.ts),
                layout, classes and video unchanged. */}
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              {betalningarHero.overline}
            </p>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                {betalningarHero.title}
              </h1>
              <p className="text-lg md:text-xl text-white/75 leading-relaxed">
                {betalningarHero.lead}
              </p>
            </div>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              {betalningarHero.body}
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <AnimatedButton href={betalningarHero.primary.href} variant="primary" size="lg">
                {betalningarHero.primary.label}
              </AnimatedButton>
              <Link
                href={betalningarHero.back.href}
                className="inline-flex items-center text-base font-semibold text-white/70 transition-colors hover:text-white"
              >
                {betalningarHero.back.label}
                <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
          </FadeIn>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
    <BetalningarSections />
    </>
  );
}


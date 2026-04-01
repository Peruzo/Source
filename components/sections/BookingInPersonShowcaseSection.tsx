'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';

export function BookingInPersonShowcaseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videoLayer = videoLayerRef.current;
    if (!section || !videoLayer) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      videoLayer.style.transform = 'translate3d(0,0,0) scale(1)';
      return;
    }

    let rafId = 0;
    let currentY = 0;
    let currentScale = 1;
    let targetY = 0;
    let targetScale = 1;

    const animate = () => {
      currentY += (targetY - currentY) * 0.1;
      currentScale += (targetScale - currentScale) * 0.1;
      videoLayer.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;

      if (Math.abs(targetY - currentY) > 0.08 || Math.abs(targetScale - currentScale) > 0.0007) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        rafId = 0;
      }
    };

    const updateTargets = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight)));

      const maxTranslate = window.innerWidth < 768 ? 14 : 30;
      targetY = progress * maxTranslate;
      targetScale = 1 + progress * 0.018;

      if (!rafId) rafId = window.requestAnimationFrame(animate);
    };

    const onScroll = () => updateTargets();
    const onResize = () => updateTargets();

    videoLayer.style.willChange = 'transform';
    updateTargets();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      videoLayer.style.willChange = 'auto';
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden text-white">
      <div ref={videoLayerRef} className="absolute inset-0 origin-center">
        <video
          src="/booking-demo-web.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center"
          aria-label="Bokningssystem i praktiken"
        />
      </div>

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/12 to-black/28" />

      <Container className="relative z-10 flex min-h-[100svh] flex-col items-center justify-start px-6 pt-20 text-center md:px-10 md:pt-24 lg:px-20 lg:pt-28">
        <div className="w-full max-w-[920px] space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.36em] text-white/75">BOKNINGSSYSTEM</p>
          <h2 className="text-[2.2rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
            Full kontroll över bokningar i en enda plattform
          </h2>
          <p className="mx-auto max-w-[760px] text-base leading-relaxed text-white/86 md:text-lg">
            Hantera bokningar, tillgänglighet och personal i realtid med ett bokningssystem som ger
            full överblick över hela verksamheten.
          </p>
        </div>
      </Container>
    </section>
  );
}

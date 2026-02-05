'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';

export default function BokningssystemPage() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const section = heroSectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const handleEnded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
    };

    video.addEventListener('ended', handleEnded);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  hasPlayedRef.current = true;
                })
                .catch(() => {
                  hasPlayedRef.current = true;
                });
            } else {
              hasPlayedRef.current = true;
            }
          } else if (!entry.isIntersecting && hasPlayedRef.current) {
            hasPlayedRef.current = false;
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative min-h-screen flex items-center"
        style={{
          background: `
            radial-gradient(ellipse 120% 100% at 85% 50%, rgba(240, 253, 250, 0.8) 0%, rgba(236, 253, 245, 0.6) 30%, rgba(249, 250, 251, 0.4) 60%, rgba(255, 255, 255, 1) 100%),
            linear-gradient(to bottom right, rgba(249, 250, 251, 1) 0%, rgba(240, 253, 250, 0.9) 50%, rgba(255, 255, 255, 1) 100%)
          `,
        }}
      >
        <Container className="w-full py-24 md:py-32 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Bokningssystem
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Ett bokningssystem byggt för alla branscher
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Automatisera bokningar, betalningar och flöden i ett system som anpassar sig efter ditt sätt att arbeta.
              </p>
            </div>

            <div className="relative w-full pl-8 lg:pl-12 overflow-visible">
              <video
                ref={videoRef}
                src="/boksystemstart.mp4"
                muted
                playsInline
                preload="auto"
                className="max-w-none h-auto lg:translate-x-[-6%]"
                style={{
                  width: '150%',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                }}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

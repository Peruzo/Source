'use client';

import { useEffect, useRef } from 'react';

export default function IntegrationerPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;
    let hasPlayed = false;

    const handleEnded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayed) {
              video.currentTime = 0;
              video.play().catch(() => {});
              hasPlayed = true;
            }
          } else {
            hasPlayed = false;
            video.pause();
            video.currentTime = 0;
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
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
      <video
        ref={videoRef}
        src="/Integrations.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      />

      <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0)_40%)]" />

      <div className="relative z-[3] flex h-full items-start justify-center px-6 pt-[18vh] text-center md:px-10">
        <div className="mx-auto max-w-[700px]">
          <h1 className="text-[48px] font-semibold leading-[1.08] tracking-tight text-white md:text-[56px] lg:text-[64px]">
            Integrationer
          </h1>
          <p className="mx-auto mt-6 text-base leading-relaxed text-white/85 md:text-lg">
            Koppla ihop dina system och skapa ett sömlöst flöde mellan din e-handel,
            betalningar och data. Med våra integrationer får du full kontroll och
            automatisering i varje steg.
          </p>
        </div>
      </div>
    </section>
  );
}


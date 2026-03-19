'use client';

import { useEffect, useRef } from 'react';

export default function BokforingPage() {
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
        src="/bokfaringvid.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full items-center px-6 md:px-10 lg:px-20">
        <div className="max-w-[560px] text-[#111]">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Bokföring
          </h1>
          <p className="mt-6 text-base leading-relaxed md:text-lg">
            Ett modernt bokföringsverktyg byggt för e-handel.
            Automatisera din bokföring med realtidsdata och en direkt integration
            till Fortnox - så att du får full kontroll utan manuellt arbete.
          </p>
        </div>
      </div>
    </section>
  );
}


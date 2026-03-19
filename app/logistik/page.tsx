'use client';

import { useEffect, useRef } from 'react';

export default function LogistikPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;
    let hasPlayed = false;
    let stopped = false;
    const STOP_TIME = 4.0;

    const handleLoadedMetadata = () => {
      video.currentTime = 0;
      stopped = false;
    };

    const handleTimeUpdate = () => {
      if (!stopped && video.currentTime >= STOP_TIME) {
        stopped = true;
        video.pause();
        // Freeze near the target frame to avoid end-frame jump.
        video.currentTime = STOP_TIME - 0.05;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayed) {
              video.currentTime = 0;
              stopped = false;
              video.play().catch(() => {});
              hasPlayed = true;
            }
          } else {
            hasPlayed = false;
            stopped = false;
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(video);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.pause();
    };
  }, []);

  return (
    <>
      <section
        className="relative h-[100svh] w-full overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 120% 100% at 85% 50%, rgba(240, 253, 250, 0.8) 0%, rgba(236, 253, 245, 0.6) 30%, rgba(249, 250, 251, 0.4) 60%, rgba(255, 255, 255, 1) 100%),
            linear-gradient(to bottom right, rgba(249, 250, 251, 1) 0%, rgba(240, 253, 250, 0.9) 50%, rgba(255, 255, 255, 1) 100%)
          `,
        }}
      >
        {/* Video - absolutely positioned in entire section, centered */}
        {/* Unique ID to prevent conflicts with other video controllers */}
        <video
          ref={videoRef}
          id="logistikVideo"
          data-logistik-video="true"
          src="/logbilfor.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute pointer-events-none z-0"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
          }}
        />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.2)_60%,rgba(0,0,0,0)_100%)]" />

        {/* Content grid - relative z-2 to be above video/overlay */}
        <div className="relative z-[2] flex h-full items-center w-full py-24 md:py-32 px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-12 lg:gap-20 items-center max-w-[1440px] mx-auto">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                Logistik
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Full kontroll över din logistik
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Ge ditt team verktygen som krävs för att organisera leveranser med våra logistikwidgets. Med dessa anpassade funktioner kan ni hantera beställningar, frakt och leveransstatus – oavsett om det handlar om en ny beställning eller att spåra en expressleverans.
              </p>
            </div>

            {/* Empty right column for spacing */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>
    </>
  );
}

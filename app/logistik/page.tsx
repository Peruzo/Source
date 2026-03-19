'use client';

import { useEffect, useRef } from 'react';

export default function LogistikPage() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const section = heroSectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    // Reverse segment playback: start at 0:03 and stop at 0:00.
    const reverseEndTime = 0;
    const reverseStartTimeRequested = 3; // seconds

    let rafId: number | null = null;
    let lastTs: number | null = null;

    const stopReversePlayback = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTs = null;
      video.pause();
    };

    const startReversePlayback = () => {
      if (hasPlayedRef.current || video.readyState < 2) return;

      stopReversePlayback();

      const duration = Number.isNaN(video.duration) ? 0 : video.duration;
      const reverseStartTime = Math.min(
        reverseStartTimeRequested,
        duration > 0 ? duration : reverseStartTimeRequested
      );

      // Seek to the requested reverse start frame and manually "seek backwards".
      video.currentTime = reverseStartTime;
      video.play().catch(() => {});
      // Disable native playback advancement; we only move the timeline manually.
      video.playbackRate = 0;

      hasPlayedRef.current = true;

      const tick = (ts: number) => {
        if (!section || !video) return;

        if (lastTs === null) {
          lastTs = ts;
        }

        const dtSeconds = (ts - lastTs) / 1000;
        lastTs = ts;

        const nextTime = Math.max(
          reverseEndTime,
          // 1x reverse speed
          video.currentTime - dtSeconds
        );

        video.currentTime = nextTime;

        if (nextTime <= reverseEndTime + 0.001) {
          // Stop at 0:00 and keep the last frame.
          stopReversePlayback();
          hasPlayedRef.current = true;
          return;
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    // IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current && video.readyState >= 2) {
            startReversePlayback();
          }

          if (!entry.isIntersecting) {
            // When leaving viewport: reset so scrolling back restarts from 0:03.
            hasPlayedRef.current = false;
            stopReversePlayback();

            if (video.readyState >= 2) {
              video.currentTime = Math.min(
                reverseStartTimeRequested,
                Number.isNaN(video.duration) ? reverseStartTimeRequested : video.duration
              );
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    // Setup
    const setup = () => {
      if (video.readyState >= 2) {
        video.pause();
        const duration = Number.isNaN(video.duration) ? 0 : video.duration;
        video.currentTime = Math.min(
          reverseStartTimeRequested,
          duration > 0 ? duration : reverseStartTimeRequested
        );
        observer.observe(section);
        
        // Check if already visible
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
        if (isVisible && !hasPlayedRef.current) {
          startReversePlayback();
        }
      } else {
        video.addEventListener('loadedmetadata', () => {
          video.pause();
          const duration = Number.isNaN(video.duration) ? 0 : video.duration;
          video.currentTime = Math.min(
            reverseStartTimeRequested,
            duration > 0 ? duration : reverseStartTimeRequested
          );
          observer.observe(section);
          
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
          if (isVisible && !hasPlayedRef.current) {
            startReversePlayback();
          }
        }, { once: true });
      }
    };

    setup();

    return () => {
      observer.disconnect();
      stopReversePlayback();
      video.pause();
    };
  }, []);

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative min-h-screen flex items-center overflow-hidden"
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
          id="logistik-hero-video"
          data-logistik-video="true"
          src="/logiformotion.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '120vw',
            height: '100%',
            objectFit: 'cover',
            maskImage: 'radial-gradient(ellipse 80% 100% at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Content grid - relative z-10 to be above video */}
        <div className="relative z-10 w-full py-24 md:py-32 px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-12 lg:gap-20 items-center max-w-[1440px] mx-auto">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Logistik
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Full kontroll över din logistik
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
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

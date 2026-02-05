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

    // Stop at end when video finishes
    const handleEnded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
      console.log('[hero] reverse stop');
    };

    // Start playback when section becomes visible
    const startPlayback = () => {
      if (hasPlayedRef.current || video.readyState < 2) return;

      video.currentTime = 0;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[hero] reverse start');
            hasPlayedRef.current = true;
          })
          .catch(() => {
            hasPlayedRef.current = true;
          });
      } else {
        hasPlayedRef.current = true;
      }
    };

    // IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current && video.readyState >= 2) {
            console.log('[hero] intersect');
            startPlayback();
          } else if (!entry.isIntersecting && hasPlayedRef.current) {
            hasPlayedRef.current = false;
          }
        });
      },
      { threshold: 0.6 }
    );

    // Setup
    const setup = () => {
      if (video.readyState >= 2) {
        video.pause();
        video.currentTime = 0;
        observer.observe(section);
        
        // Check if already visible
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
        if (isVisible && !hasPlayedRef.current) {
          startPlayback();
        }
      } else {
        video.addEventListener('loadedmetadata', () => {
          video.pause();
          video.currentTime = 0;
          observer.observe(section);
          
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
          if (isVisible && !hasPlayedRef.current) {
            startPlayback();
          }
        }, { once: true });
      }
    };

    video.addEventListener('ended', handleEnded);
    setup();

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
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
          src="/logistik-reversed.mp4"
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

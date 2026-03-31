'use client';

import { useEffect, useRef, useState } from 'react';
import { LogistikOverviewSection } from '@/components/sections/LogistikOverviewSection';
import { LogisticsWidgetsSection } from '@/components/sections/LogisticsWidgetsSection';

export default function LogistikPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const returVideoRef = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredReturPlayback = useRef(false);
  const [isReturVideoEnded, setIsReturVideoEnded] = useState(false);

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

  useEffect(() => {
    const video = returVideoRef.current;
    if (!video) return;

    const onEnded = () => {
      // Freeze on the final frame instead of resetting/replaying.
      const freezeAt = Number.isFinite(video.duration) ? Math.max(video.duration - 0.03, 0) : video.currentTime;
      video.pause();
      video.currentTime = freezeAt;
      setIsReturVideoEnded(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasTriggeredReturPlayback.current) return;
          hasTriggeredReturPlayback.current = true;
          video.play().catch(() => {});
        });
      },
      { threshold: 0.45 }
    );

    video.addEventListener('ended', onEnded);
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', onEnded);
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

      <LogistikOverviewSection />
      <LogisticsWidgetsSection />

      <section className="relative min-h-[100svh] w-full overflow-hidden text-white">
        <div className="relative h-[100svh] w-full">
          <video
            ref={returVideoRef}
            src="/0330.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-label="Demonstration av returhanteringssystem"
          />

          <div className="pointer-events-none absolute inset-0 z-10 hidden items-center lg:flex">
            <div className="w-full px-6 md:px-10 lg:px-20">
              <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
                <div className="self-center pr-8 xl:pr-14">
                  <ul className="space-y-6 text-left md:space-y-7">
                    {[
                      'Eget system för att administrativt styra returerna',
                      'Kopplat mot inventarier och automatisk refund policy',
                      'Full kontroll över returflödet i realtid',
                      'Smidigare upplevelse för både kund och support',
                    ].map((point, index) => (
                      <li
                        key={point}
                        className={`text-[1.16rem] font-semibold leading-[1.62] tracking-[-0.012em] text-[#f7f6f2] [text-shadow:0_4px_14px_rgba(0,0,0,0.18)] transition-all duration-700 ease-out md:text-[1.28rem] md:leading-[1.68] ${
                          isReturVideoEnded
                            ? 'translate-y-0 opacity-100 blur-0'
                            : 'translate-y-3 opacity-0 blur-[2px]'
                        }`}
                        style={{ transitionDelay: isReturVideoEnded ? `${index * 130}ms` : '0ms' }}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex h-full w-full justify-center px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-24 lg:px-20 lg:pb-24 lg:pt-28">
            <div className="mx-auto flex w-full max-w-[920px] flex-col items-center text-center">
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-white/90 [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] md:text-sm">
                RETURHANTERING
              </p>
              <h2 className="mt-5 max-w-[15ch] text-4xl font-semibold leading-[1.08] tracking-tight text-white [text-shadow:0_6px_28px_rgba(0,0,0,0.38)] sm:text-5xl md:text-6xl">
                Hantera returer utan onödigt krångel
              </h2>
              <p className="mt-6 max-w-[690px] text-base leading-relaxed text-white/88 [text-shadow:0_3px_18px_rgba(0,0,0,0.34)] md:text-lg">
                Ge kunderna en smidig returupplevelse samtidigt som ditt team får full kontroll över
                varje steg i flödet — från mottagning till återbetalning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

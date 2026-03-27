'use client';

import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { CampaignVisualShowcase } from '@/components/sections/CampaignVisualShowcase';
import { useEffect, useRef } from 'react';

export default function CampaignsPage() {
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
    <>
      <section ref={sectionRef} className="bg-white text-gray-900">
        <Container className="min-h-[100svh] py-24 lg:py-0">
          <div className="grid min-h-[100svh] grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[140px]">
            <FadeIn className="max-w-[500px] space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                TJÄNSTER
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                Kampanjer
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Skapa kampanjer som känns premium, laddar snabbt och är byggda för att
                konvertera.
              </p>
            </FadeIn>

            <div className="ml-auto flex w-full items-center justify-end lg:min-h-[760px] lg:pr-0">
              <video
                ref={videoRef}
                src="/3dvidoforkampanj.mp4"
                muted
                playsInline
                preload="auto"
                className="w-full h-auto mix-blend-normal drop-shadow-[0_80px_140px_rgba(0,0,0,0.12)] [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_100%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_100%)] lg:w-[1100px] lg:max-w-none lg:translate-x-[15%]"
              />
            </div>
          </div>
        </Container>
      </section>
      <CampaignVisualShowcase />
    </>
  );
}


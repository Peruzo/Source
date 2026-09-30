'use client';

import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { KampanjerSections } from '@/components/sections/tjanster/kampanjer/KampanjerSections';
import { useEffect, useRef, type CSSProperties } from 'react';

// The hero video's own background, measured on its edges (left, right and corners of the
// frame it rests on: #f2f2f2–#f4f4f6). The section takes that colour and the video fades out
// on all four sides, so no edge of the frame shows against the page.
const VIDEO_EDGE = '#f4f4f5';
const videoMask =
  'linear-gradient(to right, transparent 0%, #000 24%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)';
const videoMaskStyle: CSSProperties = {
  maskImage: videoMask,
  WebkitMaskImage: videoMask,
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
};

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
      <section ref={sectionRef} className="overflow-hidden text-gray-900" style={{ backgroundColor: VIDEO_EDGE }}>
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
                className="h-auto w-full lg:w-[1100px] lg:max-w-none lg:translate-x-[15%]"
                style={videoMaskStyle}
              />
            </div>
          </div>
        </Container>
      </section>
      <KampanjerSections />
    </>
  );
}


'use client';

import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CubeIcon, BanknotesIcon, TruckIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import { StickySteps } from '@/components/sections/tjanster/StickySteps';
import { RestockSuggestion, ScanCard, StockCounter } from '@/components/sections/tjanster/widgets/InventoryWidgets';
import {
  inventarierFeatures,
  inventarierHeroVideo as heroVideo,
  inventarierImages,
  inventarierImport,
  inventarierRestock,
  inventarierReturns,
  inventarierSteps,
  inventarierWidgets as w,
} from '@/lib/data/tjanster/inventarier';
// The same switch as the returns card on /logistik: FEATURE_RETURNS is off in the portal by default.
import { FLAGGOR } from '@/lib/data/tjanster/logistik';

const returnIcons = [CubeIcon, TruckIcon, BanknotesIcon];

const steps = [
  {
    ...inventarierSteps.steps[0],
    visual: ({ active }: { active: boolean }) => (
      <ScanCard active={active} title={w.scan.title} found={w.scan.found} ean={w.ean} product={w.product} variant={w.variant} />
    ),
  },
  {
    ...inventarierSteps.steps[1],
    visual: ({ active }: { active: boolean }) => (
      <StockCounter active={active} {...w.stock} product={w.product} variant={w.variant} />
    ),
  },
  {
    ...inventarierSteps.steps[2],
    visual: ({ active }: { active: boolean }) => (
      <RestockSuggestion active={active} {...w.restock} product={w.product} variant={w.variant} />
    ),
  },
];

// Hero clip: fades out on all four sides into the section, which has the clip's own edge colour
// (lib/data/tjanster/inventarier.ts), so no edge of the frame shows. Wider fades at the left, where
// the wall is darker, and at the bottom, where the dark pedestal leaves the frame.
const heroMask =
  'linear-gradient(to right, transparent 0%, #000 22%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 78%, transparent 100%)';
const heroMaskStyle: CSSProperties = {
  maskImage: heroMask,
  WebkitMaskImage: heroMask,
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
};

export default function InventarierPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [posterSrc, setPosterSrc] = useState<string | undefined>(undefined);

  // Plays when the hero is in view and again each time it comes back; rests on the last frame.
  // Under reduced motion the <video> is not rendered and the last frame is shown as a still.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video || reduceMotion) return;
    setPosterSrc(window.matchMedia('(max-width: 767px)').matches ? heroVideo.poster.smallSrc : heroVideo.poster.src);
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
  }, [reduceMotion]);

  return (
    <>
      {/* Hero – like the /tjanster/kampanjer hero: the section in the clip's edge colour, dark text,
          the whole 16:9 clip with a soft mask. From lg the clip sits to the right and runs to the
          edge of the screen; below lg it sits whole under the text. */}
      <section
        ref={sectionRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-12 text-gray-900 lg:py-0"
        style={{ backgroundColor: heroVideo.edge }}
      >
        <Container className="w-full">
          <div className="max-w-[480px] space-y-6 lg:max-w-[min(480px,36vw)]">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-700">
              TJÄNSTER
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-[#111111]">
              Inventarier
            </h1>

            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mt-4">
              Full kontroll över dina inventarier
            </h2>

            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Alla förändringar uppdateras automatiskt – vid köp och
              lagerförändringar. Du har alltid korrekt data utan manuellt arbete.
            </p>
          </div>
        </Container>

        <div
          className="relative mt-10 aspect-video w-full lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:w-[60vw] lg:-translate-y-1/2"
          style={heroMaskStyle}
        >
          {reduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroVideo.end.src}
              srcSet={heroVideo.end.srcSet}
              sizes="(min-width: 1024px) 60vw, 100vw"
              alt={heroVideo.label}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              poster={posterSrc}
              aria-label={heroVideo.label}
              className="absolute inset-0 h-full w-full object-cover"
            >
              {heroVideo.sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} media={source.media} />
              ))}
            </video>
          )}
        </div>
      </section>

      <ServicePageLayout>
        {/* 3 – Håll koll på ditt lager */}
        <section className="flex min-h-[100svh] items-center bg-[#eceef2] py-20 md:py-24 lg:py-28">
          <Container size="xl" className="max-w-[1520px]">
            <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24 xl:gap-28">
              <div className="max-w-[620px] space-y-8">
                <p className="text-xs font-medium uppercase tracking-[0.36em] text-gray-500">
                  INVENTARIER
                </p>
                <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.15rem]">
                  Håll koll på ditt lager
                </h2>
                <p className="max-w-[58ch] text-base leading-relaxed text-gray-700 md:text-lg">
                  Se lagersaldo, produktvarianter och viktiga uppdateringar på alla dina enheter — i en
                  och samma vy.
                </p>
              </div>

              <div className="w-full">
                <div className="relative mx-auto w-full max-w-[980px] overflow-hidden rounded-[30px] border border-black/5 shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
                  <Image
                    src="/inventirynewone.png"
                    alt="Lagersaldo per variant i Source på en dator, en surfplatta och en mobil."
                    width={2200}
                    height={1500}
                    className="h-auto w-full object-cover object-right"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 4 – Skanna → saldo → inköp */}
        <StickySteps
          eyebrow={inventarierSteps.eyebrow}
          title={inventarierSteps.title}
          image={inventarierImages.skanna}
          steps={steps}
        />

        {/* 5 – Funktioner */}
        <FeatureCarousel
          eyebrow={inventarierFeatures.eyebrow}
          title={inventarierFeatures.title}
          items={inventarierFeatures.items}
          background="beige"
        />

        {/* 6 – Kategorier (unchanged, video left as is) */}
        <section className="relative min-h-[100svh] w-full overflow-hidden text-white">
          <video
            src="/0331.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-black/15 md:bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

          <Container className="relative z-10 flex min-h-[100svh] items-center">
            <div className="max-w-[620px] space-y-7">
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-white/70">
                KATEGORIER
              </p>
              <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.05rem]">
                Skapa ordning i hela ditt sortiment
              </h2>
              <p className="max-w-[56ch] text-base leading-relaxed text-white/80 md:text-lg">
                Samla produkter i tydliga kategorier och håll lager, varianter och struktur
                organiserade på ett och samma ställe.
              </p>
              <div className="pt-2">
                <AnimatedButton href="/kontakt" variant="primary" size="lg">
                  Utforska inventarier
                </AnimatedButton>
              </div>
            </div>
          </Container>
        </section>

        {/* 7 – Rekommenderade inköp */}
        <ServiceFullBleed
          eyebrow={inventarierRestock.eyebrow}
          title={inventarierRestock.title}
          body={inventarierRestock.body}
          image={inventarierImages.inkop}
          tone="light"
          textPosition="top-left"
        />

        {/* 8 – Returer: same layout, copy without a stock-update claim. Only when returns are on (FLAGGOR.returer). */}
        {FLAGGOR.returer ? <ReturnsSection /> : null}

        {/* 9 – Import/export, split with the D3 close-up */}
        <ClippedImageSection
          eyebrow={inventarierImport.eyebrow}
          title={inventarierImport.title}
          body={inventarierImport.body}
          imageSide="left"
          sticky={false}
          background="white"
          media={
            <div className="relative h-[60svh] min-h-[380px] lg:h-full">
              <ServicePicture image={inventarierImages.narbild} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          }
        >
          <AnimatedButton href={inventarierImport.cta.href} variant="primary" size="lg">
            {inventarierImport.cta.label}
          </AnimatedButton>
        </ClippedImageSection>
      </ServicePageLayout>
    </>
  );
}

/* Returer – its own component so the reduced-motion hook stays out of the original hero code above. */
function ReturnsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="bg-[#f8f9fb] py-24 md:py-28 lg:py-32">
      <Container size="xl" className="max-w-[1560px]">
        <div className="mx-auto max-w-[940px] text-center">
          <p className="text-xs font-medium uppercase tracking-[0.34em] text-gray-500">
            {inventarierReturns.eyebrow}
          </p>
          <h2 className="mt-5 text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.1rem]">
            {inventarierReturns.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-base leading-relaxed text-gray-600 md:text-lg">
            {inventarierReturns.body}
          </p>
          <div className="mt-8">
            <AnimatedButton href={inventarierReturns.cta.href} variant="primary" size="lg">
              {inventarierReturns.cta.label}
            </AnimatedButton>
          </div>
        </div>
      </Container>

      {/* overflow-x-clip: the image drifts 10 px sideways (x below) and is full width on phones,
          so without it the page scrolled sideways by up to 10 px. Clip, not hidden: no scroll box. */}
      <div className="mt-12 overflow-x-clip md:mt-14 lg:mt-16">
        <motion.div
          className="relative mx-auto w-full max-w-[960px] px-4 md:max-w-[1080px] lg:max-w-[1120px]"
          animate={reduceMotion ? { x: 0 } : { x: [0, 10, 0] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 12, ease: 'easeInOut', repeat: Infinity }}
        >
          <div className="relative aspect-[16/8.4] overflow-hidden rounded-[28px] border border-black/5 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
            <Image
              src="/returinventory.png"
              alt="En person vid en laptop håller i sin telefon."
              fill
              className="object-cover object-center"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3 md:bottom-6 md:px-6 lg:bottom-7">
              <ol aria-label="Returärendets steg" className="flex w-full max-w-full gap-4 overflow-x-auto pb-1 md:w-auto md:overflow-visible">
                {inventarierReturns.steps.map((step, i) => {
                  const Icon = returnIcons[i];
                  return (
                    <li
                      key={step.title}
                      className="min-w-[240px] rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.12)] md:min-w-[270px] md:px-6 md:py-[18px]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-teal-dark text-white">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold leading-tight text-gray-900 md:text-base">
                            {step.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">{step.note}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

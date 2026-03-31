'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

const SLIDE_DURATION_MS = 4000;

const slides = [
  {
    src: '/handspic.png',
    alt: 'Handel och betalning',
    label: 'Betalningar',
  },
  {
    src: '/padeltjanster.png',
    alt: 'Betalningstjänster',
    label: 'Betalningstjänster',
  },
  {
    src: '/yagainstructor.png',
    alt: 'Prenumerationsbetalning',
    label: 'Prenumerationsbetalning',
  },
] as const;

function ProgressUnderline() {
  return (
    <motion.span
      layout={false}
      className="absolute bottom-0 left-0 h-full w-full origin-left rounded-full bg-[#00BFA6]"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: SLIDE_DURATION_MS / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}

const widgetShell =
  'pointer-events-none absolute bottom-5 left-5 right-5 z-10 md:bottom-8 md:left-8 md:right-auto md:max-w-[min(100%,400px)]';
const widgetCard =
  'rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] md:min-h-[112px] md:p-6';

function SlideWidget({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className={widgetShell}>
        <div className={widgetCard}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-base font-semibold leading-tight text-gray-900 md:text-[17px]">
                Betalning mottagen
              </p>
              <p className="text-sm leading-snug text-gray-600 md:text-[15px]">Order 23xsdswe – Grön soffa</p>
              <p className="pt-1 text-base font-semibold tabular-nums tracking-tight text-gray-900 md:text-lg">
                2499 SEK
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-[#f3f4f6] px-3 shadow-[0_6px_18px_rgba(15,23,42,0.08)] md:h-11 md:px-2.5">
                <span className="relative inline-block h-5 w-8" aria-label="Mastercard">
                  <span className="absolute left-0 top-0 inline-block h-5 w-5 rounded-full bg-[#eb001b]" />
                  <span className="absolute right-0 top-0 inline-block h-5 w-5 rounded-full bg-[#f79e1b]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className={widgetShell}>
        <div className={widgetCard}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-[1.75rem] shadow-inner md:h-[60px] md:w-[60px] md:text-[1.85rem]"
              aria-hidden
            >
              🎾
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-base font-semibold leading-tight text-gray-900 md:text-[17px]">Betalning mottagen</p>
              <p className="text-sm text-gray-600 md:text-[15px]">Padel plan 2 tim</p>
              <p className="text-xs leading-snug text-gray-500 md:text-sm">Matchat med ditt bokningssystem</p>
            </div>
            <p className="flex-shrink-0 text-base font-semibold tabular-nums tracking-tight text-gray-900 md:text-lg">
              499 SEK
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={widgetShell}>
      <div className={widgetCard}>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 text-2xl shadow-inner md:h-[60px] md:w-[60px] md:text-[1.65rem]"
            aria-hidden
          >
            🧘
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-base font-semibold leading-tight text-gray-900 md:text-[17px]">
              Prenumerationsbetalning mottagen
            </p>
            <p className="text-sm leading-snug text-gray-600 md:text-[15px]">Yoga LIGHT – 7 day Chakra Ride</p>
          </div>
          <p className="flex-shrink-0 text-base font-semibold tabular-nums tracking-tight text-gray-900 md:text-lg">
            349 SEK
          </p>
        </div>
      </div>
    </div>
  );
}

export function PaymentCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % slides.length);
  }, []);

  const restartAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(goNext, SLIDE_DURATION_MS);
  }, [goNext]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [restartAutoplay]);

  const handleLabelClick = (index: number) => {
    setActiveIndex(index);
    restartAutoplay();
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f7f5] py-28 text-gray-900 md:py-36 lg:min-h-[min(100svh,1200px)] lg:py-40 xl:py-52">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="order-2 max-w-xl space-y-5 lg:order-1">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">BETALNINGAR I PRAKTIKEN</p>
            <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight text-gray-900 md:text-4xl lg:text-[2.75rem]">
              Ta emot betalningar som känns trygga och professionella
            </h2>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              Oavsett om det gäller engångsköp, tjänster eller prenumerationer – samma smidiga
              upplevelse för dig och dina kunder.
            </p>
          </div>

          <div className="order-1 w-full lg:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[24px] bg-gray-200 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:max-w-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={slides[activeIndex].src}
                    alt={slides[activeIndex].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={activeIndex === 0}
                  />
                  <SlideWidget index={activeIndex} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-start justify-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-10 lg:justify-between lg:gap-x-4">
              {slides.map((slide, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={slide.label}
                    type="button"
                    onClick={() => handleLabelClick(i)}
                    className="group relative pb-2 text-left text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 md:text-base"
                  >
                    <span className={`relative inline-block pb-1 ${isActive ? 'text-gray-900' : ''}`}>
                      {slide.label}
                      <span className="absolute left-0 top-full mt-2 h-[2px] w-full overflow-hidden rounded-full bg-gray-200/90">
                        {isActive ? <ProgressUnderline key={activeIndex} /> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

'use client';

import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export function PaymentLinkFeatureSection() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-white py-[100px] md:py-28 lg:py-[140px]">
      <Container size="lg" className="max-w-[min(100%,1560px)]">
        <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-[minmax(0,86.5%)_minmax(0,13.5%)] lg:gap-20 xl:gap-[88px]">
          <FadeIn
            direction="up"
            className="order-1 min-w-0 w-full lg:-ml-20 lg:mr-0 xl:-ml-28 2xl:-ml-36"
          >
            <div className="relative mx-auto w-full max-w-[min(100%,1740px)] overflow-hidden rounded-[32px] border border-black/[0.05] bg-[#f2f2f0] shadow-[0_24px_80px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)] lg:mx-0 lg:max-w-none">
              {/* 16:9 matches typical Remotion/screen exports; contain shows full frame without cropping */}
              <div className="relative aspect-video w-full">
                <video
                  src="/video/payment-link-pt.mp4"
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  aria-label="Demonstration av betalningslänk"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} direction="up" className="order-2 flex min-w-0 flex-col justify-center">
            <div className="max-w-[560px] space-y-6 lg:mx-auto lg:max-w-none xl:pl-4">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
                BETALNINGSLÄNK
              </p>
              <h2 className="text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#111111] sm:text-4xl md:text-[44px] lg:text-5xl xl:text-[3.25rem]">
                Skicka en betalningslänk på några sekunder
              </h2>
              <p className="text-base leading-relaxed text-gray-600 md:text-lg md:leading-relaxed">
                Låt kunder betala direkt via sms, DM eller mejl – utan att du behöver bygga en hel
                checkoutupplevelse från grunden. En snabb, trygg och professionell väg till betalt.
              </p>
              <div className="pt-2">
                <AnimatedButton href="/kontakt" variant="primary" size="lg">
                  Utforska betalningslänkar
                </AnimatedButton>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';

/** Mobile: tall hero block. Desktop: true viewport height (no max-height cap — avoids white bands). */
const leftPanelMin =
  'min-h-[min(88svh,720px)] lg:min-h-[100svh]';

export function HostingDnsShowcase() {
  return (
    <section className="relative min-h-[100svh] overflow-x-hidden bg-white text-neutral-900">
      {/*
        Full-bleed split: left visual aligns to viewport left.
        ~55/45 column split — strong left showcase without overpowering copy.
        No vertical padding on the grid: fills 100svh cleanly (no white strips inside the section).
      */}
      <div
        className="grid min-h-[100svh] grid-cols-1 items-stretch gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        {/* Left: edge-aligned cinematic panel — jungle + product */}
        <FadeIn direction="up" className="order-1 min-w-0 self-stretch lg:order-1">
          <div className={`relative w-full overflow-hidden ${leftPanelMin}`}>
            <div
              className="absolute inset-0 bg-cover bg-left bg-no-repeat"
              style={{ backgroundImage: "url('/greenjungle.png')" }}
              role="presentation"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/18 via-neutral-950/10 to-neutral-950/26"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/8 via-transparent to-black/14"
              aria-hidden
            />

            <div
              className={`relative z-10 flex ${leftPanelMin} items-center justify-center px-8 py-12 sm:px-10 md:px-12 md:py-16 lg:px-14 lg:py-20 xl:px-16`}
            >
              <div className="w-full max-w-[600px] md:max-w-[640px] lg:max-w-[min(100%,700px)]">
                <Image
                  src="/dindoman3.png"
                  alt="Koppla domän och DNS"
                  width={1200}
                  height={1200}
                  className="h-auto w-full object-contain drop-shadow-[0_28px_72px_rgba(15,23,42,0.2)]"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  priority
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right: copy — padded to match page rhythm; extra space from the wide visual */}
        <FadeIn
          delay={0.06}
          direction="up"
          className="order-2 flex min-h-[min(88svh,720px)] min-w-0 flex-col justify-center px-6 py-12 md:px-10 md:py-14 lg:min-h-[100svh] lg:py-0 lg:pl-10 lg:pr-20 xl:pl-14 xl:pr-24"
        >
          <div className="mx-auto w-full max-w-xl space-y-8 pb-2 lg:mx-0 lg:max-w-lg xl:max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-neutral-500">
              HOSTING &amp; DNS
            </p>
            <h2 className="text-[2rem] font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-4xl md:text-[2.5rem] lg:text-5xl">
              Koppla din domän utan tekniskt krångel
            </h2>
            <p className="text-base leading-[1.75] text-neutral-600 md:text-lg md:leading-relaxed">
              Vi hjälper dig peka rätt, aktivera SSL och få din domän live – snabbt, tryggt och utan
              onödig komplexitet.
            </p>
            <div className="pt-2">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Utforska hosting
              </AnimatedButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

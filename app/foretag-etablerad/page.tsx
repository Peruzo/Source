'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ForetagEtableradeSections } from '@/components/sections/for-dig/ForetagEtableradeSections';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { etableradeStatistik } from '@/lib/data/for-dig/foretag-etablerade';

export default function ForetagEtableradPage() {
  const reduceMotion = usePrefersReducedMotion();

  // "Boka demo" links to /kontakt, where every other "Boka demo" on the site goes (Hero.tsx).
  // "Se hur det fungerar" scrolls to section 1. globals.css sets scroll-behavior: smooth on *, so the
  // reduced-motion case has to ask for 'instant' explicitly – 'auto' would
  // still follow the CSS and animate.
  const showHow = () => {
    document.getElementById(etableradeStatistik.id)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Hero – unchanged apart from the two buttons: the start page's buttons, with actions. */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
        <video
          src="https://storage.googleapis.com/source-hero-videos/etablerade.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

        <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 text-center">
          <div className="w-full max-w-[720px] space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">FÖRETAG</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
              För etablerade e-handlare
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Skala med teknik, automation och marknadsföring byggd för tillväxt.
            </p>

            {/* Same buttons as the start page hero (components/sections/Hero.tsx), Företag Start and Växa. */}
            <div className="flex gap-4 justify-center">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka demo
              </AnimatedButton>
              <AnimatedButton onClick={showHow} variant="secondary" size="lg" onDark>
                Se hur det fungerar
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      <ForetagEtableradeSections />
    </>
  );
}

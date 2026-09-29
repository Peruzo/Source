'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ForetagVaxaSections } from '@/components/sections/for-dig/ForetagVaxaSections';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { vaxaFrakt } from '@/lib/data/for-dig/foretag-vaxa';

export default function ForetagVaxandePage() {
  const reduceMotion = usePrefersReducedMotion();

  // "Boka demo" links to /kontakt, where every other "Boka demo" on the site goes (Hero.tsx).
  // "Se hur det fungerar" scrolls to section 1. globals.css sets scroll-behavior: smooth on *, so the
  // reduced-motion case has to ask for 'instant' explicitly – 'auto' would
  // still follow the CSS and animate.
  const showHow = () => {
    document.getElementById(vaxaFrakt.id)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Hero – unchanged apart from the two buttons: the start page's buttons, with actions. */}
      <section className="relative w-full overflow-hidden bg-black text-white md:min-h-[100svh]">
        {/* Media band: fixed height on small screens, full-bleed background from md */}
        <div className="relative h-[60svh] min-h-[420px] w-full md:absolute md:inset-0 md:h-auto md:min-h-0">
          <Image
            src="/foretagvaxand.png"
            alt="Företag växande e-handel"
            fill
            priority
            className="object-cover object-[55%_40%] md:object-center"
          />

          <div className="absolute inset-0 bg-black/40 z-0" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 md:relative md:min-h-[100svh]">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              Skala din e-handel smart
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8">
              För företag som redan säljer - och vill växa snabbare med rätt teknik, data och automation.
            </p>

            {/* Same buttons as the start page hero (components/sections/Hero.tsx) and Företag Start. */}
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

      <ForetagVaxaSections />
    </>
  );
}

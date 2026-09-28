'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ForetagStartSections } from '@/components/sections/for-dig/ForetagStartSections';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { foretagProdukter } from '@/lib/data/for-dig/foretag-start';

export default function ForetagNyaPage() {
  const reduceMotion = usePrefersReducedMotion();

  // "Boka demo" links to /kontakt, where every other "Boka demo" on the site goes (Hero.tsx).
  // "Se hur det fungerar" scrolls to section 1. globals.css sets scroll-behavior: smooth on *, so the
  // reduced-motion case has to ask for 'instant' explicitly – 'auto' would
  // still follow the CSS and animate.
  const showHow = () => {
    document.getElementById(foretagProdukter.id)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Hero – unchanged apart from the two buttons: the start page's buttons, with actions. */}
      <section className="relative w-full overflow-hidden bg-black text-white md:min-h-[100svh]">
        {/* Media band: fixed height on small screens, full-bleed background from md */}
        <div className="relative h-[60svh] min-h-[420px] w-full md:absolute md:inset-0 md:h-auto md:min-h-0">
          <Image
            src="/fortegatillvaxt.png"
            alt="Företag start"
            fill
            priority
            className="object-cover object-[50%_30%] md:object-center"
          />

          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 md:relative md:min-h-[100svh]">
          <div className="max-w-[700px]">
            <h1 className="text-white text-4xl md:text-6xl font-semibold">
              Ta ditt företag till nästa nivå
            </h1>

            <p className="text-white/80 mt-4 text-lg">
              Vi hjälper växande företag att skala e-handel med teknik, data och automation.
            </p>

            {/* Same buttons as the start page hero (components/sections/Hero.tsx). */}
            <div className="mt-6 flex justify-center gap-4">
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

      <ForetagStartSections />
    </>
  );
}

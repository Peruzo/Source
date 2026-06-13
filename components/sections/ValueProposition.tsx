'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { PlatformConverge } from '@/components/sections/PlatformConverge';
import { motion } from 'framer-motion';

export function ValueProposition() {
  return (
    <section
      id="next-section"
      className="relative bg-white pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32 lg:pb-40 overflow-visible"
      style={{ minHeight: '100vh' }}
    >
      {/* Behåll #value-proposition för befintliga länkar / SEO */}
      <span
        id="value-proposition"
        className="sr-only"
        aria-hidden
      />

      {/* Content scales in slightly from a smaller size, to feel like it grows
          out of the small hero box, but it now sits directly on the white page.
          Made visible by default for Windows browser compatibility */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 opacity-100">
        <motion.div
          initial={{ y: 0, scale: 1, opacity: 1 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.1, margin: '-200px' }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          // Content is visible by default - animation only enhances
        >
        {/* Layout wrapper – simple vertical spacing on white background */}
        <div className="relative bg-transparent pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24">

        {/* Section intro */}
          <div className="relative max-w-[1200px] mx-auto px-2 md:px-4 lg:px-8">
            <FadeIn className="text-center mb-16 lg:mb-24">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-overline text-teal mb-4"
              >
                INTE BARA EN HEMSIDA
              </motion.p>
              <h2
                className="text-section-title text-black max-w-4xl mx-auto"
                data-droplet-highlight
              >
                En tillväxtpartner med AI som{' '}
                <span className="text-teal">faktiskt förstår</span> din verksamhet.
              </h2>
            </FadeIn>

            {/* Konvergens-effekt: alla funktioner drar ihop sig till en plattform */}
            <PlatformConverge />
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}

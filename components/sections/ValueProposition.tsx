'use client';

import { BentoCard } from '@/components/ui/BentoGrid';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

export function ValueProposition() {
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
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

            {/* Bento Grid Layout - Asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Large card - Main message */}
              <BentoCard
                span={3}
                className="lg:col-span-7 lg:row-span-2 bg-gradient-to-br from-black via-black-secondary to-black-tertiary text-white relative overflow-hidden"
                delay={0}
              >
                {/* TEMP: flicker bisect, remove after diagnosis */}
                {!nofx.glow && <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>}
                
                <div className="relative z-10">
                  <h3 className="text-section-subtitle mb-6 leading-tight">
                    Medan andra rapporterar{' '}
                    <span className="text-gray-400">"du har 100 besökare"</span>,
                  </h3>
                  <p className="text-body-large text-gray-300 mb-8">
                    analyserar vi <span className="text-teal font-semibold">varför bara 5 köper</span>
                    {' '}— och ger dig en konkret plan för vad du ska göra åt det.
                  </p>
                  
                  {/* Example insight card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="glass rounded-xl p-6 border-l-4 border-teal mt-8"
                    data-droplet-highlight
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal mb-1">AI-Insikt</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          "80% lämnar vid checkout. Ta bort obligatorisk kontoskapning → +30% konvertering"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </BentoCard>

              {/* Top right - Animated counter */}
              <BentoCard
                span={2}
                className="lg:col-span-5 bg-teal text-white relative overflow-hidden"
                delay={0.1}
                data-droplet-highlight
              >
                <div className="absolute -top-10 -right-10 text-service-number text-white/5">
                  +
                </div>
                
                <div className="relative z-10">
                  <p className="text-overline text-white/80 mb-3">PROGNOSTISERAD FÖRBÄTTRING</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <AnimatedCounter
                      end={180}
                      suffix="%"
                      className="text-display-number font-bold"
                    />
                  </div>
                  <p className="text-base text-white/90">
                    ökning i försäljning (prognos baserad på branschgenomsnitt efter 6 månader)
                  </p>
                </div>
              </BentoCard>

              {/* Bottom right - Microanalysis features */}
              <BentoCard
                span={2}
                className="lg:col-span-5 bg-beige-light border-none"
                delay={0.2}
              >
                <p className="text-overline text-teal mb-4">MIKROANALYS INKLUDERAR</p>
                <ul className="space-y-3">
                  {[
                    'Exakt kundresa från landing till köp',
                    'Heatmaps på produktsidor',
                    'A/B-test rekommendationer',
                    'Konverteringshinder identifierade',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                      className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </BentoCard>
            </div>

            {/* Bottom statement */}
            <FadeIn delay={0.4} className="text-center mt-16 lg:mt-24">
              <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
                Vi kombinerar AI-driven analys med mänsklig expertis för att ge dig{' '}
                <span className="font-semibold text-black">konkreta, handlingsbara rekommendationer</span>
                {' '}som verkligen gör skillnad.
              </p>
            </FadeIn>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

export function PricingTeaser() {
  const features = [
    { text: 'Design & utveckling' },
    { text: 'AI-analys & insights' },
    { text: 'Hosting & säkerhet' },
    { text: 'Support & uppdateringar' },
  ];

  return (
    <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Background with diagonal split */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-beige-light to-white"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-teal/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal/5 blur-3xl rounded-full"></div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12 lg:mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-overline text-teal mb-4"
            >
              TRANSPARENT PRISSÄTTNING
            </motion.p>
            <h2 className="text-section-title text-black mb-6">
              Prenumeration.<br />
              Inte projektpriser.
            </h2>
          </FadeIn>

          {/* Main pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Price card with glassmorphism */}
            <div className="glass-light rounded-3xl p-8 md:p-12 border border-gray-200 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                {/* Price showcase */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-block"
                  >
                    <p className="text-sm text-gray-600 mb-2">Från</p>
                    <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-black mb-2">
                      2 995<span className="text-4xl md:text-5xl text-gray-500"> kr</span>
                    </p>
                    <p className="text-lg text-gray-600">per månad</p>
                  </motion.div>
                </div>

                {/* Value props */}
                <div className="max-w-2xl mx-auto mb-10">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm md:text-base text-gray-700 mb-8">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Ingen bindningstid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Allt inkluderat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Inga dolda kostnader</span>
                    </div>
                  </div>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-300 shadow-sm"
                      >
                        <div className="w-2 h-2 bg-teal rounded-full flex-shrink-0"></div>
                        <span className="text-sm md:text-base text-gray-700 font-medium">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-center"
                >
                  <AnimatedButton href="/priser" variant="primary" size="lg">
                    Jämför alla planer
                  </AnimatedButton>
                </motion.div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
              className="absolute -top-6 -right-6 bg-teal text-white px-6 py-3 rounded-full font-semibold shadow-lg hidden md:block"
            >
              Mest valda: Growth
            </motion.div>
          </motion.div>

          {/* Additional info */}
          <FadeIn delay={0.5} className="text-center mt-12">
            <p className="text-gray-600 text-sm md:text-base">
              * Alla priser exklusive moms. Uppgradera eller nedgradera när som helst.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

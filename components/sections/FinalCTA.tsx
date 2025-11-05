'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 lg:py-56 bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading with reveal animation */}
          <div className="overflow-hidden mb-12">
            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Redo att{' '}
              <motion.span
                className="text-teal inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 191, 166, 0.5)',
                    '0 0 40px rgba(0, 191, 166, 0.7)',
                    '0 0 20px rgba(0, 191, 166, 0.5)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                växa
              </motion.span>
              ?
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-body-large text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Boka en kostnadsfri demo och upptäck hur Source kan transformera din online-närvaro med AI-driven tillväxt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <AnimatedButton href="/kontakt" variant="primary" size="lg">
              Boka en demo
            </AnimatedButton>
            <AnimatedButton href="/priser" variant="secondary" size="lg">
              Se priser
            </AnimatedButton>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 pt-16 border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-teal mb-2">24h</p>
                <p className="text-sm text-gray-400">Svarstid</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal mb-2">Ingen</p>
                <p className="text-sm text-gray-400">Bindningstid</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal mb-2">100%</p>
                <p className="text-sm text-gray-400">Transparent</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

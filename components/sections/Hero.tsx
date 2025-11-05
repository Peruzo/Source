'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { SplitScreenComparison } from '@/components/ui/SplitScreenComparison';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.99]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh noise-overlay"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 py-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Main heading with staggered animation */}
            <div className="mb-8">
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="text-hero text-white"
                style={{
                  lineHeight: '1.1',
                  paddingTop: '0.1em',
                  marginBottom: '-0.1em'
                }}
              >
                VÄXA ONLINE.
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-12">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.h1
                  className="text-hero-sub text-teal leading-none"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(0, 191, 166, 0.3)',
                      '0 0 40px rgba(0, 191, 166, 0.4)',
                      '0 0 20px rgba(0, 191, 166, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  VERKLIGEN.
                </motion.h1>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-body-large text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              AI som analyserar din verksamhet och ger konkreta råd—inte bara
              rapporter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka demo
              </AnimatedButton>
              <AnimatedButton href="#value-proposition" variant="secondary" size="lg">
                Se hur det fungerar ↓
              </AnimatedButton>
            </motion.div>
          </div>

          {/* Visual - Split Screen Comparison */}
          <div className="hidden lg:block relative">
            <SplitScreenComparison />
            {/* Subtle ambient glow */}
            <div className="absolute -inset-6 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 rounded-3xl blur-2xl -z-10 opacity-40"></div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-center justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full"
            />
          </div>
          <span className="text-xs font-medium">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

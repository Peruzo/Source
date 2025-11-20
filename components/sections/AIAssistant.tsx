'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function AIAssistant() {
  return (
    <section className="py-20 md:py-32 lg:py-40 bg-white relative overflow-hidden">
      {/* Subtle background decoration - very minimal */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal/3 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 md:px-10 lg:px-20">
        <FadeIn className="text-center">
          {/* Icon/Visual - Minimal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-teal/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-teal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-section-title text-black mb-6"
          >
            Säg hej till din personliga AI-assistent
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-body-large text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Din personliga, finansiella assistent som hjälper dig spara, budgetera och investera smartare.
          </motion.p>

          {/* Description - Minimal */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-body text-gray-500 mb-12 max-w-xl mx-auto"
          >
            Få intelligenta rekommendationer baserat på dina vanor och mål. 
            Allt för att du ska kunna fatta bättre ekonomiska beslut.
          </motion.p>

          {/* CTA Button - Simple and clean */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              href="/tjanster"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal text-white font-semibold rounded-full hover:bg-teal-hover transition-colors duration-200 text-base md:text-lg"
            >
              Kom igång
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}



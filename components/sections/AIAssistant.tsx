'use client';

import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function AIAssistant() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Show typing state shortly on first load
    setIsTyping(true);
    const firstTimeout = setTimeout(() => setIsTyping(false), 1500);

    // Then repeat the typing animation periodically
    let repeatTimeout: NodeJS.Timeout | null = null;
    const intervalId = setInterval(() => {
      setIsTyping(true);
      repeatTimeout = setTimeout(() => setIsTyping(false), 1500);
    }, 8000);

    return () => {
      clearTimeout(firstTimeout);
      if (repeatTimeout) clearTimeout(repeatTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white relative overflow-hidden">
      {/* Very subtle background like Lunar hero */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal/5 via-white to-white" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 lg:px-20">
        <FadeIn className="flex flex-col items-center text-center gap-10">
          {/* Three animated AI bubbles – base float + periodic typing, with smooth crossfade */}
          <div className="relative flex items-center justify-center h-32 md:h-40">
            {/* Typing/loading state */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: isTyping ? 1 : 0, scale: isTyping ? 1 : 0.96, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center gap-3 md:gap-4"
            >
              <span className="ai-bubble-loading ai-bubble-loading-1 inline-block h-4 w-4 md:h-5 md:w-5 rounded-full bg-teal" />
              <span className="ai-bubble-loading ai-bubble-loading-2 inline-block h-4 w-4 md:h-5 md:w-5 rounded-full bg-teal" />
              <span className="ai-bubble-loading ai-bubble-loading-3 inline-block h-4 w-4 md:h-5 md:w-5 rounded-full bg-teal" />
            </motion.div>

            {/* Floating bubbles state */}
            <motion.div
              initial={{ opacity: 1, scale: 1, y: 24 }}
              whileInView={{ opacity: isTyping ? 0 : 1, scale: isTyping ? 0.96 : 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative h-32 w-32 md:h-40 md:w-40 flex items-center justify-center"
            >
              {/* Center bubble */}
              <div className="ai-bubble ai-bubble-1 relative z-10 h-16 w-16 md:h-24 md:w-24 rounded-full bg-teal shadow-2xl shadow-teal/40" />

              {/* Left bubble */}
              <div className="ai-bubble ai-bubble-2 absolute left-0 bottom-2 h-8 w-8 md:h-12 md:w-12 rounded-full bg-teal-light shadow-xl shadow-teal/20" />

              {/* Right bubble */}
              <div className="ai-bubble ai-bubble-3 absolute right-0 top-2 h-10 w-10 md:h-14 md:w-14 rounded-full bg-emerald-400 shadow-xl shadow-emerald-400/40" />
            </motion.div>
          </div>

          {/* Text content */}
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="text-overline text-teal"
            >
              SOURCE AI ASSISTENT
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="text-section-title text-black"
            >
              Säg hej till Source AI – din digitala assistent i vardagen.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-body-large text-gray-600"
            >
              En AI-assistent som förstår dina processer, bokningar och kundresor – och hjälper dig ta
              smartare beslut på några sekunder istället för timmar.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-body text-gray-500"
            >
              Ställ en fråga om dina siffror, be om en rapport eller få ett konkret nästa steg – Source AI
              går igenom datan åt dig och presenterar ett begripligt svar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/ai-assistent"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal text-white font-semibold rounded-full hover:bg-teal-hover transition-colors duration-200 text-base md:text-lg"
              >
                Utforska Source AI
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

              <p className="text-sm text-gray-500">
                Beta-version – perfekt för dig som vill ligga steget före.
              </p>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion, useReducedMotion } from 'framer-motion';

export function AIAgentShowcase() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Vid reducerad rörelse: stoppa videon om webbläsaren hann starta den innan
  // hydreringen, så att postern och kontrollerna gäller.
  useEffect(() => {
    if (reduceMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [reduceMotion]);

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        {/* Top label and heading */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal-dark mb-4"
          >
            FÖR ALLA VERKSAMHETER
          </motion.p>
          <h2 className="text-section-title text-black mb-4">
            Ett smartare sätt att driva din verksamhet – oavsett vad du gör.
          </h2>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            Source är byggt för alla typer av företag, oavsett bransch eller
            teknisk vana. Vår vision är att göra det lika enkelt att driva och
            utveckla en verksamhet digitalt som att skicka ett sms.
          </p>
        </FadeIn>

        {/* Layout: video + vem Source är byggt för */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Video side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-[16/9] shadow-xl border border-gray-200">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/Aiagentvid.mp4"
                poster="/Aiagentvid-poster.webp"
                preload="metadata"
                playsInline
                muted
                loop
                autoPlay={!reduceMotion}
                controls={reduceMotion === true}
              />

              {/* Gradient overlay for readability / style */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Subtle badge on video – dold vid reducerad rörelse så den inte täcker kontrollerna */}
              {!reduceMotion && (
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/90 backdrop-blur-sm text-xs md:text-sm font-medium text-gray-900 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI-agenten i Source, i praktiken.
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6">
              <p className="text-sm font-semibold text-teal-dark mb-1">
                Byggd för företag i alla storlekar och branscher.
              </p>
              <p className="text-sm text-gray-600">
                Source är gjort för dig som vill utveckla din verksamhet
                digitalt utan att drunkna i teknik – oavsett om du precis har
                börjat eller redan är etablerad.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

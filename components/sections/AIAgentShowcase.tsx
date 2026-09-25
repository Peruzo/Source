'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

// Hämtat från det sajten redan säger om AI:n (FAQ "AI & Automatisering" och
// AIAssistant). Inga siffror, resultat eller kundnamn.
const capabilities = [
  'Analyserar din data och tar fram rapporter med insikter och rekommendationer.',
  'Svarar på frågor om dina siffror och föreslår ett konkret nästa steg.',
  'Skriver texter och föreslår innehåll och design för din sajt.',
  'Automatiserar återkommande uppgifter som e-post, lagerstatus och rapporter.',
];

export function AIAgentShowcase() {
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
            Börja hantera din e-handel på ett smart sätt – precis som andra som
            valt Source.
          </h2>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            Vi bygger e-handel för alla – oavsett bransch eller teknisk nivå.
            Vår vision är att göra handel online lika enkel och naturlig som att
            skicka ett sms.
          </p>
        </FadeIn>

        {/* Layout: video + vad AI-agenten gör */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
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
                className="w-full h-full object-cover"
                src="/Aiagentvid.mp4"
                poster="/Aiagentvid-poster.webp"
                preload="metadata"
                playsInline
                autoPlay
                loop
                muted
              />

              {/* Gradient overlay for readability / style */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Subtle badge on video */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/90 backdrop-blur-sm text-xs md:text-sm font-medium text-gray-900 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI-agenten som gör e-handel lika enkel som sms.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6">
              <p className="text-sm font-semibold text-teal-dark mb-1">
                Byggd för entreprenörer, e-handlare och lokala verksamheter.
              </p>
              <p className="text-sm text-gray-600">
                Source är gjort för alla som vill sälja online utan att drunkna
                i teknik – från första produkt till skalbar e-handel.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <h3 className="text-base md:text-lg font-semibold text-black mb-4">
                Det här gör AI-agenten
              </h3>
              <ul className="space-y-3">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex gap-3 text-sm md:text-base text-gray-800 leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-dark"
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



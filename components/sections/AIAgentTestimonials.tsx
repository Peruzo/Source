 'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Vi trodde att e-handel skulle vara krångligt – med Source känns det bokstavligen lika enkelt som att skicka ett sms.',
    name: 'Emma, grundare av en lokal butik',
  },
  {
    quote:
      'Vi är inga tekniker. Ändå lanserade vi vår shop på veckor istället för månader, och allt bara fungerar.',
    name: 'Johan, e-handelsansvarig',
  },
  {
    quote:
      'Source gör att hela teamet kan jobba med e-handel utan att fastna i tekniska detaljer.',
    name: 'Sara, marknadschef',
  },
];

export function AIAgentTestimonials() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        {/* Top label and heading */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal mb-4"
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

        {/* Layout: video + testimonials */}
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

          {/* Testimonials side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Summary / social proof header */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 md:p-6">
              <p className="text-sm font-semibold text-teal mb-1">
                Byggd för entreprenörer, e-handlare och lokala verksamheter.
              </p>
              <p className="text-sm text-gray-600">
                Source är gjort för alla som vill sälja online utan att drunkna
                i teknik – från första produkt till skalbar e-handel.
              </p>
            </div>

            {/* Individual quotes */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.figure
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]"
                >
                  <blockquote className="text-sm md:text-base text-gray-800 leading-relaxed">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-3 text-xs md:text-sm font-medium text-gray-500">
                    {testimonial.name}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



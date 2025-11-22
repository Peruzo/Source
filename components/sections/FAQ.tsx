'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

const faqs = [
  {
    question: 'Vad är Source?',
    answer:
      'Source är en komplett plattform för hemsidor, e-handel och kundhantering. Allt du behöver för drift, betalningar, marknadsföring och statistik finns samlat på ett ställe.',
  },
  {
    question: 'Hur fungerar plattformen?',
    answer:
      'Du loggar in i vår kundportal där du hanterar produkter, kunder, beställningar, betalningar och marknadsföring. Vi sköter tekniken i bakgrunden så du slipper.',
  },
  {
    question: 'Vem kan använda Source?',
    answer:
      'Alla företag som behöver en hemsida, webshop eller en modern kundportal — från små lokala verksamheter till växande e-handelsbolag.',
  },
  {
    question: 'Behöver jag en egen hemsida?',
    answer:
      'Nej. Vi bygger hemsidan åt dig och kopplar den direkt till din kundportal. Har du redan en hemsida kan vi antingen förbättra den eller migrera den.',
  },
  {
    question: 'Hur snabbt kommer jag igång?',
    answer:
      'De flesta kommer igång samma dag. En ny hemsida kan lanseras inom några dagar beroende på omfattning.',
  },
  {
    question: 'Behövs teknisk kunskap?',
    answer:
      'Nej. Plattformen är byggd för att vara enkel. Du får ett färdigt system där du bara sköter innehåll och val — vi tar hand om allt tekniskt.',
  },
  {
    question: 'Bygger ni hemsidor åt mig?',
    answer:
      'Ja. Vi designar och utvecklar hela din hemsida baserat på dina behov, och kopplar den direkt till din e-handel och kundportal.',
  },
  {
    question: 'Kan ni flytta min nuvarande webbshop?',
    answer:
      'Ja. Vi kan migrera produkter, innehåll och struktur från din nuvarande plattform till Source utan att du tappar något.',
  },
  {
    question: 'Hur funkar betalningar via Stripe?',
    answer:
      'Stripe sköter alla kortbetalningar, utbetalningar och kvitton. Du får dem automatiskt kopplade till din statistik, ekonomi och kunddata i Source.',
  },
  {
    question: 'Vilka betalmetoder stödjer ni?',
    answer:
      'Kortbetalningar, Apple Pay, Google Pay, Klarna, faktura, Swish, prenumerationer och fler betalalternativ baserat på Stripes utbud.',
  },
];

export function FAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <FadeIn className="text-center mb-12 md:mb-16">
            <h2 className="text-section-title text-black mb-8 md:mb-10">
              Få svar på dina frågor.
            </h2>
            
            {/* Action buttons - styled like Lunar */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
              <AnimatedButton
                href="/kontakt"
                variant="primary"
                size="md"
              >
                Kontakta oss
              </AnimatedButton>
              <AnimatedButton
                href="/hjalp"
                variant="ghost"
                size="md"
                className="!bg-white !text-black !border-black hover:!bg-gray-50 hover:!border-black hover:!text-black"
              >
                Se alla frågor och svar
              </AnimatedButton>
            </div>
          </FadeIn>

          {/* FAQ items */}
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:border-teal/30 transition-colors duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full py-6 px-6 md:px-8 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <span className="font-semibold text-base md:text-lg text-black pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl text-teal flex-shrink-0 group-hover:text-teal-hover"
                  >
                    ↓
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 text-gray-700 leading-relaxed text-base md:text-lg">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


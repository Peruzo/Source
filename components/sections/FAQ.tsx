'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

const faqs = [
  {
    question: 'Vad är Source?',
    answer:
      'En plattform där butik, betalningar, fakturor, kunder, frakt och bokföring samlas i en kundportal. Vilka delar som ingår beror på paketet.',
  },
  {
    question: 'Hur fungerar plattformen?',
    answer:
      'Du loggar in i kundportalen och sköter produkter, kunder, betalningar, fakturor och kampanjer där. Din hemsida hämtar produkterna och tar betalt via kundportalen.',
  },
  {
    question: 'Vem kan använda Source?',
    answer:
      'Alla företag som behöver en hemsida, webshop eller en modern kundportal — från små lokala verksamheter till växande e-handelsbolag.',
  },
  {
    question: 'Hur går onboardingen till?',
    answer:
      'Du väljer paket och skapar ett konto. Sedan går vi igenom din verksamhet tillsammans och du kopplar ditt Stripe-konto. Därefter bygger vi din hemsida eller integrerar den du redan har mot kundportalen.',
  },
  {
    question: 'Hur snabbt kommer jag igång?',
    answer:
      'Efter onboardingen har du din nya hemsida, eller din befintliga hemsida integrerad mot kundportalen, inom 24 timmar.',
  },
  {
    question: 'Kan jag behålla min hemsida?',
    answer:
      'Ja. Har du redan en hemsida integrerar vi den mot kundportalen. Har du ingen bygger vi en åt dig.',
  },
  {
    question: 'Behövs teknisk kunskap?',
    answer:
      'Nej. Plattformen är byggd för att vara enkel. Du får ett färdigt system där du bara sköter innehåll och val — vi tar hand om allt tekniskt.',
  },
  {
    question: 'Vad ingår i paketen?',
    answer:
      'Alla paket har produkter och lager, kortbetalningar, betalningslänk, fakturor, prenumerationer, kampanjkoder, kundregister och support. Growth lägger bland annat till frakt med PostNord, bokföring, bokningar och AI-insikter. Enterprise lägger till statistik, kampanjstudio och annonser som vi sköter åt dig. Hela listan finns på prissidan.',
  },
  {
    question: 'Hur funkar betalningar via Stripe?',
    answer:
      'Du kopplar ditt eget Stripe-konto i onboardingen. Kortbetalningarna går direkt till det kontot, och i kundportalen ser du dem och kan betala tillbaka.',
  },
  {
    question: 'Vilka betalmetoder stödjer ni?',
    answer:
      'Kassan tar betalt med kort via Stripe, och pengarna går till ditt eget Stripe-konto. Du kan också ta betalt med betalningslänk, faktura och prenumeration.',
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
                className="min-h-11"
              >
                Kontakta oss
              </AnimatedButton>
              <AnimatedButton
                href="/hjalp"
                variant="ghost"
                size="md"
                className="min-h-11 !bg-white !text-black !border-black hover:!bg-gray-50 hover:!border-black hover:!text-black"
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


'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Hur lång tid tar det?',
    answer:
      'Typisk tidslinje är 4-8 veckor från start till lansering, beroende på komplexitet.',
  },
  {
    question: 'Vad kostar det?',
    answer: 'Från 2,995 kr/mån beroende på paket. Se vår prissida för detaljer.',
  },
  {
    question: 'Kan jag se exempel?',
    answer: 'Absolut! Vi har flera mockups i vår portfolio.',
  },
  {
    question: 'Jobbar ni med min bransch?',
    answer:
      'Vi jobbar med alla branscher. Vår AI anpassar lösningen efter din specifika verksamhet.',
  },
  {
    question: 'Hur fungerar supporten?',
    answer: '24/7 e-post, chatt för Growth+, prioritet för Enterprise.',
  },
];

export default function ContactPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero – split layout (Fortnox + Revolut) */}
      <section className="min-h-[480px] md:min-h-[520px] flex flex-col lg:flex-row bg-[#0d3b2c] text-white overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-20 py-16 md:py-20 lg:py-24 order-2 lg:order-1">
          <p className="text-sm font-medium tracking-wider uppercase text-white/80 mb-4">
            Kontakta oss
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-xl">
            Vi finns här för dig
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg mb-8 leading-relaxed">
            Oavsett om du vill skicka ett meddelande eller bläddra i vårt hjälpcenter – vi svarar inom 24 timmar.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center px-8 py-4 bg-white text-[#0d3b2c] font-semibold rounded-full hover:bg-white/95 transition-colors"
            >
              Prata med oss
            </button>
            <Link
              href="/hjalp"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Till hjälpcentret
            </Link>
          </div>
        </div>
        <div className="flex-1 relative min-h-[280px] lg:min-h-full order-1 lg:order-2">
          <div className="absolute inset-0">
            <Image
              src="/youngwomensofa.png"
              alt="Kontakta oss"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d3b2c] via-[#0d3b2c]/80 to-transparent lg:from-[#0d3b2c] lg:via-[#0d3b2c]/60 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* 3-kort grid (Fortnox) */}
      <section className="py-16 md:py-24 bg-[#F5F0EB] relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <article className="bg-white rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-black mb-3">
                Skicka ett meddelande
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Berätta om ditt projekt och dina behov. Vi återkommer inom 24 timmar med ett personligt svar.
              </p>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center text-teal font-semibold hover:text-teal-hover transition-colors group"
              >
                Skicka meddelande
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </article>

            <article className="bg-white rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-black mb-3">
                Behöver du hjälp?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Har du redan ett konto? Logga in i kundportalen. Eller ring oss på{' '}
                <a href="tel:+46733221212" className="text-teal font-medium hover:text-teal-hover">
                  +46 73 322 12 12
                </a>{' '}
                vardagar 09–17.
              </p>
              <Link
                href="/onboarding/login"
                className="inline-flex items-center text-teal font-semibold hover:text-teal-hover transition-colors group"
              >
                Logga in och prata med oss
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </article>

            <article className="bg-white rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-black mb-3">
                Vanliga frågor
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Hitta svar på vanliga frågor om Source, priser och hur vi jobbar.
              </p>
              <Link
                href="/hjalp"
                className="inline-flex items-center text-teal font-semibold hover:text-teal-hover transition-colors group"
              >
                Till vår hjälpsida
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </article>
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 md:py-24 bg-white">
        <Container size="md">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Skicka ett meddelande
            </h2>
            <p className="text-gray-600 mb-8">
              Eller{' '}
              <a href="mailto:help@source.com" className="text-teal hover:text-teal-hover font-medium">
                maila oss direkt
              </a>
            </p>
            <div className="bg-[#FAFAFA] rounded-2xl p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Press & Partners (Fortnox) */}
      <section className="py-16 md:py-24 bg-[#F4E8D8]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-12">
              För press och samarbeten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Presskontakt</h3>
                <p className="text-gray-700 mb-2">
                  Mejla{' '}
                  <a href="mailto:press@source.com" className="text-teal font-medium hover:text-teal-hover">
                    press@source.com
                  </a>
                </p>
                <Link href="/om-oss" className="text-teal font-semibold hover:text-teal-hover inline-flex items-center group">
                  Läs mer om oss
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Partnerskap</h3>
                <p className="text-gray-700 mb-2">
                  Mejla{' '}
                  <a href="mailto:partners@source.com" className="text-teal font-medium hover:text-teal-hover">
                    partners@source.com
                  </a>
                </p>
                <Link href="/tjanster" className="text-teal font-semibold hover:text-teal-hover inline-flex items-center group">
                  Se våra tjänster
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion (Revolut) */}
      <section className="py-16 md:py-24 bg-white">
        <Container size="md">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-wider uppercase text-gray-500 mb-2">
              Snabbåtkomst
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-12">
              Behöver du hjälp? Så här gör du
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-teal/30 transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors group"
                    aria-expanded={expandedFaq === index}
                  >
                    <span className="font-semibold text-black pr-4">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-teal flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust / Löften (Revolut-mörk) */}
      <section className="py-16 md:py-24 bg-[#121212] text-white">
        <Container size="md">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Vårt löfte till dig
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-bold text-teal mb-2">✓ Svar inom 24 timmar</h3>
              <p className="text-white/70">På alla förfrågningar</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-teal mb-2">✓ Inga säljsnack</h3>
              <p className="text-white/70">Vi lyssnar först, säljer sen</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-teal mb-2">✓ Transparent rådgivning</h3>
              <p className="text-white/70">Ärlig om vad som passar dig</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-teal mb-2">✓ Ingen press</h3>
              <p className="text-white/70">Bestäm i din egen takt</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

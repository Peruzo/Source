'use client';

import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    id: 'design',
    number: '01',
    title: 'Design & Utveckling',
    intro:
      'Inte mallar. Inte "gör själv". AI-driven design anpassad för din bransch och målgrupp.',
    included: [
      'Responsiv design (mobil-först)',
      'E-handelsintegration',
      'Betalningslösningar',
      'SEO-optimering',
      'Prestandaoptimering',
    ],
    result: 'Professionell design till en bråkdel av byråpriset.',
  },
  {
    id: 'ecommerce',
    number: '02',
    title: 'E-handel',
    intro: 'Komplett e-handelslösning med allt du behöver för att sälja online.',
    included: [
      'Produkthantering',
      'Inventory management',
      'Betalningar (Stripe)',
      'Fraktintegration',
      'Kundhantering',
      'Orderhantering',
    ],
    result: 'Ditt team har erfarenhet från betalningsbranschen.',
  },
  {
    id: 'ai-analytics',
    number: '03',
    title: 'AI-Driven Analys',
    subtitle: '★ Vår huvudsakliga skillnad',
    intro: 'Detta är inte Google Analytics.',
    included: [
      'Automatiserade förbättringsförslag baserat på användarbeteende',
      'Identifiering av konverteringsbarriärer och friktionspunkter',
      'Optimering av produktpresentation genom visuell analys',
      'Personalisering av användarupplevelser baserat på preferenser',
      'Realtids-A/B-testning och kontinuerlig optimering',
    ],
    result: 'AI ger konkreta förslag som är bevisat att göra skillnad.',
    featured: true,
  },
  {
    id: 'payments',
    number: '04',
    title: 'Betalningar & Hosting',
    intro: 'Allt ingår. Inga dolda kostnader. Inga tredjeparter.',
    included: [
      'Stripe-integration',
      'Flera valutor',
      'Prenumerationer',
      'Refunds & rapporter',
      'Render/Vercel hosting',
      'Auto-scaling',
      'SSL-certifikat',
      'CDN',
      'Backup dagligen',
    ],
    result: 'Du behöver inte hantera tekniska detaljer.',
  },
  {
    id: 'support',
    number: '05',
    title: 'Support & Utveckling',
    intro: 'Vi växer med dig.',
    included: [
      'Chatt i kundportalen',
      'E-post support',
      'Video-möten (beroende på plan)',
      'Feedback-driven utveckling',
      'Nya funktioner automatiskt',
      'Säkerhetsuppdateringar',
      'Prestandaförbättringar',
      'Feature requests',
    ],
    result:
      'Alla tre grundare kommer från kundservice-branschen. Vi förstår att hjälpa kunder.',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-32 md:py-40 gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay"></div>
        
        <Container>
          <FadeIn className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-overline text-teal mb-6"
            >
              VÅRA TJÄNSTER
            </motion.p>
            <h1 className="text-section-title text-white mb-8">
              Inte bara en tjänst.<br />
              <span className="text-teal">En komplett lösning.</span>
            </h1>
            <p className="text-body-large text-gray-300">
              Design • E-handel • AI-analys • Hosting • Support
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Service Sections */}
      {services.map((service, index) => {
        const bgColor = service.featured
          ? 'bg-black'
          : index % 2 === 0
          ? 'bg-white'
          : 'bg-beige-light';
        const textColor = service.featured ? 'text-white' : 'text-black';
        const subtextColor = service.featured ? 'text-gray-300' : 'text-gray-700';

        return (
          <section
            key={service.id}
            id={service.id}
            className={`py-20 md:py-32 ${bgColor} ${
              service.featured ? 'relative overflow-hidden' : ''
            }`}
          >
            {service.featured && (
              <>
                <div className="absolute inset-0 noise-overlay"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>
              </>
            )}
            
            <Container>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  service.featured ? 'lg:grid-cols-1 max-w-5xl mx-auto text-center' : ''
                }`}
              >
                {/* Text Content */}
                <div className={service.featured ? '' : 'relative'}>
                  {!service.featured && (
                    <div className="absolute -top-8 -left-4 lg:-left-8 text-service-number text-black/5">
                      {service.number}
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="relative z-10"
                  >
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${textColor} mb-4`}>
                      {service.title}
                    </h2>

                    {service.subtitle && (
                      <p className="text-xl text-teal mb-6">{service.subtitle}</p>
                    )}

                    {service.featured && (
                      <div className="mb-10 py-8">
                        <p className="text-2xl md:text-3xl text-gray-400 mb-4">
                          "Du har 100 besökare"
                        </p>
                        <p className="text-lg text-gray-500 mb-4">vs</p>
                        <p className="text-2xl md:text-3xl text-teal font-semibold">
                          "Baserat på din bransch bör du fokusera på X för att nå 500
                          besökare inom 3 månader"
                        </p>
                      </div>
                    )}

                    <p className={`text-lg md:text-xl ${subtextColor} leading-relaxed mb-8`}>
                      {service.intro}
                    </p>

                    <h3 className={`text-xl font-semibold ${textColor} mb-6`}>
                      {service.featured ? 'Mikroanalys inkluderar:' : 'Vad ingår:'}
                    </h3>
                    <ul className={`space-y-4 mb-8 ${subtextColor}`}>
                      {service.included.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-teal mt-1 text-xl">•</span>
                          <span className="text-base md:text-lg">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {service.featured && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="glass rounded-2xl p-6 md:p-8 border-l-4 border-teal text-left max-w-3xl mx-auto"
                      >
                        <p className="text-sm font-semibold text-teal mb-3 uppercase tracking-wide">
                          Exempel
                        </p>
                        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                          "Användare lämnar checkout vid steg 2. Förslag: Minska
                          formulärfält från 8 till 4. Förväntat resultat: +25%
                          konvertering"
                        </p>
                      </motion.div>
                    )}

                    <p
                      className={`mt-8 text-base md:text-lg ${
                        service.featured ? 'text-gray-400' : 'text-gray-600'
                      } italic`}
                    >
                      {service.result}
                    </p>
                  </motion.div>
                </div>

                {/* Visual Placeholder */}
                {!service.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex items-center justify-center"
                  >
                    <div className="glass rounded-3xl aspect-square w-full max-w-md p-12 border border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-8xl font-bold text-black/5 mb-4">{service.number}</p>
                        <p className="text-gray-400 text-sm">{service.title}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Package Overview */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <Container size="md">
          <FadeIn>
            <h2 className="text-section-subtitle text-black text-center mb-16">
              Allt inkluderas beroende på ditt paket
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', included: ['Design', 'Hosting', 'Support'] },
              { name: 'Growth', included: ['+ E-handel', '+ AI-Basic'], highlight: true },
              { name: 'Enterprise', included: ['+ AI-Advanced', '+ Prioritet'] },
            ].map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`rounded-2xl p-8 ${
                  pkg.highlight
                    ? 'bg-teal text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <ul className="space-y-2">
                  {pkg.included.map((item) => (
                    <li key={item} className="text-sm md:text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center mt-12">
            <Link
              href="/priser"
              className="inline-flex items-center gap-2 text-teal hover:text-teal-hover font-semibold text-lg transition-colors"
            >
              Se detaljerade priser
              <span>→</span>
            </Link>
          </FadeIn>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 bg-black text-white">
        <Container>
          <FadeIn className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10">
              Vill veta mer?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka en demo
              </AnimatedButton>
              <AnimatedButton href="/priser" variant="secondary" size="lg">
                Se priser
              </AnimatedButton>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

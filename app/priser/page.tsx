'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

const pricingPlans = [
  {
    planId: 'bas',
    name: 'Core',
    price: '799',
    description: 'Perfekt för att komma igång med din online-närvaro',
    features: [
      'Responsiv design',
      'Upp till 5 sidor',
      'Betalningar, faktuering, prenumerationer',
      'Support',
      'Rapporter för försäljning',
    ],
    limitations: undefined,
    cta: 'Kom igång',
    href: '/onboarding/login',
    featured: false,
  },
  {
    planId: 'growth',
    name: 'Growth',
    price: '1499',
    badge: 'Mest valda',
    description: 'Komplett lösning för att växa din verksamhet online',
    features: [
      'Allt i Bas, plus:',
      'Obegränsat antal sidor och design.',
      'Rapporter',
      'Kontaktformulär på hemsida till kundportal',
      'AI agent för din hemsida',
      'Marknadsföring',
      'Betalningslänk',
      'Kampanjer',
      'Logistik',
      'Integrationer',
      'Bokningssytem för alla bransher',
      'Produkthantering',
      'Max 5 användare',
    ],
    cta: 'Boka demo',
    href: '/onboarding/login',
    featured: true,
  },
  {
    planId: 'enterprise',
    name: 'Enterprise',
    price: '3499',
    description: 'För företag som behöver avancerade lösningar',
    features: [
      'Allt i Growth, plus:',
      'AI insikter',
      'Inventarier hantering',
      '24/7 support',
      'Avancerad Statisk och analys för tillväxtmöjligheter',
      'Bokföring verktyg',
      'Max 10 användare',
    ],
    cta: 'Kontakta oss',
    href: '/onboarding/login',
    featured: false,
  },
];

const faqs = [
  {
    question: 'Kan jag byta plan?',
    answer:
      'Ja, du kan uppgradera eller nedgradera när som helst. Ändringar träder i kraft från nästa faktureringscykel. Inga avgifter för ändringar.',
  },
  {
    question: 'Vad händer om jag säger upp?',
    answer:
      'Ingen bindningstid. Säg upp när som helst med en månads uppsägningstid. Du behåller full åtkomst under uppsägningstiden. Vi kan exportera din data vid behov.',
  },
  {
    question: 'Finns det bindningstid?',
    answer:
      'Nej. Alla planer är månad till månad. Vi tror på att förtjäna din verksamhet varje månad.',
  },
  {
    question: 'Vad ingår i AI-analys?',
    answer:
      'Basic: Besökarbeteende, heatmaps, konverteringsspårning, veckovisa insikter. Advanced: + Prediktiv analys, anpassade rekommendationer, A/B-testning, dagliga insikter, API-åtkomst.',
  },
  {
    question: 'Hur fungerar support?',
    answer:
      'E-post: Alla planer (24h för Starter, 12h för Growth, 2h för Enterprise). Chatt: Growth och Enterprise (i kundportalen). Video-möten: Endast Enterprise (månatliga schemalagda samtal).',
  },
];

import { setStoredPlanId } from '@/lib/onboarding/selected-plan';

export default function PricingPage() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [submittingPlanId, setSubmittingPlanId] = useState<string | null>(null);

  const goToOnboarding = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Bug 3 race-condition fix: blockera multipla parallella klick.
    // Utan denna guard kan flera snabba klick (<10ms) skapa flera olika
    // UUIDs eftersom första cookien inte hunnit sättas. Resultat: 3-6
    // inkommande-rader för EN onboarding i admin-portalen.
    if (submittingPlanId !== null) return;
    setSubmittingPlanId(planId);

    // Bevarad: lokal storage för befintlig getStoredPlanId()-läsning
    setStoredPlanId(planId);

    // Robusthet: skicka package_selected-event till admin-portalen innan login.
    // Detta garanterar att admin-portalen ALLTID har paket-valet registrerat
    // även om kunden avbryter Stripe-flödet halvvägs. Best effort —
    // navigation fortsätter oavsett resultat.
    try {
      await fetch('/api/onboarding/package-selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
    } catch (err) {
      console.error('[Pricing] Failed to register package selection:', err);
    }

    // router.push() triggar navigation — ingen reset av submittingPlanId
    // behövs eftersom komponenten unmountas. Om navigation failade av
    // någon anledning skulle vi behöva resetta, men det är extremt sällsynt
    // i Next.js client-side navigation.
    router.push(`/onboarding/login?plan=${encodeURIComponent(planId)}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay"></div>
        
        <Container>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <FadeIn>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-overline text-teal mb-6"
              >
                PRISSÄTTNING
              </motion.p>
              <h1 className="text-section-title text-white mb-8">
                Transparent.<br />
                Förutsägbart.<br />
                <span className="text-teal">Inga överraskningar.</span>
              </h1>
              <p className="text-body-large text-gray-300 mb-8">
                Prenumeration istället för projektpriser. Ingen bindningstid.
              </p>
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-teal"
              >
                Från 799 kr
              </motion.p>
              <p className="text-xl text-gray-400 mt-4">per månad</p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative rounded-3xl p-8 md:p-10 border transition-all duration-300 ${
                  plan.featured
                    ? 'bg-gradient-to-br from-teal/5 to-teal/10 border-teal border-2 md:scale-105 shadow-xl'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg"
                  >
                    {plan.badge}
                  </motion.div>
                )}

                <h2 className="text-3xl font-bold text-black mb-3">{plan.name}</h2>
                <div className="mb-6">
                  <p className="text-5xl md:text-6xl font-bold text-teal">
                    {plan.price.includes('Pris på förfrågan') ? (
                      <span className="text-2xl md:text-3xl">{plan.price}</span>
                    ) : plan.price.includes('Från') ? (
                      <>
                        <span className="text-2xl">Från </span>
                        {plan.price.replace('Från ', '')}
                        <span className="text-xl text-gray-500"> kr</span>
                      </>
                    ) : (
                      <>
                        {plan.price}
                        <span className="text-xl text-gray-500"> kr</span>
                      </>
                    )}
                  </p>
                  {!plan.price.includes('Pris på förfrågan') && (
                    <p className="text-gray-600 text-sm mt-1">/månad</p>
                  )}
                </div>
                <p className="text-gray-700 mb-8 min-h-[3rem]">{plan.description}</p>

                <div className="mb-8">
                  <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wide">
                    Vad ingår:
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1 + i * 0.03 }}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <svg
                          className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>


                <button
                  type="button"
                  onClick={(e) => goToOnboarding(e, plan.planId)}
                  disabled={submittingPlanId !== null}
                  className={`block w-full text-center font-semibold transition-all duration-300 px-8 py-4 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed ${
                    plan.featured
                      ? 'bg-teal text-white hover:bg-teal-hover'
                      : 'bg-transparent text-teal border-2 border-teal hover:bg-teal hover:text-white'
                  }`}
                >
                  {submittingPlanId === plan.planId ? 'Skickar...' : plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="py-20 md:py-32 bg-white">
        <Container size="md">
          <FadeIn>
            <h2 className="text-section-subtitle text-black text-center mb-4">
              Tilläggstjänster
            </h2>
            <p className="text-body text-gray-600 text-center mb-12">
              Utöka din plan med dessa tillägg
            </p>
          </FadeIn>

          <div className="space-y-4">
            {[
              { name: 'Flerspråkigt (i18n)', price: '+500 kr/språk/mån' },
              { name: 'Google/Meta Ads Management', price: '+1 500 kr/mån' },
              { name: 'Advanced SEO', price: '+1 000 kr/mån' },
              { name: 'Newsletter-integration', price: '+500 kr/mån' },
              { name: 'Custom integration', price: 'Offert efter kravanalys' },
            ].map((addon, i) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex justify-between items-center py-5 px-6 rounded-xl bg-gray-50 hover:bg-teal/5 border border-gray-200 hover:border-teal/30 transition-all duration-300"
              >
                <span className="font-medium text-black">{addon.name}</span>
                <span className="text-teal font-semibold">{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* What's NOT Included */}
      <section className="py-20 md:py-32 bg-beige-light">
        <Container size="md">
          <FadeIn>
            <h2 className="text-section-subtitle text-black text-center mb-6">
              Vad ingår INTE
            </h2>
            <p className="text-body-large text-gray-700 text-center mb-12">
              Vi är transparenta om vad du behöver betala extra för:
            </p>
          </FadeIn>

          <div className="space-y-8 max-w-2xl mx-auto">
            {[
              {
                title: 'Domännamn',
                description: 'Du äger din domän',
                cost: '~100-200 kr/år',
              },
              {
                title: 'Transaktionsavgifter',
                description: 'Stripe: 1,4% + 1,8 kr',
                cost: 'Går direkt till Stripe',
              },
              {
                title: 'Innehållsproduktion',
                description: 'Texter, foton, videos',
                cost: 'Vi kan rekommendera leverantörer',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-light rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="font-bold text-black mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-700 mb-2">{item.description}</p>
                <p className="text-teal font-medium text-sm">{item.cost}</p>
              </motion.div>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center mt-12">
            <p className="text-xl font-semibold text-black">
              Allt annat ingår i ditt paket.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-white">
        <Container size="md">
          <FadeIn>
            <h2 className="text-section-subtitle text-black text-center mb-16">
              Vanliga frågor
            </h2>
          </FadeIn>

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
                  className="w-full py-6 px-8 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-lg text-black pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl text-teal flex-shrink-0"
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
                      <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 bg-black text-white relative overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <Container>
          <FadeIn className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Osäker på vilket paket?
            </h2>
            <p className="text-body-large text-gray-300 mb-10">
              Vi hjälper dig hitta rätt lösning för din verksamhet
            </p>
            <AnimatedButton href="/kontakt" variant="primary" size="lg">
              Boka en kostnadsfri demo
            </AnimatedButton>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

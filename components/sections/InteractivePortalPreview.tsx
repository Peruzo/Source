'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ServiceCard } from '@/components/ui/ServiceCard';

const stats = [
  { value: 99.9, suffix: '%', label: 'AI Precision' },
  { value: 10, suffix: '+', label: 'Länder (mål Q1)' },
  { value: 24, suffix: '/7', label: 'Support' },
  { value: 15, suffix: '+', label: 'Integrationer (planerat)' },
];

const services = [
  {
    title: 'AI-Driven Analys',
    description: 'Automatiserade förbättringsförslag baserat på AI',
    features: [
      'Automatiserade förbättringsförslag baserat på användarbeteende',
      'Identifiering av konverteringsbarriärer och friktionspunkter',
      'Optimering av produktpresentation genom visuell analys',
      'Realtids-A/B-testning och kontinuerlig optimering',
    ],
    color: 'analytics' as const,
    span: 'md:col-span-2',
    delay: 0.1,
  },
  {
    title: 'Betalningar & Hosting',
    description: 'Stripe-integration, hosting, auto-scaling',
    features: [
      'Stripe-integration',
      'Flera valutor',
      'Render/Vercel hosting',
      'Auto-scaling och SSL',
    ],
    color: 'payments' as const,
    span: 'md:col-span-1',
    delay: 0.2,
  },
  {
    title: 'E-handel',
    description: 'Komplett e-handelslösning',
    features: [
      'Produkthantering',
      'Inventory management',
      'Fraktintegration',
      'Orderhantering',
    ],
    color: 'ecommerce' as const,
    span: 'md:col-span-1',
    delay: 0.3,
  },
  {
    title: 'Support & Utveckling',
    description: 'Chatt, e-post, video-möten',
    features: [
      'Chatt i kundportalen',
      'E-post support',
      'Video-möten',
      'Feedback-driven utveckling',
    ],
    color: 'support' as const,
    span: 'md:col-span-2',
    delay: 0.4,
  },
];

export function InteractivePortalPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black text-white py-16 md:py-20 lg:py-32 overflow-hidden"
      aria-label="Source kundportal preview"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      {/* Animated glow spots */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal/10 rounded-full blur-3xl"
      />

      <Container className="relative z-10">
        {/* Hero/Slogan section */}
        <FadeIn className="text-center mb-16 md:mb-20">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ opacity }}
          >
            Rooted in{' '}
            <span className="text-teal">Data</span>
            , Growing with You
          </motion.h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            En komplett plattform för att växa online. Verkligen.
          </p>
        </FadeIn>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {stats.map((stat, i) => (
            <MagneticButton key={i} strength={0.15}>
              <GlassCard className="text-center p-6 md:p-8">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
              </GlassCard>
            </MagneticButton>
          ))}
        </div>

        {/* Bento Grid Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
              color={service.color}
              delay={service.delay}
              span={service.span}
            />
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.5} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Redo att växa online?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka en demo
              </AnimatedButton>
              <AnimatedButton href="/tjanster" variant="secondary" size="lg">
                Se alla tjänster
              </AnimatedButton>
            </div>
          </motion.div>
        </FadeIn>
      </Container>
    </section>
  );
}


'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TreeStem } from '@/components/ui/TreeStem';
import { TreeRoots } from '@/components/ui/TreeRoots';
import { GlowingCircles } from '@/components/ui/GlowingCircles';
import { ServiceCard } from '@/components/ui/ServiceCard';
import Link from 'next/link';

interface ServiceData {
  id: string;
  title: string;
  features: string[];
  color: 'analytics' | 'payments' | 'ecommerce' | 'support';
}

const services: ServiceData[] = [
  {
    id: 'ai-analytics',
    title: 'AI-Driven Analys',
    features: [
      'Automatiserade förbättringsförslag baserat på användarbeteende',
      'Identifiering av konverteringsbarriärer och friktionspunkter',
      'Optimering av produktpresentation genom visuell analys',
      'Personalisering av användarupplevelser baserat på preferenser',
    ],
    color: 'analytics',
  },
  {
    id: 'payments',
    title: 'Betalningar & Hosting',
    features: [
      'Stripe-integration',
      'Flera valutor',
      'Render/Vercel hosting',
      'Auto-scaling och SSL',
    ],
    color: 'payments',
  },
  {
    id: 'ecommerce',
    title: 'E-handel',
    features: [
      'Produkthantering',
      'Inventory management',
      'Fraktintegration',
      'Orderhantering',
    ],
    color: 'ecommerce',
  },
  {
    id: 'support',
    title: 'Support & Utveckling',
    features: [
      'Chatt i kundportalen',
      'E-post support',
      'Feedback-driven utveckling',
      'Nya funktioner automatiskt',
    ],
    color: 'support',
  },
];

const stats = [
  { value: 99.9, suffix: '%', label: 'AI Precision' },
  { value: 47, suffix: '+', label: 'Länder' },
  { value: 24, suffix: '/7', label: 'Support' },
  { value: 50, suffix: '+', label: 'Integrationer' },
];

export function OrganicGrowthPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
      aria-label="Source kundportal med organisk tillväxtvisualisering"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Tree Roots and Stem */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Roots Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative h-32 md:h-48"
        >
          <TreeRoots />
        </motion.div>

        {/* Main Content Area with Tree Stem */}
        <motion.div
          style={{ opacity }}
          className="flex-1 relative flex items-center justify-center px-6 md:px-10 lg:px-20 py-20"
        >
          {/* Tree Stem - Central decorative element */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-1/2 top-0 bottom-0 w-16 md:w-24 -translate-x-1/2 origin-bottom z-0"
          >
            <TreeStem />
          </motion.div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center relative z-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-teal relative">
                Rooted in{' '}
                <span className="relative inline-block">
                  Data
                  {/* Glowing Circles over Data */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-0">
                    <GlowingCircles />
                  </div>
                </span>
                , Growing
              </span>
              <br />
              <span className="text-white">with You</span>
            </h2>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 pb-12 px-6 md:px-10 lg:px-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.2 + i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Services Bento Grid Section */}
      <div className="relative z-20 pb-12 md:pb-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                features={service.features}
                color={service.color}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <FadeIn delay={3} className="text-center pb-20 relative z-20">
        <Link
          href="https://portal.source.com"
          className="inline-flex items-center gap-2 text-teal hover:text-white font-semibold text-lg group transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          Utforska kundportalen
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </Link>
      </FadeIn>
    </section>
  );
}

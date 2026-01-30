'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlassCard } from '@/components/ui/GlassCard';
import { LogoHeroShowcase } from './LogoHeroShowcase';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function PortalPreview() {
  const features = [
    {
      title: 'Betalningar',
      description: 'Stripe-integration med full rapportering',
    },
    {
      title: 'AI-Analys',
      description: 'Realtidsinsikter om kundbeteende',
    },
    {
      title: 'Inventory',
      description: 'Lagerhantering och produkter',
    },
    {
      title: 'Support',
      description: 'Inbyggd chatt och ärendehantering',
    },
  ];

  const stats = [
    { value: 99.9, suffix: '%', label: 'Uptime' },
    { value: 24, suffix: '/7', label: 'Support' },
    { value: 50, suffix: '+', label: 'Integrationer' },
  ];

  return (
    <section className="relative py-20 md:py-32 lg:py-40 bg-black text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 191, 166, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 191, 166, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <FadeIn className="text-center mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal mb-4"
          >
            KRAFTFULL KUNDPORTAL
          </motion.p>
          <h2 className="text-section-title text-white mb-6">
            Allt på ett ställe.<br />
            <span className="text-teal">Ingen röra.</span>
          </h2>
          <p className="text-body-large text-gray-400 max-w-3xl mx-auto">
            Din framtida kontrollpanel där varje funktion du behöver är integrerad och redo att använda.
          </p>
        </FadeIn>

        {/* Main dashboard preview with floating elements */}
        <div className="relative mb-20">
          {/* Central dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="glass rounded-3xl p-8 md:p-12 border border-white/10">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <div className="h-4 w-48 bg-white/20 rounded mb-3"></div>
                  <div className="h-3 w-32 bg-white/10 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-teal/30 rounded-full"></div>
                  <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard content grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="glass-light rounded-xl p-4 text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-teal mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Logo Hero Showcase */}
              <LogoHeroShowcase />
            </div>
          </motion.div>

          {/* Floating feature cards */}
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              className="hidden lg:block absolute"
              style={{
                top: i < 2 ? `${20 + i * 15}%` : `${60 + (i - 2) * 15}%`,
                left: i % 2 === 0 ? '2%' : 'auto',
                right: i % 2 === 1 ? '2%' : 'auto',
              }}
            >
              <GlassCard className="w-64 backdrop-blur-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-teal rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Features grid - mobile friendly */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:hidden mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-dark rounded-xl p-4 border-l-2 border-teal"
            >
              <p className="text-sm font-medium text-white mb-1">{feature.title}</p>
              <p className="text-xs text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.6} className="text-center">
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
      </div>
    </section>
  );
}

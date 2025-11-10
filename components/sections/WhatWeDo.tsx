'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    number: '01',
    title: 'Design & E-handel',
    description:
      'AI-driven design som anpassar sig efter din bransch och målgrupp. Komplett e-handelslösning inkluderad.',
    details: [
      'Responsiv design (mobil-först)',
      'E-handelsintegration',
      'Betalningslösningar',
      'SEO-optimering',
    ],
    imagePlaceholder: 'E-commerce UI',
    imageSrc: '/bild.png',
    bgColor: 'from-white to-beige-light',
  },
  {
    number: '02',
    title: 'Intelligent Analys',
    description:
      'Inte bara data. Konkreta rekommendationer för tillväxt baserade på mikroanalys av kundbeteende.',
    details: [
      'Beteendeanalys i realtid',
      'AI-drivna insikter',
      'Konverteringsoptimering',
      'Prediktiva rekommendationer',
    ],
    imagePlaceholder: 'Analytics Dashboard',
    bgColor: 'from-beige-light to-white',
  },
  {
    number: '03',
    title: 'Betalningar & Hosting',
    description:
      'Allt ingår. Inga dolda kostnader eller tredjeparter. Stripe-integration, hosting, SSL—allt inkluderat.',
    details: [
      'Stripe-integration',
      'Flera valutor',
      'SSL & säkerhet',
      'Auto-scaling hosting',
    ],
    imagePlaceholder: 'Payment Systems',
    bgColor: 'from-white to-gray-50',
  },
  {
    number: '04',
    title: 'Support & Utveckling',
    description:
      'Vi växer med dig. Inte bara vid start, utan hela vägen. 24/7 support och kontinuerliga uppdateringar.',
    details: [
      'Chatt & e-post support',
      'Kontinuerlig optimering',
      'Månatliga uppdateringar',
      'Dedikerad kontakt',
    ],
    imagePlaceholder: 'Support Portal',
    bgColor: 'from-gray-50 to-white',
  },
];

export function WhatWeDo() {
  return (
    <section className="py-20 md:py-32 lg:py-40 relative">
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-20 lg:mb-32">
        <FadeIn className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal mb-4"
          >
            KOMPLETT LÖSNING
          </motion.p>
          <h2 className="text-section-title text-black">
            Allt du behöver.{' '}
            <span className="text-teal">En plattform.</span>
          </h2>
        </FadeIn>
      </div>

      {/* Service sections - Full width alternating */}
      <div className="space-y-0">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={service.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative min-h-[60vh] lg:min-h-[70vh] flex items-center bg-gradient-to-br ${service.bgColor}`}
            >
              <div className="absolute inset-0 noise-overlay"></div>
              
              <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Text content */}
                  <div className={`${!isEven ? 'lg:col-start-2' : ''} space-y-6`}>
                    {/* Large number background */}
                    <div className="relative">
                      <div className="text-service-number text-gray-900 absolute -top-16 -left-4 lg:-left-8">
                        {service.number}
                      </div>
                      
                      <div className="relative z-10">
                        <motion.h3
                          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4"
                        >
                          {service.title}
                        </motion.h3>
                        
                        <motion.p
                          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-body-large text-gray-700 mb-8"
                        >
                          {service.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Details list */}
                    <motion.ul
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                          className="flex items-center gap-3 text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-teal rounded-full"></div>
                          <span className="text-sm md:text-base">{detail}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>

                  {/* Image/Visual - Glass card with preview */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: 2 }}
                      transition={{ duration: 0.4 }}
                      className="relative group"
                    >
                      <div className="glass relative rounded-3xl p-6 md:p-8 aspect-[4/3] flex items-center justify-center border border-white/20 overflow-hidden">
                        {/* Placeholder content - replace with actual screenshots */}
                        {service.imageSrc ? (
                          <div className="absolute inset-0">
                            <Image
                              src={service.imageSrc}
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="(min-width: 1024px) 480px, 100vw"
                              priority={index === 0}
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-6xl md:text-8xl font-bold text-white/10 mb-4">
                              {service.number}
                            </p>
                            <p className="text-sm text-white/60">{service.imagePlaceholder}</p>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal/0 to-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Glow effect on hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal/0 via-teal/30 to-teal/0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mt-20 lg:mt-32">
        <FadeIn className="text-center">
          <Link
            href="/tjanster"
            className="inline-flex items-center gap-2 text-teal hover:text-teal-hover font-semibold text-lg group transition-colors duration-200"
          >
            Se alla tjänster i detalj
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

'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function PortfolioTeaser() {
  const projects = [
    {
      title: 'E-handel',
      category: 'Exempel',
      metric: 'Prognos: +100-200% trafik',
      slug: 'ecommerce-example',
      size: 'large', // For masonry effect
    },
    {
      title: 'SaaS Platform',
      category: 'Exempel',
      metric: 'Prognos: 4-6 veckor lansering',
      slug: 'saas-example',
      size: 'medium',
    },
    {
      title: 'Lokal Business',
      category: 'Exempel',
      metric: 'Prognos: +50-150% bokningar',
      slug: 'local-example',
      size: 'medium',
    },
  ];

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <FadeIn className="text-center mb-16 lg:mb-24">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal mb-4"
          >
            EXEMPEL
          </motion.p>
          <h2 className="text-section-title text-black mb-6">
          Exempel-scenarion
        </h2>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            Så här kan Source hjälpa olika typer av verksamheter växa online.
          </p>
        </FadeIn>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 mb-12">
          {/* Project 1 - Large */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 lg:row-span-2 group"
          >
            <Link href={`/portfolio/${projects[0].slug}`}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] lg:aspect-auto lg:h-full border border-gray-200">
                {/* Image placeholder - replace with actual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-white/10 mb-2">01</p>
                    <p className="text-sm text-white/40">{projects[0].title}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal mb-2 block">
                      {projects[0].category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {projects[0].title}
                    </h3>
                    <p className="text-teal font-medium mb-4">{projects[0].metric}</p>
                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                      Visa projekt
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 border-2 border-teal/0 group-hover:border-teal/50 rounded-3xl transition-all duration-500"></div>
              </div>
            </Link>
          </motion.article>

          {/* Project 2 - Medium */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 group"
          >
            <Link href={`/portfolio/${projects[1].slug}`}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 aspect-[4/3] border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white/10 mb-2">02</p>
                    <p className="text-sm text-white/40">{projects[1].title}</p>
                  </div>
              </div>
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal mb-2 block">
                      {projects[1].category}
                </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {projects[1].title}
                </h3>
                    <p className="text-teal font-medium mb-3">{projects[1].metric}</p>
                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                      Visa projekt →
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-teal/0 group-hover:border-teal/50 rounded-3xl transition-all duration-500"></div>
              </div>
            </Link>
          </motion.article>

          {/* Project 3 - Medium */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 group"
          >
            <Link href={`/portfolio/${projects[2].slug}`}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-600 to-gray-700 aspect-[4/3] border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white/10 mb-2">03</p>
                    <p className="text-sm text-white/40">{projects[2].title}</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal mb-2 block">
                      {projects[2].category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {projects[2].title}
                    </h3>
                    <p className="text-teal font-medium mb-3">{projects[2].metric}</p>
                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                      Visa projekt →
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-teal/0 group-hover:border-teal/50 rounded-3xl transition-all duration-500"></div>
              </div>
            </Link>
          </motion.article>
        </div>


        {/* CTA */}
        <FadeIn delay={0.6} className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-teal hover:text-white transition-all duration-300 group"
          >
            Se alla projekt
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

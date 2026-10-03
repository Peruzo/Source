'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { portfolioProjects } from '@/lib/data/portfolioProjects';
import { ProjectCard } from '@/components/sections/ProjectCard';

const clientProjects = portfolioProjects.filter((project) => project.kind === 'client');
const conceptProjects = portfolioProjects.filter((project) => project.kind === 'concept');

export function PortfolioTeaser() {
  return (
    <section className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <FadeIn className="text-center mb-16 lg:mb-24">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal-dark mb-4"
          >
            PORTFOLIO
          </motion.p>
          <h2 className="text-section-title text-black mb-6">
            Byggt av Source
          </h2>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            Så här kan Source hjälpa olika typer av verksamheter växa online.
          </p>
        </FadeIn>

        {/* Kundcase */}
        {clientProjects.map((project) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="mb-16 lg:mb-24"
          >
            <ProjectCard project={project} variant="featured" />
          </motion.div>
        ))}

        {/* Koncept */}
        {conceptProjects.length > 0 && (
          <div className="mb-12">
            <FadeIn className="mb-8 md:mb-10">
              <h3 className="text-section-subtitle text-black mb-2">Koncept</h3>
              <p className="text-body text-gray-600">
                Demosajter vi byggt för att visa vad som är möjligt i olika branscher.
              </p>
            </FadeIn>

            {/* Horisontell scroll med snap på mobil, grid med 3 kolumner på lg */}
            <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-4 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
              {conceptProjects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-auto"
                >
                  <ProjectCard project={project} />
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <FadeIn delay={0.6} className="text-center">
          <Link
            href="/portfolio"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-[22px] py-3 text-[15px] font-medium leading-tight text-black transition-colors duration-200 hover:bg-gray-100"
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

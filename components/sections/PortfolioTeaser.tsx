'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export function PortfolioTeaser() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const projects = [
    {
      title: 'E-handel',
      category: 'Exempel',
      metric: 'Prognos: +100-200% trafik',
      slug: 'ecommerce-example',
      image: '/forthewebsitesource.png',
      hoverImage: '/forthebetterse.png',
      link: 'https://peran.onrender.com/',
      external: true,
    },
    {
      title: 'GLOW',
      category: 'Exempel',
      metric: 'E-handel & varumärke',
      slug: 'glow-example',
      image: '/glowanotherone.png',
      hoverImage: '/glowkundcase.png',
      link: 'https://glow-test.onrender.com/',
      external: true,
    },
    {
      title: 'Minti Wellness',
      category: 'Exempel',
      metric: 'Wellness & digital närvaro',
      slug: 'minti-example',
      image: '/mintilogo.png',
      hoverImage: '/mintiwebsite.png',
      link: 'https://minti.onrender.com/',
      external: true,
    },
    {
      title: 'Support & Service',
      category: 'Exempel',
      metric: 'Prognos: +80% kundnöjdhet',
      slug: 'support-example',
      image: null,
      hoverImage: null,
      link: '/portfolio/support-example',
      external: false,
    },
    {
      title: 'Statistik & Analys',
      category: 'Exempel',
      metric: 'Prognos: Data-driven beslut',
      slug: 'analytics-example',
      image: null,
      hoverImage: null,
      link: '/portfolio/analytics-example',
      external: false,
    },
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll by ~80% of viewport
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

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
            PORTFOLIO
          </motion.p>
          <h2 className="text-section-title text-black mb-6">
            Byggt av Source
          </h2>
          <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
            Så här kan Source hjälpa olika typer av verksamheter växa online.
          </p>
        </FadeIn>

        {/* Horizontal Carousel Container */}
        <div className="relative mb-12 -mx-6 md:-mx-10 lg:-mx-20">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal hover:text-white hover:border-teal transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal hover:text-white hover:border-teal transition-all duration-300 ${
              canScrollRight ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Scrollable Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex flex-row gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 px-6 md:px-10 lg:px-20"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {projects.map((project, index) => {
              return (
                <motion.article
                  key={project.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex-shrink-0 snap-start group w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px]"
                >
                  <div className="w-full">
                    {project.external ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] border border-gray-200 cursor-pointer mb-4 group-hover:border-teal/50 transition-all duration-300">
                          {/* Main image */}
                          {project.image && (
                            <img
                              src={project.image}
                              alt={project.title}
                              className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${
                                project.hoverImage ? 'group-hover:opacity-0' : ''
                              }`}
                            />
                          )}

                          {/* Hover image (if available) */}
                          {project.hoverImage && (
                            <>
                              <img
                                src={project.hoverImage}
                                alt={project.title}
                                className="absolute inset-0 z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              />
                              {/* Hover overlay with "Se mer" text */}
                              <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl md:text-3xl font-bold text-white">
                                    Se mer
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Placeholder content when no image */}
                          {!project.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-5xl font-bold text-white/10 mb-2">{String(index + 1).padStart(2, '0')}</p>
                                <p className="text-sm text-white/40">{project.title}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </a>
                    ) : (
                      <Link href={project.link} className="block">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] border border-gray-200 cursor-pointer mb-4 group-hover:border-teal/50 transition-all duration-300">
                          {/* Main image */}
                          {project.image && (
                            <img
                              src={project.image}
                              alt={project.title}
                              className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${
                                project.hoverImage ? 'group-hover:opacity-0' : ''
                              }`}
                            />
                          )}

                          {/* Hover image (if available) */}
                          {project.hoverImage && (
                            <>
                              <img
                                src={project.hoverImage}
                                alt={project.title}
                                className="absolute inset-0 z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              />
                              {/* Hover overlay with "Se mer" text */}
                              <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl md:text-3xl font-bold text-white">
                                    Se mer
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Placeholder content when no image */}
                          {!project.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-5xl font-bold text-white/10 mb-2">{String(index + 1).padStart(2, '0')}</p>
                                <p className="text-sm text-white/40">{project.title}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    )}
                    
                    {/* Text below card */}
                    <div className="px-1">
                      <h3 className="text-base md:text-lg font-semibold text-black mb-1 group-hover:text-teal transition-colors duration-300 leading-tight">
                        {project.title} – {project.metric}
                      </h3>
                      {project.category && (
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Custom scrollbar styling */}
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
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

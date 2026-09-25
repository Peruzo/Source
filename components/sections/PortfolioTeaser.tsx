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
      logo: '/peran-logo.webp',
      siteImage: '/peran-site.webp',
      link: 'https://peran.onrender.com/',
      external: true,
    },
    {
      title: 'GLOW',
      category: 'Exempel',
      metric: 'E-handel & varumärke',
      slug: 'glow-example',
      logo: '/glow-logo.webp',
      siteImage: '/glow-site.webp',
      link: 'https://glow-test.onrender.com/',
      external: true,
    },
    {
      title: 'Minti Wellness',
      category: 'Exempel',
      metric: 'Wellness & digital närvaro',
      slug: 'minti-example',
      logo: '/minti-logo.webp',
      siteImage: '/minti-site.webp',
      link: 'https://minti.onrender.com/',
      external: true,
    },
    {
      title: 'Vattentrygg',
      category: 'Exempel',
      metric: 'Översvämningsskydd & fastighetsskydd',
      slug: 'vattentrygg-example',
      logo: '/vattentrygg-logo.webp',
      siteImage: '/vattentrygg-site.webp',
      // Samma mål som Vattentrygg-kortet i PortfolioCarousel — samma case ska
      // inte bete sig olika på startsidan och portfolio-sidan.
      link: '/kontakt',
      external: false,
    },
    {
      title: 'Support & Service',
      category: 'Exempel',
      metric: 'Prognos: +80% kundnöjdhet',
      slug: 'support-example',
      logo: null,
      siteImage: null,
      // Inget case utan ett tjänsteerbjudande: pekar på support-avsnittet på
      // tjänstesidan. Slugen /portfolio/support-example har aldrig funnits.
      link: '/tjanster#support',
      external: false,
    },
    {
      title: 'Statistik & Analys',
      category: 'Exempel',
      metric: 'Prognos: Data-driven beslut',
      slug: 'analytics-example',
      logo: null,
      siteImage: null,
      // Inget case utan ett tjänsteerbjudande: /analys är den egna sidan för
      // det. Slugen /portfolio/analytics-example har aldrig funnits.
      link: '/analys',
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
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
      container.removeEventListener('wheel', handleWheel);
    };
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

        {/* Horizontal Carousel Container */}
        <div className="relative mb-12 -mx-6 md:-mx-10 lg:-mx-20">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal-darker hover:text-white hover:border-teal-dark transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal-darker hover:text-white hover:border-teal-dark transition-all duration-300 ${
              canScrollRight ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Scrollable Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex flex-row gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 px-6 md:px-10 lg:px-20"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
              overscrollBehaviorY: 'none',
              touchAction: 'pan-x',
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
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] border border-gray-200 cursor-pointer mb-4 group-hover:border-teal-dark/50 transition-all duration-300">
                          {/* Main image */}
                          {project.logo && (
                            <img
                              src={project.logo}
                              alt={project.title}
                              className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${
                                project.siteImage ? 'group-hover:opacity-0' : ''
                              }`}
                            />
                          )}

                          {/* Hover image (if available) */}
                          {project.siteImage && (
                            <>
                              <img
                                src={project.siteImage}
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
                          {!project.logo && (
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
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/3] border border-gray-200 cursor-pointer mb-4 group-hover:border-teal-dark/50 transition-all duration-300">
                          {/* Main image */}
                          {project.logo && (
                            <img
                              src={project.logo}
                              alt={project.title}
                              className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${
                                project.siteImage ? 'group-hover:opacity-0' : ''
                              }`}
                            />
                          )}

                          {/* Hover image (if available) */}
                          {project.siteImage && (
                            <>
                              <img
                                src={project.siteImage}
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
                          {!project.logo && (
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
                      <h3 className="text-base md:text-lg font-semibold text-black mb-1 group-hover:text-teal-dark transition-colors duration-300 leading-tight">
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
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-[22px] py-3 text-[15px] font-medium leading-tight text-black transition-colors duration-200 hover:bg-gray-100"
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

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const slides = [
  {
    id: 'analysis',
    image: '/hioke.png',
    title: 'Analys av besökare, kunder och köp',
    body: 'Vi följer hela resan – från första besök till genomfört köp – så att du ser exakt vad som driver intäkter och vad som bromsar.',
  },
  {
    id: 'booking',
    image: '/booking.png',
    title: 'Bokningssystem för alla branscher',
    body: 'Ett flexibelt bokningsflöde som anpassas efter din verklighet – oavsett om du driver salong, byrå eller konsultverksamhet.',
  },
  {
    id: 'fortnox',
    image: '/accountant.png',
    title: 'Verktyg som kopplar bokningar till Fortnox',
    body: 'Automatisera flödet från bokning till bokföring med färdiga integrationer mot Fortnox och tydliga rapporter.',
  },
];

const SLIDE_DURATION = 8000;

export function DataGrowthSlideshow() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState(0);
  const isInView = useInView(sectionRef, {
    // Start lite innan sektionen är helt i bild
    margin: '-30% 0px -30% 0px',
  });

  // Starta/stoppa slideshow baserat på scroll, och börja alltid från första bild
  useEffect(() => {
    if (!isInView) {
      return;
    }

    // När sektionen kommer in i bild: starta från första slide
    setCurrent(0);

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, [isInView]);

  const activeSlide = slides[current];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
    >
      {/* Background image slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${activeSlide.image})`,
              }}
            />
            {/* Very subtle gradient overlay for readability without darkening too much */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content overlay – centered like Revolut hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32 lg:py-36 flex flex-col items-center text-center">
        <div className="w-full">
          <p className="text-overline text-teal mb-4">
            FRÅN DATA TILL VERKLIG TILLVÄXT
          </p>
          <h2 className="text-section-title text-white mb-4">
            Tillväxt som syns i{' '}
            <span className="text-teal">bokningar och siffror</span>.
          </h2>
          <motion.h3
            key={activeSlide.id + '-title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-section-subtitle text-white mb-3"
          >
            {activeSlide.title}
          </motion.h3>
          <motion.p
            key={activeSlide.id + '-body'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-body-large text-gray-100 mb-8 max-w-3xl mx-auto"
          >
            {activeSlide.body}
          </motion.p>

          {/* Slide indicators */}
          <div className="flex items-center justify-center gap-3">
            {slides.map((slide, index) => {
              const isActive = index === current;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className="group relative h-2 flex-1 max-w-[120px] rounded-full overflow-hidden bg-white/10"
                  aria-label={slide.title}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-teal' : 'bg-white/20 group-hover:bg-white/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}



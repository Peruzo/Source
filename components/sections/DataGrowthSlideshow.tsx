'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';

const slides = [
  {
    id: 'analysis',
    image: '/hioke.png',
    title: 'Analys av besökare, kunder och köp',
    body: 'Vi följer hela resan – från första besök till genomfört köp – så att du ser exakt vad som driver intäkter och vad som bromsar.',
  },
  {
    id: 'booking',
    image: '/restaurantforbooking.webp',
    title: 'Bokningssystem för alla branscher',
    body: 'Ett flexibelt bokningsflöde som anpassas efter din verklighet – oavsett om du driver salong, byrå eller konsultverksamhet.',
  },
  {
    id: 'fortnox',
    image: '/newbooking.webp',
    title: 'Verktyg som kopplar bokningar till Fortnox',
    body: 'Automatisera flödet från bokning till bokföring med färdiga integrationer mot Fortnox och tydliga rapporter.',
  },
];

const SLIDE_DURATION = 8000;

export function DataGrowthSlideshow() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, {
    // Start lite innan sektionen är helt i bild
    margin: '-30% 0px -30% 0px',
  });

  const goToNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  // När sektionen kommer in i bild: börja alltid från första slide
  useEffect(() => {
    if (isInView) {
      setCurrent(0);
    }
  }, [isInView]);

  // Med reducerad rörelse finns ingen fyllnadsanimation som driver bytet,
  // så vi byter via en timer som startar om vid varje slide-byte.
  useEffect(() => {
    if (!reduceMotion || !isInView) {
      return;
    }

    const timeout = setTimeout(goToNext, SLIDE_DURATION);
    return () => clearTimeout(timeout);
  }, [reduceMotion, isInView, current]);

  const activeSlide = slides[current];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
    >
      {/* Background image slideshow – överlappande crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${activeSlide.image})`,
            }}
          />
        </AnimatePresence>
        {/* Very subtle gradient overlay for readability without darkening too much */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
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
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-section-subtitle text-white mb-3">
                {activeSlide.title}
              </h3>
              <p className="text-body-large text-gray-100 mb-8 max-w-3xl mx-auto">
                {activeSlide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators – den aktiva fylls och driver bytet */}
          <div className="flex items-center justify-center gap-3">
            {slides.map((slide, index) => {
              const isActive = index === current;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`relative h-2 flex-1 max-w-[120px] rounded-full overflow-hidden bg-white/10 transition-colors duration-300 ${
                    isActive ? '' : 'hover:bg-white/20'
                  }`}
                  aria-label={slide.title}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive &&
                    (reduceMotion ? (
                      <div className="absolute inset-0 bg-teal" />
                    ) : (
                      <motion.div
                        key={current}
                        className="absolute inset-0 origin-left bg-teal"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isInView ? 1 : 0 }}
                        transition={
                          isInView
                            ? { duration: SLIDE_DURATION / 1000, ease: 'linear' }
                            : { duration: 0 }
                        }
                        onAnimationComplete={(definition) => {
                          // Endast en fullbordad fyllnad byter slide, inte nollställningen
                          const target = definition as { scaleX?: number };
                          if (isInView && target.scaleX === 1) {
                            goToNext();
                          }
                        }}
                      />
                    ))}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasSnappedToSection2, setHasSnappedToSection2] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Track from top of page until end of hero to drive the whole transition.
    offset: ['start start', 'end start'],
  });

  // When the user starts scrolling down in the hero, gently snap them to
  // the start of section 2 so a small scroll leads directly to that view.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      // As soon as the user nudges the scroll from the top of the hero,
      // immediately jump to section 2 so no intermediate hero state is visible.
      if (!hasSnappedToSection2 && value > 0.02) {
        const nextSection = document.getElementById('value-proposition');
        if (nextSection) {
          setHasSnappedToSection2(true);
          nextSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [hasSnappedToSection2, scrollYProgress]);

  // When the user scrolls back up towards the hero from section 2,
  // snap them back to the top hero view so there is no in-between state.
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingUp = currentY < lastScrollY.current;
      lastScrollY.current = currentY;

      const valueSection = document.getElementById('value-proposition');
      if (!valueSection) return;

      const sectionTop = valueSection.offsetTop;

      // If we're scrolling up and are just below the start of section 2,
      // jump straight to the top (hero full view).
      if (
        goingUp &&
        currentY >= sectionTop - 200 &&
        currentY <= sectionTop + 200
      ) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IMAGE / CARD TRANSFORM
  // Låt animationen spela ut över lite mer scroll (ca 50% av hero),
  // så en liten scroll fortfarande tar dig till sektion 2 men inte känns för “snabb”.
  const imageScale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.5], [1.04, 0.95, 0.65, 0.45]);
  // Positiv Y flyttar boxen ned mot nedre delen av viewporten.
  const imageY = useTransform(scrollYProgress, [0, 0.5], ['0%', '42%']);
  const imageRadius = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, 24, 40]);
  const framePadding = useTransform(scrollYProgress, [0, 0.5], [0, 96]); // px top-padding
  const imageOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1, 0]); // fade out mot slutet av hero-rörelsen

  // BACKGROUND TRANSFORM
  // Växla till vit bakgrund medan bilden fortfarande är synlig, men något senare,
  // så övergången till sektion 2 känns mjuk men inte blixtsnabb.
  const darkBgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const whiteBgOpacity = useTransform(scrollYProgress, [0.15, 0.35, 1], [0, 1, 1]);

  // OVERLAY CONTENT (text) – keep it readable on top of the image.
  const overlayGradientOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black-secondary"
    >
      {/* Dark gradient mesh at the very top, fades away as we move into the white 2nd section */}
      <motion.div
        style={{ opacity: darkBgOpacity }}
        className="absolute inset-0 gradient-mesh noise-overlay"
      />
      {/* White background that takes over as the image shrinks into a box */}
      <motion.div
        style={{ opacity: whiteBgOpacity }}
        className="absolute inset-0 bg-white"
      />

      {/* Wrapper that adds padding as we scroll so the full-bleed image
          gradually gets more air around it, reading as a smaller box that
          moves down towards section 2. */}
      <motion.div
        style={{ paddingTop: framePadding }}
        className="relative z-10 w-full h-screen flex items-end justify-center pb-10 md:pb-16"
      >
        {/* Picture that transitions from full-page to small box */}
        <motion.div
          style={{
            scale: imageScale,
            y: imageY,
            borderRadius: imageRadius,
            opacity: imageOpacity,
          }}
          className="relative w-full h-full overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-black"
        >
          <Image
            src="/firstsectionpicture.png"
            alt="Source hero"
            width={1920}
            height={1080}
            priority
            className="w-full h-full object-cover"
          />

          {/* Soft vignette so the central text remains readable */}
          <motion.div
            style={{ opacity: overlayGradientOpacity }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          />

          {/* Centered hero content – inspired by Revolut layout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4"
            >
              VÄXA ONLINE.
              <br />
              <span className="text-teal">VERKLIGEN.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl text-base md:text-lg text-white/85 mb-6"
            >
              AI som analyserar din verksamhet och ger konkreta råd — inte bara rapporter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka demo
              </AnimatedButton>
              <AnimatedButton href="#value-proposition" variant="secondary" size="lg">
                Se hur det fungerar ↓
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

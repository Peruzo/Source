'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Track from top of page until end of hero to drive the whole transition.
    offset: ['start start', 'end start'],
  });

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

  // Fullpage-like scroll locking between section 1 (Hero) and section 2
  // so the user only ever settles on full views of these two sections.
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const hero = sectionRef.current;
      const valueSection = document.getElementById('value-proposition');
      if (!hero || !valueSection) return;

      const section2Top = valueSection.offsetTop;
      const scrollY = window.scrollY;

      // Only intercept scroll while we're between top of page and start of section 2
      if (scrollY < section2Top && scrollY >= 0) {
        event.preventDefault();

        // Scroll direction: down → snap to section 2, up → snap to top of page
        if (event.deltaY > 0) {
          window.scrollTo({ top: section2Top, behavior: 'smooth' });
        } else if (event.deltaY < 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel as any);
  }, []);

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

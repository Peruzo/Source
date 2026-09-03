'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
  const heroOff = nofx.hero; // TEMP: flicker bisect, remove after diagnosis

  // Smooth snap: hero ↔ nästa sektion. Vid snap: passive: false + preventDefault
  // så native wheel inte tävlar med scrollIntoView; scroll-end (debounce) ersätter fast timeout.
  useEffect(() => {
    let isSnapping = false;
    let lastDirection: 'down' | 'up' | null = null;
    let scrollEndCleanup: (() => void) | null = null;

    function waitForScrollEnd(callback: () => void): () => void {
      let timeout: ReturnType<typeof setTimeout>;

      const check = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          window.removeEventListener('scroll', check);
          callback();
        }, 120);
      };

      window.addEventListener('scroll', check, { passive: true });

      return () => {
        clearTimeout(timeout);
        window.removeEventListener('scroll', check);
      };
    }

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) return;

      const direction = e.deltaY > 0 ? 'down' : 'up';

      // Ignorera snabba upprepningar i samma riktning (samma “tick” av gesten)
      if (direction === lastDirection) return;

      lastDirection = direction;

      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // SCROLL NER (Hero → Next)
      if (direction === 'down' && scrollY < heroHeight * 0.2) {
        e.preventDefault();
        isSnapping = true;
        scrollEndCleanup?.();
        scrollEndCleanup = waitForScrollEnd(() => {
          isSnapping = false;
          lastDirection = null;
          scrollEndCleanup = null;
        });
        document.getElementById('next-section')?.scrollIntoView({
          behavior: 'smooth',
        });
        return;
      }

      // SCROLL UPP (Next → Hero)
      if (direction === 'up' && scrollY > heroHeight * 0.2 && scrollY < heroHeight * 1.1) {
        e.preventDefault();
        isSnapping = true;
        scrollEndCleanup?.();
        scrollEndCleanup = waitForScrollEnd(() => {
          isSnapping = false;
          lastDirection = null;
          scrollEndCleanup = null;
        });
        document.getElementById('hero')?.scrollIntoView({
          behavior: 'smooth',
        });
        return;
      }

      // Ingen snap: återställ så normal scroll inte låses av lastDirection
      lastDirection = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollEndCleanup?.();
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
  // Made white background appear earlier and more smoothly to prevent gaps on Windows
  const darkBgOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  // White background div is now redundant since section has bg-white, but kept for smooth transition
  const whiteBgOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  // OVERLAY CONTENT (text) – keep it readable on top of the image.
  const overlayGradientOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`relative min-h-screen overflow-hidden bg-white ${
        heroOff ? '' : 'will-change-transform transform-gpu'
      }`} // TEMP: flicker bisect, remove after diagnosis
    >
      {/* Dark gradient mesh at the very top, fades away as we move into the white 2nd section */}
      <motion.div
        style={
          heroOff
            ? { opacity: 1 } // TEMP: flicker bisect, remove after diagnosis
            : {
                opacity: darkBgOpacity,
                willChange: 'opacity',
                transform: 'translateZ(0)',
              }
        }
        className="absolute inset-0 gradient-mesh z-0"
      />
      {/* Noise overlay - separated for better performance, can be disabled on low-end devices */}
      {!nofx.noise && ( // TEMP: flicker bisect, remove after diagnosis
        <motion.div
          style={
            heroOff
              ? { opacity: 1 } // TEMP: flicker bisect, remove after diagnosis
              : {
                  opacity: darkBgOpacity,
                  willChange: 'opacity',
                }
          }
          className="absolute inset-0 noise-overlay z-0"
        />
      )}
      {/* White background that takes over as the image shrinks into a box - Always visible, just becomes opaque */}
      <motion.div
        style={
          heroOff
            ? { opacity: 0 } // TEMP: flicker bisect, remove after diagnosis
            : {
                opacity: whiteBgOpacity,
                willChange: 'opacity',
                transform: 'translateZ(0)',
              }
        }
        className="absolute inset-0 bg-white z-[1]"
      />

      {/* Wrapper that adds padding as we scroll so the full-bleed image
          gradually gets more air around it, reading as a smaller box that
          moves down towards section 2. */}
      <motion.div
        style={
          heroOff
            ? { paddingTop: 0 } // TEMP: flicker bisect, remove after diagnosis
            : {
                paddingTop: framePadding,
                willChange: 'transform',
                transform: 'translateZ(0)',
              }
        }
        className="relative z-[2] w-full h-screen flex items-center md:items-end justify-center pb-10 md:pb-16"
      >
        {/* Picture that transitions from full-page to small box */}
        <motion.div
          style={
            heroOff
              ? { scale: 1, y: 0, borderRadius: 0, opacity: 1 } // TEMP: flicker bisect, remove after diagnosis
              : {
                  scale: imageScale,
                  y: imageY,
                  borderRadius: imageRadius,
                  opacity: imageOpacity,
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }
          }
          className="relative w-full min-h-[420px] h-[60svh] md:min-h-0 md:h-full overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-black"
        >
          <Image
            src="/firstsectionpicture.png"
            alt="Source hero"
            width={1232}
            height={928}
            priority
            className="w-full h-full object-cover object-[80%_center] md:object-center"
          />

          {/* Soft vignette so the central text remains readable */}
          <motion.div
            style={heroOff ? { opacity: 1 } : { opacity: overlayGradientOpacity }} // TEMP: flicker bisect, remove after diagnosis
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
              <AnimatedButton href="#next-section" variant="secondary" size="lg">
                Se hur det fungerar ↓
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

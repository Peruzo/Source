'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

const ROTATING_WORDS = ['Starta', 'Växa', 'Skala'] as const;
const WORD_INTERVAL = 2500;
/** Word shown when the visitor prefers reduced motion (no rotation). */
const STATIC_WORD = 'Växa';

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
  // The copy sits in its own layer (it must not inherit the image's scale/y), so it
  // needs its own fade – otherwise white text would linger over the white background.
  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

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
        className="relative z-[2] w-full h-screen flex items-end justify-center pb-10 md:pb-16"
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
          className="relative w-full h-full overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-black"
        >
          <Image
            src="/landing.webp"
            alt="Source hero"
            width={2048}
            height={1152}
            priority
            className="w-full h-full object-cover object-[50%_65%]"
          />

          {/* Soft vignette so the central text remains readable */}
          <motion.div
            style={heroOff ? { opacity: 1 } : { opacity: overlayGradientOpacity }} // TEMP: flicker bisect, remove after diagnosis
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          />

        </motion.div>
      </motion.div>

      {/* Centered hero copy – own layer so it keeps still while the image scales away */}
      <motion.div
        style={heroOff ? { opacity: 1 } : { opacity: textOpacity }} // TEMP: flicker bisect, remove after diagnosis
        // Mobile: copy sits low so the face stays clear. The padding tracks viewport
        // height (55vh - 268px, clamped 104-180px) so the gap below the chin stays
        // ~45px at 844px tall and never drops under ~24px on a 667px screen.
        className="absolute inset-0 z-[3] flex flex-col items-center justify-end px-4 pb-[clamp(6.5rem,calc(55vh_-_268px),11.25rem)] text-center md:justify-center md:pb-0"
      >
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-3 md:mb-4"
        >
          <RotatingWord /> online. Verkligen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl text-base md:text-lg text-white/85 mb-4 md:mb-6"
        >
          AI som analyserar din verksamhet och ger konkreta råd — inte bara rapporter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-center"
        >
          <AnimatedButton
            href="/kontakt"
            variant="primary"
            size="lg"
            className="w-full !py-4 md:w-auto md:!py-5"
          >
            Boka demo
          </AnimatedButton>
          <AnimatedButton
            href="#next-section"
            variant="secondary"
            size="lg"
            className="w-full !py-4 md:w-auto md:!py-5"
          >
            Se hur det fungerar ↓
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * First word of the headline, rotating Starta → Växa → Skala.
 * All three words are rendered invisibly in the same grid cell so the slot is as
 * wide as the widest word and the rest of the line never reflows on change.
 */
function RotatingWord() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, WORD_INTERVAL);

    return () => clearInterval(id);
  }, [reduce]);

  const word = reduce ? STATIC_WORD : ROTATING_WORDS[index];

  return (
    <span className="relative inline-block overflow-hidden align-bottom text-accent-600">
      <span aria-hidden className="invisible grid">
        {ROTATING_WORDS.map((w) => (
          <span key={w} className="col-start-1 row-start-1">
            {w}
          </span>
        ))}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

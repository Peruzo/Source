'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import {
  motion,
  animate,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  type AnimationPlaybackControls,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

const ROTATING_WORDS = ['Starta', 'Växa', 'Skala'] as const;
const WORD_INTERVAL = 2500;
/** Word shown when the visitor prefers reduced motion (no rotation). */
const STATIC_WORD = 'Växa';

/** Wheel snap: a downward tick this far into the hero (fraction of its height) still snaps to section 2. */
const HERO_ZONE = 0.4;
/** An upward tick within this many px of section 2's top snaps back to the hero. */
const SECTION_TOP_TOLERANCE = 40;
/** Snap animation length in seconds, and the wheel cooldown after it in ms. */
const SNAP_DURATION = 0.8;
const SNAP_COOLDOWN_MS = 300;
const SNAP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
  const heroOff = nofx.hero; // TEMP: flicker bisect, remove after diagnosis

  // Wheel snap between the hero and section 2 (desktop only: touch never fires wheel events).
  // Any downward tick inside the hero zone, however small, animates the page to #next-section;
  // any upward tick at the top of section 2 animates it back to the hero. The page scroll is
  // driven by framer-motion's animate with a fixed duration rather than native smooth scrolling,
  // so the lock window is exact and the motion is the same in Safari as elsewhere. Wheel events
  // are swallowed while the animation runs and for a short cooldown after it, so a trailing tick
  // of the same gesture cannot bounce the page back.
  useEffect(() => {
    if (reduce) return;

    const html = document.documentElement;
    let controls: AnimationPlaybackControls | null = null;
    let animating = false;
    let cooldownUntil = 0;
    // globals.css sets scroll-behavior: smooth on everything; the per-frame scrollTo must be instant.
    const previousScrollBehavior = html.style.scrollBehavior;

    const finish = () => {
      controls = null;
      animating = false;
      html.style.scrollBehavior = previousScrollBehavior;
      cooldownUntil = performance.now() + SNAP_COOLDOWN_MS;
    };

    const snapTo = (target: number) => {
      animating = true;
      html.style.scrollBehavior = 'auto';
      controls = animate(window.scrollY, target, {
        duration: SNAP_DURATION,
        ease: SNAP_EASE,
        onUpdate: (v) => window.scrollTo(0, v),
        onComplete: finish,
      });
    };

    const handleWheel = (e: WheelEvent) => {
      // Pinch-zoom on trackpads arrives as wheel + ctrlKey; horizontal ticks carry no deltaY.
      if (e.ctrlKey || e.deltaY === 0) return;

      if (animating || performance.now() < cooldownUntil) {
        e.preventDefault();
        return;
      }

      const next = document.getElementById('next-section');
      const hero = sectionRef.current;
      if (!next || !hero) return;

      const scrollY = window.scrollY;
      const heroTop = hero.getBoundingClientRect().top + scrollY;
      const nextTop = next.getBoundingClientRect().top + scrollY;
      const heroHeight = hero.offsetHeight || window.innerHeight;

      if (e.deltaY > 0 && scrollY < heroTop + heroHeight * HERO_ZONE) {
        e.preventDefault();
        snapTo(nextTop);
        return;
      }

      if (e.deltaY < 0 && Math.abs(scrollY - nextTop) <= SECTION_TOP_TOLERANCE) {
        e.preventDefault();
        snapTo(heroTop);
      }
      // Anywhere else: normal scrolling, untouched.
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      controls?.stop();
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [reduce]);

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
 *
 * All words share one inline-grid cell: the invisible ones fix the slot to the
 * widest word so the line never reflows, and the visible one is an in-flow grid
 * item, so it inherits the h1's family, weight, size and tracking and sits on the
 * same baseline as the rest of the line. justify-self-end keeps its right edge
 * fixed, so a shorter word cannot open a gap before "online.".
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
    <span className="inline-grid align-baseline text-teal">
      {ROTATING_WORDS.map((w) => (
        <span key={w} aria-hidden className="invisible col-start-1 row-start-1">
          {w}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          initial={{ y: '0.25em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.25em', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="col-start-1 row-start-1 justify-self-end"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

'use client';

import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { useIdleScrollHint } from '@/components/ui/ScrollHint';
import { useAutoplayProgress } from '@/lib/hooks/useAutoplayProgress';
import { useEffect, useRef, useState } from 'react';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

const ROTATING_WORDS = ['Starta', 'Växa', 'Skala'] as const;
const WORD_INTERVAL = 2500;
/** Word shown when the visitor prefers reduced motion (no rotation). */
const STATIC_WORD = 'Växa';

/**
 * Introt: herons bild-/kortövergång spelas av sig själv vid laddning i stället för att styras av
 * scrollen. Samma transformer som när den var scrollstyrd, men baklänges: från kortläget vid
 * INTRO_FROM (bilden som ett rundat kort på vit botten, texten dold) till helbild vid 0 – alltså
 * slutläget är heron som den alltid har sett ut överst på sidan.
 */
const INTRO_FROM = 0.25;
const INTRO_DURATION = 1.2;
const INTRO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Scrollpåminnelsens markör: täcker heron och är `hidden md:block`, så rutan följer
  // samma mobilregel som övriga scrollsektioner (ingen ruta under 768 px).
  const hintRef = useRef<HTMLDivElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
  const heroOff = nofx.hero; // TEMP: flicker bisect, remove after diagnosis

  // 0 → 1 en gång när heron är i bild (vid laddning); 1 direkt vid reducerad rörelse.
  const intro = useAutoplayProgress(sectionRef, { duration: INTRO_DURATION, ease: INTRO_EASE, once: true });
  // Samma skala som den tidigare scrollprogressen: INTRO_FROM → 0.
  const heroProgress = useTransform(intro, [0, 1], [INTRO_FROM, 0]);

  // Påminnelsen visas i heron först efter 5 s utan scroll och försvinner vid första scroll
  // (aldrig under 768 px och aldrig vid reducerad rörelse).
  useIdleScrollHint(hintRef, !reduce);

  // IMAGE / CARD TRANSFORM
  const imageScale = useTransform(heroProgress, [0, 0.2, 0.4, 0.5], [1.04, 0.95, 0.65, 0.45]);
  // Positiv Y flyttar boxen ned mot nedre delen av viewporten.
  const imageY = useTransform(heroProgress, [0, 0.5], ['0%', '42%']);
  const imageRadius = useTransform(heroProgress, [0, 0.25, 0.5], [0, 24, 40]);
  const framePadding = useTransform(heroProgress, [0, 0.5], [0, 96]); // px top-padding
  // Bottenluften under bilden växer på samma sätt från 0 till --hero-pb (2.5rem, md: 4rem).
  // Den var tidigare fast, så att bilden i toppläget slutade ~50px ovanför herons nederkant och
  // lämnade en remsa av den mörka bakgrunden (gradient-mesh + brus) synlig – mest märkbart på
  // låga fönster, t.ex. Windows med 125 % skalning. Vid 0 täcker bilden nu hela ytan; från
  // halva scrollen är luften densamma som förut.
  const framePaddingBottom = useTransform(
    heroProgress,
    (p) => `calc(var(--hero-pb) * ${Math.min(Math.max(p / 0.5, 0), 1)})`
  );
  const imageOpacity = useTransform(heroProgress, [0.3, 0.55], [1, 0]); // fade out mot slutet av hero-rörelsen

  // BACKGROUND TRANSFORM
  // Växla till vit bakgrund medan bilden fortfarande är synlig, men något senare,
  // så övergången till sektion 2 känns mjuk men inte blixtsnabb.
  // Made white background appear earlier and more smoothly to prevent gaps on Windows
  const darkBgOpacity = useTransform(heroProgress, [0, 0.15], [1, 0]);
  // White background div is now redundant since section has bg-white, but kept for smooth transition
  const whiteBgOpacity = useTransform(heroProgress, [0, 0.25], [0, 1]);

  // OVERLAY CONTENT (text) – keep it readable on top of the image.
  const overlayGradientOpacity = useTransform(heroProgress, [0, 0.6], [1, 0.85]);
  // The copy sits in its own layer (it must not inherit the image's scale/y), so it
  // needs its own fade – otherwise white text would linger over the white background.
  const textOpacity = useTransform(heroProgress, [0, 0.22], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`relative min-h-screen overflow-hidden bg-white ${
        heroOff ? '' : 'will-change-transform transform-gpu'
      }`} // TEMP: flicker bisect, remove after diagnosis
    >
      <div ref={hintRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block" />
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

      {/* Wrapper whose padding gives the image air in the card state; the intro
          takes it from a smaller box to the full-bleed image. */}
      <motion.div
        style={
          heroOff
            ? { paddingTop: 0, paddingBottom: 'var(--hero-pb)' } // TEMP: flicker bisect, remove after diagnosis
            : {
                paddingTop: framePadding,
                paddingBottom: framePaddingBottom,
                willChange: 'transform',
                transform: 'translateZ(0)',
              }
        }
        className="relative z-[2] w-full h-screen flex items-end justify-center [--hero-pb:2.5rem] md:[--hero-pb:4rem]"
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
          Butik, betalningar, bokföring, frakt och kunder – samlat på ett ställe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          // Natural-width pills, centred, wrapping to a stack only when they do not fit side by side.
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <AnimatedButton href="/kontakt" variant="primary" size="lg">
            Boka demo
          </AnimatedButton>
          <AnimatedButton href="#next-section" variant="secondary" size="lg" onDark>
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
  const reduce = usePrefersReducedMotion();
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

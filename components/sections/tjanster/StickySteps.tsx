'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { ServicePicture } from './ServicePicture';
import type { ServiceImage, ServiceStep } from './types';

type StickyStepsProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  image: ServiceImage;
  steps: ServiceStep[];
  /** `dark` for pages with a dark layout (and a white header), e.g. /analys. Default `light`. */
  theme?: 'light' | 'dark';
  /** Room for a larger step widget over the photo: 30rem instead of 22rem. Default off. */
  wideVisual?: boolean;
};

const themes = {
  light: { section: 'bg-white', eyebrow: 'text-teal-dark', heading: 'text-gray-900', body: 'text-gray-700', number: 'text-teal-dark', rule: 'border-gray-200', line: 'bg-teal-dark', media: 'bg-surface-stone' },
  dark: { section: 'bg-black', eyebrow: 'text-teal', heading: 'text-white', body: 'text-white/70', number: 'text-teal', rule: 'border-white/15', line: 'bg-teal', media: 'bg-black-tertiary' },
} as const;

/*
 * A process in a few steps, Revolut's sticky pattern (_research/revolut-analys.md, typ 5):
 * from `lg` the section is one viewport per step tall, a frame pins to the top,
 * and scrolling moves the active step – the text highlights and the step's
 * widget swaps over the photo.
 *
 * Below `lg`, and at every width under reduced motion, there is no pinning:
 * the photo and the steps are laid out statically, each step with its widget
 * already in its final state. Long pinned sections on phones feel like the
 * page is stuck, and Revolut compensates with video we don't have.
 *
 * Both layouts are in the DOM and swapped with CSS, so the server HTML is right
 * at every width without knowing the viewport. The hidden one is display:none,
 * so it is out of the accessibility tree.
 */
export function StickySteps({ id, eyebrow, title, intro, image, steps, theme = 'light', wideVisual = false }: StickyStepsProps) {
  const t = themes[theme];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();
  const { reveal, shouldReduceMotion } = useReveal();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const pinned = !shouldReduceMotion;

  const header = (headingIdForThis?: string) => (
    <div className="max-w-[34rem]">
      {eyebrow ? <p className={`text-overline mb-5 ${t.eyebrow}`}>{eyebrow}</p> : null}
      <h2 id={headingIdForThis} className={`text-[2.25rem] font-semibold leading-[1.05] tracking-tight ${t.heading} sm:text-5xl`}>
        {title}
      </h2>
      {intro ? <p className={`mt-5 text-base leading-relaxed ${t.body} md:text-lg`}>{intro}</p> : null}
    </div>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={`relative ${t.section}`}>
      {pinned ? (
        <div ref={trackRef} className="hidden lg:block" style={{ height: `${steps.length * 100}svh` }}>
          <div className="sticky top-0 mx-auto grid h-[100svh] max-w-[1440px] grid-cols-12 gap-16 px-20 pb-12 pt-24">
            {/* Photo with the active step's widget */}
            <div className={`relative col-span-7 overflow-hidden rounded-3xl ${t.media}`}>
              <ServicePicture image={image} sizes="(min-width: 1440px) 760px, 58vw" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(14,11,8,0.35) 0%, rgba(14,11,8,0) 45%)' }}
              />
              <div className={`absolute bottom-8 left-8 ${wideVisual ? 'w-[min(30rem,calc(100%-4rem))]' : 'w-[min(22rem,calc(100%-4rem))]'}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {steps[active].visual({ active: true })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Text: all steps listed, the active one highlighted */}
            <div className="col-span-5 flex flex-col justify-center">
              {header(headingId)}
              <ol className={`relative mt-12 space-y-8 border-l ${t.rule} pl-8`}>
                <motion.span
                  aria-hidden="true"
                  className={`absolute -left-px top-0 w-0.5 origin-top ${t.line}`}
                  style={{ height: '100%', scaleY: scrollYProgress }}
                />
                {steps.map((step, i) => (
                  <li
                    key={step.title}
                    aria-current={i === active ? 'step' : undefined}
                    className={`transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <p className={`text-ui-label font-semibold tabular-nums ${t.number}`}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className={`mt-1 text-xl font-semibold ${t.heading}`}>{step.title}</h3>
                    <p className={`mt-2 max-w-[40ch] text-base leading-relaxed ${t.body}`}>{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : null}

      {/* Static layout: below lg, and at every width under reduced motion. */}
      <div className={`mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28 lg:px-20 ${pinned ? 'lg:hidden' : ''}`}>
        <motion.div {...reveal(0)}>{header(pinned ? undefined : headingId)}</motion.div>
        <motion.div
          {...reveal(0.1)}
          className={`relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl ${t.media} md:aspect-[16/9]`}
        >
          <ServicePicture image={image} sizes="(min-width: 1440px) 1280px, 100vw" />
        </motion.div>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <motion.li key={step.title} {...reveal(0.1 + i * 0.06)} className="flex flex-col">
              <p className={`text-ui-label font-semibold tabular-nums ${t.number}`}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className={`mt-1 text-xl font-semibold ${t.heading}`}>{step.title}</h3>
              <p className={`mt-2 text-base leading-relaxed ${t.body}`}>{step.body}</p>
              <div className="mt-5">{step.visual({ active: true })}</div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

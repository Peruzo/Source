'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { GROWTH_R1 } from './content-r1';

// REDESIGN 1, PASS 3: kopia av Growth i ../Clients.tsx med GROWTH_R1 (tre bilder i stället
// för två). Beteendet är identiskt: bilderna tonar över i varandra, den aktiva indikatorn
// fylls på 8 s och driver bytet, bytet pausar utanför bild och börjar om från bild 1, och
// indikatorerna går att klicka. Med reducerad rörelse byts bilden på timer utan fyllnad.
// Alla bilder laddas ivrigt (loading="eager"): de ligger staplade och osynliga tills de
// blir aktiva, så en lat inläsning kan inte förutsäga när de behövs.
export function GrowthR1() {
  const ref = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const reduce = usePrefersReducedMotion();
  const slides = GROWTH_R1.slides;
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '-30% 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) setCurrent(0);
  }, [inView]);

  useEffect(() => {
    if (!reduce || !inView) return;
    const t = setTimeout(next, GROWTH_R1.slideDurationMs);
    return () => clearTimeout(t);
  }, [reduce, inView, current]);

  const active = slides[current];

  return (
    <section ref={ref} className="rd-growth">
      <div className="rd-growth-media">
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.image}
            alt=""
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            className="rd-growth-img"
            data-slide={s.id}
            data-active={i === current ? 'true' : undefined}
          />
        ))}
      </div>
      <div className="rd-growth-copy">
        <p className="rd-overline rd-overline-on-dark">{GROWTH_R1.overline}</p>
        <h2 className="rd-h2 rd-growth-h">
          {GROWTH_R1.titleA}
          <span className="rd-accent-on-dark">{GROWTH_R1.titleAccent}</span>
          {GROWTH_R1.titleB}
        </h2>
        <div key={active.id} className="rd-growth-slide">
          <h3 className="rd-h3">{active.title}</h3>
          <p className="rd-body-lg">{active.body}</p>
        </div>
        <div className="rd-indicators">
          {slides.map((s, i) => {
            const isActive = i === current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={s.title}
                aria-current={isActive ? 'true' : undefined}
                className="rd-indicator"
              >
                {isActive &&
                  (reduce ? (
                    <span className="rd-indicator-fill rd-indicator-full" />
                  ) : (
                    <span
                      key={`${current}-${inView}`}
                      className="rd-indicator-fill"
                      data-running={inView ? 'true' : undefined}
                      style={{ animationDuration: `${GROWTH_R1.slideDurationMs}ms` }}
                      onAnimationEnd={() => {
                        if (inView) next();
                      }}
                    />
                  ))}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

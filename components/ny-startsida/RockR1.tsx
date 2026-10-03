'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { ROCK } from './content';

/*
 * REDESIGN 1, PASS 4: stenscenen renderad som develops PlatformRock
 * (components/sections/PlatformRock.tsx på 49f3724), lager för lager:
 *   - scenens bakgrund: develops radiella vinjett (#ecedeb → #9a9a92)
 *   - stenen: video (desktop) eller slutbilden (mobil, reducerad rörelse) med bredden
 *     min(92vw, 1040px), höjd auto och develops radiella mask (ROCK_MEDIA_STYLE)
 *   - svävrörelsen rockFloat 7 s (±13 px, −0,5°), av vid statisk scen
 *   - skuggvinjetten (rgba(6,10,12) → rgba(4,7,9) 0,74) som tonar bort mot grönt
 *   - ljusglöden (vit, upp till 0,3) som tonar fram mot slutet
 *   - hotspotsen (Ekonomi, System, Main) med develops utseende, positionerade mot scenen
 * Övergången från sektion 2 (pass 7) och mot nästa sektion ligger i r1.css.
 *
 * PASS 10: funktionschipsen och den gröna träffglöden är borttagna. Gräset växer jämnt med
 * scrollen: videons tid följer scrollpositionen kontinuerligt (en sökning per bildruta, via
 * timeAt) från första till sista bildrutan över hela scenens scrollsträcka, och stenen är
 * helt grön när sträckan tar slut. Ljussättningen (skugga, ljusglöd, budskap, hotspots) följer scrollen
 * som förut.
 *
 * Spelas en gång (pass 7, oförändrat): när sträckan är slut sparas DONE_KEY i sessionStorage,
 * scenen fryses i slutläget och svävningen pausas där den står. Först när hela scenen ligger
 * ovanför (eller under) visningsytan tas den extra scrollsträckan bort: sektionen får
 * data-done (normal höjd, inget sticky-läge) och scrollpositionen kompenseras i samma
 * bildruta med exakt den borttagna höjden. Vid omladdning med flaggan sätter ett litet
 * inline-skript i PageR1 data-r1-rock-done på <html> före första målningen, så att CSS ger
 * normal höjd och slutbild redan innan React har hydrerat.
 */

const REVEAL_AT = 0.9; // som develops RockHotspots
const HIDE_AT = 0.8;
const HOT_GAP = 8;
const MOBILE_QUERY = '(max-width: 767px)';
export const DONE_KEY = 'r1-rock-done';
/* Videon växer inte jämnt i tiden (ruta 1–11 är helt grå, sedan accelererar grönskan).
   Scrollen kopplas därför till videotiden via de bildrutor som delar vägen grå → helt grön i
   femton lika stora visuella steg (medelavvikelsen mot slutbilden minskar med 1/15 per steg,
   uppmätt i pass 7), med linjär interpolation mellan dem: kontinuerligt, utan steg, och
   grönskan ökar jämnt med scrollen. Ruta 96 (sista, helt grön) nås exakt när sträckan tar slut. */
const EVEN_FRAMES = [1, 27, 39, 45, 50, 55, 57, 61, 65, 72, 75, 78, 82, 88, 92, 96];
const EVEN_TIMES = EVEN_FRAMES.map((f) => (f - 1) / 24 + 1 / 48);
function timeAt(p: number) {
  const x = Math.min(Math.max(p, 0), 1) * (EVEN_TIMES.length - 1);
  const i = Math.min(Math.floor(x), EVEN_TIMES.length - 2);
  return EVEN_TIMES[i] + (EVEN_TIMES[i + 1] - EVEN_TIMES[i]) * (x - i);
}

function readDone() {
  try {
    return window.sessionStorage.getItem(DONE_KEY) === '1';
  } catch {
    return false;
  }
}
function writeDone() {
  try {
    window.sessionStorage.setItem(DONE_KEY, '1');
  } catch {}
}

function subscribeMobile(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}
function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE_QUERY).matches, () => false);
}

export function RockR1() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingTime = useRef(0);
  const [revealed, setRevealed] = useState(false);
  // complete: sträckan är slut (scenen fryst i slutläget, sträckan finns kvar).
  // done: sträckan är borttagen, scenen renderas som en vanlig sektion med slutbilden.
  const [complete, setComplete] = useState(false);
  const [done, setDone] = useState(false);
  const completeRef = useRef(false);
  const reduce = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const isStatic = reduce || isMobile;
  const isFinal = isStatic || done;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useMotionValue(0);

  // Flaggan från ett tidigare genomspelat besök (samma session).
  useEffect(() => {
    if (readDone()) {
      completeRef.current = true;
      setComplete(true);
      setDone(true);
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (isFinal || completeRef.current) return;
    progress.set(p);
    if (p > REVEAL_AT) setRevealed(true);
    else if (p < HIDE_AT) setRevealed(false);
  });

  useEffect(() => {
    if (!isFinal && !complete) return;
    progress.set(1);
    setRevealed(true);
  }, [isFinal, complete, progress]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      try {
        v.currentTime = timeAt(progress.get());
      } catch {}
    };
    if (v.readyState >= 1 && v.duration) onMeta();
    else v.addEventListener('loadedmetadata', onMeta);
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, [isFinal, progress]);

  // Videon följer scrollen kontinuerligt: högst en sökning per bildruta.
  const seek = useCallback(() => {
    rafRef.current = null;
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - pendingTime.current) > 0.004) {
      try {
        v.currentTime = pendingTime.current;
      } catch {}
    }
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  useMotionValueEvent(progress, 'change', (p) => {
    if (isFinal) return;
    pendingTime.current = timeAt(p);
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(seek);
    if (p >= 1 - 1e-6 && !completeRef.current) {
      completeRef.current = true;
      writeDone();
      setComplete(true);
    }
  });

  // Ta bort scrollsträckan först när hela scenen är utanför visningsytan. Ligger den
  // ovanför kompenseras scrollpositionen i samma bildruta med exakt den borttagna höjden.
  const collapse = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec || sec.hasAttribute('data-done')) return true;
    const r = sec.getBoundingClientRect();
    const above = r.bottom <= 0;
    const below = r.top >= window.innerHeight;
    if (!above && !below) return false;
    const y0 = window.scrollY;
    const h0 = sec.offsetHeight;
    sec.setAttribute('data-done', '');
    const removed = h0 - sec.offsetHeight;
    if (above && removed > 0) window.scrollTo({ top: y0 - removed, behavior: 'instant' });
    setDone(true);
    return true;
  }, []);

  useEffect(() => {
    if (!complete || done || isStatic) return;
    if (collapse()) return;
    const onScroll = () => {
      if (collapse()) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [complete, done, isStatic, collapse]);

  // Develops ljussättning (PlatformRock.tsx:211-214), följer scrollen som förut.
  const shadowOpacity = useTransform(progress, [0, 1], [1, 0]);
  const glowOpacity = useTransform(progress, [0.45, 1], [0, 0.3]);
  const msgOpacity = useTransform(progress, [0.86, 0.97], [0, 1]);
  const msgY = useTransform(progress, [0.86, 1], [28, 0]);

  return (
    <section
      ref={sectionRef}
      className="r1-rock"
      aria-label={ROCK.ariaLabel}
      data-static={isStatic ? '' : undefined}
      data-done={done ? '' : undefined}
      data-complete={complete ? '' : undefined}
    >
      <div className="r1-rock-stage">
        {/* PASS 7: sektion 2:s färg under scenens lager i övergångszonen (se r1.css). */}
        <span aria-hidden="true" className="r1-rock-base" />
        <span aria-hidden="true" className="r1-rock-bg r1-rock-under" />

        <div className={`r1-rock-media${isFinal ? '' : ' r1-rock-float'}`}>
          {isFinal ? (
            <Image
              src={ROCK.finalFrame}
              alt=""
              width={1280}
              height={720}
              sizes="(max-width: 767px) 92vw, 1040px"
              className="r1-rock-video"
            />
          ) : (
            <>
              <video ref={videoRef} src={ROCK.video} muted playsInline preload="auto" className="r1-rock-video r1-rock-live" />
              {/* Visas bara via CSS när flaggan är satt före hydrering (html[data-r1-rock-done]). */}
              <Image
                src={ROCK.finalFrame}
                alt=""
                width={1280}
                height={720}
                sizes="1040px"
                className="r1-rock-video r1-rock-prefinal"
              />
            </>
          )}
        </div>

        <motion.span
          aria-hidden="true"
          className="r1-rock-shadow r1-rock-under"
          style={{ opacity: isFinal ? 0 : shadowOpacity }}
        />
        <motion.span
          aria-hidden="true"
          className="r1-rock-glow r1-rock-under"
          style={{ opacity: isFinal ? 0.3 : glowOpacity }}
        />

        <motion.div className="rd-rock-msg r1-rock-msg" style={{ opacity: isFinal ? 1 : msgOpacity, y: isFinal ? 0 : msgY }}>
          <p className="rd-overline">{ROCK.overline}</p>
          <h2 className="rd-rock-title">{ROCK.title}</h2>
        </motion.div>

        <Hotspots revealed={revealed} />
      </div>
    </section>
  );
}

/* Hotspots med develops utseende (RockHotspots.tsx), positionerade mot scenen. */
function Hotspots({ revealed }: { revealed: boolean }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    if (!revealed) setOpenKey(null);
  }, [revealed]);

  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openKey]);

  return (
    <div className="r1-hot-layer" data-revealed={revealed ? 'true' : undefined}>
      {ROCK.hotspots.map((c, i) => {
        const isRight = c.side === 'right';
        const open = openKey === c.key;
        const toggle = () => setOpenKey(open ? null : c.key);
        const labelPos = isRight ? { left: `${c.mx + HOT_GAP}%` } : { right: `${100 - (c.mx - HOT_GAP)}%` };
        return (
          <div key={c.key}>
            <span
              aria-hidden="true"
              className="r1-hot-line"
              style={{
                top: `${c.my}%`,
                left: isRight ? `${c.mx}%` : `${c.mx - HOT_GAP}%`,
                width: `${HOT_GAP}%`,
                transformOrigin: isRight ? 'left center' : 'right center',
                transitionDelay: `${0.15 + i * 0.12}s`,
              }}
            />
            <button
              type="button"
              onClick={toggle}
              aria-label={c.label}
              aria-expanded={open}
              tabIndex={revealed ? 0 : -1}
              className="r1-hot-marker"
              data-open={open ? 'true' : undefined}
              style={{ top: `${c.my}%`, left: `${c.mx}%`, transitionDelay: `${i * 0.12}s` }}
            />
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              tabIndex={revealed ? 0 : -1}
              className={`r1-hot-label ${isRight ? 'r1-hot-right' : 'r1-hot-left'}`}
              style={{ top: `${c.my}%`, ...labelPos, transitionDelay: `${0.25 + i * 0.12}s` }}
            >
              {c.label}
              <span className="r1-hot-plus" data-open={open ? 'true' : undefined} aria-hidden="true">
                +
              </span>
            </button>
            {open && (
              <>
                <span className="rd-hot-backdrop" onClick={() => setOpenKey(null)} aria-hidden="true" />
                <div
                  role="menu"
                  className="rd-hot-menu"
                  style={{
                    ...labelPos,
                    ...(c.openDir === 'down' ? { top: `calc(${c.my}% + 26px)` } : { bottom: `calc(${100 - c.my}% + 26px)` }),
                  }}
                >
                  <p className="rd-overline">{c.label}</p>
                  {c.items.map((it) => (
                    <a key={it.name} href={it.href} target="_blank" rel="noopener noreferrer" role="menuitem">
                      <span className="rd-dot" aria-hidden="true" />
                      {it.name}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

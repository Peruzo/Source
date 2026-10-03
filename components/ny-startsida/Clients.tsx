'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { ASSISTANT, SHOWCASE } from './content';

// NY STARTSIDA: klientsektioner med samma beteende som på dagens startsida, kopierade från
// experimentets redesign. Rörelse sker bara med transform/opacity via CSS-klasser.

/* ---------- 6 AIAssistant ----------
   Samma beteende som components/sections/AIAssistant.tsx: tre svävande bubblor som
   periodvis (var 8:e s, i 1,5 s) byter till ett skrivläge med tre punkter. */
export function Assistant() {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setTyping(true);
    const first = setTimeout(() => setTyping(false), ASSISTANT.typingMs);
    let repeat: ReturnType<typeof setTimeout> | null = null;
    const id = setInterval(() => {
      setTyping(true);
      repeat = setTimeout(() => setTyping(false), ASSISTANT.typingMs);
    }, ASSISTANT.repeatMs);
    return () => {
      clearTimeout(first);
      if (repeat) clearTimeout(repeat);
      clearInterval(id);
    };
  }, []);

  return (
    <section className="rd-assistant">
      <div className="rd-bubbles" data-typing={typing ? 'true' : undefined} aria-hidden="true">
        <span className="rd-bubbles-typing">
          <span />
          <span />
          <span />
        </span>
        <span className="rd-bubbles-float">
          <span className="rd-bubble rd-bubble-1" />
          <span className="rd-bubble rd-bubble-2" />
          <span className="rd-bubble rd-bubble-3" />
        </span>
      </div>
      <div className="rd-assistant-copy rd-reveal">
        <p className="rd-overline">{ASSISTANT.overline}</p>
        <h2 className="rd-h2">{ASSISTANT.title}</h2>
        <p className="rd-body-lg">{ASSISTANT.body1}</p>
        <p className="rd-body rd-muted">{ASSISTANT.body2}</p>
        <div className="rd-assistant-cta">
          <Link href={ASSISTANT.cta.href} className="rd-pill rd-pill-primary">
            {ASSISTANT.cta.label}
            <svg className="rd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="rd-note">{ASSISTANT.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8 AIAgentShowcase ----------
   Samma beteende som components/sections/AIAgentShowcase.tsx: videon spelar tyst i
   loop; med reducerad rörelse pausas den, kontrollerna visas och märket döljs. */
export function Showcase() {
  const reduce = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (reduce && videoRef.current) videoRef.current.pause();
  }, [reduce]);

  return (
    <section className="rd-showcase">
      <header className="rd-showcase-head rd-reveal">
        <p className="rd-overline">{SHOWCASE.overline}</p>
        <h2 className="rd-h2">{SHOWCASE.title}</h2>
        <p className="rd-body-lg">{SHOWCASE.lead}</p>
      </header>
      <div className="rd-showcase-grid">
        <div className="rd-showcase-video rd-reveal">
          <video
            ref={videoRef}
            src={SHOWCASE.video}
            poster={SHOWCASE.poster}
            preload="metadata"
            playsInline
            muted
            loop
            autoPlay={!reduce}
            controls={reduce === true}
          />
          {!reduce && (
            <span className="rd-showcase-badge">
              <span className="rd-dot" aria-hidden="true" />
              {SHOWCASE.badge}
            </span>
          )}
        </div>
        <div className="rd-showcase-info rd-reveal">
          <p className="rd-showcase-info-title">{SHOWCASE.infoTitle}</p>
          <p className="rd-body">{SHOWCASE.infoBody}</p>
        </div>
      </div>
    </section>
  );
}

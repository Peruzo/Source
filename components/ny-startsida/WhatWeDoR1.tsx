import { WHAT_R1 } from './content-r1';
import { CategoryWidget } from './CategoryWidgets';
import { PhotoBubbles } from './PhotoBubbles';
import { WhatLineR1 } from './WhatLineR1';

// REDESIGN 1: kopia av WhatWeDo i ../sections.tsx, bara för redesign 1.
// Samma struktur och klasser (tidslinjen, rd-service, rd-reveal) så att mekaniken i
// ../base.css gäller oförändrat. PASS 3: budskapet att Source är byggt för att formas, och
// i stället för bilder en byggd UI-vy per kategori (ConfigViews.tsx) som visar en verifierad
// konfigurationsmöjlighet. Förra passets gröna rad finns kvar som piller ovanför rubriken.

export function WhatWeDoR1() {
  return (
    <section className="rd-what">
      <header className="rd-what-head rd-reveal">
        <p className="rd-overline">{WHAT_R1.overline}</p>
        <h2 className="rd-h2">
          {WHAT_R1.titleA} <span className="rd-accent">{WHAT_R1.titleB}</span>
        </h2>
        <p className="rd-body-lg r1-what-lead">{WHAT_R1.lead}</p>
      </header>
      {/* PASS 8: den raka linjen (.rd-timeline-line) är ersatt av WhatLineR1. */}
      <div className="rd-timeline">
        {WHAT_R1.categories.map((c, i) => (
          <article key={c.number} className={`rd-service ${i % 2 === 0 ? 'rd-even' : 'rd-odd'}`}>
            <div className="rd-service-text rd-reveal">
              <span className="rd-service-num" aria-hidden="true">
                {c.number}
              </span>
              <p className="r1-tagline">
                <span className="rd-dot" aria-hidden="true" />
                {c.tagline}
              </p>
              <h3 className="rd-h3">{c.title}</h3>
              <p className="rd-body-lg">{c.description}</p>
              <ul className="rd-details">
                {c.details.map((d) => (
                  <li key={d}>
                    <span className="rd-dot" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {/* PASS 5: develops originalbild (oredigerad, 1920 × 1080) visas i 16:9 så att inget av
                bildens inbakade text beskärs. Widgeten ligger under bilden, inte över den, eftersom
                bildernas egna gröna bubblor och motiv täcker hela ytan. */}
            <figure className="rd-service-fig r1-fig rd-reveal">
              <div className="rd-service-frame r1-photo">
                <img
                  src={c.imageSrc}
                  alt={c.title}
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="r1-photo-img"
                />
                {/* PASS 6: nya foton för kategori 1–3, bubblorna som riktig text ovanpå. */}
                {c.bubbleSet ? <PhotoBubbles set={c.bubbleSet} /> : null}
              </div>
              <div className="r1-view-wrap r1-under-photo">
                <CategoryWidget widget={c.widget} label={c.widgetLabel} />
              </div>
            </figure>
          </article>
        ))}
      </div>
      <WhatLineR1 />
    </section>
  );
}

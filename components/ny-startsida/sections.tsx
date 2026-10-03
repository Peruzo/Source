import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  FAQS,
  FINAL,
  HERO,
  PORTFOLIO,
  PRICING,
  portfolioKindLabels,
  portfolioProjects,
} from './content';
import type { PortfolioProject } from '@/lib/data/portfolioProjects';

// NY STARTSIDA: serverrenderade sektioner, kopierade från experimentets redesign
// (experiment/landing-remodel). Bara de sektioner som /ny-startsida använder. Allt utseende
// ligger i base.css och ny-startsida.css, scopat under #ny-startsida. Klasserna rd-reveal och
// rd-hero-* används av CSS:ens scroll-driven animations (endast transform/opacity, avstängda
// vid prefers-reduced-motion).

/* ---------- 1 Hero ---------- */
export function Hero() {
  return (
    <section id="hero" className="rd-hero" aria-labelledby="rd-h1">
      <div className="rd-hero-media">
        <Image
          src={HERO.image.src}
          alt={HERO.image.alt}
          width={HERO.image.width}
          height={HERO.image.height}
          priority
          sizes="100vw"
          className="rd-hero-img"
        />
      </div>
      <div className="rd-hero-copy">
        <h1 id="rd-h1" className="rd-h1">
          {/* Skärmläsare får samma statiska ord som dagens Hero visar vid reducerad rörelse. */}
          <span className="rd-sr">
            {HERO.staticWord} {HERO.rest}
          </span>
          <span aria-hidden="true">
            <span className="rd-rot">
              {HERO.rotatingWords.map((w) => (
                <span key={w} className={w === HERO.staticWord ? 'rd-rot-static' : undefined}>
                  {w}
                </span>
              ))}
            </span>{' '}
            {HERO.rest}
          </span>
        </h1>
        <p className="rd-hero-sub">{HERO.sub}</p>
        <div className="rd-ctas">
          <Link href={HERO.primary.href} className="rd-pill rd-pill-primary">
            {HERO.primary.label}
          </Link>
          <a href={HERO.secondary.href} className="rd-pill rd-pill-ghost-dark">
            {HERO.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7 PortfolioTeaser ---------- */
function ProjectLink({ project, className, children }: { project: PortfolioProject; className: string; children: ReactNode }) {
  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={project.href} className={className}>
      {children}
    </Link>
  );
}

function Cta({ label }: { label: string }) {
  return (
    <span className="rd-card-cta">
      {label}
      <span aria-hidden="true" className="rd-arrow">
        →
      </span>
    </span>
  );
}

export function Portfolio() {
  const clients = portfolioProjects.filter((p) => p.kind === 'client');
  const concepts = portfolioProjects.filter((p) => p.kind === 'concept');
  return (
    <section className="rd-portfolio">
      <header className="rd-portfolio-head rd-reveal">
        <p className="rd-overline">{PORTFOLIO.overline}</p>
        <h2 className="rd-h2">{PORTFOLIO.title}</h2>
        <p className="rd-body-lg">{PORTFOLIO.lead}</p>
      </header>

      {clients.map((p) => (
        <ProjectLink key={p.slug} project={p} className="rd-featured rd-reveal">
          <span className="rd-featured-media">
            {p.siteImage && (
              <Image
                src={p.siteImage}
                alt={`Webbplatsen för ${p.title}`}
                fill
                sizes="(max-width: 1023px) 100vw, 66vw"
                className="rd-featured-img"
              />
            )}
          </span>
          <span className="rd-featured-body">
            {p.logo && (
              <span className="rd-featured-logo">
                <Image src={p.logo} alt={`${p.title} logotyp`} fill sizes="80px" className="rd-contain" />
              </span>
            )}
            <span className="rd-overline">{portfolioKindLabels[p.kind]}</span>
            <span className="rd-featured-title">{p.title}</span>
            <span className="rd-body">{p.description ?? p.metric}</span>
            <Cta label={p.ctaLabel} />
          </span>
        </ProjectLink>
      ))}

      {concepts.length > 0 && (
        <div className="rd-concepts">
          <div className="rd-concepts-head rd-reveal">
            <h3 className="rd-h3">{PORTFOLIO.conceptTitle}</h3>
            <p className="rd-body">{PORTFOLIO.conceptLead}</p>
          </div>
          <div className="rd-concept-row">
            {concepts.map((p) => (
              <article key={p.slug} className="rd-concept rd-reveal">
                <ProjectLink project={p} className="rd-concept-link">
                  {/* Logotyp som standard, skärmdump vid hovring (som i dagens ProjectCard). */}
                  <span className="rd-concept-media">
                    {p.logo && (
                      <Image src={p.logo} alt={p.title} fill sizes="(max-width: 1023px) 320px, 33vw" className="rd-concept-logo" />
                    )}
                    {p.siteImage && (
                      <Image
                        src={p.siteImage}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 1023px) 320px, 33vw"
                        className="rd-concept-shot"
                      />
                    )}
                  </span>
                  <span className="rd-concept-kind">{portfolioKindLabels[p.kind]}</span>
                  <span className="rd-concept-title">{p.title}</span>
                  <span className="rd-concept-metric">{p.metric}</span>
                  <Cta label={p.ctaLabel} />
                </ProjectLink>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="rd-center">
        <Link href={PORTFOLIO.cta.href} className="rd-pill rd-pill-quiet">
          {PORTFOLIO.cta.label}
          <span aria-hidden="true" className="rd-arrow">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ---------- 9 FAQ ---------- */
export function Faq() {
  return (
    <section className="rd-faq">
      <header className="rd-faq-head rd-reveal">
        <h2 className="rd-h2">{FAQS.title}</h2>
        <div className="rd-ctas rd-ctas-center">
          <Link href={FAQS.primary.href} className="rd-pill rd-pill-primary">
            {FAQS.primary.label}
          </Link>
          <Link href={FAQS.secondary.href} className="rd-pill rd-pill-outline">
            {FAQS.secondary.label}
          </Link>
        </div>
      </header>
      {/* Dragspel: en fråga öppen åt gången, som i dagens FAQ (details name = exklusiv grupp). */}
      <div className="rd-faq-list">
        {FAQS.items.map((f) => (
          <details key={f.question} name="rd-faq" className="rd-faq-item">
            <summary>
              <span>{f.question}</span>
              <span className="rd-faq-icon" aria-hidden="true">
                ↓
              </span>
            </summary>
            <p className="rd-faq-answer">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- 10 PricingTeaser ---------- */
export function Pricing() {
  return (
    <section className="rd-pricing">
      <header className="rd-pricing-head rd-reveal">
        <p className="rd-overline">{PRICING.overline}</p>
        <h2 className="rd-h2">
          {PRICING.titleA}
          <br />
          {PRICING.titleB}
        </h2>
      </header>
      <div className="rd-price-card rd-reveal">
        <span className="rd-price-badge">{PRICING.badge}</span>
        <div className="rd-price-main">
          <p className="rd-price-from">{PRICING.from}</p>
          <p className="rd-price-amount">
            {PRICING.price}
            <span>{PRICING.currency}</span>
          </p>
          <p className="rd-price-period">{PRICING.period}</p>
        </div>
        <ul className="rd-price-checks">
          {PRICING.checks.map((c) => (
            <li key={c}>
              {/* Samma bock-ikon som dagens PricingTeaser. */}
              <svg className="rd-check" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {c}
            </li>
          ))}
        </ul>
        <ul className="rd-price-features">
          {PRICING.features.map((f) => (
            <li key={f}>
              <span className="rd-dot" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <div className="rd-center">
          <Link href={PRICING.cta.href} className="rd-pill rd-pill-primary rd-pill-lg">
            {PRICING.cta.label}
          </Link>
        </div>
      </div>
      <p className="rd-footnote">{PRICING.footnote}</p>
    </section>
  );
}

/* ---------- 11 FinalCTA ---------- */
export function Final() {
  return (
    <section className="rd-final">
      <h2 className="rd-final-h rd-reveal">
        {FINAL.titleA}
        <span className="rd-accent-on-dark">{FINAL.titleAccent}</span>
        {FINAL.titleB}
      </h2>
      <p className="rd-final-body rd-reveal">{FINAL.body}</p>
      <div className="rd-ctas rd-ctas-center rd-reveal">
        <Link href={FINAL.primary.href} className="rd-pill rd-pill-primary rd-pill-lg">
          {FINAL.primary.label}
        </Link>
        <Link href={FINAL.secondary.href} className="rd-pill rd-pill-ghost-dark rd-pill-lg">
          {FINAL.secondary.label}
        </Link>
      </div>
      <div className="rd-stats">
        {FINAL.stats.map((s) => (
          <div key={s.label}>
            <p className="rd-stat-value">{s.value}</p>
            <p className="rd-stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

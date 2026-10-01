'use client';

import { useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { PortfolioCarousel } from '@/components/sections/PortfolioCarousel';
import {
  portfolioCategories,
  portfolioProjects,
} from '@/lib/data/portfolioProjects';

export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>('all');

  // "Alla" plus a single category is not a choice, so the chips are dropped.
  const showFilters = portfolioCategories.length > 2;

  // Kundcase först, sedan koncept. Sorteringen är stabil, så ordningen i datan
  // gäller inom varje grupp.
  const filteredProjects = useMemo(
    () =>
      [
        ...(filter === 'all'
          ? portfolioProjects
          : portfolioProjects.filter((project) => project.categoryId === filter)),
      ].sort((a, b) => Number(b.kind === 'client') - Number(a.kind === 'client')),
    [filter]
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex items-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#1F1F1F] py-28 text-white md:min-h-[60svh] md:py-32 lg:py-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,191,166,0.18),transparent_60%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 noise-overlay" />

        <Container className="relative z-10">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <p className="text-overline text-teal-dark mb-6">PORTFOLIO</p>
            <h1 className="text-section-title text-white">
              Projekt vi är{' '}
              <span className="underline-draw inline-block">stolta</span> över
            </h1>
            <p className="text-body-large text-gray-300 mt-8 md:mt-10">
              Hemsidor för alla typer av företag, kopplade till samma kundportal.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Filter — hidden entirely when there is nothing to filter between */}
      {showFilters && (
      <section className="sticky top-12 z-40 border-b border-gray-200 bg-white/95 py-5 backdrop-blur md:top-14 lg:top-16">
        <Container>
          <div
            role="group"
            aria-label="Filtrera projekt efter kategori"
            className="scrollbar-hide flex justify-start gap-3 overflow-x-auto md:justify-center"
          >
            {portfolioCategories.map((category) => {
              const isActive = filter === category.id;

              return (
                <Button
                  key={category.id}
                  type="button"
                  size="sm"
                  variant={isActive ? 'primary' : 'ghost'}
                  onClick={() => setFilter(category.id)}
                  aria-pressed={isActive}
                >
                  {category.label}
                </Button>
              );
            })}
          </div>
        </Container>
      </section>
      )}

      {/* Projects carousel */}
      <section className="overflow-hidden bg-[#F4F7F6] py-20 md:py-32">
        <Container>
          <FadeIn className="mx-auto mb-4 max-w-2xl text-center md:mb-8">
            <p className="text-overline text-teal-dark mb-4">UTVALDA CASE</p>
            <h2 className="text-section-title text-black mb-6">Våra projekt</h2>
            <p className="text-body-large text-gray-600">
              Ett urval av vad vi byggt och bygger just nu. Svep, dra eller
              använd piltangenterna för att bläddra.
            </p>
          </FadeIn>
        </Container>

        {/* Full-bleed track so cards can center against the viewport */}
        <PortfolioCarousel key={filter} projects={filteredProjects} />

        <Container>
          <FadeIn className="mt-12 text-center md:mt-16">
            <p className="text-body text-gray-600">
              Vi bygger just nu åt riktiga kunder – portfolion uppdateras
              löpande.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="bg-white py-20 md:py-32">
        <Container size="lg">
          <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-overline text-teal-dark mb-4">VAD VI BYGGER</p>
            <h2 className="text-section-title text-black mb-6">
              Vad vi kan bygga åt dig
            </h2>
            <p className="text-body-large text-gray-600">
              Samma team, samma plattform – oavsett vilken typ av verksamhet du
              driver.
            </p>
          </FadeIn>

          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Ny hemsida',
                desc: 'Vi bygger din hemsida och kopplar den till kundportalen från start.',
              },
              {
                title: 'Din befintliga hemsida',
                desc: 'Har du redan en hemsida integrerar vi den mot kundportalen, så att produkter, kassa och kunder hämtas därifrån.',
              },
              {
                title: 'Butik och lager',
                desc: 'Produkter med varianter och bilder, lagersaldo och förslag på inköp.',
              },
              {
                title: 'Kassa och betalningar',
                desc: 'Kunden betalar med kort och pengarna går till ditt eget Stripe-konto. Du kan också ta betalt med betalningslänk, faktura och prenumeration.',
              },
              {
                title: 'Bokning',
                desc: 'Tjänster, personal och resurser som kunden bokar online. Ingår i Growth och Enterprise.',
              },
              {
                title: 'Kontaktformulär',
                desc: 'Meddelanden från hemsidans formulär landar i kundportalen. Ingår i Growth och Enterprise.',
              },
            ].map((capability) => (
              <div
                key={capability.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-teal-dark/40 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold md:text-2xl text-black mb-3">
                  {capability.title}
                </h3>
                <p className="text-body text-gray-700">{capability.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/kontakt" variant="primary" size="lg">
              Diskutera ditt projekt
            </Button>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-[#FDF8F3] py-20 md:py-32">
        <Container>
          <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-overline text-teal-dark mb-4">SÅ ARBETAR VI</p>
            <h2 className="text-section-title text-black mb-6">Vår process</h2>
            <p className="text-body-large text-gray-600">
              Från valt paket till en hemsida som är kopplad till kundportalen –
              fyra steg vi tar tillsammans.
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
            {[
              { num: '1', title: 'Välj paket', desc: 'Du väljer paket och skapar ett konto' },
              { num: '2', title: 'Onboarding', desc: 'Vi går igenom din verksamhet tillsammans och du kopplar ditt Stripe-konto' },
              { num: '3', title: 'Hemsida', desc: 'Vi bygger din hemsida eller integrerar den du redan har mot kundportalen' },
              { num: '4', title: 'Igång', desc: 'Du säljer, tar betalt och sköter dina kunder i kundportalen' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-dark text-xl font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 font-bold text-black">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-gray-700">
            Hemsida eller integration klar: <span className="font-semibold">inom 24 timmar</span> efter onboardingen
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 text-white md:py-32">
        <Container>
          <FadeIn className="text-center">
            <h2 className="text-section-title mb-10">
              Redo att starta ditt projekt?
            </h2>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/kontakt" variant="primary" size="lg">
                Boka ett möte
              </Button>
              <Button href="/priser" variant="secondary" size="lg" onDark>
                Se priser
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

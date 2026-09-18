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

  const filteredProjects = useMemo(
    () =>
      filter === 'all'
        ? portfolioProjects
        : portfolioProjects.filter((project) => project.categoryId === filter),
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
            <p className="text-overline text-teal mb-6">PORTFOLIO</p>
            <h1 className="text-section-title text-white">
              Projekt vi är{' '}
              <span className="underline-draw inline-block">stolta</span> över
            </h1>
            <p className="text-body-large text-gray-300 mt-8 md:mt-10">
              Från e-handel till SaaS. Alla branscher. En plattform.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Filter */}
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
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFilter(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-teal text-white shadow-md shadow-teal/25'
                      : 'border border-gray-200 bg-transparent text-black hover:border-teal hover:text-teal'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Projects carousel */}
      <section className="overflow-hidden bg-[#F4F7F6] py-20 md:py-32">
        <Container>
          <FadeIn className="mx-auto mb-4 max-w-2xl text-center md:mb-8">
            <p className="text-overline text-teal mb-4">UTVALDA CASE</p>
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
            <p className="text-overline text-teal mb-4">VAD VI BYGGER</p>
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
                title: 'E-handel',
                desc: 'Kompletta onlinebutiker med betalningar, inventory och kundhantering.',
              },
              {
                title: 'SaaS Platforms',
                desc: 'Prenumerationstjänster med användardashboards och analytics.',
              },
              {
                title: 'Business Websites',
                desc: 'Professionella hemsidor för lokala företag med bokningssystem.',
              },
            ].map((capability) => (
              <div
                key={capability.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-xl"
              >
                <h3 className="text-section-subtitle text-black mb-3">
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
            <p className="text-overline text-teal mb-4">SÅ ARBETAR VI</p>
            <h2 className="text-section-title text-black mb-6">Vår process</h2>
            <p className="text-body-large text-gray-600">
              Från första samtalet till löpande tillväxt – fem steg vi kör
              igenom tillsammans.
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
            {[
              { num: '1', title: 'Discovery', desc: 'Vi förstår din verksamhet och dina mål' },
              { num: '2', title: 'Design', desc: 'AI-driven design anpassad för din bransch' },
              { num: '3', title: 'Utveckling', desc: 'Agil utveckling med löpande feedback' },
              { num: '4', title: 'Lansering', desc: 'Smidig lansering med full support' },
              { num: '5', title: 'Tillväxt', desc: 'Kontinuerlig optimering och utveckling' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal text-xl font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 font-bold text-black">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-gray-700">
            Typisk tidslinje: <span className="font-semibold">4-8 veckor</span>
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
              <Button href="/priser" variant="secondary" size="lg">
                Se priser
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

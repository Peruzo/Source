'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const projects = [
  {
    slug: 'fashion-store',
    title: 'Fashion E-commerce Store',
    category: 'E-handel',
    metric: '+200% trafik på 3 månader',
    services: 'Design • E-handel • AI-analys',
  },
  {
    slug: 'saas-platform',
    title: 'Tech Startup Platform',
    category: 'SaaS',
    metric: 'Lanserat på 4 veckor',
    services: 'Design • Hosting • Support',
  },
  {
    slug: 'restaurant',
    title: 'Restaurant Website',
    category: 'Lokal Business',
    metric: '+150% bokningar',
    services: 'Design • Booking • AI-insights',
  },
  {
    slug: 'nonprofit',
    title: 'Non-Profit Organization',
    category: 'Organisation',
    metric: '+150% donationer online',
    services: 'Design • Betalningar',
  },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Alla' },
    { id: 'ecommerce', label: 'E-handel' },
    { id: 'saas', label: 'SaaS' },
    { id: 'local', label: 'Lokal Business' },
    { id: 'other', label: 'Övrigt' },
  ];

  const filteredProjects = filter === 'all' ? projects : projects; // Simplified for now

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#121212] to-[#1F1F1F] text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Projekt vi är stolta över
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Från e-handel till SaaS. Alla branscher. En plattform.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <Container>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === cat.id
                    ? 'bg-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24 bg-[#F4F7F6]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.slug}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">{project.title}</p>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {project.category}
                  </span>
                  <h2 className="text-2xl font-bold text-black mt-2 mb-3">
                    {project.title}
                  </h2>
                  <p className="text-teal font-semibold mb-3">
                    {project.metric}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {project.services}
                  </p>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="text-teal hover:text-teal-hover font-medium inline-flex items-center gap-1"
                  >
                    Visa projekt
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}

            {/* Coming Soon Card */}
            <article className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Mer projekt kommer
                </h3>
                <p className="text-sm text-gray-600">
                  Vi bygger just nu åt riktiga kunder.<br />
                  Portfolio uppdateras löpande.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="py-20 md:py-32 bg-white">
        <Container size="lg">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Vad vi kan bygga åt dig
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
            ].map((cap) => (
              <div key={cap.title}>
                <h3 className="text-xl font-bold text-black mb-2">{cap.title}</h3>
                <p className="text-gray-700">{cap.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/kontakt" variant="primary" size="lg">
              Diskutera ditt projekt
            </Button>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-20 md:py-32 bg-[#FDF8F3]">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">
            Vår process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 max-w-5xl mx-auto">
            {[
              { num: '1', title: 'Discovery', desc: 'Vi förstår din verksamhet och dina mål' },
              { num: '2', title: 'Design', desc: 'AI-driven design anpassad för din bransch' },
              { num: '3', title: 'Utveckling', desc: 'Agil utveckling med löpande feedback' },
              { num: '4', title: 'Lansering', desc: 'Smidig lansering med full support' },
              { num: '5', title: 'Tillväxt', desc: 'Kontinuerlig optimering och utveckling' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-teal text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {step.num}
                </div>
                <h3 className="font-bold text-black mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-700 mt-12">
            Typisk tidslinje: <span className="font-semibold">4-8 veckor</span>
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-black text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-10">
              Redo att starta ditt projekt?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/kontakt" variant="primary" size="lg">
                Boka ett möte
              </Button>
              <Button href="/priser" variant="secondary" size="lg">
                Se priser
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


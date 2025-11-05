import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const projectsData = {
  'fashion-store': {
    title: 'Fashion E-commerce Store',
    category: 'E-handel',
    challenge: 'En ny modebutik behövde en modern e-handelsplattform för att konkurrera online.',
    solution: [
      'Responsiv design (mobil-först)',
      'Stripe-integration för betalningar',
      'Inventory management system',
      'AI-driven produktrekommendationer',
      'SEO-optimering',
    ],
    results: [
      '+200% trafik på 3 månader',
      '+150% konvertering',
      '4.8/5 kundbetyg',
    ],
    tech: ['Next.js', 'Stripe', 'MongoDB', 'AI-analys'],
    timeline: '6 veckor totalt',
  },
  'saas-platform': {
    title: 'Tech Startup SaaS Platform',
    category: 'SaaS',
    challenge: 'Ett växande startup behövde en skalbar användardashboard.',
    solution: [
      'Modern responsiv design',
      'Användarautentisering & roller',
      'Real-time analytics dashboard',
      'Prenumerationssystem',
    ],
    results: [
      'Lanserat på 4 veckor',
      'Hanterar 10K+ användare',
      '99.9% uptime',
    ],
    tech: ['Next.js', 'React', 'Node.js', 'Vercel'],
    timeline: '4 veckor',
  },
  'restaurant': {
    title: 'Restaurant & Booking Platform',
    category: 'Lokal Business',
    challenge: 'Lokal restaurang behövde online-närvaro och bokningssystem.',
    solution: [
      'Elegant responsiv design',
      'Integrerat bokningssystem',
      'Menyhantering',
      'Kundrecensioner',
    ],
    results: [
      '+150% online-bokningar',
      '+80% kundengagemang',
      '5/5 betyg på Google',
    ],
    tech: ['Next.js', 'Booking API', 'CMS'],
    timeline: '3 veckor',
  },
  'nonprofit': {
    title: 'Non-Profit Donation Platform',
    category: 'Organisation',
    challenge: 'Organisation behövde öka online-donationer.',
    solution: [
      'Ren, engagerande design',
      'Säkert donationssystem',
      'Impact stories',
      'Newsletter-integration',
    ],
    results: [
      '+150% online-donationer',
      '+200% newsletter-registreringar',
      'Uppmärksammad i media',
    ],
    tech: ['Next.js', 'Stripe', 'Email Marketing'],
    timeline: '4 veckor',
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projectsData[params.slug as keyof typeof projectsData];
  
  if (!project) {
    return {
      title: 'Projekt ej funnet',
    };
  }

  return {
    title: `${project.title} - Portfolio`,
    description: project.challenge,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projectsData[params.slug as keyof typeof projectsData];

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-gray-50">
        <Container>
          <Link
            href="/portfolio"
            className="text-teal hover:text-teal-hover font-medium inline-flex items-center gap-2 mb-8"
          >
            ← Tillbaka till portfolio
          </Link>
        </Container>
      </section>

      {/* Hero Image */}
      <section>
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">{project.title} Hero Image</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-gray-600 mb-8">{project.category}</p>

              <h2 className="text-2xl font-bold text-black mb-4">Utmaningen</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {project.challenge}
              </p>

              <h2 className="text-2xl font-bold text-black mb-4">Lösningen</h2>
              <ul className="space-y-3 mb-8">
                {project.solution.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <span className="text-teal mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-[#FDF8F3] p-6 rounded-xl">
                <h3 className="text-xl font-bold text-black mb-4">Resultat</h3>
                <ul className="space-y-2">
                  {project.results.map((result) => (
                    <li key={result} className="text-teal font-medium">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-black mb-4">Teknologi</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-black mb-2">Tidslinje</h3>
                <p className="text-gray-700">{project.timeline}</p>
              </div>
            </div>
          </div>

          {/* Screenshots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Screenshot {num}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button href="/kontakt" variant="primary" size="lg">
              Boka en liknande lösning
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}


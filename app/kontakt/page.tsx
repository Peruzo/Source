import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Kontakt - Vi svarar inom 24 timmar',
  description: 'Har du frågor om Source? Kontakta oss via formulär, e-post eller telefon. Vi svarar inom 24 timmar. Boka även en kostnadsfri demo.',
};

export default function ContactPage() {
  const faqs = [
    {
      question: 'Hur lång tid tar det?',
      answer: 'Typisk tidslinje är 4-8 veckor från start till lansering, beroende på komplexitet.',
    },
    {
      question: 'Vad kostar det?',
      answer: 'Från 2,995 kr/mån beroende på paket. Se vår prissida för detaljer.',
    },
    {
      question: 'Kan jag se exempel?',
      answer: 'Absolut! Vi har flera mockups i vår portfolio.',
    },
    {
      question: 'Jobbar ni med min bransch?',
      answer: 'Vi jobbar med alla branscher. Vår AI anpassar lösningen efter din specifika verksamhet.',
    },
    {
      question: 'Hur fungerar supporten?',
      answer: '24/7 e-post, chatt för Growth+, prioritet för Enterprise.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#121212] to-[#1F1F1F] text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Låt oss prata
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Vi svarar inom 24 timmar på alla förfrågningar
            </p>
          </div>
        </Container>
      </section>

      {/* Quick Contact */}
      <section className="py-16 md:py-20 bg-[#FDF8F3]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold text-black mb-2">E-post</h3>
              <a
                href="mailto:help@source.com"
                className="text-lg text-teal hover:text-teal-hover font-medium block mb-2"
              >
                help@source.com
              </a>
              <p className="text-sm text-gray-600">Vi svarar inom 24h</p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2">Telefon</h3>
              <a
                href="tel:+46733221212"
                className="text-lg text-teal hover:text-teal-hover font-medium block mb-2"
              >
                +46 73 322 12 12
              </a>
              <p className="text-sm text-gray-600">Vardagar 09-17</p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2">Kundportal</h3>
              <a
                href="https://portal.source.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-teal hover:text-teal-hover font-medium block mb-2"
              >
                Till kundportalen →
              </a>
              <p className="text-sm text-gray-600">För befintliga kunder</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-32 bg-[#F4F7F6]">
        <Container size="md">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center">
              Skicka ett meddelande
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Eller{' '}
              <a href="mailto:help@source.com" className="text-teal hover:text-teal-hover font-medium">
                maila oss direkt
              </a>
            </p>
            
            <ContactForm />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-white">
        <Container size="md">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Vanliga frågor
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-lg text-black mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Response Promise */}
      <section className="py-20 md:py-32 bg-[#1F1F1F] text-white">
        <Container size="md">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vårt löfte till dig
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-teal mb-3">✓ Svar inom 24 timmar</h3>
              <p className="text-gray-300">På alla förfrågningar</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal mb-3">✓ Inga säljsnack</h3>
              <p className="text-gray-300">Vi lyssnar först, säljer sen</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal mb-3">✓ Transparent rådgivning</h3>
              <p className="text-gray-300">Ärlig om vad som passar dig</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-teal mb-3">✓ Ingen press</h3>
              <p className="text-gray-300">Bestäm i din egen takt</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


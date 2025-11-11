import { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Om Source - AI-driven tillväxt för företag',
  description: 'Lär känna teamet bakom Source. Tre grundare med bakgrund i kundservice och betalningsbranschen som skapar AI-drivna lösningar för företagstillväxt.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Kundservice först',
      desc: 'Vi är inte bara utvecklare. Vi är er partner för tillväxt.',
    },
    {
      title: 'Transparens',
      desc: 'Inga dolda kostnader. Inga konstiga villkor. Vad du ser är vad du får.',
    },
    {
      title: 'Innovation',
      desc: 'Vi använder AI för att ge dig konkurrensfördelar, inte för att det är trendigt.',
    },
    {
      title: 'Långsiktighet',
      desc: 'Vi växer när du växer. Vi bygger relationer, inte bara projekt.',
    },
  ];

  const expertise = [
    {
      title: 'E-handel & Betalningar',
      desc: 'Teamets bakgrund från betalningsbranschen ger oss unik förståelse för e-handel.',
    },
    {
      title: 'AI & Data',
      desc: 'Vi använder AI för mikroanalys som ger konkreta förslag, inte bara rapporter.',
    },
    {
      title: 'Kundservice',
      desc: 'Alla grundare har erfarenhet från kundservice. Vi vet hur man hjälper kunder.',
    },
    {
      title: 'Fullstack Development',
      desc: 'Från design till deployment. Vi hanterar hela kedjan.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate min-h-screen overflow-hidden text-white">
        <Image
          src="/u6293379286_make_a_picture_of_two_people_from_behind_were_the_5f586b53-e006-4127-b94f-23fde9c403b1_3.png"
          alt="Två personer blickar ut över horisonten"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/10 sm:to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

        <Container className="h-full">
          <div className="relative z-10 flex min-h-screen flex-col justify-center py-32">
            <span className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
              Om oss
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Vi finns här för att hjälpa företag växa.
              <span className="block text-white/90">Verkligen.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              Source ger dig rådgivning, insikter och verktyg för att skala smartare. Vi är det
              dedikerade teamet som står vid din sida genom varje steg av tillväxtresan.
            </p>
            <div className="mt-10">
              <Button
                href="/kontakt"
                size="lg"
                variant="ghost"
                className="!bg-white !text-black !border-white/60 !hover:bg-white/90 rounded-full shadow-lg shadow-black/20"
              >
                Boka ett möte
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 bg-[#FDF8F3]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8">
              Vår mission
            </h2>
            
            <p className="text-2xl md:text-3xl font-bold text-black mb-6">
              De flesta verktyg rapporterar data.<br />
              Vi ger råd.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Source skapades för att ge företag tillgång till samma nivå av insikter och 
              strategisk rådgivning som Fortune 500-företag—till ett pris alla har råd med.
            </p>
            
            <p className="text-xl md:text-2xl text-teal font-medium">
              Som att anställa en världsklass CEO, inte bara ett verktyg.
            </p>
          </div>
        </Container>
      </section>

      {/* Origin Story + Values */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white to-beige-light">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Origin */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Varför Source?</h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Vi såg ett gap i marknaden: Antingen köper företag dyra mallar som ser ut som 
                  alla andras, eller betalar byråpriser för unik design.
                </p>
                <p>
                  Med AI kan vi erbjuda det tredje alternativet: Skräddarsydd design och strategisk 
                  rådgivning till prenumerationspris.
                </p>
                <p>
                  Men teknologi är bara halva lösningen. Den andra halvan är att verkligen förstå 
                  och hjälpa våra kunder.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Våra värderingar</h2>
              <div className="space-y-6">
                {values.map((value) => (
                  <div key={value.title} className="border-l-4 border-teal pl-4">
                    <h3 className="text-xl font-bold text-black mb-2">{value.title}</h3>
                    <p className="text-gray-700">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 md:py-32 bg-[#1F1F1F] text-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Teamet - Tre grundare. En vision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-teal/20 to-teal/5 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-teal/30">
                <p className="text-teal text-5xl font-bold">AS</p>
              </div>
              <h3 className="text-2xl font-bold mb-2">André Söderberg</h3>
              <p className="text-teal font-medium mb-4">CEO & Lead Developer</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                15 års erfarenhet av fullstack-utveckling och e-handel. Tidigare teknisk lead på 
                betalningsplattform med fokus på kundupplevelse.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-teal/20 to-teal/5 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-teal/30">
                <p className="text-teal text-5xl font-bold">VK</p>
              </div>
              <h3 className="text-2xl font-bold mb-2">Valentin Korpela</h3>
              <p className="text-teal font-medium mb-4">Head of Customer Success</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                10 års erfarenhet från kundservice och support. Expert på att förstå kundbehov 
                och översätta dem till konkreta lösningar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-teal/20 to-teal/5 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-teal/30">
                <p className="text-teal text-5xl font-bold">VK</p>
              </div>
              <h3 className="text-2xl font-bold mb-2">Vincent Korpela</h3>
              <p className="text-teal font-medium mb-4">Head of AI & Analytics</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Specialist på AI-driven dataanalys och business intelligence. Tidigare 
                datavetare med fokus på e-handelsoptimering.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-300 mt-16 text-lg max-w-3xl mx-auto">
            Alla tre grundare kommer från kundservice-branschen. Vi förstår vikten av att 
            lyssna och ta åt sig feedback. Tillsammans har vi över 30 års erfarenhet av att 
            hjälpa företag växa online.
          </p>
        </Container>
      </section>

      {/* Expertise */}
      <section className="py-20 md:py-32 bg-[#F4F7F6]">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Vår expertis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {expertise.map((item) => (
              <div key={item.title}>
                <h3 className="text-2xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Journey */}
      <section className="py-20 md:py-32 bg-[#1F1F1F] text-white">
        <Container size="md">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vår resa
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-teal mb-3">2024</h3>
              <p className="text-gray-300 text-lg">
                Source grundades med en vision: Demokratisera tillgång till AI-driven affärsrådgivning.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-teal mb-3">2025</h3>
              <p className="text-gray-300 text-lg">
                Vi bygger vår första kundgeneration och utvecklar plattformen.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-teal mb-3">Framåt</h3>
              <p className="text-gray-300 text-lg">
                Vi fortsätter växa med våra kunder och förbättrar plattformen varje dag.
              </p>
            </div>

            <p className="text-xl text-teal font-medium text-center mt-12">
              Vi är i början av något stort. Vill du vara med på resan?
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-black text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-10">
              Vill du jobba med oss?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/kontakt" variant="primary" size="lg">
                Boka ett möte
              </Button>
              <Button href="/tjanster" variant="secondary" size="lg">
                Se våra tjänster
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


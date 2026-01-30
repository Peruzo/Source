import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="py-24 md:py-32 min-h-[60vh] flex items-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-black mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Sidan finns inte
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Sidan du letar efter kunde inte hittas. Den kan ha flyttats eller tagits bort.
          </p>
          <Button href="/" variant="primary" size="lg">
            Tillbaka till startsidan
          </Button>
        </div>
      </Container>
    </section>
  );
}


'use client';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { LeadsShowcase } from '@/components/ui/LeadsShowcase';
import { motion } from 'framer-motion';

/**
 * Egen sektion som ramar in LeadsShowcase-produktvyn.
 * Ljus beige bakgrund ger kontrast mot det vita produktkortet.
 * LeadsShowcase triggar sin genererande animation via useInView när
 * sektionen scrollas in i vy.
 */
export function LeadsSection() {
  return (
    <Section background="beige">
      <Container>
        {/* Rubrik-block */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-overline text-teal mb-4"
          >
            AI-LEADS
          </motion.p>
          <h2 className="text-section-title text-black mb-6">
            Vi hittar dina nästa kunder.
          </h2>
          <p className="text-body text-gray-700">
            Source söker fram potentiella kunder, rangordnar dem efter hur väl de
            liknar dina bäst konverterande, och pekar ut var du ska börja.
          </p>
        </FadeIn>

        {/* Produktvy */}
        <FadeIn className="max-w-[1000px] mx-auto">
          <LeadsShowcase />
        </FadeIn>

        {/* Dubbel CTA */}
        <FadeIn className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 lg:mt-16">
          <Button href="/kontakt" variant="primary" size="lg">
            Boka demo
          </Button>
          <Button href="/priser" variant="secondary" size="lg">
            Kom igång
          </Button>
        </FadeIn>
      </Container>
    </Section>
  );
}

'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { LeadsShowcase } from '@/components/ui/LeadsShowcase';
import { LeadDetail } from '@/components/ui/LeadDetail';
import { motion } from 'framer-motion';

/**
 * Kompakt Leads-sektion: listan (LeadsShowcase, compact) bredvid en detaljvy
 * (LeadDetail). En gemensam useInView-trigger orkestrerar koreografin:
 * listan genererar → het rad väljs → detaljen glider in något efter.
 * Beige bakgrund ger kontrast mot de vita korten.
 */
export function LeadsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // once: false → spelas om varje gång sektionen scrollas in i vy
  const inView = useInView(sectionRef, { once: false, margin: '-80px' });
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    if (inView) setTriggerKey(k => k + 1);
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-[#FDF8F3]">
      <Container>
        {/* Rubrik-block */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
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

        {/* Tvåkolumn: lista + detaljvy. Wrap till staplat under ~720 px. */}
        <div className="flex flex-wrap items-start justify-center gap-4 max-w-[1080px] mx-auto">
          <div className="flex-1 basis-[460px] min-w-[300px]">
            <LeadsShowcase compact triggerKey={triggerKey} />
          </div>
          <div className="flex-[0_1_380px] min-w-[300px]">
            <LeadDetail triggerKey={triggerKey} />
          </div>
        </div>
      </Container>
    </section>
  );
}

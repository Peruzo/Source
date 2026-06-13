import { Hero } from '@/components/sections/Hero';
import { ValueProposition } from '@/components/sections/ValueProposition';
import { WhatWeDo } from '@/components/sections/WhatWeDo';
import { LeadsSection } from '@/components/sections/LeadsSection';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { AIAgentTestimonials } from '@/components/sections/AIAgentTestimonials';
import { FAQ } from '@/components/sections/FAQ';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { DataGrowthSlideshow } from '@/components/sections/DataGrowthSlideshow';
import { AIAssistant } from '@/components/sections/AIAssistant';
// import { WaterDroplet } from '@/components/ui/WaterDroplet';

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <WhatWeDo />
      <LeadsSection />
      <DataGrowthSlideshow />
      <AIAssistant />
      <PortfolioTeaser />
      <AIAgentTestimonials />
      <FAQ />
      <PricingTeaser />
      <FinalCTA />
      {/* <WaterDroplet /> */}
    </>
  );
}

import { Hero } from '@/components/sections/Hero';
import { ValueProposition } from '@/components/sections/ValueProposition';
import { WhatWeDo } from '@/components/sections/WhatWeDo';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { AIAgentTestimonials } from '@/components/sections/AIAgentTestimonials';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { DataGrowthSlideshow } from '@/components/sections/DataGrowthSlideshow';
// import { WaterDroplet } from '@/components/ui/WaterDroplet';

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <WhatWeDo />
      <DataGrowthSlideshow />
      <PortfolioTeaser />
      <AIAgentTestimonials />
      <PricingTeaser />
      <FinalCTA />
      {/* <WaterDroplet /> */}
    </>
  );
}

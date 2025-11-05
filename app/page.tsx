import { Hero } from '@/components/sections/Hero';
import { ValueProposition } from '@/components/sections/ValueProposition';
import { WhatWeDo } from '@/components/sections/WhatWeDo';
import { InteractivePortalPreview } from '@/components/sections/InteractivePortalPreview';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';
// import { WaterDroplet } from '@/components/ui/WaterDroplet';

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <WhatWeDo />
      <InteractivePortalPreview />
      <PortfolioTeaser />
      <PricingTeaser />
      <FinalCTA />
      {/* <WaterDroplet /> */}
    </>
  );
}

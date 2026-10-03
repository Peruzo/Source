import { Hero, Portfolio, Faq, Pricing, Final } from './sections';
import { Assistant, Showcase } from './Clients';
import { ValueR1 } from './ValueR1';
import { VALUE } from './content';
import { RockR1 } from './RockR1';
import { WhatWeDoR1 } from './WhatWeDoR1';
import { GrowthR1 } from './GrowthR1';
import './base.css';
import './ny-startsida.css';

const ROCK_DONE_SCRIPT =
  "try{if(sessionStorage.getItem('r1-rock-done')==='1')document.documentElement.setAttribute('data-r1-rock-done','')}catch(e){}";
const CHAOS_DONE_SCRIPT =
  "try{if(sessionStorage.getItem('r1-chaos-done')==='1')document.documentElement.setAttribute('data-r1-chaos-done','')}catch(e){}";

// NY STARTSIDA (/ny-startsida): redesign 1 från experimentet (experiment/landing-remodel),
// flyttad hit oförändrad i innehåll och beteende. Allt utseende ligger i base.css och
// ny-startsida.css, scopat under #ny-startsida, så att dagens startsida och övriga sidor
// inte påverkas. Sektion 2 (ValueR1), stenen (RockR1), kategorierna (WhatWeDoR1) och
// bildspelet (GrowthR1) är redesign 1:s egna versioner; övriga sektioner är kopior av
// experimentets gemensamma sektioner (sections.tsx, Clients.tsx).
export function NyStartsida() {
  return (
    <div id="ny-startsida" className="rd-root">
      <Hero />
      {/* Sektion 2 spelas en gång per besök. Är flaggan satt markeras <html> innan
          sektionen målas, så att CSS visar slutläget redan före hydrering. */}
      <script dangerouslySetInnerHTML={{ __html: CHAOS_DONE_SCRIPT }} />
      <ValueR1 value={VALUE} />
      {/* Stenscenen spelas en gång per besök. Är flaggan satt markeras <html> innan
          scenen målas, så att CSS ger normal höjd och slutbild redan före hydrering. */}
      <script dangerouslySetInnerHTML={{ __html: ROCK_DONE_SCRIPT }} />
      <RockR1 />
      <WhatWeDoR1 />
      <GrowthR1 />
      <Assistant />
      <Portfolio />
      <Showcase />
      <Faq />
      <Pricing />
      <Final />
    </div>
  );
}

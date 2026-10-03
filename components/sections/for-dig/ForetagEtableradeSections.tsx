'use client';

import { InboxStackIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import {
  STUDIO_SCREEN,
  etableradeAvslut,
  etableradeHjalp,
  etableradeImages,
  etableradeKomIgang,
  etableradeMer,
  etableradeStatistik,
  etableradeStudio,
  etableradeSupportInkorg,
} from '@/lib/data/for-dig/foretag-etablerade';
import { FullBleedImageSection } from './FullBleedImageSection';
import { GettingStartedSection } from './GettingStartedSection';
import { StudioScreenSection } from './foretag-etablerade/StudioScreenSection';
import { ChatCard, StatsAreasWidget, StudioScreen } from './foretag-etablerade/widgets';
import { StatusCard } from './foretag-vaxa/widgets';

/**
 * Everything under the hero on /foretag-etablerad (Företag Etablerade). The hero in
 * app/foretag-etablerad/page.tsx stays as it is. Copy and example data live in
 * lib/data/for-dig/foretag-etablerade.ts, with the evidence for each claim.
 *
 * Darker and calmer than Växa: black and black-secondary surfaces only, seven
 * sections, the dark variants from /analys (FeatureCarousel dark, ServiceFullBleed
 * over dark photos). No package names, no prices of our own, no user counts.
 */
export function ForetagEtableradeSections() {
  const s = etableradeStatistik;
  const st = etableradeStudio;
  const si = etableradeSupportInkorg;

  return (
    <>
      {/* 1 – Statistik för ledningen. Text on the black upper left; from lg the statistics widget on the black
          upper right, above the highest arches, under the photo below lg. Target of the hero's "Se hur det fungerar". */}
      <ServiceFullBleed
        id={s.id}
        eyebrow={s.eyebrow}
        title={s.title}
        body={s.body}
        image={etableradeImages.statistik}
        tone="light"
        textPosition="top-left"
        panel={{
          label: s.widget.label,
          content: <StatsAreasWidget content={s.widget} />,
          // Clear of the heading's longest line (about 37rem from the left edge at lg) from 1024 px up.
          position: { right: 'clamp(1.5rem, 3vw, 5rem)', top: 'clamp(6.5rem, 15vh, 9rem)', width: 'min(36rem, 38vw)' },
        }}
      />

      {/* 2 – Marknadsföringsstudion. The studio's UI on the tablet's screen. */}
      <StudioScreenSection
        id={st.id}
        eyebrow={st.eyebrow}
        title={st.title}
        body={st.body}
        image={etableradeImages.studio}
        portraitShape="square"
        screen={STUDIO_SCREEN}
        label={st.screen.label}
      >
        <StudioScreen content={st.screen} />
      </StudioScreenSection>

      {/* 3 – Support-inkorg. White text over the concrete with the full dark layer; card by her phone. */}
      <ServiceFullBleed
        id={si.id}
        eyebrow={si.eyebrow}
        title={si.title}
        body={si.body}
        image={etableradeImages.support}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: 'Exempel: ett besvarat ärende i support-inkorgen',
          content: <StatusCard content={si.card} icon={InboxStackIcon} tone="solid" />,
          anchor: { x: 40, y: 78 },
          anchorPortrait: { x: 50, y: 24 },
        }}
      />

      {/* 4 – Hjälp när det gäller. Plain black band with the chat. */}
      <FullBleedImageSection id={etableradeHjalp.id} eyebrow={etableradeHjalp.eyebrow} title={etableradeHjalp.title} body={etableradeHjalp.body}>
        <div className="mx-auto w-full max-w-[26rem]">
          <ChatCard content={etableradeHjalp.chat} />
        </div>
      </FullBleedImageSection>

      {/* 5 – Allt från Växa. */}
      <FeatureCarousel id={etableradeMer.id} eyebrow={etableradeMer.eyebrow} title={etableradeMer.title} items={etableradeMer.items} background="dark" />

      {/* 6 – Så kommer ni igång. Image: a still from the hero video. */}
      <GettingStartedSection
        id={etableradeKomIgang.id}
        eyebrow={etableradeKomIgang.eyebrow}
        title={etableradeKomIgang.title}
        steps={etableradeKomIgang.steps}
        image={etableradeKomIgang.image}
      >
        {/* secondary, as on Företag Start and Växa: white on teal is only 2.26:1 here. */}
        <Button href={etableradeKomIgang.cta.href} variant="secondary" size="lg">
          {etableradeKomIgang.cta.label}
        </Button>
      </GettingStartedSection>

      {/* 7 – Avslutande CTA. Boka demo primary, priser secondary. */}
      <FullBleedImageSection id={etableradeAvslut.id} title={etableradeAvslut.title} height="tall" body={etableradeAvslut.body}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={etableradeAvslut.primary.href} variant="primary" size="lg">
            {etableradeAvslut.primary.label}
          </Button>
          <Button href={etableradeAvslut.secondary.href} variant="secondary" size="lg" onDark>
            {etableradeAvslut.secondary.label}
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

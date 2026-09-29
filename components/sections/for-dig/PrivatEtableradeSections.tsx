'use client';

import { ChatBubbleLeftRightIcon, InboxStackIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import {
  privatEtableradeAvslut,
  privatEtableradeHjalp,
  privatEtableradeImages,
  privatEtableradeInkorg,
  privatEtableradeKomIgang,
  privatEtableradeMer,
  privatEtableradeStatistik,
  privatEtableradeStudio,
} from '@/lib/data/for-dig/privat-etablerade';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { GettingStartedSection } from './GettingStartedSection';
import { StatsOverviewCard } from './foretag-etablerade/widgets';
import { StatusCard, StatusRow } from './foretag-vaxa/widgets';

/**
 * Everything under the hero on /privat-etablerad (Privat Etablerade). The hero in
 * app/privat-etablerad/page.tsx stays as it is. Copy and example data live in
 * lib/data/for-dig/privat-etablerade.ts, with the evidence for each claim.
 *
 * Written to one person and their own brand ("du"). Light surfaces – white and stone – as the
 * light mirror of Företag Etablerade; the photos are warm daylight and evening scenes, so they
 * use ServiceFullBleed's existing scrim 'full' to keep white text at 4.5:1. Every card is the
 * flat, solid style from Företag Växa – no blur.
 */
export function PrivatEtableradeSections() {
  const s = privatEtableradeStudio;
  const i = privatEtableradeInkorg;
  const st = privatEtableradeStatistik;
  const h = privatEtableradeHjalp;

  return (
    <>
      {/* 1 – En studio för ditt varumärke. Text on the window side, no eyebrow (teal reached only 3.9:1 on
          the bright window). From md the card lies on the table over the sketchbook, left of the tablet and
          their hands – the empty table in front is too shallow for it at 1366 × 768. Below md, where the
          card would reach their hands, a compact row sits on the table in front instead.
          Target of "Se hur det fungerar". */}
      <ServiceFullBleed
        id={s.id}
        title={s.title}
        body={s.body}
        image={privatEtableradeImages.studio}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: 'Exempel: en kampanjplan från AI-assistenten',
          content: (
            <>
              <div className="flex justify-center md:hidden">
                <div className="w-full max-w-[16rem]">
                  <StatusRow content={s.row} icon={SparklesIcon} />
                </div>
              </div>
              <div className="hidden md:block">
                <StatusCard content={s.card} icon={SparklesIcon} tone="solid" />
              </div>
            </>
          ),
          anchor: { x: 30, y: 78 },
          anchorPortrait: { x: 50, y: 86 },
        }}
      />

      {/* 2 – Svara dina kunder från en inkorg. Card over the red print on the cushion and the lid of the
          laptop, left of her hands. */}
      <ServiceFullBleed
        id={i.id}
        eyebrow={i.eyebrow}
        title={i.title}
        body={i.body}
        image={privatEtableradeImages.inkorg}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: 'Exempel: ett besvarat mejl i support-inkorgen',
          content: <StatusCard content={i.card} icon={InboxStackIcon} tone="solid" />,
          anchor: { x: 34, y: 76 },
          anchorPortrait: { x: 50, y: 22 },
        }}
      />

      {/* 3 – Se vad som driver försäljningen. Interface only, no photo. */}
      <ClippedImageSection
        id={st.id}
        eyebrow={st.eyebrow}
        title={st.title}
        body={st.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
            <div className="w-full max-w-[24rem]">
              <StatsOverviewCard content={st.card} />
            </div>
          </div>
        }
      />

      {/* 4 – Hjälp när det gäller. Text over the hood and the fridge, no eyebrow (teal reached only 3.5:1 on
          the lit hood at 1366 × 768); a compact row by the phone, between his face and his hands. */}
      <ServiceFullBleed
        id={h.id}
        title={h.title}
        body={h.body}
        image={privatEtableradeImages.hjalp}
        tone="light"
        scrim="full"
        textPosition="top-right"
        card={{
          label: 'Exempel: AI-supporten kopplar vidare till livechatt',
          content: (
            <div className="flex justify-center">
              <div className="w-full max-w-[16rem]">
                <StatusRow content={h.card} icon={ChatBubbleLeftRightIcon} />
              </div>
            </div>
          ),
          anchor: { x: 16.8, y: 78.3 },
          anchorPortrait: { x: 50, y: 65 },
        }}
      />

      {/* 5 – Allt från Växande. */}
      <FeatureCarousel id={privatEtableradeMer.id} eyebrow={privatEtableradeMer.eyebrow} title={privatEtableradeMer.title} items={privatEtableradeMer.items} background="white" />

      {/* 6 – Så kommer du igång. Image: a still from the green hero video. */}
      <GettingStartedSection
        id={privatEtableradeKomIgang.id}
        eyebrow={privatEtableradeKomIgang.eyebrow}
        title={privatEtableradeKomIgang.title}
        steps={privatEtableradeKomIgang.steps}
        image={privatEtableradeKomIgang.image}
      >
        {/* secondary, as on the other För dig pages: white on teal is only 2.26:1 here. */}
        <Button href={privatEtableradeKomIgang.cta.href} variant="secondary" size="lg">
          {privatEtableradeKomIgang.cta.label}
        </Button>
      </GettingStartedSection>

      {/* 7 – Avslutande CTA, black. Boka demo primary, priser secondary. */}
      <FullBleedImageSection id={privatEtableradeAvslut.id} title={privatEtableradeAvslut.title} height="tall" body={privatEtableradeAvslut.body}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={privatEtableradeAvslut.primary.href} variant="primary" size="lg">
            {privatEtableradeAvslut.primary.label}
          </Button>
          <Button href={privatEtableradeAvslut.secondary.href} variant="secondary" size="lg" onDark>
            {privatEtableradeAvslut.secondary.label}
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

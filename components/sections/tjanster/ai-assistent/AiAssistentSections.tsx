'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '../FeatureCarousel';
import { ScrollScene } from '../ScrollScene';
import { ServiceFullBleed } from '../ServiceFullBleed';
import { ServicePageLayout } from '../ServicePageLayout';
import { StickySteps } from '../StickySteps';
import { InsightCard } from '../widgets/AnalyticsWidgets';
import {
  AdvisorChatCard,
  BookkeepingHelpCard,
  CampaignAssistantDemo,
  LeadList,
  PackageList,
  SourceAiAnswerCard,
  WeekList,
} from '../widgets/AiAssistantDemos';
import {
  aiAvslut,
  aiBokforing,
  aiImages,
  aiInsikter,
  aiKampanj,
  aiLeads,
  aiMer,
  aiSourceAi,
} from '@/lib/data/tjanster/ai-assistent';

/** The package line under a section's text. */
function PackageNote({ text, onDark = false }: { text: string; onDark?: boolean }) {
  return <p className={`text-sm font-medium ${onDark ? 'text-white/80' : 'text-gray-700'}`}>{text}</p>;
}

/**
 * Everything under the hero on /ai-assistent. Copy and example data live in
 * lib/data/tjanster/ai-assistent.ts, with the evidence for each claim. Three
 * full-bleed photos (Source AI, AI-insikter, Leads), everything else is widgets
 * on panels. The package is stated in every section.
 */
export function AiAssistentSections() {
  const ins = aiInsikter;
  const insightSteps = [
    { ...ins.steps[0], visual: () => <InsightCard {...ins.insight} /> },
    { ...ins.steps[1], visual: () => <WeekList content={ins.week} /> },
    { ...ins.steps[2], visual: () => <AdvisorChatCard content={ins.chat} /> },
  ];

  return (
    <ServicePageLayout>
      {/* 1 – Source AI i portalen. Target of the hero's "Se hur det fungerar". Text at the top left, clear
          of her face; the card is anchored to the photo over the cup by her feet (its rim has tiny
          print), below her hands. */}
      <ServiceFullBleed
        id={aiSourceAi.id}
        eyebrow={aiSourceAi.eyebrow}
        title={aiSourceAi.title}
        body={aiSourceAi.body}
        image={aiImages.sourceai}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: aiSourceAi.card.label,
          content: <SourceAiAnswerCard content={aiSourceAi.card} />,
          anchor: { x: 32, y: 76 },
          anchorPortrait: { x: 46, y: 80 },
          anchorTo: 'image',
        }}
      />

      {/* 2 – AI-insikter med rådgivare. The step card sits bottom left of the photo, over the plants;
          focus 30 % keeps her face, the tablet and both hands to the right of it, also at 1366. */}
      <StickySteps
        id={ins.id}
        eyebrow={ins.eyebrow}
        title={ins.title}
        intro={ins.intro}
        image={aiImages.insikter}
        steps={insightSteps}
      />

      {/* 3 – Bokföringshjälpen. Widgets only, no photo. */}
      <ClippedImageSection
        id={aiBokforing.id}
        eyebrow={aiBokforing.eyebrow}
        title={aiBokforing.title}
        body={aiBokforing.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
            <div className="w-full max-w-[26rem]">
              <BookkeepingHelpCard content={aiBokforing.widget} />
            </div>
          </div>
        }
      >
        <PackageNote text={aiBokforing.packageNote} />
      </ClippedImageSection>

      {/* Kampanjassistenten. Scroll-driven demo of the portal's start flow, no photo and no images. */}
      <ScrollScene
        id={aiKampanj.id}
        eyebrow={aiKampanj.eyebrow}
        title={aiKampanj.title}
        body={aiKampanj.body}
        label={aiKampanj.label}
        demoSide="left"
        background="stone"
        aside={<PackageNote text={aiKampanj.packageNote} />}
      >
        {(progress) => <CampaignAssistantDemo progress={progress} content={aiKampanj.demo} />}
      </ScrollScene>

      {/* Mer AI i portalen – the package is in each card's text. */}
      <FeatureCarousel id={aiMer.id} eyebrow={aiMer.eyebrow} title={aiMer.title} items={aiMer.items} background="beige" />

      {/* 6 – Leads. Text centred on the left over his dark jacket, clear of his head; the card on the
          grass to the right, above the hand he gestures with and clear of the phone hand. */}
      <ServiceFullBleed
        id={aiLeads.id}
        eyebrow={aiLeads.eyebrow}
        title={aiLeads.title}
        body={aiLeads.body}
        image={aiImages.leads}
        tone="light"
        scrim="full"
        textPosition="center-left"
        card={{
          label: aiLeads.card.label,
          content: <LeadList content={aiLeads.card} />,
          anchor: { x: 70, y: 38 },
          anchorPortrait: { x: 46, y: 80 },
          anchorTo: 'image',
        }}
      />

      {/* 7 – Avslut – which feature is in which package, then the way forward. */}
      <ClippedImageSection
        id={aiAvslut.id}
        eyebrow={aiAvslut.eyebrow}
        title={aiAvslut.title}
        body={aiAvslut.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[26rem]">
              <PackageList content={aiAvslut.list} />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-4">
          <AnimatedButton href={aiAvslut.primary.href} variant="primary" size="lg">
            {aiAvslut.primary.label}
          </AnimatedButton>
          <AnimatedButton href={aiAvslut.secondary.href} variant="secondary" size="lg">
            {aiAvslut.secondary.label}
          </AnimatedButton>
        </div>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

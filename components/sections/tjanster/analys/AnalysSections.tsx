'use client';

import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { DeviceShowcase } from '@/components/sections/tjanster/DeviceShowcase';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import { StickySteps } from '@/components/sections/tjanster/StickySteps';
import {
  CustomerRingCard,
  InsightCard,
  KpiCard,
  PeriodTrendCard,
  ReportCard,
  TopListCard,
  TopPagesCard,
} from '@/components/sections/tjanster/widgets/AnalyticsWidgets';
import {
  analysFeatures,
  analysImages,
  analysInsights,
  analysPages,
  analysPeriod,
  analysReports,
  analysSteps,
  analysWidgets as w,
} from '@/lib/data/tjanster/analys';

/*
 * The new sections of /analys, as client components so the page itself can
 * stay a server component and its first section untouched. The header stays
 * white and transparent on /analys, so every section here is dark.
 */

const cardWidth = 'w-[min(20rem,calc(100vw-3rem))]';

/** Section right after the hero: this period against the previous one. */
export function AnalysIntro() {
  return (
    <ServiceFullBleed
      eyebrow={analysPeriod.eyebrow}
      title={analysPeriod.title}
      body={analysPeriod.body}
      image={analysImages.period}
      tone="light"
      scrim="full"
      textPosition="top-right"
      card={{
        content: <PeriodTrendCard active {...w.trend} />,
        label: 'Exempel: intäkter jämfört med perioden innan',
        anchor: { x: 40, y: 52 },
        anchorPortrait: { x: 50, y: 55 },
        anchorTo: 'image',
      }}
    />
  );
}

/** Everything after the existing "Global analys" section. */
export function AnalysSections() {
  const steps = [
    {
      ...analysSteps.steps[0],
      visual: () => <KpiCard {...w.kpi} />,
    },
    {
      ...analysSteps.steps[1],
      visual: ({ active }: { active: boolean }) => <CustomerRingCard active={active} {...w.customers} />,
    },
    {
      ...analysSteps.steps[2],
      visual: () => <TopListCard {...w.topProducts} />,
    },
  ];

  return (
    <ServicePageLayout>
      <StickySteps
        theme="dark"
        eyebrow={analysSteps.eyebrow}
        title={analysSteps.title}
        image={analysImages.nyckeltal}
        steps={steps}
      />

      <DeviceShowcase
        eyebrow={analysPages.eyebrow}
        title={analysPages.title}
        body={analysPages.body}
        image={analysImages.sidor}
        card={{
          content: (
            <div className={cardWidth}>
              <TopPagesCard {...w.pages} />
            </div>
          ),
          label: 'Exempel: mest besökta sidor just nu',
          anchor: { x: 51, y: 41 },
        }}
      />

      <FeatureCarousel
        eyebrow={analysFeatures.eyebrow}
        title={analysFeatures.title}
        items={analysFeatures.items}
        background="dark"
      />

      <ServiceFullBleed
        eyebrow={analysInsights.eyebrow}
        title={analysInsights.title}
        body={analysInsights.body}
        image={analysImages.insikter}
        tone="light"
        scrim="full"
        textPosition="top-right"
        card={{
          content: <InsightCard {...w.insight} />,
          label: 'Exempel: en AI-insikt',
          anchor: { x: 38, y: 58 },
          anchorPortrait: { x: 50, y: 60 },
          anchorTo: 'image',
        }}
      />

      <ClippedImageSection
        eyebrow={analysReports.eyebrow}
        title={analysReports.title}
        body={analysReports.body}
        imageSide="left"
        sticky={false}
        background="dark"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={analysImages.rapporter} sizes="(min-width: 1024px) 50vw, 100vw" />
            <div className="absolute inset-x-0 bottom-6 flex justify-center px-6 lg:bottom-12">
              <div className={cardWidth}>
                <ReportCard {...w.report} />
              </div>
            </div>
          </div>
        }
      >
        <AnimatedButton href={analysReports.cta.href} variant="primary" size="lg">
          {analysReports.cta.label}
        </AnimatedButton>
        <p className="mt-5 text-sm text-white/60">
          {analysReports.packageNote.text}{' '}
          <Link href={analysReports.packageNote.href} className="text-white underline underline-offset-4 hover:text-teal">
            {analysReports.packageNote.linkLabel}
          </Link>
        </p>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

'use client';

import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ScrollScene } from '@/components/sections/tjanster/ScrollScene';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import {
  CampaignPriceDemo,
  EmailSendDemo,
  PromoCheckoutDemo,
  TrackingDemo,
} from '@/components/sections/tjanster/widgets/CampaignDemos';
import {
  kampanjerAvslut,
  kampanjerFeatures,
  kampanjerImages,
  kampanjerIntro,
  kampanjerKassa,
  kampanjerKoderPaus,
  kampanjerPris,
  kampanjerSparning,
  kampanjerUppfoljningPaus,
  kampanjerUtskick,
} from '@/lib/data/tjanster/kampanjer';

/*
 * The new sections of /tjanster/kampanjer, after the existing hero and collage.
 * The header is solid white on this page, so everything here is light.
 *
 * The scroll-driven demos (ScrollScene) carry the page; the abstract photos
 * are short pauses between them – four at most.
 */
export function KampanjerSections() {
  return (
    <ServicePageLayout>
      <ServiceFullBleed
        eyebrow={kampanjerIntro.eyebrow}
        title={kampanjerIntro.title}
        body={kampanjerIntro.body}
        image={kampanjerImages.intro}
        tone="light"
        textPosition="center-left"
      />

      <ScrollScene
        eyebrow={kampanjerPris.eyebrow}
        title={kampanjerPris.title}
        body={kampanjerPris.body}
        label={kampanjerPris.label}
      >
        {(progress) => <CampaignPriceDemo progress={progress} content={kampanjerPris.demo} />}
      </ScrollScene>

      <ServiceFullBleed
        eyebrow={kampanjerKoderPaus.eyebrow}
        title={kampanjerKoderPaus.title}
        body={kampanjerKoderPaus.body}
        image={kampanjerImages.koder}
        tone="dark"
      />

      <ScrollScene
        eyebrow={kampanjerKassa.eyebrow}
        title={kampanjerKassa.title}
        body={kampanjerKassa.body}
        label={kampanjerKassa.label}
        demoSide="left"
      >
        {(progress) => <PromoCheckoutDemo progress={progress} content={kampanjerKassa.demo} />}
      </ScrollScene>

      <ScrollScene
        eyebrow={kampanjerUtskick.eyebrow}
        title={kampanjerUtskick.title}
        body={kampanjerUtskick.body}
        label={kampanjerUtskick.label}
        background="stone"
      >
        {(progress) => <EmailSendDemo progress={progress} content={kampanjerUtskick.demo} />}
      </ScrollScene>

      <ServiceFullBleed
        eyebrow={kampanjerUppfoljningPaus.eyebrow}
        title={kampanjerUppfoljningPaus.title}
        body={kampanjerUppfoljningPaus.body}
        image={kampanjerImages.uppfoljning}
        tone="dark"
      />

      <ScrollScene
        eyebrow={kampanjerSparning.eyebrow}
        title={kampanjerSparning.title}
        body={kampanjerSparning.body}
        label={kampanjerSparning.label}
        demoSide="left"
      >
        {(progress) => <TrackingDemo progress={progress} content={kampanjerSparning.demo} />}
      </ScrollScene>

      <FeatureCarousel
        eyebrow={kampanjerFeatures.eyebrow}
        title={kampanjerFeatures.title}
        items={kampanjerFeatures.items}
        background="stone"
      />

      <ClippedImageSection
        eyebrow={kampanjerAvslut.eyebrow}
        title={kampanjerAvslut.title}
        body={kampanjerAvslut.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={kampanjerImages.avslut} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        }
      >
        <AnimatedButton href={kampanjerAvslut.cta.href} variant="primary" size="lg">
          {kampanjerAvslut.cta.label}
        </AnimatedButton>
        <p className="mt-5 text-sm text-gray-600">
          {kampanjerAvslut.packageNote.text}{' '}
          <Link href={kampanjerAvslut.packageNote.href} className="text-gray-900 underline underline-offset-4 hover:text-teal-dark">
            {kampanjerAvslut.packageNote.linkLabel}
          </Link>
        </p>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

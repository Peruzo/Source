'use client';

import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import { LogisticsFlowSection, TrackingMailCard } from '@/components/sections/tjanster/widgets/LogisticsFlow';
import {
  logistikAvslut,
  logistikFeatures,
  logistikFlode,
  logistikFraktsedel,
  logistikImages,
  logistikIntro,
  logistikSkala,
  logistikSparning,
} from '@/lib/data/tjanster/logistik';

/*
 * The new sections of /logistik, after the existing returns section. The header is
 * white once the page has scrolled, so everything here is light. Each photo belongs
 * to one section; photos with people sit beside the text, never under it.
 *
 * S4 has no photo: both candidates had text on lockers or on the carton. It shows the
 * tracking email instead. S5 (the mailbox video) is PAUSED: the mailbox front carries
 * made-up lettering in every frame – see CC-RAPPORT-logistik-bygge.md punkt 2.
 */

function PhotoMedia({ image }: { image: (typeof logistikImages)[keyof typeof logistikImages] }) {
  return (
    <div className="relative h-[60svh] min-h-[380px] lg:h-full">
      <ServicePicture image={image} sizes="(min-width: 1024px) 50vw, 100vw" />
    </div>
  );
}

export function LogistikSections() {
  return (
    <ServicePageLayout>
      {/* S1 – inledning, helbild av lagret. Text on the free left side (sky and trees). */}
      <ServiceFullBleed
        eyebrow={logistikIntro.eyebrow}
        title={logistikIntro.title}
        body={logistikIntro.body}
        image={logistikImages.lager}
        tone="light"
        scrim="full"
      />

      {/* S2 – fraktsedeln, foto bredvid texten */}
      <ClippedImageSection
        eyebrow={logistikFraktsedel.eyebrow}
        title={logistikFraktsedel.title}
        body={logistikFraktsedel.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={<PhotoMedia image={logistikImages.fraktsedel} />}
      />

      {/* S3 – hela bokningsflödet, motion design */}
      <LogisticsFlowSection content={logistikFlode} />

      {/* S4 – spårningslänken; no photo, the email itself */}
      <ClippedImageSection
        eyebrow={logistikSparning.eyebrow}
        title={logistikSparning.title}
        body={logistikSparning.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="relative flex h-full min-h-[420px] items-center justify-center bg-teal-light px-6 py-12 lg:px-16">
            <div role="group" aria-label="Exempel: mejlet kunden får när leveransen är bokad" className="w-full max-w-[22rem]">
              <TrackingMailCard content={logistikFlode.mail} />
            </div>
          </div>
        }
      />

      {/* S5 – brevlådevideon: PAUSAD, se kommentaren överst. */}

      {/* S6 – skala, större lager */}
      <ClippedImageSection
        eyebrow={logistikSkala.eyebrow}
        title={logistikSkala.title}
        body={logistikSkala.body}
        imageSide="right"
        sticky={false}
        background="stone"
        media={<PhotoMedia image={logistikImages.skala} />}
      />

      {/* S7 – belagda funktioner */}
      <FeatureCarousel
        eyebrow={logistikFeatures.eyebrow}
        title={logistikFeatures.title}
        items={logistikFeatures.items}
        background="white"
      />

      {/* S8 – slut-CTA */}
      <ClippedImageSection
        eyebrow={logistikAvslut.eyebrow}
        title={logistikAvslut.title}
        body={logistikAvslut.body}
        imageSide="left"
        sticky={false}
        background="stone"
        media={<PhotoMedia image={logistikImages.avslut} />}
      >
        <AnimatedButton href={logistikAvslut.cta.href} variant="primary" size="lg">
          {logistikAvslut.cta.label}
        </AnimatedButton>
        <p className="mt-5 text-sm text-gray-600">
          {logistikAvslut.packageNote.text}{' '}
          <Link href={logistikAvslut.packageNote.href} className="text-gray-900 underline underline-offset-4 hover:text-teal-dark">
            {logistikAvslut.packageNote.linkLabel}
          </Link>
        </p>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

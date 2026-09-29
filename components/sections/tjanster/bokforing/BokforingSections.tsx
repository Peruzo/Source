'use client';

import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ScrollScene } from '@/components/sections/tjanster/ScrollScene';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import { ServiceVideo } from '@/components/sections/tjanster/ServiceVideo';
import {
  FiscalYearDemo,
  FortnoxSendDemo,
  ResponsibilityNote,
  VoucherDemo,
} from '@/components/sections/tjanster/widgets/BookkeepingDemos';
import {
  bokforingAnsvar,
  bokforingArsbokslut,
  bokforingBalans,
  bokforingAvslut,
  bokforingFeatures,
  bokforingFortnox,
  bokforingImages,
  bokforingKvall,
  bokforingLattnad,
  bokforingSammanhang,
  bokforingVerifikat,
} from '@/lib/data/tjanster/bokforing';

/*
 * The new sections of /bokforing, after the existing section 4. The header is
 * white once the page has scrolled, so everything here is light. The photos are
 * documentary with the people in the middle, so they sit beside the text, never under it.
 */
export function BokforingSections() {
  return (
    <ServicePageLayout>
      {/* S1 – det tunga. A split, not a full-bleed: the person fills the middle of the
          photo, and text over it measured 1.5–2.3:1 (CC-RAPPORT-bokforing-bygge.md punkt 4). */}
      <ClippedImageSection
        eyebrow={bokforingKvall.eyebrow}
        title={bokforingKvall.title}
        body={bokforingKvall.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={bokforingImages.kvall} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        }
      />

      {/* S2 – verifikat från en utbetalning, med balanskontrollen */}
      <ScrollScene
        eyebrow={bokforingVerifikat.eyebrow}
        title={bokforingVerifikat.title}
        body={bokforingVerifikat.body}
        label={bokforingVerifikat.label}
      >
        {(progress) => <VoucherDemo progress={progress} content={bokforingVerifikat.demo} />}
      </ScrollScene>

      {/* S3 – vågskålsvideon: debet och kredit ska gå jämnt ut */}
      <ServiceVideo
        eyebrow={bokforingBalans.eyebrow}
        title={bokforingBalans.title}
        body={bokforingBalans.body}
        label={bokforingBalans.label}
        sources={bokforingBalans.sources}
        poster={bokforingBalans.poster}
        end={bokforingBalans.end}
        background="stone"
      />

      {/* S4 – sändning till Fortnox */}
      <ScrollScene
        eyebrow={bokforingFortnox.eyebrow}
        title={bokforingFortnox.title}
        body={bokforingFortnox.body}
        label={bokforingFortnox.label}
        demoSide="left"
      >
        {(progress) => <FortnoxSendDemo progress={progress} content={bokforingFortnox.demo} />}
      </ScrollScene>

      {/* S5 – allt hänger ihop: familjen med klosstornet */}
      <ClippedImageSection
        eyebrow={bokforingSammanhang.eyebrow}
        title={bokforingSammanhang.title}
        body={bokforingSammanhang.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={bokforingImages.familj} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        }
      />

      {/* S6 – räkenskapsåret stängs, årsredovisningen som mall att granska */}
      <ScrollScene
        eyebrow={bokforingArsbokslut.eyebrow}
        title={bokforingArsbokslut.title}
        body={bokforingArsbokslut.body}
        label={bokforingArsbokslut.label}
        aside={<ResponsibilityNote lead={bokforingAnsvar.lead} text={bokforingAnsvar.text} />}
      >
        {(progress) => <FiscalYearDemo progress={progress} content={bokforingArsbokslut.demo} />}
      </ScrollScene>

      {/* S7 – belagda funktioner */}
      <FeatureCarousel
        eyebrow={bokforingFeatures.eyebrow}
        title={bokforingFeatures.title}
        items={bokforingFeatures.items}
        background="stone"
      />

      {/* S8 – lättnad. A split for the same reason as S1. */}
      <ClippedImageSection
        eyebrow={bokforingLattnad.eyebrow}
        title={bokforingLattnad.title}
        body={bokforingLattnad.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={bokforingImages.lattnad} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        }
      />

      {/* S9 – avslut med ansvarsmeningen och paketraden */}
      <ClippedImageSection
        eyebrow={bokforingAvslut.eyebrow}
        title={bokforingAvslut.title}
        body={bokforingAvslut.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="relative h-[60svh] min-h-[380px] lg:h-full">
            <ServicePicture image={bokforingImages.avslut} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        }
      >
        <ResponsibilityNote lead={bokforingAnsvar.lead} text={bokforingAnsvar.text} />
        <div className="mt-8">
          <AnimatedButton href={bokforingAvslut.cta.href} variant="primary" size="lg">
            {bokforingAvslut.cta.label}
          </AnimatedButton>
        </div>
        <p className="mt-5 text-sm text-gray-600">
          {bokforingAvslut.packageNote.text}{' '}
          <Link href={bokforingAvslut.packageNote.href} className="text-gray-900 underline underline-offset-4 hover:text-teal-dark">
            {bokforingAvslut.packageNote.linkLabel}
          </Link>
        </p>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

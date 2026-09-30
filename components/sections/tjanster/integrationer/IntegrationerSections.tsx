'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ScrollScene } from '@/components/sections/tjanster/ScrollScene';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
import { ImageAnchoredCard } from '@/components/sections/tjanster/ServiceFullBleed';
import { ServicePicture } from '@/components/sections/tjanster/ServicePicture';
import {
  FortnoxConnectDemo,
  IntegrationListCard,
  InvoiceProviderCard,
  PayoutChainDemo,
  PostNordSettingsCard,
} from '@/components/sections/tjanster/widgets/IntegrationDemos';
import {
  integrationerAvslut,
  integrationerFaktura,
  integrationerFeatures,
  integrationerFortnox,
  integrationerImages,
  integrationerIntro,
  integrationerKort,
  integrationerPostNord,
  integrationerStripe,
} from '@/lib/data/tjanster/integrationer';

/*
 * The new sections of /integrationer, after the hero. The header is white once the
 * page has scrolled, so everything here is light.
 *
 * I4 and I8 have photos beside the text, with their widget on the photo from xl and
 * under it below xl (CC-RAPPORT-integrationer-media-3.md punkt 1). I1 and I5 show their
 * widget on a coloured panel, as S4 on /logistik does: no photo for them passed review
 * (every candidate had text, a logo or made-up lettering – CC-RAPPORT-integrationer-bygge.md
 * punkt 2 and CC-RAPPORT-integrationer-media.md punkt 2).
 *
 * I6 (the key-in-the-lock video) is PAUSED until the video has been reviewed.
 */

type Photo = (typeof integrationerImages)[keyof typeof integrationerImages];
type Placement = { anchor: { x: number; y: number }; aspect?: number; origin?: 'center' | 'top-left' };

/*
 * A photo with a widget. From xl the widget sits on the photo, anchored to the photo
 * itself (ImageAnchoredCard, as the cards on /analys), at a spot clear of faces and
 * hands. Below xl the column is too narrow for a card over people, so the widget
 * stacks under the photo on a teal panel. The card fades in once (opacity only);
 * under reduced motion it is simply there.
 */
function PhotoWithCard({ image, placement, label, card, stacked }: { image: Photo; placement: Placement; label: string; card: ReactNode; stacked: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const reveal = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-15%' },
        transition: { duration: 0.3, ease: [0.15, 0.5, 0.5, 1] as const },
      };
  return (
    <div className="flex flex-col lg:h-full">
      <div className="relative h-[60svh] min-h-[380px] lg:h-auto lg:min-h-0 lg:flex-1">
        <ServicePicture image={image} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="hidden xl:block">
          <ImageAnchoredCard
            card={{ content: card, label, anchor: placement.anchor, anchorTo: 'image' }}
            image={image}
            parallax={undefined}
            reduce
            reveal={reveal}
            aspect={placement.aspect}
            origin={placement.origin}
          />
        </div>
      </div>
      <div className="flex justify-center bg-teal-light px-6 py-10 xl:hidden">
        <div role="group" aria-label={label} className="w-full max-w-[22rem]">
          {stacked}
        </div>
      </div>
    </div>
  );
}

function WidgetPanel({ label, tone, children }: { label: string; tone: 'teal' | 'beige'; children: ReactNode }) {
  return (
    <div className={`relative flex h-full min-h-[420px] items-center justify-center px-6 py-12 lg:px-16 ${tone === 'teal' ? 'bg-teal-light' : 'bg-beige-light'}`}>
      <div role="group" aria-label={label} className="w-full max-w-[22rem]">
        {children}
      </div>
    </div>
  );
}

export function IntegrationerSections() {
  return (
    <ServicePageLayout>
      {/* I1 – inledning: vilka kopplingar som finns */}
      <ClippedImageSection
        eyebrow={integrationerIntro.eyebrow}
        title={integrationerIntro.title}
        body={integrationerIntro.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <WidgetPanel label="Exempel: integrationerna i portalen" tone="teal">
            <IntegrationListCard content={integrationerIntro.list} />
          </WidgetPanel>
        }
      />

      {/* I2 – anslut Fortnox, scrollstyrd scen */}
      <ScrollScene
        eyebrow={integrationerFortnox.eyebrow}
        title={integrationerFortnox.title}
        body={integrationerFortnox.body}
        label={integrationerFortnox.label}
        background="stone"
      >
        {(progress) => <FortnoxConnectDemo progress={progress} content={integrationerFortnox.demo} />}
      </ScrollScene>

      {/* I3 – från Stripe-utbetalning till verifikat i Fortnox, scrollstyrd scen */}
      <ScrollScene
        eyebrow={integrationerStripe.eyebrow}
        title={integrationerStripe.title}
        body={integrationerStripe.body}
        label={integrationerStripe.label}
        demoSide="left"
        background="white"
      >
        {(progress) => <PayoutChainDemo progress={progress} content={integrationerStripe.demo} />}
      </ScrollScene>

      {/* I4 – välj var fakturan skapas */}
      <ClippedImageSection
        eyebrow={integrationerFaktura.eyebrow}
        title={integrationerFaktura.title}
        body={integrationerFaktura.body}
        imageSide="left"
        sticky={false}
        background="stone"
        media={
          <PhotoWithCard
            image={integrationerImages.faktura}
            placement={integrationerKort.faktura}
            label="Exempel: en faktura som skapas via Fortnox"
            card={<InvoiceProviderCard content={integrationerFaktura.card} compact />}
            stacked={<InvoiceProviderCard content={integrationerFaktura.card} />}
          />
        }
      />

      {/* I5 – PostNord ställs in, inte kopplas */}
      <ClippedImageSection
        eyebrow={integrationerPostNord.eyebrow}
        title={integrationerPostNord.title}
        body={integrationerPostNord.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <WidgetPanel label="Exempel: PostNord-inställningarna ifyllda" tone="beige">
            <PostNordSettingsCard content={integrationerPostNord.card} />
          </WidgetPanel>
        }
      >
        <Link
          href={integrationerPostNord.link.href}
          className="text-base font-semibold text-teal-dark underline underline-offset-4 hover:text-teal-darker"
        >
          {integrationerPostNord.link.label}
        </Link>
      </ClippedImageSection>

      {/* I6 – nyckeln i låset (video): PAUSAD, se kommentaren överst. */}

      {/* I7 – vad kopplingarna gör */}
      <FeatureCarousel
        eyebrow={integrationerFeatures.eyebrow}
        title={integrationerFeatures.title}
        items={integrationerFeatures.items}
        background="stone"
      />

      {/* I8 – slut-CTA */}
      <ClippedImageSection
        eyebrow={integrationerAvslut.eyebrow}
        title={integrationerAvslut.title}
        body={integrationerAvslut.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <PhotoWithCard
            image={integrationerImages.avslut}
            placement={integrationerKort.avslut}
            label="Exempel: integrationerna anslutna"
            card={<IntegrationListCard content={integrationerIntro.list} connected />}
            stacked={<IntegrationListCard content={integrationerIntro.list} connected />}
          />
        }
      >
        <AnimatedButton href={integrationerAvslut.cta.href} variant="primary" size="lg">
          {integrationerAvslut.cta.label}
        </AnimatedButton>
        <p className="mt-5 text-sm text-gray-600">
          {integrationerAvslut.packageNote.text}{' '}
          <Link href={integrationerAvslut.packageNote.href} className="text-gray-900 underline underline-offset-4 hover:text-teal-dark">
            {integrationerAvslut.packageNote.linkLabel}
          </Link>
        </p>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ScrollScene } from '@/components/sections/tjanster/ScrollScene';
import { ServicePageLayout } from '@/components/sections/tjanster/ServicePageLayout';
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
  integrationerIntro,
  integrationerPostNord,
  integrationerStripe,
} from '@/lib/data/tjanster/integrationer';

/*
 * The new sections of /integrationer, after the hero. The header is white once the
 * page has scrolled, so everything here is light.
 *
 * No photo passed review (every candidate had text, a logo or made-up lettering –
 * see CC-RAPPORT-integrationer-bygge.md punkt 2). I1, I4, I5 and I8 therefore show
 * their widget on a coloured panel, as S4 on /logistik does. When photos are approved,
 * I1 can become a ServiceFullBleed with the list as its card, and I4, I5 and I8 swap
 * `media` for a photo.
 *
 * I6 (the key-in-the-lock video) is PAUSED until the video has been reviewed.
 */

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
          <WidgetPanel label="Exempel: en faktura som skapas via Fortnox" tone="teal">
            <InvoiceProviderCard content={integrationerFaktura.card} />
          </WidgetPanel>
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
          <WidgetPanel label="Exempel: integrationerna anslutna" tone="teal">
            <IntegrationListCard content={integrationerIntro.list} connected />
          </WidgetPanel>
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

'use client';

import { ArrowUturnLeftIcon, CheckCircleIcon, DocumentChartBarIcon, DocumentCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { StickySteps } from '@/components/sections/tjanster/StickySteps';
import {
  vaxaAvslut,
  vaxaBokforing,
  vaxaBokningar,
  vaxaFrakt,
  vaxaImages,
  vaxaInsikter,
  vaxaKassa,
  vaxaKomIgang,
  vaxaKunder,
  vaxaLeads,
  vaxaMer,
  vaxaMoney,
  vaxaOfferter,
} from '@/lib/data/for-dig/foretag-vaxa';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { GettingStartedSection } from './GettingStartedSection';
import { ServiceBooking } from './ProductWidgets';
import { BrandedCheckout, EmailRow, GiftCard, LeadList, OfferView, ReviewCard, StatusCard, StatusRow } from './foretag-vaxa/widgets';

const STEP_ICONS = [CheckCircleIcon, TruckIcon, ArrowUturnLeftIcon];

/**
 * Everything under the hero on /foretag-vaxande (Företag Växa). The hero in
 * app/foretag-vaxande/page.tsx stays as it is. Copy and example data live in
 * lib/data/for-dig/foretag-vaxa.ts, with the evidence for each claim.
 *
 * Shows what is added when the business grows, without repeating Företag
 * Start. No package names, no prices of our own, no user counts, only PostNord.
 */
export function ForetagVaxaSections() {
  const f = vaxaFrakt;
  const k = vaxaKassa;
  const u = vaxaKunder;

  return (
    <>
      {/* 1 – Frakt och returer. Target of the hero's "Se hur det fungerar". */}
      <StickySteps
        id={f.id}
        eyebrow={f.eyebrow}
        title={f.title}
        intro={f.intro}
        image={vaxaImages.frakt}
        steps={f.steps.map((step, i) => ({
          title: step.title,
          body: step.body,
          // StickySteps puts the visual at bottom-8 left-8 of the photo. The photo has no sky, so
          // the row goes on the strip of street under the doorway: 20 px lower from lg keeps it
          // below the threshold down to 1366 × 768 (the strip is ~12 % of the photo's height).
          // Below lg, and under reduced motion, the row sits under the step text, where the
          // shift only moves it into the section's bottom padding.
          visual: () => (
            <div className="lg:translate-y-5">
              <StatusRow content={step.row} icon={STEP_ICONS[i]} />
            </div>
          ),
        }))}
      />

      {/* 2 – Offerter. */}
      <ClippedImageSection
        id={vaxaOfferter.id}
        eyebrow={vaxaOfferter.eyebrow}
        title={vaxaOfferter.title}
        body={vaxaOfferter.body}
        imageSide="left"
        sticky={false}
        background="beige"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[26rem]">
              <OfferView content={vaxaOfferter.offer} {...vaxaMoney} />
            </div>
          </div>
        }
      />

      {/* 2b – Leads. Widgets only, no photo: the list on the stone panel, mirrored against Offerter. */}
      <ClippedImageSection
        id={vaxaLeads.id}
        eyebrow={vaxaLeads.eyebrow}
        title={vaxaLeads.title}
        body={vaxaLeads.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
            <div className="w-full max-w-[26rem]">
              <LeadList content={vaxaLeads.list} />
            </div>
          </div>
        }
      />

      {/* 3 – Bokföring med Fortnox. Card right under the phone holder, left of the hand with the phone,
          clear of his face (measured at 1440 × 900 and 1366 × 768). */}
      <ServiceFullBleed
        id={vaxaBokforing.id}
        title={vaxaBokforing.title}
        body={vaxaBokforing.body}
        image={vaxaImages.bokforing}
        tone="light"
        textPosition="top-left"
        card={{
          label: 'Exempel: ett verifikat skickat till Fortnox',
          content: <StatusCard content={vaxaBokforing.card} icon={DocumentCheckIcon} tone="glass" />,
          anchor: { x: 18, y: 84 },
          anchorPortrait: { x: 50, y: 82 },
        }}
      />

      {/* 4 – Kassan i ditt utseende. */}
      <ClippedImageSection
        id={k.id}
        eyebrow={k.eyebrow}
        title={k.title}
        body={k.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col justify-center gap-4 bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
            <div className="w-full max-w-[22rem] self-center">
              <BrandedCheckout content={k.checkout} {...vaxaMoney} />
            </div>
            <div className="w-full max-w-[20rem] self-end">
              <GiftCard content={k.giftCard} />
            </div>
          </div>
        }
      />

      {/* 5 – Bokningar. */}
      <FullBleedImageSection id={vaxaBokningar.id} eyebrow={vaxaBokningar.eyebrow} title={vaxaBokningar.title} body={vaxaBokningar.body}>
        <div className="@container mx-auto w-full max-w-[36rem]">
          <ServiceBooking content={vaxaBokningar.booking} {...vaxaMoney} />
        </div>
      </FullBleedImageSection>

      {/* 6 – Insikter och rapporter. Text on the white wall, card by the tablet, clear of her face. */}
      <ServiceFullBleed
        id={vaxaInsikter.id}
        eyebrow={vaxaInsikter.eyebrow}
        title={vaxaInsikter.title}
        body={vaxaInsikter.body}
        image={vaxaImages.insikter}
        tone="dark"
        textPosition="top-left"
        card={{
          label: 'Exempel: en schemalagd rapport',
          content: <StatusCard content={vaxaInsikter.card} icon={DocumentChartBarIcon} tone="solid" />,
          anchor: { x: 17, y: 74 },
          anchorPortrait: { x: 44, y: 17 },
        }}
      />

      {/* 7 – Håll kunderna nära. */}
      <ClippedImageSection
        id={u.id}
        eyebrow={u.eyebrow}
        title={u.title}
        body={u.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col justify-center gap-4 bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[24rem] self-center">
              <EmailRow content={u.email} />
            </div>
            <div className="w-full max-w-[20rem] self-end">
              <ReviewCard content={u.review} />
            </div>
          </div>
        }
      />

      {/* 8 – Mer som ingår. */}
      <FeatureCarousel id={vaxaMer.id} eyebrow={vaxaMer.eyebrow} title={vaxaMer.title} items={vaxaMer.items} background="beige" />

      {/* 9 – Så kommer du igång. */}
      <GettingStartedSection
        id={vaxaKomIgang.id}
        eyebrow={vaxaKomIgang.eyebrow}
        title={vaxaKomIgang.title}
        steps={vaxaKomIgang.steps}
        image={vaxaKomIgang.image}
      >
        {/* secondary, as on Företag Start: white on teal is only 2.26:1 here. */}
        <Button href={vaxaKomIgang.cta.href} variant="secondary" size="lg">
          {vaxaKomIgang.cta.label}
        </Button>
      </GettingStartedSection>

      {/* 10 – Avslutande CTA. Plain black band. */}
      <FullBleedImageSection id={vaxaAvslut.id} title={vaxaAvslut.title} height="tall" body={vaxaAvslut.body}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={vaxaAvslut.primary.href} variant="primary" size="lg">
            {vaxaAvslut.primary.label}
          </Button>
          <Button href={vaxaAvslut.secondary.href} variant="secondary" size="lg" onDark>
            {vaxaAvslut.secondary.label}
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

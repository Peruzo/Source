'use client';

import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import {
  foretagAvslut,
  foretagBetalningslank,
  foretagFakturor,
  foretagImages,
  foretagKampanjer,
  foretagKomIgang,
  foretagMer,
  foretagMoney,
  foretagMyndighetsdatum,
  foretagPrenumerationer,
  foretagProdukter,
} from '@/lib/data/for-dig/foretag-start';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { GettingStartedSection } from './GettingStartedSection';
import { InvoiceWidgets } from './InvoiceWidgets';
import { SubscriptionWidgets } from './SubscriptionWidgets';
import { PaymentLinkCard } from './foretag-start/widgets';
import { ProductsWidget } from './interactive/ProductsWidget';
import { CampaignsWidget } from './interactive/CampaignsWidget';
import { DeadlinesWidget } from './interactive/DeadlinesWidget';

/**
 * Everything under the hero on /foretag-nya (Företag Start). The hero in
 * app/foretag-nya/page.tsx stays as it is. Copy and example data live in
 * lib/data/for-dig/foretag-start.ts, with the evidence for each claim.
 *
 * Only core functions, no package names, no prices of our own, no user counts.
 * The shared widgets are composed from their parts here so nothing outside
 * core shows up: no bookable times, no accounting marks, no product photos from
 * one particular trade.
 */
export function ForetagStartSections() {
  const p = foretagProdukter;
  const k = foretagKampanjer;

  return (
    <>
      {/* 1 – Produkter och tjänster. Target of the hero's "Se hur det fungerar". */}
      <ClippedImageSection
        id={p.id}
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[36rem]">
              <ProductsWidget content={p.widget} {...foretagMoney} />
            </div>
          </div>
        }
      />

      {/* 2 – Fakturor till företag. No integration marks. */}
      <FullBleedImageSection id={foretagFakturor.id} eyebrow={foretagFakturor.eyebrow} title={foretagFakturor.title} body={foretagFakturor.body}>
        <InvoiceWidgets {...foretagFakturor.widgets} />
      </FullBleedImageSection>

      {/* 3 – Betalningslänk. Photo with the card on his hands and the phone. */}
      <ServiceFullBleed
        id={foretagBetalningslank.id}
        eyebrow={foretagBetalningslank.eyebrow}
        title={foretagBetalningslank.title}
        body={foretagBetalningslank.body}
        image={foretagImages.betalningslank}
        tone="light"
        textPosition="center-left"
        card={{
          label: 'Exempel: en betald betalningslänk',
          content: <PaymentLinkCard content={foretagBetalningslank.card} />,
          anchor: { x: 60, y: 76 },
          anchorPortrait: { x: 50, y: 80 },
        }}
      />

      {/* 4 – Kampanjer och rabattkoder. The create flow and the active list – no product photos. */}
      <ClippedImageSection
        id={k.id}
        eyebrow={k.eyebrow}
        title={k.title}
        body={k.body}
        imageSide="right"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
            <div className="w-full max-w-[36rem]">
              <CampaignsWidget content={k.widget} />
            </div>
          </div>
        }
      />

      {/* 5 – Prenumerationer. Card as payment method. One full screen, with the levels at the larger scale. */}
      <FullBleedImageSection
        id={foretagPrenumerationer.id}
        eyebrow={foretagPrenumerationer.eyebrow}
        title={foretagPrenumerationer.title}
        body={foretagPrenumerationer.body}
        height="screen"
      >
        <SubscriptionWidgets {...foretagPrenumerationer.widgets} large discount={foretagPrenumerationer.discount} />
      </FullBleedImageSection>

      {/* 6 – Myndighetsdatum. "Kommande datum" under the text, over the table – the woman and her hands stay clear. */}
      <ServiceFullBleed
        id={foretagMyndighetsdatum.id}
        eyebrow={foretagMyndighetsdatum.eyebrow}
        title={foretagMyndighetsdatum.title}
        body={foretagMyndighetsdatum.body}
        image={foretagImages.myndighetsdatum}
        tone="light"
        textPosition="top-left"
        panel={{
          label: foretagMyndighetsdatum.deadlines.label,
          content: <DeadlinesWidget content={foretagMyndighetsdatum.deadlines} />,
          place: 'text',
        }}
      />

      {/* 7 – Mer som ingår. */}
      <FeatureCarousel id={foretagMer.id} eyebrow={foretagMer.eyebrow} title={foretagMer.title} items={foretagMer.items} background="beige" />

      {/* 8 – Så kommer du igång. */}
      <GettingStartedSection
        id={foretagKomIgang.id}
        eyebrow={foretagKomIgang.eyebrow}
        title={foretagKomIgang.title}
        steps={foretagKomIgang.steps}
        image={foretagKomIgang.image}
      >
        {/* secondary, as on /privat-start: white on teal is only 2.26:1 here. */}
        <Button href={foretagKomIgang.cta.href} variant="secondary" size="lg">
          {foretagKomIgang.cta.label}
        </Button>
      </GettingStartedSection>

      {/* 9 – Avslutande CTA. Plain black band, no placeholder art. */}
      <FullBleedImageSection id={foretagAvslut.id} title={foretagAvslut.title} height="tall" body={foretagAvslut.body}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={foretagAvslut.primary.href} variant="primary" size="lg">
            {foretagAvslut.primary.label}
          </Button>
          <Button href={foretagAvslut.secondary.href} variant="secondary" size="lg" onDark>
            {foretagAvslut.secondary.label}
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

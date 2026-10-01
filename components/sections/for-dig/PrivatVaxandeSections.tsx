'use client';

import { CalendarDaysIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { FeatureCarousel } from '@/components/sections/tjanster/FeatureCarousel';
import { ServiceFullBleed } from '@/components/sections/tjanster/ServiceFullBleed';
import { InsightCard } from '@/components/sections/tjanster/widgets/AnalyticsWidgets';
import {
  privatVaxandeAvslut,
  privatVaxandeBoka,
  privatVaxandeFrakt,
  privatVaxandeImages,
  privatVaxandeInsikter,
  privatVaxandeKassa,
  privatVaxandeKomIgang,
  privatVaxandeKunder,
  privatVaxandeMer,
  privatVaxandeMoney,
} from '@/lib/data/for-dig/privat-vaxande';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { GettingStartedSection } from './GettingStartedSection';
import { CheckoutWidget } from './interactive/CheckoutWidget';
import { GiftCard, ReviewCard, StatusCard, StatusRow } from './foretag-vaxa/widgets';

/**
 * Everything under the hero on /privat-vaxande (Privat Växande). The hero in
 * app/privat-vaxande/page.tsx stays as it is. Copy and example data live in
 * lib/data/for-dig/privat-vaxande.ts, with the evidence for each claim.
 *
 * Written to one person and their own brand ("du"), not to a team. Reuses the
 * Företag Växa widgets with private content; every card is the flat, solid
 * style – no blur. The three photos use scrim 'full': they are bright daylight
 * scenes, and the full layer is what keeps white text at 4.5:1 and above.
 */
export function PrivatVaxandeSections() {
  const f = privatVaxandeFrakt;
  const k = privatVaxandeKassa;
  const ku = privatVaxandeKunder;
  const b = privatVaxandeBoka;
  const ins = privatVaxandeInsikter;

  return (
    <>
      {/* 1 – Skicka dina beställningar. Text top right (her face is on the left); the card covers the
          shipping label on the package, below her face and above her hands. Target of "Se hur det fungerar". */}
      <ServiceFullBleed
        id={f.id}
        title={f.title}
        body={f.body}
        image={privatVaxandeImages.frakt}
        tone="light"
        scrim="full"
        textPosition="top-right"
        card={{
          label: 'Exempel: en beställning skickad med PostNord',
          content: <StatusCard content={f.card} icon={TruckIcon} tone="solid" />,
          anchor: { x: 41, y: 80 },
          anchorPortrait: { x: 50, y: 71 },
        }}
      />

      {/* 2 – Kassan i ditt utseende. */}
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
            <div className="w-full max-w-[40rem] self-center">
              <CheckoutWidget content={k.checkout} {...privatVaxandeMoney} />
            </div>
            <div className="w-full max-w-[20rem] self-end">
              <GiftCard content={k.giftCard} />
            </div>
          </div>
        }
      />

      {/* 3 – Kunderna kommer tillbaka. Card on the box, over its label, below his hands. */}
      <ServiceFullBleed
        id={ku.id}
        eyebrow={ku.eyebrow}
        title={ku.title}
        body={ku.body}
        image={privatVaxandeImages.kunder}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: 'Exempel: ett nytt omdöme som visas på webbplatsen',
          content: <ReviewCard content={ku.review} />,
          anchor: { x: 64, y: 71.5 },
          anchorPortrait: { x: 50, y: 67 },
        }}
      />

      {/* 4 – Låt kunderna boka tid. A single row between her face and her hands, by the phone. */}
      <ServiceFullBleed
        id={b.id}
        eyebrow={b.eyebrow}
        title={b.title}
        body={b.body}
        image={privatVaxandeImages.boka}
        tone="light"
        scrim="full"
        textPosition="top-left"
        card={{
          label: 'Exempel: en bokning som är betald med kort',
          content: <StatusRow content={b.card} icon={CalendarDaysIcon} />,
          anchor: { x: 62.5, y: 71 },
          anchorPortrait: { x: 50, y: 61 },
        }}
      />

      {/* 5 – Se vad som säljer. */}
      <ClippedImageSection
        id={ins.id}
        eyebrow={ins.eyebrow}
        title={ins.title}
        body={ins.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[24rem]">
              <InsightCard {...ins.insight} />
            </div>
          </div>
        }
      />

      {/* 6 – Mer som ingår. */}
      <FeatureCarousel id={privatVaxandeMer.id} eyebrow={privatVaxandeMer.eyebrow} title={privatVaxandeMer.title} items={privatVaxandeMer.items} background="beige" />

      {/* 7 – Så kommer du igång. */}
      <GettingStartedSection
        id={privatVaxandeKomIgang.id}
        eyebrow={privatVaxandeKomIgang.eyebrow}
        title={privatVaxandeKomIgang.title}
        steps={privatVaxandeKomIgang.steps}
        image={privatVaxandeKomIgang.image}
      >
        {/* secondary, as on the Företag pages: white on teal is only 2.26:1 here. */}
        <Button href={privatVaxandeKomIgang.cta.href} variant="secondary" size="lg">
          {privatVaxandeKomIgang.cta.label}
        </Button>
      </GettingStartedSection>

      {/* 8 – Avslutande CTA. Boka demo primary, priser secondary. */}
      <FullBleedImageSection id={privatVaxandeAvslut.id} title={privatVaxandeAvslut.title} height="tall" body={privatVaxandeAvslut.body}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={privatVaxandeAvslut.primary.href} variant="primary" size="lg">
            {privatVaxandeAvslut.primary.label}
          </Button>
          <Button href={privatVaxandeAvslut.secondary.href} variant="secondary" size="lg" onDark>
            {privatVaxandeAvslut.secondary.label}
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

'use client';

import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { CheckoutCard } from '@/components/sections/for-dig/payment-cards/cards';
import { CreateInvoiceDialog, InvoicePreview } from '@/components/sections/for-dig/invoice-widgets/widgets';
import { FeatureCarousel } from '../FeatureCarousel';
import { ScrollScene } from '../ScrollScene';
import { ServiceFullBleed } from '../ServiceFullBleed';
import { ServicePageLayout } from '../ServicePageLayout';
import { StickySteps } from '../StickySteps';
import { PackageList } from '../widgets/AiAssistantDemos';
import { InvoicePaidCard, PaymentLinkDemo, PaymentsRefundDemo, SubscriptionDemo } from '../widgets/PaymentDemos';
import {
  PAYMENT_CURRENCY,
  PAYMENT_LOCALE,
  betalningarAvslut,
  betalningarFakturor,
  betalningarImages,
  betalningarKort,
  betalningarLank,
  betalningarMer,
  betalningarOversikt,
  betalningarPrenumeration,
} from '@/lib/data/tjanster/betalningar';

const money = { currency: PAYMENT_CURRENCY, locale: PAYMENT_LOCALE };

/** The package line under a section's text. */
function PackageNote({ text }: { text: string }) {
  return <p className="text-sm font-medium text-gray-700">{text}</p>;
}

/**
 * Everything under the hero on /tjanster/betalningar. Copy and example data live in
 * lib/data/tjanster/betalningar.ts, with the evidence for each claim. The package is
 * stated in every section.
 *
 * The two photo sections (1 and 3) are prepared but not rendered until their photo is in
 * betalningarImages – see the comment there. Until then the page goes straight from the
 * hero to the payment link.
 */
export function BetalningarSections() {
  const kortImage = betalningarImages.kort;
  const fakturorImage = betalningarImages.fakturor;
  const f = betalningarFakturor;
  const invoiceSteps = [
    { ...f.steps[0], visual: () => <CreateInvoiceDialog content={f.create} fields="full" {...money} /> },
    { ...f.steps[1], visual: () => <InvoicePreview content={f.preview} {...money} /> },
    { ...f.steps[2], visual: ({ active }: { active: boolean }) => <InvoicePaidCard content={f.paid} active={active} /> },
  ];

  return (
    <ServicePageLayout>
      {/* Fotosektion 1 – Kortbetalningar till ditt eget konto (bild 1). Kortet landar intill
          telefonen, i vänstra delen av bilden. Renderas först när bilden finns. */}
      {kortImage ? (
        <ServiceFullBleed
          id={betalningarKort.id}
          eyebrow={betalningarKort.eyebrow}
          title={betalningarKort.title}
          body={betalningarKort.body}
          image={kortImage}
          tone="light"
          textPosition="top-right"
          card={{
            label: betalningarKort.card.label,
            content: (
              <div className="w-[min(20rem,80vw)]">
                <CheckoutCard content={betalningarKort.card} {...money} />
              </div>
            ),
            anchor: betalningarKort.cardAnchor,
            anchorPortrait: betalningarKort.cardAnchorPortrait,
            anchorTo: 'image',
          }}
        />
      ) : null}

      {/* 2 – Betalningslänk. Scroll-driven demo, no photo. */}
      <ScrollScene
        id={betalningarLank.id}
        eyebrow={betalningarLank.eyebrow}
        title={betalningarLank.title}
        body={betalningarLank.body}
        label={betalningarLank.label}
        aside={<PackageNote text={betalningarLank.packageNote} />}
      >
        {(progress) => <PaymentLinkDemo progress={progress} content={betalningarLank.demo} />}
      </ScrollScene>

      {/* Fotosektion 2 – Fakturor (bild 2 som bakgrund). Stegkorten landar på bänken intill
          datorn, i nedre delen av bilden. Renderas först när bilden finns. */}
      {fakturorImage ? (
        <StickySteps id={f.id} eyebrow={f.eyebrow} title={f.title} intro={f.intro} image={fakturorImage} steps={invoiceSteps} />
      ) : null}

      {/* 4 – Prenumerationer. Scroll-driven demo, no photo. */}
      <ScrollScene
        id={betalningarPrenumeration.id}
        eyebrow={betalningarPrenumeration.eyebrow}
        title={betalningarPrenumeration.title}
        body={betalningarPrenumeration.body}
        label={betalningarPrenumeration.label}
        demoSide="left"
        aside={<PackageNote text={betalningarPrenumeration.packageNote} />}
      >
        {(progress) => <SubscriptionDemo progress={progress} content={betalningarPrenumeration.demo} />}
      </ScrollScene>

      {/* 5 – Alla betalningar och återbetalningar. */}
      <ScrollScene
        id={betalningarOversikt.id}
        eyebrow={betalningarOversikt.eyebrow}
        title={betalningarOversikt.title}
        body={betalningarOversikt.body}
        label={betalningarOversikt.label}
        aside={<PackageNote text={betalningarOversikt.packageNote} />}
      >
        {(progress) => <PaymentsRefundDemo progress={progress} content={betalningarOversikt.demo} />}
      </ScrollScene>

      {/* 6 – Mer för växande företag. The package is in each card's text. */}
      <FeatureCarousel id={betalningarMer.id} eyebrow={betalningarMer.eyebrow} title={betalningarMer.title} items={betalningarMer.items} background="beige" />

      {/* 8 – Avslut – which feature is in which package, then the way forward. Section 7
          (Hemsidan) is not built: hosting is off this page. */}
      <ClippedImageSection
        id={betalningarAvslut.id}
        eyebrow={betalningarAvslut.eyebrow}
        title={betalningarAvslut.title}
        body={betalningarAvslut.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[26rem]">
              <PackageList content={betalningarAvslut.list} />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-4">
          <AnimatedButton href={betalningarAvslut.primary.href} variant="primary" size="lg">
            {betalningarAvslut.primary.label}
          </AnimatedButton>
          <AnimatedButton href={betalningarAvslut.secondary.href} variant="secondary" size="lg">
            {betalningarAvslut.secondary.label}
          </AnimatedButton>
        </div>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

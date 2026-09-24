'use client';

import { Button } from '@/components/ui/Button';
import { CampaignWidgets } from './CampaignWidgets';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { SubscriptionWidgets } from './SubscriptionWidgets';
import { GettingStartedSection, type GettingStartedStep } from './GettingStartedSection';
import { InvoiceWidgets } from './InvoiceWidgets';
import { PaymentCards } from './PaymentCards';
import { ProductWidgets } from './ProductWidgets';

/*
 * INNEHÅLL – "För dig / Privat"
 *
 * Allt brödtext nedan är PLATSHÅLLARE. Meningarna är skrivna i rätt längd så
 * du ser hur mycket text varje sektion rymmer – byt ut dem rakt av.
 * Rubrikerna är däremot de riktiga och ska normalt stå kvar.
 *
 * Sektionskomponenterna är generiska och tar props, så företagssegmentet kan
 * återanvända dem med eget innehåll (se ClippedImageSection m.fl.).
 *
 * INGA priser, belopp eller procentsatser får stå på den här sidan förrän
 * prissättningen är bekräftad – se {TODO: pris}-markeringarna.
 *
 * Sektionsnumren i kommentarerna räknar heron som 1 och följer sidans ordning
 * uppifrån – samma nummer som platshållarbilderna i bildmappen har.
 */

const IMG = '/images/for-dig/privat';

/*
 * Mörk bakgrund bakom widgetarna i de klippta sektionerna (4 och 6). Luften
 * på den sida där klippformen har sitt djupa hörn (10rem på lg) håller
 * widgetarna fria från kurvan.
 */
const WIDGET_BACKDROP = {
  background:
    'radial-gradient(120% 90% at 100% 0%, rgba(0,128,109,0.55) 0%, transparent 60%), var(--color-black-tertiary)',
};

const steps: GettingStartedStep[] = [
  {
    number: '01',
    title: 'Placeholder – steg ett',
    body: 'Här står en beskrivning av det första steget. Skriv ungefär så här mycket text: två meningar som förklarar vad som händer och vad du behöver göra.',
  },
  {
    number: '02',
    title: 'Placeholder – steg två',
    body: 'Här står en beskrivning av det andra steget. Samma längd som ovan så att stegen ser jämna ut när man scrollar igenom dem.',
  },
  {
    number: '03',
    title: 'Placeholder – steg tre',
    body: 'Här står en beskrivning av det tredje steget. Två meningar räcker – längre text gör att den stora typografin tappar sin verkan.',
  },
  {
    number: '04',
    title: 'Placeholder – steg fyra',
    body: 'Här står en beskrivning av det fjärde steget. Ta bort det här steget om ni landar i tre steg i stället – layouten klarar båda.',
  },
];

/**
 * Allt nytt innehåll på /privat-start, renderat UNDER den befintliga heron.
 * Heron i app/privat-start/page.tsx ska lämnas orörd.
 */
export function PrivatForDigSections() {
  return (
    <>
      {/* 2 – Vi bygger din hemsida. Sidans viktigaste sektion.
          Budskap att skriva fram: vi bygger din hemsida precis som du vill ha
          den. Du behöver inte kunna något tekniskt och inte ha något sedan
          innan. */}
      <ClippedImageSection
        id="vi-bygger-din-hemsida"
        eyebrow="DIN HEMSIDA"
        title="Vi bygger din hemsida"
        imageSide="right"
        background="white"
        body={[
          'Här står den bärande texten i sektionen. Den får vara några rader längre än på övriga sektioner, eftersom det är den här sidan ska landa hos besökaren. Skriv ungefär så här mycket.',
          'Här står ett andra stycke som tar hand om invändningen. Två till tre meningar räcker – det ska kännas lugnt, inte som en argumentlista.',
          'Här står ett kort avslutande stycke som leder vidare till nästa sektion.',
        ]}
        // Renderad i ~/projects/source-motion, se README i public/images/for-dig/privat/.
        video={{
          src: '/videos/vi-bygger-din-hemsida.mp4',
          poster: '/videos/vi-bygger-din-hemsida-poster.webp',
          alt: 'En laptop där en webbutik byggs upp på skärmen och scrollas igenom, från tom skärm till färdig startsida med produkter och erbjudanden.',
        }}
      >
        <Button href="/kontakt" variant="primary" size="lg">
          Placeholder – primär knapp
        </Button>
        {/* CC BY 4.0 kräver synlig kreditering där verket används. Ta bort
            raden bara om videon tas bort. Se README i public/images/for-dig/privat/. */}
        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          3D-modell i videon:{' '}
          <a
            href="https://sketchfab.com/3d-models/modern-slim-laptop-fbf172f8b14241feab581dcb1fbcd475"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            ”Modern Slim Laptop”
          </a>{' '}
          av{' '}
          <a
            href="https://sketchfab.com/Mraz3D"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            Blaž Mraz
          </a>
          ,{' '}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer license"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            CC BY 4.0
          </a>
          , bearbetad.
        </p>
      </ClippedImageSection>

      {/* 3 – Börja ta betalt. Ingen bakgrundsbild – visualen är de tre
          betalkorten. Kortens exempelinnehåll (fiktiv butik, kundens belopp,
          inte våra priser) ligger i for-dig/payment-cards/content.ts. */}
      <FullBleedImageSection
        id="borja-ta-betalt"
        eyebrow="BETALNINGAR"
        title="Börja ta betalt"
        height="tall"
        body={[
          // TODO: ledtid för aktivering — bekräftas mot admin-portalen
          'Här står texten om att komma igång med betalningar. Tidsangivelsen för hur snabbt det går att aktivera ska in i den här meningen när den är bekräftad.',
          'Här står ett andra stycke om vad som ingår och vad du slipper hålla reda på. Två till tre meningar.',
          // TODO: verifiera att vi inte tar transaktionsavgift
        ]}
      >
        <PaymentCards />
      </FullBleedImageSection>

      {/* 4 – Lägg upp dina produkter eller tjänster. Klippformen till vänster,
          texten står fast medan butiken – en hög kolumn – scrollar förbi.
          Exempelinnehållet (fiktiv butik, kundens priser) ligger i
          for-dig/product-widgets/content.ts. */}
      <ClippedImageSection
        id="lagg-upp-produkter"
        eyebrow="PRODUKTER & TJÄNSTER"
        title="Lägg upp dina produkter eller tjänster"
        imageSide="left"
        background="white"
        body={[
          'Här står den bärande texten om hur du lägger upp det du säljer. Skriv ungefär så här mycket – tre till fyra rader på desktop.',
          'Här står ett andra stycke som förklarar vad du kan styra själv och vad vi gör åt dig.',
        ]}
        media={
          <div className="px-4 py-6 md:p-8 lg:px-14 lg:pb-16 lg:pt-28" style={WIDGET_BACKDROP}>
            <ProductWidgets />
          </div>
        }
      />

      {/* 5 – Fakturor. Ett brett appfönster under texten. Exempelinnehållet
          (fiktivt gym, kundens belopp) ligger i
          for-dig/invoice-widgets/content.ts. */}
      <FullBleedImageSection
        id="fakturor"
        eyebrow="EKONOMI"
        title="Fakturor"
        body={[
          'Här står texten om fakturering. Två till tre meningar som förklarar vad som sker automatiskt och vad du själv styr över.',
          'Här står ett kort andra stycke om uppföljning och påminnelser.',
        ]}
      >
        <InvoiceWidgets />
      </FullBleedImageSection>

      {/* 6 – Kampanjer. Klippformen till höger som sektion 2, men ett kompakt
          kollage i stället för en hög kolumn – därför inte fastlåst text.
          Exempelinnehållet ligger i for-dig/campaign-widgets/content.ts. */}
      <ClippedImageSection
        id="kampanjer"
        eyebrow="MARKNADSFÖRING"
        title="Kampanjer"
        imageSide="right"
        sticky={false}
        background="white"
        body={[
          'Här står den bärande texten om kampanjer. Skriv ungefär så här mycket text så att sektionen väger jämnt mot sektion 2 och 4.',
          'Här står ett andra stycke om vad du kan mäta och följa upp.',
        ]}
        media={
          <div className="px-4 py-6 md:p-8 lg:px-14 lg:pb-28 lg:pt-16" style={WIDGET_BACKDROP}>
            <CampaignWidgets />
          </div>
        }
      />

      {/* 7 – Prenumerationer. Den löpande driften som ett rutnät med olika
          stora rutor (sektion 3 visar redan skapandet). Exempelinnehållet –
          ett fiktivt rosteri och dess egna nivåer, inte våra paket – ligger i
          for-dig/subscription-widgets/content.ts. */}
      <FullBleedImageSection
        id="prenumerationer"
        eyebrow="ÅTERKOMMANDE INTÄKTER"
        title="Prenumerationer"
        body={[
          'Här står texten om prenumerationer och återkommande betalningar. Två till tre meningar.',
          // TODO: pris
          'Här står ett andra stycke. Om prisnivån ska nämnas någonstans är det troligen här – den får inte in förrän prissättningen är bekräftad.',
        ]}
      >
        <SubscriptionWidgets />
      </FullBleedImageSection>

      {/* 8 – Så kommer du igång. */}
      <GettingStartedSection
        id="sa-kommer-du-igang"
        eyebrow="KOM IGÅNG"
        title="Så kommer du igång"
        steps={steps}
        background="beige"
      >
        {/* TODO: pris */}
        <Button href="/kontakt" variant="primary" size="lg">
          Placeholder – knapp under stegen
        </Button>
      </GettingStartedSection>

      {/* 9 – Avslutande CTA. */}
      <FullBleedImageSection
        id="kom-igang-cta"
        title="Placeholder – avslutande rubrik"
        height="tall"
        body={[
          'Här står den avslutande texten. En till två meningar som tar besökaren vidare till kontaktformuläret.',
        ]}
        image={{
          src: `${IMG}/09-avslutande-cta.svg`,
          alt: 'TODO: alt-text – beskriv bilden för den avslutande CTA-sektionen',
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/kontakt" variant="primary" size="lg">
            Placeholder – primär CTA
          </Button>
          <Button href="/kontakt" variant="secondary" size="lg">
            Placeholder – sekundär CTA
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

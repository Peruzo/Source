'use client';

import { Button } from '@/components/ui/Button';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { SubscriptionWidgets } from './SubscriptionWidgets';
import { GettingStartedSection, type GettingStartedStep } from './GettingStartedSection';
import { HorizontalScrollSection, type ScrollPanel } from './HorizontalScrollSection';
import { InvoiceWidgets } from './InvoiceWidgets';
import { PaymentCards } from './PaymentCards';

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
 */

const IMG = '/images/for-dig/privat';

const panels: ScrollPanel[] = [
  {
    id: 'produkter',
    title: 'Produkter & tjänster',
    body: 'Här står en kort text om vad du kan lägga upp och hur du håller det uppdaterat. Två till tre rader är lagom i den här panelen.',
    image: {
      src: `${IMG}/03-panel-produkter.svg`,
      alt: 'TODO: alt-text – beskriv vad som syns i panelbilden för Produkter & tjänster',
    },
  },
  {
    id: 'fakturor',
    title: 'Fakturor',
    body: 'Här står en kort text om hur fakturorna skapas och följs upp. Håll den ungefär lika lång som de andra panelerna.',
    // Riktiga widgets i stället för bild. Exempelinnehållet (fiktivt gym,
    // kundens belopp) ligger i for-dig/invoice-widgets/content.ts.
    media: <InvoiceWidgets />,
  },
  {
    id: 'kampanjer',
    title: 'Kampanjer',
    body: 'Här står en kort text om hur du sätter upp en kampanj och vad du kan styra. Två till tre rader.',
    image: {
      src: `${IMG}/03-panel-kampanjer.svg`,
      alt: 'TODO: alt-text – beskriv vad som syns i panelbilden för Kampanjer',
    },
  },
  {
    id: 'prenumerationer',
    title: 'Prenumerationer',
    body: 'Här står en kort text om återkommande betalningar och vad kunden ser. Två till tre rader.',
    // Riktiga widgets i stället för bild: den löpande driften (sektion 3
    // visar redan skapandet). Exempelinnehållet – ett fiktivt rosteri och
    // dess egna nivåer, inte våra paket – ligger i
    // for-dig/subscription-widgets/content.ts.
    media: <SubscriptionWidgets />,
  },
];

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
      {/* 1 – Vi bygger din hemsida. Sidans viktigaste sektion.
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
        image={{
          src: `${IMG}/01-vi-bygger.svg`,
          alt: 'TODO: alt-text – beskriv bilden för sektionen Vi bygger din hemsida',
        }}
      >
        <Button href="/kontakt" variant="primary" size="lg">
          Placeholder – primär knapp
        </Button>
      </ClippedImageSection>

      {/* 2 – Börja ta betalt. Ingen bakgrundsbild – visualen är de tre
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

      {/* 3 – Horisontell scroll. */}
      <HorizontalScrollSection
        id="allt-du-kan-gora"
        eyebrow="ÖVERSIKT"
        title="Allt du kan göra"
        intro="Här står en kort ingress som förklarar vad panelerna visar. En till två meningar."
        panels={panels}
        regionLabel="Allt du kan göra – bläddra i sidled"
        background="stone"
      />

      {/* 4 – Lägg upp dina produkter eller tjänster. Speglad mot sektion 1. */}
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
        image={{
          src: `${IMG}/04-lagg-upp-produkter.svg`,
          alt: 'TODO: alt-text – beskriv bilden för sektionen Lägg upp dina produkter eller tjänster',
        }}
      />

      {/* 5 – Fakturor. */}
      <FullBleedImageSection
        id="fakturor"
        eyebrow="EKONOMI"
        title="Fakturor"
        body={[
          'Här står texten om fakturering. Två till tre meningar som förklarar vad som sker automatiskt och vad du själv styr över.',
          'Här står ett kort andra stycke om uppföljning och påminnelser.',
        ]}
        image={{
          src: `${IMG}/05-fakturor.svg`,
          alt: 'TODO: alt-text – beskriv bilden för sektionen Fakturor',
        }}
      />

      {/* 6 – Kampanjer. Samma sida som sektion 1. */}
      <ClippedImageSection
        id="kampanjer"
        eyebrow="MARKNADSFÖRING"
        title="Kampanjer"
        imageSide="right"
        background="white"
        body={[
          'Här står den bärande texten om kampanjer. Skriv ungefär så här mycket text så att sektionen väger jämnt mot sektion 1 och 4.',
          'Här står ett andra stycke om vad du kan mäta och följa upp.',
        ]}
        image={{
          src: `${IMG}/06-kampanjer.svg`,
          alt: 'TODO: alt-text – beskriv bilden för sektionen Kampanjer',
        }}
      />

      {/* 7 – Prenumerationer. */}
      <FullBleedImageSection
        id="prenumerationer"
        eyebrow="ÅTERKOMMANDE INTÄKTER"
        title="Prenumerationer"
        body={[
          'Här står texten om prenumerationer och återkommande betalningar. Två till tre meningar.',
          // TODO: pris
          'Här står ett andra stycke. Om prisnivån ska nämnas någonstans är det troligen här – den får inte in förrän prissättningen är bekräftad.',
        ]}
        image={{
          src: `${IMG}/07-prenumerationer.svg`,
          alt: 'TODO: alt-text – beskriv bilden för sektionen Prenumerationer',
        }}
      />

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

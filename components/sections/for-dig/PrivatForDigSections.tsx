'use client';

import { Button } from '@/components/ui/Button';
import { CampaignWidgets } from './CampaignWidgets';
import { ClippedImageSection } from './ClippedImageSection';
import { FullBleedImageSection } from './FullBleedImageSection';
import { SubscriptionWidgets } from './SubscriptionWidgets';
import { subscriptionWidgetsDefaults } from './subscription-widgets/content';
import { GettingStartedSection, type GettingStartedStep } from './GettingStartedSection';
import { InvoiceWidgets } from './InvoiceWidgets';
import { invoiceWidgetsDefaults } from './invoice-widgets/content';
import { PaymentCards } from './PaymentCards';
import { paymentCardsDefaults } from './payment-cards/content';
import { ProductWidgets } from './ProductWidgets';
import { productWidgetsDefaults } from './product-widgets/content';

/*
 * INNEHÅLL – "För dig / Privat"
 *
 * Brödtexten nedan är riktig copy, belagd mot kundportalen (se
 * ~/cc-rapporter/privat-start-copy-1.md). Byt inte ut den mot påståenden som
 * inte går att belägga. Rubrikerna är de riktiga och ska normalt stå kvar.
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

// En mening per steg, ca 70 tecken – texten ligger över bild på desktop.
const steps: GettingStartedStep[] = [
  {
    number: '01',
    title: 'Välj paket och skapa konto',
    body: 'Välj det paket som passar dig och skapa ditt konto.',
  },
  {
    number: '02',
    title: 'Svara på några frågor',
    body: 'Berätta om dig och om du redan har en hemsida.',
  },
  {
    number: '03',
    title: 'Godkänn villkoren och koppla Stripe',
    body: 'Skapa ditt Stripe-konto, så kan du ta emot betalningar.',
  },
  {
    number: '04',
    title: 'Vi granskar och öppnar kontot',
    body: 'Vi går igenom kontot och hör av oss. Sedan loggar du in i kundportalen.',
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
        sticky={false}
        background="white"
        body={[
          'Vi bygger en responsiv hemsida åt dig med upp till fem sidor, som fungerar lika bra i mobilen som på datorn.',
          'Du behöver inte kunna något tekniskt och inte ha någon hemsida sedan tidigare. Har du redan en, delar du koden med oss när du kommer igång.',
        ]}
        // Renderad i ~/projects/source-motion, se README i public/images/for-dig/privat/.
        video={{
          src: '/videos/vi-bygger-din-hemsida.mp4',
          poster: '/videos/vi-bygger-din-hemsida-poster.webp',
          alt: 'En laptop där en webbutik byggs upp på skärmen och scrollas igenom, från tom skärm till färdig startsida med produkter och erbjudanden.',
        }}
      >
        <Button href="/kontakt" variant="primary" size="lg">
          Boka demo
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
          'Skapa en betalningslänk och skicka den till kunden, så betalar kunden med kort direkt via länken.',
          'Betalningarna samlas i kundportalen, där du ser vad som har kommit in.',
          // TODO: verifiera att vi inte tar transaktionsavgift
        ]}
      >
        {/* Bara kortbetalning: butikens kassa tar enbart kort. */}
        <PaymentCards
          checkout={{
            ...paymentCardsDefaults.checkout,
            methodGroups: [paymentCardsDefaults.checkout.methodGroups[0].filter((m) => m.id === 'kort')],
          }}
        />
      </FullBleedImageSection>

      {/* 4 – Lägg upp dina produkter eller tjänster. Widgetarna till vänster
          på en ljus panel som fyller klippformen, texten centrerad bredvid.
          Exempelinnehållet (fiktiv butik, kundens priser) ligger i
          for-dig/product-widgets/content.ts. */}
      <ClippedImageSection
        id="lagg-upp-produkter"
        eyebrow="PRODUKTER & TJÄNSTER"
        title="Lägg upp dina produkter eller tjänster"
        imageSide="left"
        sticky={false}
        background="white"
        body={[
          'Lägg upp det du säljer, både varor och tjänster, med namn, pris och bild.',
          'Sortera dem i kategorier, så hittar kunden rätt i din butik.',
        ]}
        media={
          // Panel kant till kant i klippformen. Djupt hörn (10rem) uppe till
          // höger på lg – därför 80px luft upptill mot 32px på sidan.
          <div className="flex flex-col bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            {/* En tjänst med pris utan bokningsbara tider: bokning ingår i Growth. */}
            <ProductWidgets
              booking={false}
              service={{
                ...productWidgetsDefaults.service,
                name: 'Konsultation',
                details: '60 minuter',
                price: 895,
              }}
            />
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
          'Skapa fakturan med momsen uträknad per rad och ladda ner den som PDF. Lägg till en betalningslänk, så kan kunden betala direkt.',
          'Blir en faktura sen skickar du en påminnelse från kundens profil.',
        ]}
      >
        {/* Utan märkningen "Bokförd i": bokföring ingår i Growth. */}
        <InvoiceWidgets
          list={{
            ...invoiceWidgetsDefaults.list,
            rows: invoiceWidgetsDefaults.list.rows.map((row) => ({ ...row, integrationId: undefined })),
          }}
        />
      </FullBleedImageSection>

      {/* 6 – Kampanjer. Kollaget till höger på en ljus panel som fyller
          klippformen, texten centrerad bredvid.
          Exempelinnehållet ligger i for-dig/campaign-widgets/content.ts. */}
      <ClippedImageSection
        id="kampanjer"
        eyebrow="MARKNADSFÖRING"
        title="Kampanjer"
        imageSide="right"
        sticky={false}
        background="white"
        body={[
          'Skapa en rabattkod med procent eller ett fast belopp, och bestäm hur många gånger den får användas och när den slutar gälla.',
          'Kunden anger koden i kassan, och rabatten räknas av på köpet.',
        ]}
        media={
          // Panel kant till kant i klippformen. Djupt hörn (10rem) nere till
          // vänster på lg – därför 80px luft nedtill mot 32px på sidan.
          <div className="flex flex-col bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-20 lg:pl-8 lg:pr-8 lg:pt-12 xl:pr-12">
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
          'Sälj prenumerationer i din butik. Kunden betalar med kort när prenumerationen tecknas, och sedan dras betalningen automatiskt varje period.',
          'Du följer alla prenumerationer i kundportalen.',
        ]}
      >
        <SubscriptionWidgets
          incoming={{ ...subscriptionWidgetsDefaults.incoming, paymentMethod: 'Kort' }}
          create={{
            ...subscriptionWidgetsDefaults.create,
            paymentMethod: { ...subscriptionWidgetsDefaults.create.paymentMethod, value: 'Faktura' },
          }}
        />
      </FullBleedImageSection>

      {/* 8 – Så kommer du igång. Fullbreddsbild med mörk gradient från vänster. */}
      <GettingStartedSection
        id="sa-kommer-du-igang"
        eyebrow="KOM IGÅNG"
        title="Så kommer du igång"
        steps={steps}
        image={{
          src: `${IMG}/08-sa-kommer-du-igang.webp`,
          alt: 'En kvinna i tjock stickad tröja sitter i en grön soffa och skriver på en laptop, i ett ljust vardagsrum med en vägg full av inramade konstverk och en monstera.',
        }}
      >
        {/* TODO: pris */}
        {/* secondary, inte primary: vit text på teal är bara 2,26:1. Teal på
            sektionens mörka ton (#001310) är 8,1:1. */}
        <Button href="/priser" variant="secondary" size="lg">
          Kom igång
        </Button>
      </GettingStartedSection>

      {/* 9 – Avslutande CTA. */}
      <FullBleedImageSection
        id="kom-igang-cta"
        title="Redo att komma igång?"
        height="tall"
        body={[
          'Välj ett paket och kom igång, eller boka en demo så visar vi hur det fungerar.',
        ]}
        image={{
          src: `${IMG}/09-avslutande-cta.svg`,
          alt: 'Mörk grå bakgrund.',
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/priser" variant="primary" size="lg">
            Kom igång
          </Button>
          <Button href="/kontakt" variant="secondary" size="lg" onDark>
            Boka demo
          </Button>
        </div>
      </FullBleedImageSection>
    </>
  );
}

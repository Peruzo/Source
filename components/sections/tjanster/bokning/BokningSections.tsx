'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ClippedImageSection } from '@/components/sections/for-dig/ClippedImageSection';
import { BookingWidget } from '@/components/sections/for-dig/interactive/BookingWidget';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import { FeatureCarousel } from '../FeatureCarousel';
import { ScrollScene } from '../ScrollScene';
import { ServiceFullBleed } from '../ServiceFullBleed';
import { ServicePageLayout } from '../ServicePageLayout';
import { StickySteps } from '../StickySteps';
import { PackageList } from '../widgets/AiAssistantDemos';
import { BookingEmailCard, BookingPaymentDemo, BookingTimeCard, DayTimelineDemo, SettingsCard } from '../widgets/BookingDemos';
import {
  BOOKING_CURRENCY,
  BOOKING_LOCALE,
  bokningAvslut,
  bokningBetalning,
  bokningDagen,
  bokningHemsida,
  bokningImages,
  bokningMejl,
  bokningMer,
  bokningPersonal,
  bokningTjanster,
} from '@/lib/data/tjanster/bokning';

const money = { currency: BOOKING_CURRENCY, locale: BOOKING_LOCALE };

/** The package line under a section's text. */
function PackageNote({ text }: { text: string }) {
  return <p className="text-sm font-medium text-gray-700">{text}</p>;
}

/**
 * Section 2 – the customer's booking on the business's own site. A heading over the full
 * width and the BookingWidget from /foretag-vaxande under it, with this page's own data.
 * The widget is wide (two tabs, a step list from 48rem), so it gets the whole row rather
 * than half of a split.
 */
function BookingOnSiteSection() {
  const { reveal } = useReveal();
  const headingId = useId();
  const s = bokningHemsida;
  return (
    <section id={s.id} aria-labelledby={headingId} className="bg-surface-stone py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <motion.div {...reveal(0)} className="max-w-[40rem]">
          {/* teal-darker, not teal-dark: on the stone background teal-dark measures 4.15:1. */}
          <p className="text-overline mb-5 text-teal-darker">{s.eyebrow}</p>
          <h2 id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            {s.title}
          </h2>
          <div className="mt-5 space-y-4">
            {s.body.map((paragraph, i) => (
              <p key={i} className="max-w-[52ch] text-base leading-relaxed text-gray-700 md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6">
            <PackageNote text={s.packageNote} />
          </div>
        </motion.div>
        <motion.div {...reveal(0.1, 40)} className="mx-auto mt-10 w-full max-w-[68rem] md:mt-14">
          <BookingWidget content={s.widget} {...money} />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Everything under the hero on /bokningssystem. Copy and example data live in
 * lib/data/tjanster/bokning.ts, with the evidence for each claim. The package is stated in
 * every section: Growth and Enterprise for the booking system, Enterprise for statistics.
 *
 * The three photo sections (1, 3 and 5) render only when their photo is in bokningImages –
 * see the comment there. Today sections 1 (tjanster) and 3 (personal) have one.
 */
export function BokningSections() {
  const tjansterImage = bokningImages.tjanster;
  const personalImage = bokningImages.personal;
  const mejlImage = bokningImages.mejl;
  const p = bokningPersonal;
  const staffSteps = [
    { ...p.steps[0], visual: () => <SettingsCard content={p.hours} /> },
    { ...p.steps[1], visual: () => <SettingsCard content={p.absence} /> },
    { ...p.steps[2], visual: () => <SettingsCard content={p.resources} /> },
  ];

  return (
    <ServicePageLayout>
      {/* Fotosektion 1 – Tjänster och tider: kvinnan som bokar under paraplyet. Texten uppe till
          vänster, kortet på gatan under texten, fritt från ansikte och händer. */}
      {tjansterImage ? (
        <ServiceFullBleed
          id={bokningTjanster.id}
          eyebrow={bokningTjanster.eyebrow}
          title={bokningTjanster.title}
          body={bokningTjanster.body}
          image={tjansterImage}
          tone="light"
          // Full scrim: the yellow trees and the sky behind the text gave white text under 4.5:1
          // against the lightest 5 % with the side scrim alone.
          scrim="full"
          textPosition="top-left"
          card={{
            label: bokningTjanster.card.label,
            content: <BookingTimeCard content={bokningTjanster.card} />,
            anchor: bokningTjanster.cardAnchor,
            anchorPortrait: bokningTjanster.cardAnchorPortrait,
            anchorTo: 'image',
          }}
        />
      ) : null}

      {/* 2 – Kunden bokar på din hemsida, med BookingWidget. */}
      <BookingOnSiteSection />

      {/* Fotosektion 2 – Personal, scheman och resurser: kvinnan som ställer i ordning rummet.
          Stegkorten ligger nere till vänster, över dörren och golvet. */}
      {personalImage ? (
        <StickySteps id={p.id} eyebrow={p.eyebrow} title={p.title} intro={p.intro} image={personalImage} steps={staffSteps} />
      ) : null}

      {/* 4 – Dagen i portalen. Scroll-driven demo, no photo. */}
      <ScrollScene
        id={bokningDagen.id}
        eyebrow={bokningDagen.eyebrow}
        title={bokningDagen.title}
        body={bokningDagen.body}
        label={bokningDagen.label}
        aside={<PackageNote text={bokningDagen.packageNote} />}
      >
        {(progress) => <DayTimelineDemo progress={progress} content={bokningDagen.demo} />}
      </ScrollScene>

      {/* Fotosektion 3 – Mejl till kunden och avbokning (bild 3). Kortet landar i himlen,
          till vänster om personen. Renderas först när bilden finns. */}
      {mejlImage ? (
        <ServiceFullBleed
          id={bokningMejl.id}
          eyebrow={bokningMejl.eyebrow}
          title={bokningMejl.title}
          body={bokningMejl.body}
          image={mejlImage}
          tone="dark"
          textPosition="top-right"
          card={{
            label: bokningMejl.cardLabel,
            content: (
              <div className="w-[min(22rem,80vw)]">
                <BookingEmailCard content={bokningMejl.email} />
              </div>
            ),
            anchor: bokningMejl.cardAnchor,
            anchorPortrait: bokningMejl.cardAnchorPortrait,
            anchorTo: 'image',
          }}
        />
      ) : null}

      {/* 6 – Betalning vid bokning. */}
      <ScrollScene
        id={bokningBetalning.id}
        eyebrow={bokningBetalning.eyebrow}
        title={bokningBetalning.title}
        body={bokningBetalning.body}
        label={bokningBetalning.label}
        demoSide="left"
        aside={<PackageNote text={bokningBetalning.packageNote} />}
      >
        {(progress) => <BookingPaymentDemo progress={progress} content={bokningBetalning.demo} />}
      </ScrollScene>

      {/* 7 – Mer i bokningssystemet. The package is in each card's text; statistics is Enterprise. */}
      <FeatureCarousel id={bokningMer.id} eyebrow={bokningMer.eyebrow} title={bokningMer.title} items={bokningMer.items} background="beige" />

      {/* 8 – Avslut – which feature is in which package, then the way forward. */}
      <ClippedImageSection
        id={bokningAvslut.id}
        eyebrow={bokningAvslut.eyebrow}
        title={bokningAvslut.title}
        body={bokningAvslut.body}
        imageSide="left"
        sticky={false}
        background="white"
        media={
          <div className="flex flex-col items-center justify-center bg-surface-stone p-5 md:p-8 lg:h-full lg:pb-12 lg:pl-8 lg:pr-8 lg:pt-20 xl:pl-12">
            <div className="w-full max-w-[26rem]">
              <PackageList content={bokningAvslut.list} />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-4">
          <AnimatedButton href={bokningAvslut.primary.href} variant="primary" size="lg">
            {bokningAvslut.primary.label}
          </AnimatedButton>
          <AnimatedButton href={bokningAvslut.secondary.href} variant="secondary" size="lg">
            {bokningAvslut.secondary.label}
          </AnimatedButton>
        </div>
      </ClippedImageSection>
    </ServicePageLayout>
  );
}

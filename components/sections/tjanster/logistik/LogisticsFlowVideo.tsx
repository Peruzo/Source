'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '@/components/sections/for-dig/useReveal';
import type { ServiceVideoSource, ServiceVideoStill } from '@/components/sections/tjanster/ServiceVideo';
import { LoopingVideo } from './LoopingVideo';

type LogisticsFlowVideoProps = {
  eyebrow: string;
  title: string;
  intro: string;
  label: string;
  video: { sources: ServiceVideoSource[]; poster: ServiceVideoStill; end: ServiceVideoStill };
};

/*
 * S3 on /logistik – "Så går det till". The same heading, overline and intro as before, with the
 * whole delivery flow as a looping video instead of the five scroll-driven cards: the checkout
 * with the delivery choice and payment, the paid order, the new-order notice in the portal, the
 * order, Boka hos PostNord with the package profile and "Skapa och boka", the shipping label as a
 * PDF and the email with the tracking link. Rendered in ~/remotion-source (LogistikFlode).
 *
 * Keeps the section id (bokningsflode) and the stone background, so links and the rhythm of the
 * page stay the same. Nothing pins any more, so the scroll hint does not show here.
 */
export function LogisticsFlowVideo({ eyebrow, title, intro, label, video }: LogisticsFlowVideoProps) {
  const headingId = useId();
  const { reveal } = useReveal();
  return (
    <section id="bokningsflode" aria-labelledby={headingId} className="bg-surface-stone py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
        <motion.div {...reveal(0)} className="mx-auto max-w-[44rem] text-center">
          <p className="text-overline mb-4 text-teal-dark">{eyebrow}</p>
          <h2 id={headingId} className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">{intro}</p>
        </motion.div>

        <div className="relative mx-auto mt-10 aspect-video w-full max-w-[1120px] overflow-hidden rounded-3xl bg-surface-stone shadow-[0_24px_60px_-36px_rgba(0,0,0,0.35)] ring-1 ring-black/5 md:mt-14">
          <LoopingVideo sources={video.sources} poster={video.poster} end={video.end} label={label} sizes="(min-width: 1200px) 1120px, 100vw" />
        </div>
      </div>
    </section>
  );
}

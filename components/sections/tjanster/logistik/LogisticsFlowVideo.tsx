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
 * S3 on /logistik – "Så går det till". The whole flow as a looping 4K video (~/remotion-source,
 * LogistikKassa4K): the checkout with delivery choice and card payment, the new-order notice in
 * the portal, the order, Boka hos PostNord, the shipping label as a PDF and the email with the
 * tracking link.
 *
 * Full bleed from lg when the screen is at least 3:2 wide: the video covers the section
 * (object-fit: cover, centred), which is at least one screen tall and never shorter than 16:9, so a
 * 16:9 screen or a wider one shows the whole frame and 16:10 or 3:2 only lose background at the
 * sides (the UI in the video sits inside the 3:2 crop). The overline, heading and intro sit as HTML
 * in the calm top 22 % of the video, aligned to its bottom so the fixed header (64 px) never covers
 * them. Narrower screens – phones, tablets and 4:3 – get the text above and the video at full width
 * in 16:9 below.
 *
 * The overline is teal-darker here: teal-dark on the stone field is 4.2:1, teal-darker passes AA.
 * Keeps the section id (bokningsflode) and the stone background, so links and the rhythm of the
 * page stay the same.
 */
export function LogisticsFlowVideo({ eyebrow, title, intro, label, video }: LogisticsFlowVideoProps) {
  const headingId = useId();
  const { reveal } = useReveal();
  return (
    <section
      id="bokningsflode"
      aria-labelledby={headingId}
      className="relative bg-surface-stone [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:h-[max(100svh,56.25vw)] [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:overflow-hidden"
    >
      <div className="relative z-10 px-6 pb-10 pt-20 text-center md:px-10 md:pb-12 md:pt-28 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:absolute [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:inset-x-0 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:top-0 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:flex [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:h-[22%] [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:flex-col [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:justify-end [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:px-8 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:pb-[0.5%] [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:pt-0">
        <motion.div {...reveal(0)} className="mx-auto max-w-[44rem] [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:max-w-[76rem]">
          <p className="text-overline mb-4 text-teal-darker [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:mb-2">{eyebrow}</p>
          <h2
            id={headingId}
            className="text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:text-[clamp(1.625rem,2.3vw,2.75rem)]"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:mt-2 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:text-[clamp(0.9375rem,1.1vw,1.125rem)]">
            {intro}
          </p>
        </motion.div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:absolute [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:inset-0 [@media(min-width:1024px)_and_(min-aspect-ratio:3/2)]:aspect-auto">
        <LoopingVideo sources={video.sources} poster={video.poster} end={video.end} label={label} sizes="100vw" className="object-center" />
      </div>
    </section>
  );
}

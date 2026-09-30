"use client";

import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { usePrefersReducedMotion } from '@/components/sections/for-dig/useReveal';
import { AiAssistentSections } from '@/components/sections/tjanster/ai-assistent/AiAssistentSections';
import { aiHero, aiSourceAi } from '@/lib/data/tjanster/ai-assistent';

export default function AIAssistentPage() {
  const reduceMotion = usePrefersReducedMotion();

  // "Boka demo" links to /kontakt, like every other "Boka demo" on the site. "Se hur det fungerar"
  // scrolls to section 1, Source AI i portalen. globals.css sets scroll-behavior: smooth on *, so
  // reduced motion asks for 'instant'.
  const showHow = () => {
    document.getElementById(aiSourceAi.id)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white">
      {/* Hero – layout and photo unchanged. The copy is corrected (ai-assistent-plan.md 3.1) and the
          start page's two buttons are added. */}
      <section className="relative pt-32 md:pt-40 lg:pt-44 pb-20 md:pb-28 lg:pb-32 min-h-[640px] md:min-h-[720px] bg-white overflow-hidden">
        {/* Full-height background image for the whole section */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/womenincouch.png"
            alt="Person som använder Source AI-assistenten i soffan"
            fill
            priority
            className="object-cover object-center md:object-[center_60%]"
            sizes="100vw"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 lg:px-20 grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start md:items-center">
          {/* Left: text content */}
          <FadeIn className="space-y-6 md:space-y-7">
            <p className="text-overline text-teal">{aiHero.overline}</p>
            <h1 className="text-section-title text-white">{aiHero.title}</h1>
            <p className="text-body-large text-white max-w-xl">{aiHero.lead}</p>
            <p className="text-body text-gray-100 max-w-xl">{aiHero.body}</p>
            {/* Same buttons as the start page hero (components/sections/Hero.tsx) and the För dig pages. */}
            <div className="flex flex-wrap gap-4 pt-2">
              <AnimatedButton href={aiHero.primary.href} variant="primary" size="lg">
                {aiHero.primary.label}
              </AnimatedButton>
              <AnimatedButton onClick={showHow} variant="secondary" size="lg" onDark>
                {aiHero.secondary}
              </AnimatedButton>
            </div>
          </FadeIn>

          {/* Right: conversation card over the full-bleed image */}
          <FadeIn className="relative flex justify-center md:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              className="max-w-[260px] md:max-w-xs rounded-2xl bg-black/80 border border-white/12 shadow-2xl p-4 md:p-5 space-y-3 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between text-[11px] text-gray-300/90 mb-1">
                <span className="font-medium text-white/90">{aiHero.chat.name}</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {aiHero.chat.status}
                </span>
              </div>

              {/* Conversation */}
              <div className="space-y-2.5 text-[11px] leading-snug">
                {/* Customer message */}
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white/6 border border-white/15 px-3 py-2 text-gray-100 shadow-lg">
                    {aiHero.chat.question}
                  </div>
                </div>

                {/* AI message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-teal-dark px-3 py-2 text-white shadow-lg text-left">
                    {aiHero.chat.answers[0]}
                  </div>
                </div>

                {/* AI message 2 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-white/8 border border-emerald-400/30 px-3 py-2 text-gray-100 shadow-lg text-left">
                    {aiHero.chat.answers[1]}
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      <AiAssistentSections />
    </div>
  );
}

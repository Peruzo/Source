"use client";

import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

export default function AIAssistentPage() {
  return (
    <div className="bg-white">
      {/* Hero-like question section */}
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
            <p className="text-overline text-teal">FRÅGA SOURCE AI</p>
            <h1 className="text-section-title text-white">
              Hur får jag ut mer av mina pengar?
            </h1>
            <p className="text-body-large text-white max-w-xl">
              Med personliga insikter och tips från Source AI får du bättre kontroll, mer
              självförtroende och en tydlig bild av vad som faktiskt driver dina intäkter.
            </p>
            <p className="text-body text-gray-100 max-w-xl">
              Source AI kopplar ihop dina bokningar, kundresor och intäkter – och gör om all data till
              svar du kan agera på direkt. Fråga om utvecklingen, få en förklaring och ett konkret
              nästa steg.
            </p>
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
                <span className="font-medium text-white/90">Source AI</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Aktiv
                </span>
              </div>

              {/* Conversation */}
              <div className="space-y-2.5 text-[11px] leading-snug">
                {/* Customer message */}
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white/6 border border-white/15 px-3 py-2 text-gray-100 shadow-lg">
                    Hur får jag ut mer av mina pengar?
                  </div>
                </div>

                {/* AI message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-teal px-3 py-2 text-white shadow-lg text-left">
                    Jag ser att dina bokningar ökat – men intäkterna följer inte riktigt med. Vill du att
                    jag visar var du tjänar mest just nu?
                  </div>
                </div>

                {/* AI message 2 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-white/8 border border-emerald-400/30 px-3 py-2 text-gray-100 shadow-lg text-left">
                    Jag har tagit fram tre konkreta förslag som kan öka intäkterna utan fler timmar i
                    kalendern.
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* AI insight agents section */}
      <section className="bg-black text-white py-20 md:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-20 grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Left: agents grid */}
          <div>
            <h2 className="text-section-title mb-6">
              Egna AI insikt&nbsp;agenter som analyserar all er data
            </h2>
            <p className="text-body-large text-gray-200 mb-10 max-w-xl">
              Varje agent är tränad för ett specifikt område – från betalningar till lager och kampanjer.
              Tillsammans ger de en helhetsbild av hur din verksamhet mår, utan att du behöver öppna ett
              enda kalkylark.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { src: '/betalningsagent.png', label: 'Betalningar' },
                { src: '/analyseragent.png', label: 'Analyser' },
                { src: '/betalningslankagent.png', label: 'Betalningslänk' },
                { src: '/dashboardagent.png', label: 'Dashboard' },
                { src: '/inventarieragent.png', label: 'Inventarier' },
                { src: '/kampanjeragent.png', label: 'Kampanjer' },
                { src: '/kunderagent.png', label: 'Kunder' },
                { src: '/logistikagent.png', label: 'Logistik' },
                { src: '/marknadsforingagent.png', label: 'Marknadsföring' },
                { src: '/rapporteragent.png', label: 'Rapporter' },
                { src: '/statistikagent.png', label: 'Statistik' },
                { src: '/fakturoragent.png', label: 'Fakturor' },
              ].map((agent) => (
                <div key={agent.src} className="flex flex-col items-center text-center gap-3">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-white/10 bg-gray-900">
                    <Image
                      src={agent.src}
                      alt={agent.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-100">{agent.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: examples of insights */}
          <div className="space-y-6 md:space-y-7">
            <h3 className="text-xl md:text-2xl font-semibold">
              Exempel på hur agenterna hjälper dig i vardagen
            </h3>

            <div className="space-y-5 text-sm md:text-base text-gray-200">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold text-emerald-300 uppercase mb-1.5">
                  Betalningsagent
                </p>
                <p>
                  Upptäcker att dina kortbetalningar sticker iväg vissa dagar i månaden och föreslår att
                  du flyttar kampanjer till de perioder där konverteringen är som högst.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold text-sky-300 uppercase mb-1.5">
                  Kampanjagent
                </p>
                <p>
                  Jämför senaste kampanjen med tidigare utskick och visar exakt vilka kanaler som gav
                  bäst lönsamhet – inte bara flest klick.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold text-amber-300 uppercase mb-1.5">
                  Lager- &amp; logistikagent
                </p>
                <p>
                  Flaggar för produkter som ofta tar slut samtidigt som bokningar ökar, och föreslår
                  inköpsnivåer baserat på verklig efterfrågan.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs font-semibold text-indigo-300 uppercase mb-1.5">
                  Kund- &amp; rapportagent
                </p>
                <p>
                  Sammanfattar månaden i ett språk du faktiskt förstår – med tydliga insikter om vilka
                  kundtyper, tjänster och tider på dygnet som driver mest intäkter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



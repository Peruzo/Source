'use client';

import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';

const services = [
  {
    id: 'design',
    number: '01',
    title: 'Design & Utveckling',
    intro:
      'Inte mallar. Inte "gör själv". AI-driven design anpassad för din bransch och målgrupp.',
    included: [
      'Responsiv design (mobil-först)',
      'E-handelsintegration',
      'Betalningslösningar',
      'SEO-optimering',
      'Prestandaoptimering',
    ],
    result: 'Professionell design till en bråkdel av byråpriset.',
  },
  {
    id: 'ecommerce',
    number: '02',
    title: 'E-handel',
    intro: 'Komplett e-handelslösning med allt du behöver för att sälja online.',
    included: [
      'Produkthantering',
      'Inventory management',
      'Betalningar (Stripe)',
      'Fraktintegration',
      'Kundhantering',
      'Orderhantering',
    ],
    result: 'Ditt team har erfarenhet från betalningsbranschen.',
  },
  {
    id: 'ai-analytics',
    number: '03',
    title: 'AI-Driven Analys',
    subtitle: '★ Vår huvudsakliga skillnad',
    intro: 'Detta är inte Google Analytics.',
    included: [
      'Automatiserade förbättringsförslag baserat på användarbeteende',
      'Identifiering av konverteringsbarriärer och friktionspunkter',
      'Optimering av produktpresentation genom visuell analys',
      'Personalisering av användarupplevelser baserat på preferenser',
      'Realtids-A/B-testning och kontinuerlig optimering',
    ],
    result: 'AI ger konkreta förslag som är bevisat att göra skillnad.',
    featured: true,
  },
  {
    id: 'payments',
    number: '04',
    title: 'Betalningar & Hosting',
    intro: 'Allt ingår. Inga dolda kostnader. Inga tredjeparter.',
    included: [
      'Stripe-integration',
      'Flera valutor',
      'Prenumerationer',
      'Refunds & rapporter',
      'Render/Vercel hosting',
      'Auto-scaling',
      'SSL-certifikat',
      'CDN',
      'Backup dagligen',
    ],
    result: 'Du behöver inte hantera tekniska detaljer.',
  },
  {
    id: 'support',
    number: '05',
    title: 'Support & Utveckling',
    intro: 'Vi växer med dig.',
    included: [
      'Chatt i kundportalen',
      'E-post support',
      'Video-möten (beroende på plan)',
      'Feedback-driven utveckling',
      'Nya funktioner automatiskt',
      'Säkerhetsuppdateringar',
      'Prestandaförbättringar',
      'Feature requests',
    ],
    result:
      'Alla tre grundare kommer från kundservice-branschen. Vi förstår att hjälpa kunder.',
  },
];

export default function ServicesPage() {
  const [primaryService, ...otherServices] = services;
  const ecommerceSectionRef = useRef<HTMLElement | null>(null);
  const ecommerceVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasPlayedEcommerceVideo, setHasPlayedEcommerceVideo] = useState(false);
  const logisticsSectionRef = useRef<HTMLElement | null>(null);
  const logisticsVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasPlayedLogisticsVideo, setHasPlayedLogisticsVideo] = useState(false);

  useEffect(() => {
    const sectionEl = ecommerceSectionRef.current;
    const videoEl = ecommerceVideoRef.current;

    if (!sectionEl || !videoEl || hasPlayedEcommerceVideo) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedEcommerceVideo) {
            videoEl.currentTime = 0;
            const playPromise = videoEl.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setHasPlayedEcommerceVideo(true);
                  observer.disconnect();
                })
                .catch(() => {
                  setHasPlayedEcommerceVideo(true);
                  observer.disconnect();
                });
            } else {
              setHasPlayedEcommerceVideo(true);
              observer.disconnect();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(sectionEl);

    return () => observer.disconnect();
  }, [hasPlayedEcommerceVideo]);

  useEffect(() => {
    const sectionEl = logisticsSectionRef.current;
    const videoEl = logisticsVideoRef.current;

    if (!sectionEl || !videoEl || hasPlayedLogisticsVideo) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedLogisticsVideo) {
            videoEl.currentTime = 0;
            const playPromise = videoEl.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setHasPlayedLogisticsVideo(true);
                  observer.disconnect();
                })
                .catch(() => {
                  setHasPlayedLogisticsVideo(true);
                  observer.disconnect();
                });
            } else {
              setHasPlayedLogisticsVideo(true);
              observer.disconnect();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(sectionEl);

    return () => observer.disconnect();
  }, [hasPlayedLogisticsVideo]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
        <video
          src="/social_u6293379286_create_a_video_of_a_lady_having_her_head_out_of_t_fa3cf5e8-c008-4ece-8889-13e225e0a8ed_3.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center lg:object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#04070d] via-[#04070d]/90 via-[#04070d]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,191,166,0.18),transparent_60%)]"></div>
        <div className="absolute -bottom-20 -left-24 h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-[180px]"></div>

        <Container className="relative z-10 flex min-h-[100svh] items-center">
          <FadeIn className="max-w-2xl space-y-8 py-24 lg:py-0">
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-xs uppercase tracking-[0.4em] text-white/60"
            >
              VÅRA TJÄNSTER
            </motion.span>

            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight"
              >
                Inte bara en tjänst.
                <span className="block text-teal">En komplett lösning.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                className="max-w-xl text-lg md:text-xl text-white/70 leading-relaxed"
              >
                Design • E-handel • AI-analys • Hosting • Support. Allt samlat i en upplevelse som känns lika självklar som den ser ut.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.3 }}
              className="flex flex-col items-start gap-4 sm:flex-row"
            >
              <AnimatedButton
                href="/kontakt"
                size="lg"
                className="!px-10 !py-4 !rounded-full !bg-teal !text-white !font-semibold !shadow-[0_30px_80px_rgba(0,191,166,0.45)] hover:!bg-teal-hover"
              >
                Boka en demo
              </AnimatedButton>
              <Link
                href="#design"
                className="inline-flex items-center text-base font-semibold text-white/70 transition-colors hover:text-white"
              >
                Utforska våra tjänster
                <span className="ml-2 text-lg">→</span>
              </Link>
            </motion.div>
          </FadeIn>
        </Container>
      </section>

      {/* Design & Utveckling Highlight */}
      {primaryService && (
        <section
          id={primaryService.id}
          className="relative overflow-hidden pt-24 md:pt-32 pb-10 text-white"
        >
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src="/u6293379286_create_a_close_up_picture_with_high_grafic_were_y_60a11c9e-1c40-467a-b49e-5c0625b3e7d7_0.png"
              alt="Händer som arbetar på en laptop"
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>

          <Container>
            <div className="relative z-10 flex flex-col items-center justify-between min-h-[820px] md:min-h-[940px]">
              <div className="w-full max-w-2xl mx-auto space-y-7 text-center">
                <motion.span
                  initial={{ opacity: 0, y: -16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="inline-flex items-center justify-center text-xs md:text-sm uppercase tracking-[0.4em] text-white/70"
                >
                  01 · DESIGN & UTVECKLING
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white"
                >
                  Design och Utveckling
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto"
                >
                  {primaryService.intro}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  <AnimatedButton
                    href="/kontakt"
                    size="lg"
                    className="!bg-teal !text-white !font-semibold !px-8 !py-3 !rounded-full !shadow-[0_18px_45px_-15px_rgba(0,191,166,0.55)] hover:!bg-teal-hover"
                  >
                    Boka en demo
                  </AnimatedButton>
                  <Link
                    href="#design"
                    className="text-sm md:text-base font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    Visa alla funktioner →
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  className="text-sm md:text-base text-white/60"
                >
                  {primaryService.result}
                </motion.p>
              </div>

              <div className="w-full flex justify-center mt-auto pb-4 md:pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  className="relative w-full max-w-md"
                >
                  <div className="relative rounded-[36px] border border-white/25 bg-transparent p-10 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60 mb-6">
                      Vad som ingår
                    </p>
                    <ul className="space-y-4">
                      {primaryService.included.map((item) => (
                        <li
                          key={item}
                          className="flex items-center justify-center gap-3 text-sm md:text-base text-white/85"
                        >
                          <span className="inline-block h-[6px] w-[6px] rounded-full bg-white/80"></span>
                          <span className="leading-relaxed text-left">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Service Sections */}
      {otherServices.map((service, index) => {
        if (service.id === 'ecommerce') {
          return (
            <Fragment key={service.id}>
              <section
                id={service.id}
                ref={ecommerceSectionRef}
                className="relative overflow-hidden bg-gradient-to-br from-[#f7f8fb] via-white to-white py-24 md:py-32"
              >
                <Container>
                  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-16 lg:gap-20">
                    <div className="space-y-8 max-w-xl">
                      <motion.span
                        initial={{ opacity: 0, y: -12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-xs md:text-sm uppercase tracking-[0.4em] text-gray-500"
                      >
                        {service.number} · E-handel
                      </motion.span>

                      <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900"
                      >
                        {service.title}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: -12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        {service.intro}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                        className="pt-6"
                      >
                        <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                          Vad ingår
                        </p>
                        <ul className="mt-6 space-y-3 text-base md:text-lg text-gray-700">
                          {service.included.map((item) => (
                            <li key={item} className="flex items-center gap-3">
                              <span className="inline-block h-[6px] w-[6px] rounded-full bg-gray-900/70"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        className="text-sm md:text-base text-gray-500"
                      >
                        {service.result}
                      </motion.p>
                    </div>

                    <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="relative flex w-full justify-center lg:justify-end"
                >
                  <div className="absolute -top-24 -right-10 h-80 w-80 rounded-full bg-teal/15 blur-3xl"></div>
                  <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"></div>
                  <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] border border-gray-200 bg-white shadow-[0_45px_120px_-60px_rgba(15,23,42,0.35)]">
                    <video
                      ref={ecommerceVideoRef}
                      src="/ehnadelvideo.mp4"
                      muted
                      playsInline
                      preload="metadata"
                      controls={false}
                      loop={false}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
                </div>
              </Container>
            </section>

            <section
              ref={logisticsSectionRef}
              className="relative overflow-hidden bg-black text-white py-28 md:py-36 lg:py-40 min-h-[680px] md:min-h-[760px]"
            >
              <motion.div
                initial={{ scale: 1.02, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <video
                  ref={logisticsVideoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/logistikvideo.mp4"
                  poster="/u6293379286_create_a_black_background_with_a_delivery_truck_t_28e332cb-4cb6-4f9d-a17d-f54645d753d4_3.png"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                />
              </motion.div>

              <Container>
                <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-between text-center gap-8">
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/70"
                  >
                    Logistik
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
                  >
                    Få en överblick över din logistik.
                    <span className="block text-2xl md:text-3xl text-white/80 mt-4">
                      Synka leveranser, lager och returer i realtid.
                    </span>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative w-full max-w-xl pt-12"
                  >
                    <div className="relative mx-auto w-[260px] sm:w-[320px] rounded-[36px] bg-gradient-to-b from-[#1b1f27] via-black to-black border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-8">
                      <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48">
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_135deg,_#4f46e5_0deg,_#6366f1_220deg,_rgba(255,255,255,0.08)_220deg,_rgba(255,255,255,0.05)_360deg)]"></div>
                        <div className="absolute inset-[14%] rounded-full bg-black flex flex-col items-center justify-center gap-1">
                          <span className="text-xs uppercase tracking-wider text-white/60">
                            Försäljning
                          </span>
                          <span className="text-2xl sm:text-3xl font-semibold text-white">
                            25 200 kr
                          </span>
                          <span className="text-xs text-white/50">Januari</span>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col items-center text-white/70">
                        <p className="text-xs uppercase tracking-[0.3em]">
                          NÄSTA LEVERANS
                        </p>
                        <p className="mt-3 text-lg font-semibold text-white">
                          ETA 23 minuter · Göteborg
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex justify-center">
                      <div className="w-[360px] max-w-full h-12 rounded-[999px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.18)_0%,_rgba(255,255,255,0)_70%)] opacity-80"></div>
                    </div>
                  </motion.div>
                </div>
              </Container>
            </section>

            </Fragment>
          );
        }

        if (service.id === 'payments') {
          return (
            <section
              key={service.id}
              id={service.id}
              className="relative overflow-hidden py-32 md:py-36 text-white"
            >
              <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src="/u6293379286_create_a_picture_of_two_people_one_man_one_women__d9289ed4-880e-4a28-9b2e-2a190bdf96df_0.png"
                  alt="Två personer som ler mot varandra"
                  fill
                  priority={false}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/25"></div>

              <Container>
                <div className="relative z-10 flex flex-col items-center text-center gap-8">
                  <motion.span
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-xs md:text-sm uppercase tracking-[0.35em] text-white/70"
                  >
                    {service.number} · {service.title}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: -18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                  >
                    {service.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                    className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
                  >
                    {service.intro}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, ease: 'easeOut', delay: 0.15 }}
                    className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    {[
                      { title: 'Betalningar', value: '282 804 kr', label: 'Månadsflöde' },
                      { title: 'Hosting', value: '99.9%', label: 'Uptime SLA' },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="group flex flex-col items-center rounded-[32px] border border-white/20 bg-white/15 px-8 py-10 backdrop-blur-xl transition-colors duration-200 hover:bg-white/20"
                      >
                        <span className="text-sm uppercase tracking-[0.2em] text-white/70">
                          {item.title}
                        </span>
                        <span className="mt-5 text-4xl font-semibold tracking-tight text-white">
                          {item.value}
                        </span>
                        <span className="mt-4 inline-flex items-center rounded-full bg-white text-sm font-semibold text-gray-900 px-5 py-2">
                          {item.label}
                        </span>
                        <div className="mt-6 flex items-center gap-4 text-white/80 text-sm">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30">
                            +
                          </span>
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30">
                            ↺
                          </span>
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30">
                            …
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-sm md:text-base text-white/75 max-w-xl"
                  >
                    {service.result}
                  </motion.p>
                </div>
              </Container>
            </section>
          );
        }

        if (service.id === 'support') {
          const supportCards = [
            {
              title: 'Alla betalningar är säkrade',
              imageSrc: '/stripebild.png',
              imageAlt: 'Stripe-visualisering med neonpunkter.',
            },
            {
              title: 'Kundsupport dygnet runt',
              imageSrc: '/supportbild.png',
              imageAlt: 'Person med telefon och chattmeddelande.',
            },
            {
              title: 'Håll allt säkert på ett ställe',
              imageSrc:
                '/u6293379286_create_a_glass_blur_background_with_a_up_close_fr_dc71dc67-7e71-4045-859c-3ade356e8ca9_3.png',
              imageAlt: 'Glasikon framför suddig laptop.',
            },
          ];

          return (
            <section
              key={service.id}
              id={service.id}
              className="relative overflow-hidden bg-[#11131b] py-28 md:py-36 text-white"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),rgba(17,19,27,0.92)_55%)]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0e16]/40 to-[#05060b]"></div>

              <Container>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.span
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-xs md:text-sm uppercase tracking-[0.35em] text-white/60"
                  >
                    {service.number} · {service.title}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: -18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight"
                  >
                    {service.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                    className="mt-5 max-w-2xl text-lg md:text-xl leading-relaxed text-white/75"
                  >
                    {service.intro}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
                    className="mt-3 max-w-2xl text-base md:text-lg text-white/65"
                  >
                    {service.result}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                    className="mt-16 w-full"
                  >
                    <div className="flex w-full gap-6 overflow-x-auto pb-4 sm:justify-center sm:overflow-visible">
                      {supportCards.map((card) => (
                        <div
                          key={card.title}
                          className="group relative min-w-[260px] flex-1 max-w-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-[#101321] p-[1.5px] shadow-[0_45px_120px_-60px_rgba(5,8,20,0.85)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_60px_140px_-60px_rgba(6,10,24,0.9)]"
                          style={{ aspectRatio: '3 / 4' }}
                        >
                          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(0,204,255,0.12),rgba(9,12,20,0.92)_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                          <div className="relative h-full overflow-hidden rounded-[30px]">
                            <div className="absolute inset-0">
                              <Image
                                src={card.imageSrc}
                                alt={card.imageAlt}
                                fill
                                sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 80vw"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-105"
                                priority={false}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60"></div>
                            <div className="relative z-10 flex h-full flex-col justify-between px-8 py-10">
                              <p className="max-w-[220px] text-left text-lg md:text-xl font-semibold tracking-tight text-white">
                                {card.title}
                              </p>
                              <div className="h-12 w-32 rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition duration-300 group-hover:border-white/40 group-hover:bg-white/15"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
                    className="mt-16 w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 text-left"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Vad ingår:
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:text-base text-white/75">
                      {service.included.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <span className="inline-flex h-2 w-2 rounded-full bg-teal"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </Container>
            </section>
          );
        }

        const bgColor = service.featured
          ? 'bg-black'
          : index % 2 === 0
          ? 'bg-white'
          : 'bg-beige-light';
        const textColor = service.featured ? 'text-white' : 'text-black';
        const subtextColor = service.featured ? 'text-gray-300' : 'text-gray-700';

        return (
          <section
            key={service.id}
            id={service.id}
            className={`py-20 md:py-32 ${bgColor} ${
              service.featured ? 'relative overflow-hidden' : ''
            }`}
          >
            {service.featured && (
              <>
                <div className="absolute inset-0 noise-overlay"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>
              </>
            )}
            
            <Container>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  service.featured ? 'lg:grid-cols-1 max-w-5xl mx-auto text-center' : ''
                }`}
              >
                {/* Text Content */}
                <div className={service.featured ? '' : 'relative'}>
                  {!service.featured && (
                    <div className="absolute -top-8 -left-4 lg:-left-8 text-service-number text-black/5">
                      {service.number}
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="relative z-10"
                  >
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${textColor} mb-4`}>
                      {service.title}
                    </h2>

                    {service.subtitle && (
                      <p className="text-xl text-teal mb-6">{service.subtitle}</p>
                    )}

                    {service.featured && (
                      <div className="mb-10 py-8">
                        <p className="text-2xl md:text-3xl text-gray-400 mb-4">
                          "Du har 100 besökare"
                        </p>
                        <p className="text-lg text-gray-500 mb-4">vs</p>
                        <p className="text-2xl md:text-3xl text-teal font-semibold">
                          "Baserat på din bransch bör du fokusera på X för att nå 500
                          besökare inom 3 månader"
                        </p>
                      </div>
                    )}

                    <p className={`text-lg md:text-xl ${subtextColor} leading-relaxed mb-8`}>
                      {service.intro}
                    </p>

                    <h3 className={`text-xl font-semibold ${textColor} mb-6`}>
                      {service.featured ? 'Mikroanalys inkluderar:' : 'Vad ingår:'}
                    </h3>
                    <ul className={`space-y-4 mb-8 ${subtextColor}`}>
                      {service.included.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-teal mt-1 text-xl">•</span>
                          <span className="text-base md:text-lg">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {service.featured && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="glass rounded-2xl p-6 md:p-8 border-l-4 border-teal text-left max-w-3xl mx-auto"
                      >
                        <p className="text-sm font-semibold text-teal mb-3 uppercase tracking-wide">
                          Exempel
                        </p>
                        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                          "Användare lämnar checkout vid steg 2. Förslag: Minska
                          formulärfält från 8 till 4. Förväntat resultat: +25%
                          konvertering"
                        </p>
                      </motion.div>
                    )}

                    <p
                      className={`mt-8 text-base md:text-lg ${
                        service.featured ? 'text-gray-400' : 'text-gray-600'
                      } italic`}
                    >
                      {service.result}
                    </p>
                  </motion.div>
                </div>

                {/* Visual Placeholder */}
                {!service.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex items-center justify-center"
                  >
                    <div className="glass rounded-3xl aspect-square w-full max-w-md p-12 border border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-8xl font-bold text-black/5 mb-4">{service.number}</p>
                        <p className="text-gray-400 text-sm">{service.title}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Package Overview */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <Container size="md">
          <FadeIn>
            <h2 className="text-section-subtitle text-black text-center mb-16">
              Allt inkluderas beroende på ditt paket
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', included: ['Design', 'Hosting', 'Support'] },
              { name: 'Growth', included: ['+ E-handel', '+ AI-Basic'], highlight: true },
              { name: 'Enterprise', included: ['+ AI-Advanced', '+ Prioritet'] },
            ].map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`rounded-2xl p-8 ${
                  pkg.highlight
                    ? 'bg-teal text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <ul className="space-y-2">
                  {pkg.included.map((item) => (
                    <li key={item} className="text-sm md:text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center mt-12">
            <Link
              href="/priser"
              className="inline-flex items-center gap-2 text-teal hover:text-teal-hover font-semibold text-lg transition-colors"
            >
              Se detaljerade priser
              <span>→</span>
            </Link>
          </FadeIn>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 bg-black text-white">
        <Container>
          <FadeIn className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10">
              Vill veta mer?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Boka en demo
              </AnimatedButton>
              <AnimatedButton href="/priser" variant="secondary" size="lg">
                Se priser
              </AnimatedButton>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

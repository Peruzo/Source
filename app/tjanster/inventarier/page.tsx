'use client';

import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CubeIcon, BanknotesIcon, TruckIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';

export default function InventarierPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;
    let hasPlayed = false;

    const handleEnded = () => {
      video.pause();
      if (!Number.isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayed) {
              video.currentTime = 0;
              video.play().catch(() => {});
              hasPlayed = true;
            }
          } else {
            hasPlayed = false;
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(section);
    video.addEventListener('ended', handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      video.pause();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-[100svh] overflow-hidden bg-black text-white"
      >
        <video
          ref={videoRef}
          src="/inventarier.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Subtle overlay to keep centered copy readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

        <Container className="relative z-10 flex min-h-[100svh] flex-col items-center justify-start px-6 pt-[140px] text-center">
          <div className="w-full max-w-[700px] space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              TJÄNSTER
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
              Inventarier
            </h1>

            <h2 className="text-xl md:text-2xl font-medium text-white/85 mt-4">
              Full kontroll över dina inventarier i realtid
            </h2>

            <p className="text-base md:text-lg text-white/75 leading-relaxed">
              Alla förändringar uppdateras automatiskt – vid köp, returer,
              reklamationer och lagerförändringar. Du har alltid korrekt data utan
              manuellt arbete.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex min-h-[100svh] items-center bg-[#eceef2] py-20 md:py-24 lg:py-28">
        <Container size="xl" className="max-w-[1520px]">
          <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24 xl:gap-28">
            <div className="max-w-[620px] space-y-8">
              <p className="text-xs font-medium uppercase tracking-[0.36em] text-gray-500">
                INVENTARIER
              </p>
              <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.15rem]">
                Håll koll i realtid på ditt lager
              </h2>
              <p className="max-w-[58ch] text-base leading-relaxed text-gray-700 md:text-lg">
                Se lagersaldo, produktvarianter och viktiga uppdateringar på alla dina enheter — i en
                och samma vy.
              </p>
            </div>

            <div className="w-full">
              <div className="relative mx-auto w-full max-w-[980px] overflow-hidden rounded-[30px] border border-black/5 shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
                <Image
                  src="/inventirynewone.png"
                  alt="Inventarier i realtid"
                  width={2200}
                  height={1500}
                  className="h-auto w-full object-cover object-right"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative min-h-[100svh] w-full overflow-hidden text-white">
        <video
          src="/0331.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-black/15 md:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

        <Container className="relative z-10 flex min-h-[100svh] items-center">
          <div className="max-w-[620px] space-y-7">
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-white/70">
              KATEGORIER
            </p>
            <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.05rem]">
              Skapa ordning i hela ditt sortiment
            </h2>
            <p className="max-w-[56ch] text-base leading-relaxed text-white/80 md:text-lg">
              Samla produkter i tydliga kategorier och håll lager, varianter och struktur
              organiserade på ett och samma ställe.
            </p>
            <div className="pt-2">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Utforska inventarier
              </AnimatedButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8f9fb] py-24 md:py-28 lg:py-32">
        <Container size="xl" className="max-w-[1560px]">
          <div className="mx-auto max-w-[940px] text-center">
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-gray-500">
              RETURER
            </p>
            <h2 className="mt-5 text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.1rem]">
              Returer som uppdaterar lagret automatiskt
            </h2>
            <p className="mx-auto mt-6 max-w-[720px] text-base leading-relaxed text-gray-600 md:text-lg">
              När en retur registreras kan lager, logistik och återbetalning arbeta tillsammans i ett
              och samma flöde — utan manuellt dubbelarbete.
            </p>
            <div className="mt-8">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Se hur det fungerar
              </AnimatedButton>
            </div>
          </div>
        </Container>

        <div className="mt-12 md:mt-14 lg:mt-16">
          <motion.div
            className="relative mx-auto w-full max-w-[960px] px-4 md:max-w-[1080px] lg:max-w-[1120px]"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
          >
            <div className="relative aspect-[16/8.4] overflow-hidden rounded-[28px] border border-black/5 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
              <Image
                src="/returinventory.png"
                alt="Returflöde kopplat till inventarier"
                fill
                className="object-cover object-center"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3 md:bottom-6 md:px-6 lg:bottom-7">
                <div className="flex w-full max-w-full gap-4 overflow-x-auto pb-1 md:w-auto md:overflow-visible">
                  <div className="min-w-[260px] rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.12)] md:min-w-[285px] md:px-6 md:py-[18px]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-teal text-white">
                        <TruckIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold leading-tight text-gray-900 md:text-base">
                          Retur mottagen
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Logistik registrerad</p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[260px] rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.12)] md:min-w-[320px] md:px-6 md:py-[18px]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-teal text-white">
                        <CubeIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold leading-tight text-gray-900 md:text-base">
                          Inventarier matchat mot retur
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Lagersaldo uppdaterat</p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[260px] rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-[0_14px_36px_rgba(15,23,42,0.12)] md:min-w-[330px] md:px-6 md:py-[18px]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-teal text-white">
                        <BanknotesIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold leading-tight text-gray-900 md:text-base">
                          Återbetalning genomfört för retur
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Betalning synkroniserad</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}


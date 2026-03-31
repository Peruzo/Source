'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export default function BokforingPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeSavingSectionRef = useRef<HTMLElement | null>(null);
  const timeSavingVisualRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const sectionEl = timeSavingSectionRef.current;
    const visualEl = timeSavingVisualRef.current;
    if (!sectionEl || !visualEl) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) {
      visualEl.style.transform = 'translate3d(0,0,0) scale(1)';
      return;
    }

    let rafId = 0;
    let currentY = 0;
    let currentScale = 1;
    let targetY = 0;
    let targetScale = 1;

    const animate = () => {
      currentY += (targetY - currentY) * 0.11;
      currentScale += (targetScale - currentScale) * 0.11;

      visualEl.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;

      if (Math.abs(targetY - currentY) > 0.1 || Math.abs(targetScale - currentScale) > 0.0008) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        rafId = 0;
      }
    };

    const updateTargets = () => {
      const rect = sectionEl.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const sectionSpan = rect.height + viewportH;
      const progress = Math.max(0, Math.min(1, (viewportH - rect.top) / sectionSpan));

      const maxTranslate = window.innerWidth < 768 ? 14 : 30;
      targetY = progress * maxTranslate;
      targetScale = 1 + progress * 0.012;

      if (!rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    const onScroll = () => updateTargets();
    const onResize = () => updateTargets();

    visualEl.style.willChange = 'transform';
    updateTargets();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      visualEl.style.willChange = 'auto';
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/bokfaringvid.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 flex h-full items-center px-6 md:px-10 lg:px-20">
          <div className="max-w-[560px] text-[#111]">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Bokföring
            </h1>
            <p className="mt-6 text-base leading-relaxed md:text-lg">
              Ett modernt bokföringsverktyg byggt för e-handel.
              Automatisera din bokföring med realtidsdata och en direkt integration
              till Fortnox - så att du får full kontroll utan manuellt arbete.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-[100svh] items-center bg-[#eceef2] py-20 md:py-24 lg:py-28">
        <Container size="xl" className="max-w-[1520px]">
          <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24 xl:gap-28">
            <div className="max-w-[620px] space-y-9">
              <p className="text-xs font-medium uppercase tracking-[0.36em] text-gray-500">
                BOKFÖRING &amp; FORTNOX
              </p>
              <h2 className="text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.35rem]">
                Från Stripe-utbetalning till Fortnox — utan manuellt dubbelarbete
              </h2>
              <ul className="space-y-4 pt-1">
                {[
                  'Automatiskt bokföringsunderlag vid varje Stripe-utbetalning',
                  'Stöd för 25%, 12%, 6% och 0% moms',
                  'Hantering av Stripe-avgifter och valutadifferenser',
                  'Skicka direkt vidare till Fortnox',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 md:text-base">
                    <span className="mt-2 inline-block h-[6px] w-[6px] rounded-full bg-teal" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3">
                <AnimatedButton href="/kontakt" variant="primary" size="lg">
                  Utforska bokföring
                </AnimatedButton>
              </div>
            </div>

            <div className="w-full">
              <div className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-[28px] border border-black/5 shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
                <Image
                  src="/bokfaring123.png"
                  alt="Bokföring och Fortnox integration"
                  width={1800}
                  height={1200}
                  className="h-auto w-full object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8f9fb] py-24 md:py-28 lg:py-32">
        <Container size="xl" className="max-w-[1480px]">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-xs font-medium uppercase tracking-[0.36em] text-gray-500">
              SÅ FUNGERAR DET
            </p>
            <h2 className="mt-5 text-[2.2rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.2rem]">
              Från Stripe till Fortnox i 3 steg
            </h2>
            <p className="mx-auto mt-6 max-w-[620px] text-base leading-relaxed text-gray-600 md:text-lg">
              Automatisera bokföringsunderlaget utan att tappa kontrollen.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-7 lg:gap-8">
            {[
              {
                number: '1',
                title: 'Stripe gör en utbetalning',
                description:
                  'När Stripe betalar ut dina intäkter fångar systemet automatiskt upp payouten och tillhörande transaktioner.',
              },
              {
                number: '2',
                title: 'Bokföringsunderlaget byggs automatiskt',
                description:
                  'Systemet strukturerar försäljning, moms, avgifter och verifikat så att allt är redo att granskas.',
              },
              {
                number: '3',
                title: 'Granska och skicka till Fortnox',
                description:
                  'Du granskar underlaget, justerar vid behov och skickar det vidare direkt till Fortnox.',
              },
            ].map((step) => (
              <article
                key={step.number}
                className="flex h-full flex-col rounded-[24px] border border-black/10 bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.08)] md:p-8"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/12 text-sm font-semibold text-teal">
                  {step.number}
                </div>
                <h3 className="mt-5 text-[1.35rem] font-semibold leading-tight text-[#111111]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                  {step.description}
                </p>

                {step.number === '3' && (
                  <div className="mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-black/10 bg-[#f6f7f9] px-4 py-2.5">
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-gray-500">
                      Destination
                    </span>
                    <Image
                      src="/fortnoxlogo.png"
                      alt="Fortnox"
                      width={88}
                      height={20}
                      className="h-4 w-auto object-contain"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section ref={timeSavingSectionRef} className="relative min-h-[100svh] w-full overflow-hidden">
        <div
          ref={timeSavingVisualRef}
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/analogklocka1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            transform: 'translate3d(0,0,0) scale(1)',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-start px-6 pt-20 text-center md:px-10 md:pt-24 lg:px-20 lg:pt-28">
          <div className="mx-auto w-full max-w-[980px]">
            <p className="text-xs font-medium uppercase tracking-[0.36em] text-gray-500">
              TIDSBESPARING
            </p>
            <h2 className="mt-5 text-[2.2rem] font-semibold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.35rem]">
              Varför det här sparar tid
            </h2>
            <p className="mx-auto mt-6 max-w-[68ch] text-base leading-relaxed text-gray-700 md:text-lg">
              När Stripe-utbetalningar automatiskt omvandlas till färdiga bokföringsunderlag
              slipper du manuellt dubbelarbete. Mindre administration, snabbare granskning och
              mindre tid förlorad varje månad.
            </p>
            <div className="mt-8 flex justify-center">
              <ul className="grid w-full max-w-[760px] grid-cols-1 gap-x-12 gap-y-3 text-left md:grid-cols-2 md:gap-x-16">
                {[
                  'Automatiskt underlag vid varje Stripe-utbetalning',
                  'Mindre manuell hantering mellan system',
                  'Snabbare granskning innan bokföring',
                  'Fortnox-flöde utan onödiga mellansteg',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 md:text-base">
                    <span className="mt-2 inline-block h-[6px] w-[6px] rounded-full bg-teal" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Utforska bokföring
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


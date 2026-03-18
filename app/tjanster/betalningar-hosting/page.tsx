import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';

export default function PaymentsHostingPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <video
        src="/videoforpayments.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center lg:object-right"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,191,166,0.18),transparent_60%)]" />

      <Container className="relative z-10 flex min-h-[100svh] items-center">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="max-w-xl space-y-8 py-24 lg:py-0">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              BETALNINGAR &amp; HOSTING
            </p>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                Vi ser till att dina betalningar genomförs
              </h1>
              <p className="text-lg md:text-xl text-white/75 leading-relaxed">
                Prenumerationer, engångsbetalningar och alla sätt du vill ta betalt – vi
                ser till att pengarna landar där de ska.
              </p>
            </div>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Hantera hela ditt betalflöde på ett ställe. Från checkout till återkommande
              debiteringar och automatiserade processer. Kombinera detta med stabil och
              snabb hosting som säkerställer att dina system alltid är tillgängliga,
              säkra och optimerade för tillväxt.
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <AnimatedButton href="/kontakt" variant="primary" size="lg">
                Kom igång
              </AnimatedButton>
              <Link
                href="/tjanster"
                className="inline-flex items-center text-base font-semibold text-white/70 transition-colors hover:text-white"
              >
                Tillbaka till tjänster
                <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
          </FadeIn>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}


import Link from 'next/link';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export default function AnalysisPage() {
  return (
    <section className="flex min-h-[100svh] flex-col lg:h-[100svh] lg:flex-row">
      <div className="flex w-full flex-col justify-center bg-black px-8 py-16 text-white md:px-12 md:py-20 lg:w-1/2 lg:px-20 lg:py-24 xl:px-24">
        <div className="max-w-[680px]">
          <p className="text-xs uppercase tracking-[0.38em] text-white/65">Analys</p>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Datadriven tillvaxt for e-handel
          </h1>

          <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
            Fa full insikt i dina kunders beteende genom geografisk sparning och
            analys av ordrar i realtid. Anvand datan for att optimera marknadsforing,
            lager och tillvaxtstrategier.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <AnimatedButton href="/onboarding/start" variant="primary" size="lg">
              Kom igang
            </AnimatedButton>
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-xl border-2 border-white/45 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      </div>

      <div className="relative w-full lg:w-1/2">
        <div className="h-[46vh] w-full sm:h-[54vh] lg:h-[100svh]">
          <video
            src="/analysvideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}


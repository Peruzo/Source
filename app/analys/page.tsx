import Link from 'next/link';

export default function AnalysisPage() {
  return (
    <section className="relative h-[100svh] overflow-hidden bg-black">
      <video
        src="/analysvideo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover [object-position:70%_center]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.65)_35%,rgba(0,0,0,0.3)_55%,rgba(0,0,0,0)_75%)]" />

      <div className="relative z-10 flex h-full items-center px-6 md:px-10 lg:px-0">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="max-w-[600px] lg:ml-[80px]">
            <p className="text-[12px] uppercase tracking-[2px] text-white/60">Analys</p>

            <h1 className="mt-5 text-[42px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[50px] lg:text-[60px] xl:text-[64px]">
              Datadriven tillvaxt for e-handel
            </h1>

            <p className="mt-6 max-w-[480px] text-[16px] leading-relaxed text-white/80 md:text-[18px]">
              Fa full insikt i dina kunders beteende genom geografisk sparning och
              analys av ordrar i realtid. Anvand datan for att optimera marknadsforing,
              lager och tillvaxtstrategier.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/onboarding/start"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                Kom igang
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Kontakta oss
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


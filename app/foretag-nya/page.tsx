'use client';

import Image from 'next/image';

export default function ForetagNyaPage() {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white md:min-h-[100svh]">
      {/* Media band: fixed height on small screens, full-bleed background from md */}
      <div className="relative h-[60svh] min-h-[420px] w-full md:absolute md:inset-0 md:h-auto md:min-h-0">
        <Image
          src="/fortegatillvaxt.png"
          alt="Företag start"
          fill
          priority
          className="object-cover object-[50%_30%] md:object-center"
        />

        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 md:relative md:min-h-[100svh]">
        <div className="max-w-[700px]">
          <h1 className="text-white text-4xl md:text-6xl font-semibold">
            Ta ditt företag till nästa nivå
          </h1>

          <p className="text-white/80 mt-4 text-lg">
            Vi hjälper växande företag att skala e-handel med teknik, data och automation.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="btn-primary" type="button">
              Boka demo
            </button>
            <button className="btn-secondary" type="button">
              Se hur det fungerar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

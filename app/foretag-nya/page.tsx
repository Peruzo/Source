'use client';

import Image from 'next/image';

export default function ForetagNyaPage() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <Image
        src="/foretagstart.png"
        alt="Företag start"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex items-center justify-center min-h-[100svh] text-center px-6">
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

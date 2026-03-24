'use client';

import Image from 'next/image';

export default function ForetagVaxandePage() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <Image
        src="/foretagvaxand.png"
        alt="Företag växande e-handel"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-[100svh] text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            Skala din e-handel smart
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8">
            För företag som redan säljer - och vill växa snabbare med rätt teknik, data och automation.
          </p>

          <div className="flex gap-4 justify-center">
            <button className="bg-[#00C2A8] text-black px-6 py-3 rounded-xl font-medium" type="button">
              Boka demo
            </button>
            <button className="border border-white/30 px-6 py-3 rounded-xl" type="button">
              Se hur det fungerar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

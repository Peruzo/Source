'use client';

import Image from 'next/image';

export default function PrivatStartPage() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <Image
        src="/privatstart.png"
        alt="Privat Start hero"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6">
        <div className="mx-auto mt-[-10vh] max-w-[600px] text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Kom igång med din e-handel
          </h1>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[10%] bottom-[15%] z-20 w-[min(92vw,420px)] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[20px]">
        <div className="px-4 py-3 text-sm text-white/90 border-b border-white/10 md:px-5 md:py-4">
          Ny betalning 349 SEK
        </div>
        <div className="px-4 py-3 text-sm text-white/90 border-b border-white/10 md:px-5 md:py-4">
          Ny kund
        </div>
        <div className="px-4 py-3 text-sm text-white/90 md:px-5 md:py-4">
          Hej, hur kan jag komma igång med er prenumeration
        </div>
      </div>
    </section>
  );
}

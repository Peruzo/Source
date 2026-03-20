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

      <div
        className="pointer-events-none absolute right-[10%] bottom-[15%] z-20 w-[320px] max-w-[92vw] rounded-[20px] border border-white/10 p-5 backdrop-blur-[25px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <div className="space-y-3 md:space-y-4">
          <p className="text-xs font-light tracking-wide text-white/80">
            Ny betalning 349 SEK
          </p>
          <p className="text-base font-medium text-white/95">
            Ny kund
          </p>
          <div className="rounded-xl bg-black/25 p-3">
            <p className="text-sm font-normal leading-relaxed text-white/90">
              Hej, hur kan jag komma igång med er prenumeration
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

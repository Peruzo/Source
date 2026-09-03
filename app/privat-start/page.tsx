'use client';

import Image from 'next/image';

export default function PrivatStartPage() {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white md:min-h-[100svh]">
      {/* Media band: fixed height on small screens, full-bleed background from md */}
      <div className="relative h-[60svh] min-h-[420px] w-full md:absolute md:inset-0 md:h-auto md:min-h-0">
        <Image
          src="/privatstart.png"
          alt="Privat Start hero"
          fill
          priority
          className="object-cover object-[55%_25%] md:object-center"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="mx-auto max-w-[600px] text-center md:mt-[-10vh]">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Kom igång med din e-handel
            </h1>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 mx-6 mt-6 mb-10 flex min-h-[340px] flex-col justify-between rounded-[20px] border border-white/10 px-6 pt-6 pb-7 backdrop-blur-[25px] md:absolute md:right-[8%] md:bottom-[12%] md:z-20 md:mx-0 md:mt-0 md:mb-0 md:w-[340px] md:max-w-[92vw]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}
      >
        <div className="flex-1" />

        <div className="mb-3 rounded-[14px] bg-white/90 px-[18px] pt-[18px] pb-5 text-[#111]">
          <p className="text-xs font-medium text-black/55">Dagens ordervärde</p>
          <p className="mt-1 text-[30px] font-semibold leading-none">349 SEK</p>
          <p className="mt-2 text-sm font-medium text-emerald-600">0 ordrar</p>
        </div>

        <div className="rounded-[14px] bg-black/35 p-3.5 text-white">
          <p className="text-sm font-normal leading-relaxed text-white/90">
            Hej, hur kan jag komma igång med er prenumeration
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center rounded-[10px] bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
          >
            Svara nu
          </button>
        </div>

        <div className="absolute -top-[18px] -right-[18px] flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-[20px]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-white"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0m8.571 0A1.714 1.714 0 0 0 19.429 15V10.5a7.429 7.429 0 1 0-14.858 0V15a1.714 1.714 0 0 0 1.715 2.082m11.428 0a1.714 1.714 0 0 1-1.714 1.714H8a1.714 1.714 0 0 1-1.714-1.714" />
          </svg>
        </div>

        <div className="absolute top-[55px] right-0 rounded-lg bg-black/80 px-2.5 py-1.5 text-xs font-medium text-white">
          Ny kund
        </div>
      </div>
    </section>
  );
}

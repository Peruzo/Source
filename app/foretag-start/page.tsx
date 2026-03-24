'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ForetagStartPage() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      <Image
        src="/foretagstart.png"
        alt="Företag start"
        fill
        priority
        className="object-cover object-center scale-[0.95]"
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Ta ditt företag till nästa nivå
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-base text-white/90 md:text-xl">
            Vi hjälper växande företag att skala e-handel med teknik, data och automation.
          </p>
          <div className="mt-8">
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 md:text-base"
            >
              Boka demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

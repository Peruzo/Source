'use client';

export default function PrivatEtableradPage() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <video
        src="https://storage.googleapis.com/source-hero-videos/greenetablerade.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 text-center">
        <div className="w-full max-w-[720px] space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">PRIVAT</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
            För etablerade varumärken
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            När du vill växa snabbare med en e-handel som känns premium och konverterar.
          </p>
        </div>
      </div>
    </section>
  );
}

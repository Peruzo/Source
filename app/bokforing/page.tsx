export default function BokforingPage() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <video
        src="/bokfaringvid.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full items-center px-6 md:px-10 lg:px-20">
        <div className="max-w-[560px] text-[#111]">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Bokföring
          </h1>
          <p className="mt-6 text-base leading-relaxed md:text-lg">
            Ett modernt bokföringsverktyg byggt för e-handel.
            Automatisera din bokföring med realtidsdata och en direkt integration
            till Fortnox - så att du får full kontroll utan manuellt arbete.
          </p>
        </div>
      </div>
    </section>
  );
}


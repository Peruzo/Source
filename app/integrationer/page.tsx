export default function IntegrationerPage() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <video
        src="/Integrations.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      />

      <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0)_40%)]" />

      <div className="relative z-[3] flex h-full items-start justify-center px-6 pt-[18vh] text-center md:px-10">
        <div className="mx-auto max-w-[700px]">
          <h1 className="text-[48px] font-semibold leading-[1.08] tracking-tight text-white md:text-[56px] lg:text-[64px]">
            Integrationer
          </h1>
          <p className="mx-auto mt-6 text-base leading-relaxed text-white/85 md:text-lg">
            Koppla ihop dina system och skapa ett sömlöst flöde mellan din e-handel,
            betalningar och data. Med våra integrationer får du full kontroll och
            automatisering i varje steg.
          </p>
        </div>
      </div>
    </section>
  );
}


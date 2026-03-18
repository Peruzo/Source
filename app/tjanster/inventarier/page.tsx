import { Container } from '@/components/ui/Container';

export default function InventarierPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <video
        src="/inventarier.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Subtle overlay to keep centered copy readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

      <Container className="relative z-10 flex min-h-[100svh] flex-col items-center justify-start px-6 pt-[140px] text-center">
        <div className="w-full max-w-[700px] space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            TJÄNSTER
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
            Inventarier
          </h1>

          <h2 className="text-xl md:text-2xl font-medium text-white/85 mt-4">
            Full kontroll över dina inventarier i realtid
          </h2>

          <p className="text-base md:text-lg text-white/75 leading-relaxed">
            Alla förändringar uppdateras automatiskt – vid köp, returer,
            reklamationer och lagerförändringar. Du har alltid korrekt data utan
            manuellt arbete.
          </p>
        </div>
      </Container>
    </section>
  );
}


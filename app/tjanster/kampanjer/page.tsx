import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';

export default function CampaignsPage() {
  return (
    <section className="bg-white text-gray-900">
      <Container className="min-h-[100svh] py-24 lg:py-0">
        <div className="grid min-h-[100svh] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="max-w-[500px] space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              TJÄNSTER
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Kampanjer
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Skapa kampanjer som känns premium, laddar snabbt och är byggda för att
              konvertera.
            </p>
          </FadeIn>

          <div className="flex w-full items-center justify-end lg:min-h-[760px] lg:pr-[5%]">
            <video
              src="/3dvidoforkampanj.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto mix-blend-normal drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] lg:w-[800px] lg:max-w-[55vw]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}


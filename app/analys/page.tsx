import Image from 'next/image';
import Link from 'next/link';
import { AnalysisArcOverlay } from '@/components/sections/AnalysisArcOverlay';

export default function AnalysisPage() {
  // First premium transfer arc (UK-ish -> right side).
  // Keep points explicit so endpoint can later anchor a popup.
  const arcStart = { x: 49.8, y: 67.9 };
  const arcControl1 = { x: 54.5, y: 38.4 };
  const arcControl2 = { x: 64, y: 32 };
  const arcEnd = { x: 84, y: 52 };
  const arcPath = `M ${arcStart.x} ${arcStart.y} C ${arcControl1.x} ${arcControl1.y}, ${arcControl2.x} ${arcControl2.y}, ${arcEnd.x} ${arcEnd.y}`;
  const endpointDot = { x: arcEnd.x, y: arcEnd.y };
  const popupOffset = { x: 3.5, y: -8.5 };
  const popupWidgets = [
    { label: 'Totala besökare', value: '18 420', accent: 'teal', icon: 'U' },
    { label: 'Städer', value: '42', accent: 'blue', icon: 'O' },
    { label: 'Bestallningar', value: '1 286', accent: 'amber', icon: '#' },
  ] as const;

  return (
    <>
      <section className="relative h-[100svh] overflow-hidden bg-black">
        <video
          src="/analysvideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-0 h-full w-full object-cover [object-position:60%_center]"
        />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_20%,rgba(0,0,0,0.75)_40%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0)_80%)]" />

        <div className="relative z-[2] flex h-full items-center px-6 md:px-10 lg:px-0">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="max-w-[520px] lg:ml-[96px]">
              <p className="text-[12px] uppercase tracking-[2px] text-white/60">Analys</p>

              <h1 className="mt-5 text-[42px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[50px] lg:text-[60px] xl:text-[64px]">
                Datadriven tillväxt för e-handel
              </h1>

              <p className="mt-6 max-w-[480px] text-[16px] leading-relaxed text-white/80 md:text-[18px]">
                Få full insikt i dina kunders beteende genom geografisk spårning och
                analys av ordrar i realtid. Använd datan för att optimera marknadsföring,
                lager och tillväxtstrategier.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
                <Link
                  href="/onboarding/start"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                >
                  Kom igång
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Kontakta oss
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black text-white">
        <div className="relative z-10 mx-auto flex min-h-[460px] w-full max-w-[1120px] flex-col items-center px-6 pt-28 pb-20 text-center md:min-h-[520px] md:pt-48 md:pb-24 lg:min-h-[600px] lg:pt-60 lg:pb-28">
          <p className="text-[12px] uppercase tracking-[0.35em] text-white/60">GLOBAL ANALYS</p>
          <h2 className="mt-7 max-w-[940px] text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl lg:text-7xl">
            Spara och skala med datadrivna beslut i realtid
          </h2>
          <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/75 md:text-lg">
            Fatta snabbare beslut med insikter från alla marknader - från konvertering och
            kostnad till tillväxt per region.
          </p>
          <Link
            href="/kontakt"
            className="mt-16 inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:mt-20"
          >
            Se hur det fungerar
          </Link>
        </div>

        <div className="pointer-events-none relative h-[250px] md:h-[300px] lg:h-[360px]">
          <AnalysisArcOverlay arcPath={arcPath} />
          <div
            className="pointer-events-none absolute z-30"
            style={{
              left: `${endpointDot.x}%`,
              top: `${endpointDot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-hidden="true"
          >
            <span className="block h-[8px] w-[8px] rounded-full bg-[#75FFE8] shadow-[0_0_0_6px_rgba(117,255,232,0.15),0_0_24px_rgba(0,191,166,0.75)]" />
          </div>
          <div
            className="absolute z-30 w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.08] bg-[rgba(20,20,20,0.55)] p-4 backdrop-blur-[20px] backdrop-saturate-[140%] shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] md:w-[320px]"
            style={{
              left: `${endpointDot.x + popupOffset.x}%`,
              top: `${endpointDot.y + popupOffset.y}%`,
              transform: 'translate(-100%, -100%)',
            }}
          >
            <div className="space-y-3">
              {popupWidgets.map((widget) => {
                const accentStyles =
                  widget.accent === 'teal'
                    ? {
                        badge: 'bg-[#00BFA6]/20 text-[#8CFFEC]',
                        dot: 'bg-[#00BFA6]',
                      }
                    : widget.accent === 'blue'
                      ? {
                          badge: 'bg-[#4B8DFF]/20 text-[#9EC3FF]',
                          dot: 'bg-[#4B8DFF]',
                        }
                      : {
                          badge: 'bg-[#F59E0B]/20 text-[#FFD58A]',
                          dot: 'bg-[#F59E0B]',
                        };

                return (
                  <div
                    key={widget.label}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${accentStyles.badge}`}
                      aria-hidden="true"
                    >
                      {widget.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs uppercase tracking-[0.14em] text-white/60">
                        {widget.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-none text-white">
                        {widget.value}
                      </p>
                    </div>
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full ${accentStyles.dot}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-full overflow-visible">
            <div className="absolute left-1/2 bottom-[-42%] w-[88vw] max-w-none -translate-x-1/2 md:bottom-[-44%] md:w-[82vw] lg:bottom-[-48%] lg:w-[76vw]">
              <div
                style={{
                  clipPath: 'inset(0 0 18% 0)',
                  WebkitClipPath: 'inset(0 0 18% 0)',
                }}
              >
                <Image
                  src="/globe3.png"
                  alt="Global data visualization"
                  width={2600}
                  height={2600}
                  priority
                  className="h-auto w-full object-contain opacity-[0.94]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


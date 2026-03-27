'use client';

import Image from 'next/image';
import type { SyntheticEvent } from 'react';

export function CampaignVisualShowcase() {
  const handleVideoEnded = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.pause();
    if (!Number.isNaN(video.duration)) {
      video.currentTime = video.duration;
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f8f6] py-24 text-white md:py-28 lg:py-36">
      <div className="mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-14">
        <div className="mb-14 text-center md:mb-20">
          <p className="text-xs uppercase tracking-[0.36em] text-white/55">VISUAL SHOWCASE</p>
          <h2 className="mx-auto mt-5 max-w-[860px] text-4xl font-semibold leading-[1.06] tracking-tight text-[#111111] md:text-6xl">
            Kampanjer byggda som premium-upplevelser
          </h2>
        </div>

        <div className="relative hidden h-[740px] md:block lg:h-[820px]">
          <div className="absolute left-[8%] top-[12%] z-10 h-[360px] w-[330px] overflow-visible rounded-[28px] shadow-[0_34px_70px_rgba(0,0,0,0.5)] lg:h-[430px] lg:w-[390px]">
            <Image
              src="/secondhandcouple.png"
              alt="Lifestyle visual"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 330px, 390px"
            />

            <div className="absolute -left-[25%] -top-[20%] z-[5] h-[170px] w-[250px] overflow-hidden lg:h-[196px] lg:w-[290px]">
              <Image
                src="/nycheckout%20(1).png"
                alt="Checkout UI"
                fill
                className="object-contain object-center"
                sizes="290px"
              />
            </div>
          </div>

          <div className="absolute right-[15%] top-[14%] z-20 h-[230px] w-[250px] overflow-hidden rounded-[24px] shadow-[0_24px_58px_rgba(0,0,0,0.45)] lg:h-[280px] lg:w-[300px]">
            <Image
              src="/mansittingsofa.png"
              alt="Lifestyle portrait"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 250px, 300px"
            />
          </div>

          <div className="absolute bottom-[12%] left-[11%] z-20 h-[210px] w-[250px] overflow-hidden rounded-[24px] shadow-[0_26px_60px_rgba(0,0,0,0.5)] lg:h-[250px] lg:w-[300px]">
            <Image
              src="/oldladywalking%20(1).png"
              alt="City walking scene"
              fill
              className="object-cover [object-position:58%_45%]"
              sizes="(max-width: 1024px) 250px, 300px"
            />
          </div>

          <div className="absolute bottom-[11%] right-[12%] z-20 h-[218px] w-[248px] overflow-hidden rounded-[24px] shadow-[0_26px_60px_rgba(0,0,0,0.5)] lg:h-[255px] lg:w-[300px]">
            <Image
              src="/generic.png"
              alt="Campaign visual detail"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 248px, 300px"
            />
          </div>

          <div className="absolute left-1/2 top-1/2 z-30 h-[390px] w-[320px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-[0_44px_90px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.04)] lg:h-[450px] lg:w-[370px]">
            <video
              src="/promo.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-5 md:hidden">
          <div className="relative mx-auto h-[460px] w-[86vw] max-w-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_30px_72px_rgba(0,0,0,0.62)]">
            <video
              src="/promo.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative h-[240px] overflow-visible rounded-[22px] shadow-[0_18px_44px_rgba(0,0,0,0.48)]">
            <Image
              src="/secondhandcouple.png"
              alt="Lifestyle visual"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute -left-[25%] -top-[20%] z-[5] h-[78px] w-[108px] overflow-hidden">
              <Image
                src="/nycheckout%20(1).png"
                alt="Checkout UI"
                fill
                className="object-contain object-center"
                sizes="108px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[170px] overflow-hidden rounded-[20px] shadow-[0_16px_34px_rgba(0,0,0,0.42)]">
              <Image
                src="/mansittingsofa.png"
                alt="Lifestyle portrait"
                fill
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
            <div className="relative h-[170px] overflow-hidden rounded-[20px] shadow-[0_16px_34px_rgba(0,0,0,0.42)]">
              <Image
                src="/oldladywalking%20(1).png"
                alt="City walking scene"
                fill
                className="object-cover [object-position:58%_45%]"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="relative h-[178px] overflow-hidden rounded-[20px] shadow-[0_16px_34px_rgba(0,0,0,0.42)]">
            <Image
              src="/generic.png"
              alt="Campaign visual detail"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

export function LogistikOverviewSection() {
  return (
    <section className="relative overflow-hidden bg-white text-[#111111] py-28 md:py-36 lg:py-40 min-h-[680px] md:min-h-[760px]">
      <Container>
        <div className="flex min-h-[520px] flex-col items-center justify-between text-center gap-8">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-gray-500"
          >
            Logistik
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
          >
            Få en överblick över din logistik.
            <span className="block mt-4 text-2xl md:text-3xl text-gray-600">
              Synka leveranser, lager och returer i realtid.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full max-w-xl pt-12"
          >
            <div className="relative mx-auto w-[260px] sm:w-[320px] rounded-[36px] border border-black/10 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.12)] p-8">
              <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_135deg,_#00BFA6_0deg,_#00997D_220deg,_rgba(255,255,255,0.08)_220deg,_rgba(255,255,255,0.05)_360deg)]"></div>
                <div className="absolute inset-[14%] rounded-full bg-white flex flex-col items-center justify-center gap-1">
                  <span className="text-xs uppercase tracking-wider text-gray-500">Försäljning</span>
                  <span className="text-2xl sm:text-3xl font-semibold text-gray-900">25 200 kr</span>
                  <span className="text-xs text-gray-500">Januari</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center text-gray-600">
                <p className="text-xs uppercase tracking-[0.3em]">NÄSTA LEVERANS</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">ETA 23 minuter · Göteborg</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              <div className="w-[360px] max-w-full h-12 rounded-[999px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.18)_0%,_rgba(255,255,255,0)_70%)] opacity-80"></div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

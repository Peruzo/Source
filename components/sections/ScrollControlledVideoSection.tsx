'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/** Release sticky when progress passes this; applied imperatively in RAF (no state). */
const STICKY_RELEASE_PROGRESS = 0.9;
/** Lerp: current += (target - current) * LERP. Only applied in RAF, never from scroll. */
const LERP = 0.08;

/**
 * Imperative, RAF-only scroll-driven video. Scroll updates only targetProgress (ref).
 * One continuous requestAnimationFrame loop interpolates currentProgress → targetProgress
 * and writes video.currentTime + sticky release. No React state for motion, no re-renders from scroll.
 */
export function ScrollControlledVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const stickyWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameCountRef = useRef(303);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafScrollRef = useRef<number | null>(null);
  const rafLoopRef = useRef<number | null>(null);
  const stickyReleasedRef = useRef(false);

  useEffect(() => {
    const preloadFrames = async () => {
      const frames: HTMLImageElement[] = [];
      let loadedCount = 0;
      const total = frameCountRef.current;

      const loadFrame = (index: number): Promise<void> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            frames[index - 1] = img;
            loadedCount++;
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            resolve();
          };
          img.src = `/frames/frame_${String(index).padStart(4, '0')}.png`;
        });
      };

      const promises: Promise<void>[] = [];
      for (let i = 1; i <= total; i++) {
        promises.push(loadFrame(i));
      }

      await Promise.all(promises);
      framesRef.current = frames;
    };

    preloadFrames().then(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 4096 * dpr;
        canvas.height = 2304 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctxRef.current = ctx;
        }
      }
    });

    const animate = () => {
      rafLoopRef.current = requestAnimationFrame(animate);

      const frames = framesRef.current;
      const ctx = ctxRef.current;
      const wrapper = stickyWrapperRef.current;
      if (!frames.length || !ctx) return;

      const target = targetProgressRef.current;
      let current = currentProgressRef.current;
      current += (target - current) * LERP;
      currentProgressRef.current = current;

      const frameIndex = Math.min(
        frameCountRef.current - 1,
        Math.max(0, Math.round(current * (frameCountRef.current - 1)))
      );

      const img = frames[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, 4096, 2304);
        ctx.drawImage(img, 0, 0, 4096, 2304);
      }


      if (wrapper && !stickyReleasedRef.current && target > STICKY_RELEASE_PROGRESS) {
        stickyReleasedRef.current = true;
        wrapper.style.position = 'relative';
      }
    };
    rafLoopRef.current = requestAnimationFrame(animate);

    const handleScroll = () => {
      if (rafScrollRef.current !== null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const rect = sentinel.getBoundingClientRect();
        const progress =
          1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        const scrollProgress = Math.min(Math.max(progress, 0), 1);
        targetProgressRef.current = scrollProgress;
      });
    };

    const sentinel = sentinelRef.current;

    if (sentinel) {
      const syncProgressFromScroll = () => {
        const rect = sentinel.getBoundingClientRect();
        const progress =
          1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        const scrollProgress = Math.min(Math.max(progress, 0), 1);
        targetProgressRef.current = scrollProgress;
        currentProgressRef.current = scrollProgress;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      syncProgressFromScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafScrollRef.current !== null) cancelAnimationFrame(rafScrollRef.current);
      if (rafLoopRef.current !== null) cancelAnimationFrame(rafLoopRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-section relative w-full"
      aria-label="Scroll-styrd videovisning av logistik"
    >
      <div
        ref={sentinelRef}
        className="scroll-sentinel absolute left-0 top-0 w-full h-0 pointer-events-none"
        aria-hidden
      />
      <div
        ref={stickyWrapperRef}
        className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-32 px-4 pointer-events-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black text-center mb-4">
            Ett bokningssystem byggt för alla branscher
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-black/80 text-center">
            Som anpassar sig efter ditt arbetsflöde.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-12 md:pb-16 pointer-events-auto">
          <Link
            href="/bokningssystem"
            className="inline-flex items-center gap-2 text-black hover:text-black/80 font-semibold text-lg group transition-colors duration-200"
          >
            Se mer om vårt bokningssystem
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}

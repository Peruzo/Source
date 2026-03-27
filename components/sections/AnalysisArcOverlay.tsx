'use client';

import { useEffect, useRef } from 'react';

type AnalysisArcOverlayProps = {
  arcPath: string;
};

export function AnalysisArcOverlay({ arcPath }: AnalysisArcOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const hasAnimatedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const glowPath = glowPathRef.current;
    const mainPath = mainPathRef.current;

    if (!container || !glowPath || !mainPath) {
      return;
    }

    const setInitialState = () => {
      glowPath.style.strokeDashoffset = '1';
      mainPath.style.strokeDashoffset = '1';
      glowPath.style.opacity = '0';
      mainPath.style.opacity = '0';
    };

    setInitialState();

    const runAnimation = () => {
      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;
      setInitialState();

      const dashTiming: KeyframeAnimationOptions = {
        duration: 1500,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      };

      const opacityTiming: KeyframeAnimationOptions = {
        duration: 1500,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      };

      const glowDash = glowPath.animate(
        [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }],
        dashTiming
      );
      const mainDash = mainPath.animate(
        [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }],
        dashTiming
      );
      const glowOpacity = glowPath.animate(
        [{ opacity: 0 }, { opacity: 0.7 }, { opacity: 0.6 }],
        opacityTiming
      );
      const mainOpacity = mainPath.animate(
        [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.92 }],
        opacityTiming
      );

      Promise.all([
        glowDash.finished,
        mainDash.finished,
        glowOpacity.finished,
        mainOpacity.finished,
      ]).finally(() => {
        glowPath.style.strokeDashoffset = '0';
        mainPath.style.strokeDashoffset = '0';
        glowPath.style.opacity = '0.6';
        mainPath.style.opacity = '0.92';
        hasAnimatedRef.current = true;
        isAnimatingRef.current = false;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!hasAnimatedRef.current) {
              runAnimation();
            }
            return;
          }

          if (!entry.isIntersecting || entry.intersectionRatio < 0.4) {
            hasAnimatedRef.current = false;
          }
        });
      },
      { threshold: [0.4, 0.5, 0.6] }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [arcPath]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-20">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="analysisArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,191,166,0.35)" />
            <stop offset="45%" stopColor="rgba(0,191,166,0.9)" />
            <stop offset="100%" stopColor="rgba(140,255,236,0.8)" />
          </linearGradient>
          <filter id="analysisArcGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.25" result="blur" />
          </filter>
        </defs>

        <path
          ref={glowPathRef}
          d={arcPath}
          fill="none"
          stroke="rgba(0,191,166,0.35)"
          strokeWidth="1.9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          filter="url(#analysisArcGlow)"
          opacity="0"
        />

        <path
          ref={mainPathRef}
          d={arcPath}
          fill="none"
          stroke="url(#analysisArcGradient)"
          strokeWidth="0.72"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          opacity="0"
        />
      </svg>
    </div>
  );
}


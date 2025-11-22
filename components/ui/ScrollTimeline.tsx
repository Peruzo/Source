'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface TimelineNode {
  id: string;
  position: number; // 0-1 (percentage from top)
  label?: string;
}

interface ScrollTimelineProps {
  children: React.ReactNode;
  className?: string;
  nodes?: TimelineNode[];
  color?: string;
  lightColor?: string;
}

export function ScrollTimeline({ 
  children, 
  className = '',
  nodes = [],
  color = '#00BFA6', // Default teal
  lightColor = 'rgba(0, 191, 166, 0.1)' // Default teal light
}: ScrollTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Line fills from 0 to 100% as section scrolls
  const lineScale = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduceMotion ? [1, 1] : [0, 1]
  );
  
  // Fade in/out at edges
  const lineOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0]
  );

  // Create a lighter variant of the color for gradient
  const colorLighter = color === '#00BFA6' 
    ? 'rgba(0, 191, 166, 0.8)' 
    : color + 'CC'; // Fallback for other colors

  // Nodes are disabled - only showing the line

  return (
    <section ref={sectionRef} className={`relative ${className}`}>
      <div className="relative">
        {/* Content */}
        <div className="relative z-0">
          {children}
        </div>

        {/* Scroll Timeline Container - Hidden on mobile */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-10">
          {/* Base line (unfilled, faded) */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, ${lightColor}, rgba(0, 191, 166, 0.05), transparent)`,
            }}
          />

          {/* Animated fill line */}
          <motion.div
            className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top"
            style={{
              height: '100%',
              scaleY: lineScale,
              opacity: lineOpacity,
              background: `linear-gradient(to bottom, ${color}, ${colorLighter}, ${color})`,
            }}
          />

          {/* Timeline Nodes removed - only showing the line */}
        </div>
      </div>
    </section>
  );
}

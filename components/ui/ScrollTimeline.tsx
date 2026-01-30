'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface TimelineNode {
  id: string;
  position: number; // 0-1 (percentage from top)
  label?: string;
}

interface ServiceSection {
  id: string;
  title: string;
  position: number; // 0-1 (percentage from top of timeline)
}

interface ScrollTimelineProps {
  children: React.ReactNode;
  className?: string;
  nodes?: TimelineNode[];
  color?: string;
  lightColor?: string;
  serviceSections?: ServiceSection[]; // For horizontal underscores
}

export function ScrollTimeline({ 
  children, 
  className = '',
  nodes = [],
  color = '#00BFA6', // Default teal
  lightColor = 'rgba(0, 191, 166, 0.1)', // Default teal light
  serviceSections = []
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

  // Create transforms for horizontal underscore lines
  // Each underscore extends when scroll reaches that section
  // We need to create transforms for up to 4 sections unconditionally
  const section0Pos = serviceSections[0]?.position ?? 0.2;
  const section1Pos = serviceSections[1]?.position ?? 0.45;
  const section2Pos = serviceSections[2]?.position ?? 0.7;
  const section3Pos = serviceSections[3]?.position ?? 0.95;

  // Width transforms - extend from 0 to 1 (100% width) when section is in view
  const underscore0Width = useTransform(scrollYProgress, 
    [section0Pos - 0.1, section0Pos, section0Pos + 0.1],
    [0, 1, 0],
    { clamp: true }
  );
  const underscore0Opacity = useTransform(scrollYProgress,
    [section0Pos - 0.15, section0Pos - 0.05, section0Pos + 0.15],
    [0, 1, 0],
    { clamp: true }
  );

  const underscore1Width = useTransform(scrollYProgress,
    [section1Pos - 0.1, section1Pos, section1Pos + 0.1],
    [0, 1, 0],
    { clamp: true }
  );
  const underscore1Opacity = useTransform(scrollYProgress,
    [section1Pos - 0.15, section1Pos - 0.05, section1Pos + 0.15],
    [0, 1, 0],
    { clamp: true }
  );

  const underscore2Width = useTransform(scrollYProgress,
    [section2Pos - 0.1, section2Pos, section2Pos + 0.1],
    [0, 1, 0],
    { clamp: true }
  );
  const underscore2Opacity = useTransform(scrollYProgress,
    [section2Pos - 0.15, section2Pos - 0.05, section2Pos + 0.15],
    [0, 1, 0],
    { clamp: true }
  );

  const underscore3Width = useTransform(scrollYProgress,
    [section3Pos - 0.1, section3Pos, section3Pos + 0.1],
    [0, 1, 0],
    { clamp: true }
  );
  const underscore3Opacity = useTransform(scrollYProgress,
    [section3Pos - 0.15, section3Pos - 0.05, section3Pos + 0.15],
    [0, 1, 0],
    { clamp: true }
  );

  // Combine sections with their transforms
  const underscoreTransforms = [
    serviceSections[0] ? { section: serviceSections[0], width: underscore0Width, opacity: underscore0Opacity } : null,
    serviceSections[1] ? { section: serviceSections[1], width: underscore1Width, opacity: underscore1Opacity } : null,
    serviceSections[2] ? { section: serviceSections[2], width: underscore2Width, opacity: underscore2Opacity } : null,
    serviceSections[3] ? { section: serviceSections[3], width: underscore3Width, opacity: underscore3Opacity } : null,
  ].filter(Boolean) as Array<{ section: ServiceSection; width: any; opacity: any }>;

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

          {/* Horizontal underscore lines for service sections */}
          {underscoreTransforms.map(({ section, width, opacity }) => (
            <motion.div
              key={section.id}
              className="absolute left-1/2 origin-left"
              style={{
                top: `${section.position * 100}%`,
                height: '2px',
                opacity: shouldReduceMotion ? 1 : opacity,
              }}
            >
              <motion.div
                className="h-full"
                style={{
                  scaleX: width,
                  width: '50%', // Base width - will be scaled
                  backgroundColor: color,
                  transformOrigin: 'left center',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

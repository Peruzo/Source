'use client';

import { motion } from 'framer-motion';

interface AbstractLine {
  id: string;
  path: string;
  delay: number;
  angle: number;
  side: 'left' | 'right';
}

interface AbstractLinesProps {
  onLineReady?: (lineId: string) => void;
}

export function AbstractLines({ onLineReady }: AbstractLinesProps) {
  // Abstract angular lines that radiate from center upward
  // Lines start from bottom center (50, 90) and go upward at angles
  const lines: AbstractLine[] = [
    {
      id: 'line-analytics',
      path: 'M 50 90 L 25 30 L 15 10', // Left side, upward, angle -55
      delay: 0,
      angle: -55,
      side: 'left',
    },
    {
      id: 'line-payments',
      path: 'M 50 90 L 75 30 L 85 10', // Right side, upward, angle 60
      delay: 0.2,
      angle: 60,
      side: 'right',
    },
    {
      id: 'line-ecommerce',
      path: 'M 50 90 L 30 50 L 20 25', // Left side, less steep, angle -45
      delay: 0.4,
      angle: -45,
      side: 'left',
    },
    {
      id: 'line-support',
      path: 'M 50 90 L 70 55 L 80 35', // Right side, less steep, angle 50
      delay: 0.6,
      angle: 50,
      side: 'right',
    },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#00BFA6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00BFA6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00BFA6" stopOpacity="0.3" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((line) => (
          <motion.path
            key={line.id}
            d={line.path}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#lineGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              pathLength: {
                duration: 1.5,
                delay: line.delay,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: {
                duration: 0.5,
                delay: line.delay,
              },
            }}
            onAnimationComplete={() => onLineReady?.(line.id)}
            style={{
              transformOrigin: '50% 50%',
            }}
          />
        ))}
      </svg>
    </div>
  );
}


'use client';

import { motion } from 'framer-motion';

export function TreeStem() {
  // Organic tree stem path with Bezier curves
  // Bredare vid basen (47-53), smalare vid toppen (49-51)
  // Använder cubic Bezier (C) för smooth, organiska kurvor
  const stemPath = `M 47,100 
    C 47,95 47.5,90 48,85
    C 48.2,80 48.5,75 48.8,70
    C 49,65 49.3,60 49.5,55
    C 49.6,50 49.8,45 49.9,40
    C 50,35 50.1,30 50.2,25
    C 50.3,20 50.4,15 50.5,10
    C 50.6,7 50.8,4 51,2
    L 51,0
    L 49,0
    C 48.8,2 48.6,4 48.5,7
    C 48.4,10 48.3,15 48.2,20
    C 48.1,25 48,30 47.9,35
    C 47.8,40 47.6,45 47.5,50
    C 47.4,55 47.3,60 47.2,65
    C 47.1,70 47,75 47,80
    C 47,85 47,90 47,95
    Z`;

  // Branches coming off the stem
  const branches = [
    {
      id: 'branch-1',
      path: 'M 48.5,40 C 46,38 43,36 40,34 C 38,32 36,30 34,28',
      strokeWidth: 1.5,
      delay: 2.5,
    },
    {
      id: 'branch-2',
      path: 'M 49.5,60 C 51.5,58 53.5,56 55.5,54 C 57,52 58.5,50 60,48',
      strokeWidth: 1.5,
      delay: 2.7,
    },
    {
      id: 'branch-3',
      path: 'M 48,25 C 46,23 44,21 42,19 C 40.5,17 39,15 37.5,13',
      strokeWidth: 1.2,
      delay: 2.9,
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMin meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main stem gradient */}
          <linearGradient id="stemGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="40%" stopColor="#121212" />
            <stop offset="70%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#00BFA6" stopOpacity="0.8" />
          </linearGradient>

          {/* Highlight gradient for left side */}
          <linearGradient id="stemHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Bark texture pattern */}
          <pattern
            id="barkTexture"
            x="0"
            y="0"
            width="3"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="0.5" height="100" fill="rgba(0, 191, 166, 0.08)" />
            <rect x="1.5" width="0.5" height="100" fill="rgba(0, 191, 166, 0.12)" />
            <rect x="2.5" width="0.5" height="100" fill="rgba(0, 191, 166, 0.06)" />
          </pattern>

          {/* Shadow filter */}
          <filter id="stemShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter */}
          <filter id="stemGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow layer */}
        <motion.path
          d={stemPath}
          fill="#000000"
          opacity="0.4"
          filter="url(#stemShadow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Main stem */}
        <motion.path
          d={stemPath}
          fill="url(#stemGradient)"
          filter="url(#stemGlow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            transformOrigin: '50% 100%',
          }}
        />

        {/* Bark texture overlay */}
        <motion.path
          d={stemPath}
          fill="url(#barkTexture)"
          opacity="0.25"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Highlight layer (left side light source) */}
        <motion.path
          d={stemPath}
          fill="url(#stemHighlight)"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Branches */}
        {branches.map((branch) => (
          <motion.path
            key={branch.id}
            d={branch.path}
            fill="none"
            stroke="url(#stemGradient)"
            strokeWidth={branch.strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              pathLength: {
                duration: 1,
                delay: branch.delay,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: { duration: 0.5, delay: branch.delay },
            }}
            filter="url(#stemGlow)"
            style={{
              transformOrigin: branch.path.split(' ')[1], // Start point of branch
            }}
          />
        ))}
      </svg>

      {/* Breathing pulse animation - more subtle */}
      <motion.div
        animate={{
          scale: [1, 1.01, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-teal/10 rounded-full blur-2xl"
        style={{
          transformOrigin: '50% 100%',
        }}
      />
    </div>
  );
}

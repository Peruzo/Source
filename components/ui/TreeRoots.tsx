'use client';

import { motion } from 'framer-motion';

export function TreeRoots() {
  // Organic roots with cubic Bezier curves (C commands)
  // Varierande stroke-width och naturliga böjningar
  // Varje rot har förgreningar
  const mainRoots = [
    {
      id: 'root-1',
      path: 'M 50,100 C 45,98 40,95 35,92 C 30,88 25,85 20,80 C 15,75 12,70 10,65',
      sideRoots: [
        {
          id: 'side-1-1',
          path: 'M 35,92 C 33,90 31,88 29,86 C 27,84 25,82 23,80',
        },
        {
          id: 'side-1-2',
          path: 'M 20,80 C 18,78 16,76 14,74 C 12,72 11,70 10,68',
        },
      ],
      strokeWidth: 3,
      delay: 0.1,
    },
    {
      id: 'root-2',
      path: 'M 50,100 C 48,98 46,96 44,94 C 42,91 40,88 38,85 C 36,82 34,79 32,76',
      sideRoots: [
        {
          id: 'side-2-1',
          path: 'M 44,94 C 43,92 42,90 41,88 C 40,86 39,84 38,82',
        },
      ],
      strokeWidth: 2.5,
      delay: 0.2,
    },
    {
      id: 'root-3',
      path: 'M 50,100 C 52,98 54,96 56,94 C 58,91 60,88 62,85 C 64,82 66,79 68,76',
      sideRoots: [
        {
          id: 'side-3-1',
          path: 'M 56,94 C 57,92 58,90 59,88 C 60,86 61,84 62,82',
        },
        {
          id: 'side-3-2',
          path: 'M 62,85 C 63,83 64,81 65,79 C 66,77 67,75 68,73',
        },
      ],
      strokeWidth: 2.5,
      delay: 0.3,
    },
    {
      id: 'root-4',
      path: 'M 50,100 C 55,98 60,95 65,92 C 70,88 75,85 80,80 C 85,75 88,70 90,65',
      sideRoots: [
        {
          id: 'side-4-1',
          path: 'M 65,92 C 67,90 69,88 71,86 C 73,84 75,82 77,80',
        },
        {
          id: 'side-4-2',
          path: 'M 80,80 C 82,78 84,76 86,74 C 88,72 89,70 90,68',
        },
      ],
      strokeWidth: 3,
      delay: 0.4,
    },
    {
      id: 'root-5',
      path: 'M 50,100 C 47,99 44,98 41,97 C 38,96 35,95 32,94 C 29,93 26,92 23,91',
      sideRoots: [],
      strokeWidth: 2,
      delay: 0.5,
    },
    {
      id: 'root-6',
      path: 'M 50,100 C 53,99 56,98 59,97 C 62,96 65,95 68,94 C 71,93 74,92 77,91',
      sideRoots: [],
      strokeWidth: 2,
      delay: 0.6,
    },
  ];

  return (
    <div className="relative w-full h-full">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="rootGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#00BFA6" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#00BFA6" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#121212" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </linearGradient>
          
          {/* Root glow filter */}
          <filter id="rootGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Root shadow */}
          <filter id="rootShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="0.5" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mainRoots.map((root) => (
          <g key={root.id}>
            {/* Main root path */}
            <motion.path
              d={root.path}
              fill="none"
              stroke="url(#rootGradient)"
              strokeWidth={root.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#rootGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                pathLength: {
                  duration: 1.5,
                  delay: root.delay,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: 0.5,
                  delay: root.delay,
                },
              }}
              style={{
                filter: 'drop-shadow(0 0 3px rgba(0, 191, 166, 0.4))',
              }}
            />

            {/* Side roots (branches) */}
            {root.sideRoots.map((sideRoot, idx) => (
              <motion.path
                key={sideRoot.id}
                d={sideRoot.path}
                fill="none"
                stroke="url(#rootGradient)"
                strokeWidth={root.strokeWidth * 0.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#rootGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  pathLength: {
                    duration: 1,
                    delay: root.delay + 0.3 + idx * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  },
                  opacity: {
                    duration: 0.4,
                    delay: root.delay + 0.3 + idx * 0.1,
                  },
                }}
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(0, 191, 166, 0.3))',
                }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

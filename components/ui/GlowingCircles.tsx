'use client';

import { motion } from 'framer-motion';

interface Circle {
  id: string;
  size: number;
  x: number; // Percentage from left
  y: number; // Percentage from top
  delay: number;
  color: 'teal' | 'orange' | 'yellow';
}

export function GlowingCircles() {
  // Positioned to overlap "Data" in "Rooted in Data, Growing"
  // "Data" is roughly at center horizontally, slightly above center vertically
  const circles: Circle[] = [
    { id: 'circle-1', size: 40, x: 48, y: 48, delay: 0, color: 'teal' },
    { id: 'circle-2', size: 30, x: 52, y: 50, delay: 0.2, color: 'orange' },
    { id: 'circle-3', size: 25, x: 50, y: 52, delay: 0.4, color: 'yellow' },
    { id: 'circle-4', size: 35, x: 49, y: 49, delay: 0.6, color: 'teal' },
    { id: 'circle-5', size: 20, x: 51, y: 51, delay: 0.8, color: 'orange' },
  ];

  const colorClasses = {
    teal: 'from-teal/40 to-teal/20',
    orange: 'from-orange-400/40 to-orange-400/20',
    yellow: 'from-yellow-400/40 to-yellow-400/20',
  };

  return (
    <div className="relative w-32 h-32 pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className={`absolute rounded-full bg-gradient-to-br ${colorClasses[circle.color]} blur-sm`}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: circle.delay + 1,
            duration: 0.5,
            type: 'spring',
            stiffness: 200,
          }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            y: {
              duration: 2 + circle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            scale: {
              duration: 3 + circle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            opacity: {
              duration: 2.5 + circle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
}


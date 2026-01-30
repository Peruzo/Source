'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        glass
        rounded-2xl p-8
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}


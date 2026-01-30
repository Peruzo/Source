'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeaturePopupProps {
  title: string;
  features: string[];
  titleColor: string;
  children?: ReactNode;
  className?: string;
}

export function FeaturePopup({
  title,
  features,
  titleColor,
  className = '',
}: FeaturePopupProps) {
  return (
    <div
      className={`
        bg-black/95 
        backdrop-blur-xl 
        rounded-2xl 
        p-6 
        border border-white/30 
        shadow-2xl
        min-w-[280px] 
        max-w-[320px]
        ${className}
      `}
    >
      <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h3>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-sm text-white flex items-start gap-2"
          >
            <span className={`${titleColor} mt-1`}>•</span>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}


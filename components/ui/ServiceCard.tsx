'use client';

import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { GlassCard } from './GlassCard';

interface ServiceCardProps {
  title: string;
  description?: string;
  features: string[];
  color: 'analytics' | 'payments' | 'ecommerce' | 'support';
  delay?: number;
  span?: string; // 'md:col-span-2' etc
}

const serviceColors = {
  analytics: {
    border: 'border-l-teal',
    text: 'text-teal',
    glow: 'hover:shadow-[0_0_30px_rgba(0,191,166,0.3)]',
  },
  payments: {
    border: 'border-l-yellow-400',
    text: 'text-yellow-400',
    glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]',
  },
  ecommerce: {
    border: 'border-l-green-400',
    text: 'text-green-400',
    glow: 'hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]',
  },
  support: {
    border: 'border-l-orange-400',
    text: 'text-orange-400',
    glow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]',
  },
};

export function ServiceCard({ title, description, features, color, delay = 0, span }: ServiceCardProps) {
  const colors = serviceColors[color];

  return (
    <motion.div
      className={span}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <MagneticButton strength={0.2}>
        <GlassCard
          className={`
            h-full
            border-l-4 ${colors.border}
            border-white/10
            hover:border-teal/60
            ${colors.glow}
            transition-all duration-300
          `}
        >
          <h3 className={`${colors.text} font-bold text-xl md:text-2xl mb-4`}>
            {title}
          </h3>
          {description && (
            <p className="text-gray-400 mb-4">{description}</p>
          )}
          <ul className="space-y-2">
            {features.slice(0, 4).map((feature, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className={`${colors.text} mt-1 flex-shrink-0`}>•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </MagneticButton>
    </motion.div>
  );
}


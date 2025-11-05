'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface ServiceBranchProps {
  branch: {
    id: string;
    title: string;
    features: string[];
    color: 'analytics' | 'payments' | 'ecommerce' | 'support';
    position: {
      angle: number;
      height: number;
      side: 'left' | 'right';
    };
  };
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
}

const branchColors = {
  analytics: {
    main: 'from-teal to-teal/60',
    accent: 'bg-teal/20',
    glow: 'bg-teal/10',
    text: 'text-teal',
  },
  payments: {
    main: 'from-teal to-yellow-400/60',
    accent: 'bg-yellow-400/20',
    glow: 'bg-yellow-400/10',
    text: 'text-yellow-400',
  },
  ecommerce: {
    main: 'from-green-400 to-white/60',
    accent: 'bg-green-400/20',
    glow: 'bg-green-400/10',
    text: 'text-green-400',
  },
  support: {
    main: 'from-teal to-orange-400/60',
    accent: 'bg-orange-400/20',
    glow: 'bg-orange-400/10',
    text: 'text-orange-400',
  },
};

export function ServiceBranch({ branch, index, isExpanded, onExpand }: ServiceBranchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = branchColors[branch.color];
  
  // Calculate position
  const baseHeight = branch.position.height;
  const horizontalOffset = branch.position.side === 'left' ? -20 : 20;
  
  // Branch path calculation (simplified curve)
  const branchLength = 30;
  const radianAngle = (branch.position.angle * Math.PI) / 180;
  const endX = Math.sin(radianAngle) * branchLength;
  const endY = -Math.cos(radianAngle) * branchLength;

  return (
    <div
      className="absolute hidden md:block"
      style={{
        left: branch.position.side === 'left' ? '45%' : '55%',
        bottom: `${baseHeight}%`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`${branch.title} - Klicka för att expandera`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExpand();
        }
      }}
    >
      {/* Branch SVG */}
      <motion.svg
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          pathLength: { duration: 1.5, delay: 2 + index * 0.2, ease: 'easeOut' },
          opacity: { duration: 0.5, delay: 2 + index * 0.2 },
        }}
        className="absolute w-full h-full"
        style={{
          width: '200px',
          height: '200px',
          transform: `rotate(${branch.position.angle}deg)`,
          transformOrigin: 'bottom center',
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`branchGradient-${branch.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00BFA6" />
            <stop offset="100%" stopColor="rgba(0, 191, 166, 0.4)" />
          </linearGradient>
          <filter id={`glow-${branch.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={`M 100 200 Q ${100 + endX * 0.5} ${200 - endY * 0.5}, ${100 + endX} ${200 - endY}`}
          fill="none"
          stroke={`url(#branchGradient-${branch.id})`}
          strokeWidth="4"
          animate={{
            strokeWidth: isHovered ? 6 : 4,
          }}
          transition={{ duration: 0.3 }}
          filter={`url(#glow-${branch.id})`}
        />
      </motion.svg>

      {/* Branch end node with hover effect */}
      <motion.div
        className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${colors.main} border-2 border-white/20 flex items-center justify-center cursor-pointer ${colors.glow}`}
        style={{
          left: branch.position.side === 'left' ? '0px' : 'auto',
          right: branch.position.side === 'right' ? '0px' : 'auto',
          bottom: '0px',
          transform: `rotate(${branch.position.angle}deg) translate(${horizontalOffset}px, -30px)`,
          transformOrigin: 'center',
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          boxShadow: isHovered
            ? `0 0 20px rgba(0, 191, 166, 0.5)`
            : `0 0 10px rgba(0, 191, 166, 0.3)`,
        }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 1.1 }}
        onClick={onExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 2.5 + index * 0.2,
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white/30" />
      </motion.div>

      {/* Feature flowers/blooms */}
      {branch.features.slice(0, 3).map((_, featureIndex) => (
        <motion.div
          key={featureIndex}
          className={`absolute w-3 h-3 rounded-full ${colors.accent} border border-white/30`}
          style={{
            left: branch.position.side === 'left' ? `${featureIndex * 10}px` : 'auto',
            right: branch.position.side === 'right' ? `${featureIndex * 10}px` : 'auto',
            bottom: `${20 + featureIndex * 15}px`,
            transform: `rotate(${branch.position.angle}deg)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.8],
          }}
          viewport={{ once: true }}
          transition={{
            delay: 3 + index * 0.2 + featureIndex * 0.1,
            duration: 0.5,
          }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
          }}
        />
      ))}

      {/* Data particles (for analytics branch) */}
      {branch.color === 'analytics' && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 3.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-teal rounded-full"
              style={{
                left: branch.position.side === 'left' ? `${10 + i * 8}px` : 'auto',
                right: branch.position.side === 'right' ? `${10 + i * 8}px` : 'auto',
                bottom: `${30 + i * 12}px`,
                transform: `rotate(${branch.position.angle}deg)`,
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Expanded feature card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 w-[280px] md:w-[300px]"
            style={{
              left: branch.position.side === 'left' ? '120%' : 'auto',
              right: branch.position.side === 'right' ? '120%' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            role="dialog"
            aria-label={`${branch.title} funktioner`}
          >
            <GlassCard className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>{branch.title}</h3>
              <ul className="space-y-2">
                {branch.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className={`${colors.text} mt-1`}>•</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


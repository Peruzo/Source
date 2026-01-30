'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturePopup } from './FeaturePopup';

interface BranchNodeProps {
  id: string;
  title: string;
  features: string[];
  color: 'analytics' | 'payments' | 'ecommerce' | 'support';
  position: {
    angle: number;
    height: number; // Percentage from bottom
    side: 'left' | 'right';
    distanceFromCenter: number; // Percentage from center
  };
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
}

const branchColors = {
  analytics: {
    text: 'text-teal',
    bg: 'bg-teal/20',
    glow: 'bg-teal/10',
  },
  payments: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-400/20',
    glow: 'bg-yellow-400/10',
  },
  ecommerce: {
    text: 'text-green-400',
    bg: 'bg-green-400/20',
    glow: 'bg-green-400/10',
  },
  support: {
    text: 'text-orange-400',
    bg: 'bg-orange-400/20',
    glow: 'bg-orange-400/10',
  },
};

export function BranchNode({
  id,
  title,
  features,
  color,
  position,
  index,
  isExpanded,
  onExpand,
}: BranchNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = branchColors[color];

  // Calculate position from center
  const leftPos = position.side === 'left' 
    ? `${50 - position.distanceFromCenter}%` 
    : 'auto';
  const rightPos = position.side === 'right'
    ? `${50 - position.distanceFromCenter}%`
    : 'auto';

  return (
    <div
      className="absolute hidden md:block"
      style={{
        left: leftPos,
        right: rightPos,
        bottom: `${position.height}%`,
      }}
    >
      {/* Clickable Node */}
      <motion.div
        className={`
          absolute w-16 h-16 rounded-full 
          bg-gradient-to-br from-teal/40 to-teal/20 
          border-2 border-white/30 
          flex items-center justify-center 
          cursor-pointer 
          ${colors.glow}
        `}
        style={{
          transform: 'translate(-50%, 50%)',
        }}
        animate={{
          scale: isHovered ? 1.3 : 1,
          boxShadow: isHovered
            ? `0 0 20px rgba(0, 191, 166, 0.6)`
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
        role="button"
        tabIndex={0}
        aria-label={`${title} - Klicka för att expandera`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onExpand();
          }
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white/30" />
      </motion.div>

      {/* Expanded Feature Popup */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50"
            style={{
              left: position.side === 'left' ? '120%' : 'auto',
              right: position.side === 'right' ? '120%' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            role="dialog"
            aria-label={`${title} funktioner`}
          >
            <FeaturePopup
              title={title}
              features={features}
              titleColor={colors.text}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


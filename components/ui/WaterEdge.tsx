'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface WaterEdgeProps {
  onDropletFormed: () => void;
}

export function WaterEdge({ onDropletFormed }: WaterEdgeProps) {
  const [showDroplet, setShowDroplet] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'start end'],
  });

  const dropletOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const dropletScale = useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 0.8, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest > 0.05 && !showDroplet) {
        setShowDroplet(true);
        setTimeout(() => onDropletFormed(), 800);
      }
    });

    return unsubscribe;
  }, [scrollYProgress, showDroplet, onDropletFormed]);

  return (
    <div 
      ref={sectionRef}
      className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Water formation effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          opacity: dropletOpacity,
          scale: dropletScale,
        }}
      >
        <svg
          width="80"
          height="60"
          viewBox="0 0 80 60"
          className="drop-shadow-lg"
        >
          <defs>
            <filter id="water-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            </filter>
            <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 191, 166, 0.8)" />
              <stop offset="50%" stopColor="rgba(0, 191, 166, 0.6)" />
              <stop offset="100%" stopColor="rgba(0, 191, 166, 0.4)" />
            </linearGradient>
          </defs>
          
          {/* Water droplet shape */}
          <motion.path
            d="M40 10 C45 10, 50 15, 50 25 C50 35, 45 40, 40 45 C35 40, 30 35, 30 25 C30 15, 35 10, 40 10 Z"
            fill="url(#water-gradient)"
            filter="url(#water-blur)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Water surface ripple */}
          <motion.ellipse
            cx="40"
            cy="25"
            rx="15"
            ry="3"
            fill="rgba(0, 191, 166, 0.3)"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Water edge effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 166, 0.6) 50%, transparent 100%)',
          opacity: dropletOpacity,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}


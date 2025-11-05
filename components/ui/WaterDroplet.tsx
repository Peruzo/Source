'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useScrollDroplet } from '@/lib/hooks/useScrollDroplet';

interface DropletTrail {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function WaterDroplet() {
  const { y, isHighlighting, currentTarget, isActive } = useScrollDroplet();
  const [trail, setTrail] = useState<DropletTrail[]>([]);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const trailRef = useRef<NodeJS.Timeout | null>(null);

  // Update trail effect
  useEffect(() => {
    if (isActive && y !== lastPosition.y) {
      const newTrailPoint: DropletTrail = {
        id: Date.now(),
        x: window.innerWidth / 2, // Center horizontally
        y: y + window.innerHeight / 2, // Adjust for viewport
        timestamp: Date.now(),
      };

      setTrail(prev => [...prev.slice(-8), newTrailPoint]); // Keep last 8 trail points
      setLastPosition({ x: newTrailPoint.x, y: newTrailPoint.y });
    }
  }, [y, isActive, lastPosition]);

  // Clean up old trail points
  useEffect(() => {
    if (trailRef.current) clearInterval(trailRef.current);
    
    trailRef.current = setInterval(() => {
      setTrail(prev => prev.filter(point => Date.now() - point.timestamp < 1000));
    }, 100);

    return () => {
      if (trailRef.current) clearInterval(trailRef.current);
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Trail effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute water-trail"
            style={{
              left: point.x - 8,
              top: point.y - 8,
            }}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Main droplet */}
      <motion.div
        className="absolute water-droplet"
        style={{
          left: window.innerWidth / 2 - 16,
          top: y + window.innerHeight / 2 - 16,
        }}
        animate={{
          scale: isHighlighting ? 0.7 : 1,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          scale: { duration: 0.3 },
          rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="drop-shadow-lg"
        >
          <defs>
            <filter id="droplet-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
            </filter>
            <radialGradient id="droplet-gradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(0, 191, 166, 0.9)" />
              <stop offset="50%" stopColor="rgba(0, 191, 166, 0.7)" />
              <stop offset="100%" stopColor="rgba(0, 191, 166, 0.4)" />
            </radialGradient>
            <filter id="glass-effect">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"/>
            </filter>
          </defs>
          
          <motion.path
            d="M16 4 C18 4, 20 6, 20 10 C20 14, 18 16, 16 18 C14 16, 12 14, 12 10 C12 6, 14 4, 16 4 Z"
            fill="url(#droplet-gradient)"
            filter="url(#droplet-blur)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Highlight reflection */}
          <motion.ellipse
            cx="14"
            cy="8"
            rx="3"
            ry="2"
            fill="rgba(255, 255, 255, 0.6)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Highlight ring */}
      <AnimatePresence>
        {isHighlighting && currentTarget && (
          <motion.div
            className="absolute water-highlight-ring"
            style={{
              left: currentTarget.left - 20,
              top: currentTarget.top - 20,
              width: currentTarget.width + 40,
              height: currentTarget.height + 40,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.1, 1],
              opacity: [0, 0.8, 0.6, 0.8],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              scale: { duration: 0.3 },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

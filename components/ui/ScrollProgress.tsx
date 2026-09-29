'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNoFx } from '@/lib/hooks/useNoFx'; // TEMP: flicker bisect, remove after diagnosis

export function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  const nofx = useNoFx(); // TEMP: flicker bisect, remove after diagnosis
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || nofx.progress) { // TEMP: flicker bisect, remove after diagnosis
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-50 transform-gpu contain-strict will-change-transform"
      style={{ scaleX }}
    />
  );
}


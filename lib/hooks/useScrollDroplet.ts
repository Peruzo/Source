'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface HighlightTarget {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface DropletState {
  y: number;
  isHighlighting: boolean;
  currentTarget: HighlightTarget | null;
  isActive: boolean;
}

export function useScrollDroplet(): DropletState {
  const [dropletState, setDropletState] = useState<DropletState>({
    y: 0,
    isHighlighting: false,
    currentTarget: null,
    isActive: false,
  });

  const [dropletFormed, setDropletFormed] = useState(false);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  // Detect droplet formation trigger
  const handleDropletFormed = useCallback(() => {
    setDropletFormed(true);
  }, []);

  // Calculate droplet position based on scroll
  const calculateDropletPosition = useCallback((scrollY: number) => {
    if (!dropletFormed) return 0;
    
    // Start from hero section bottom (approximately 100vh)
    const heroHeight = window.innerHeight;
    const startY = heroHeight;
    
    // Calculate droplet Y position relative to scroll
    // Droplet follows scroll but with some lag for natural movement
    const scrollProgress = Math.max(0, scrollY - heroHeight);
    const dropletY = startY + scrollProgress * 0.8; // Slight lag behind scroll
    
    return Math.max(startY, dropletY);
  }, [dropletFormed]);

  // Check for highlight targets
  const checkHighlightTargets = useCallback((dropletY: number, currentScrollY: number) => {
    const highlightElements = document.querySelectorAll('[data-droplet-highlight]');
    
    for (const element of highlightElements) {
      const rect = element.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      
      // Check if droplet is near the element (within 100px)
      if (Math.abs(dropletY - elementCenterY - currentScrollY) < 100) {
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
    }
    
    return null;
  }, []);

  // Handle scroll events
  useMotionValueEvent(scrollY, "change", (latest) => {
    const dropletY = calculateDropletPosition(latest);
    const highlightTarget = checkHighlightTargets(dropletY, latest);
    
    // Clear previous timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    // Set highlighting state
    const isHighlighting = highlightTarget !== null;
    
    if (isHighlighting && !dropletState.isHighlighting) {
      // Start highlighting
      setDropletState(prev => ({
        ...prev,
        y: dropletY,
        isHighlighting: true,
        currentTarget: highlightTarget,
        isActive: true,
      }));

      // Stop highlighting after 2 seconds
      highlightTimeoutRef.current = setTimeout(() => {
        setDropletState(prev => ({
          ...prev,
          isHighlighting: false,
          currentTarget: null,
        }));
      }, 2000);
    } else if (!isHighlighting) {
      // Update position without highlighting
      setDropletState(prev => ({
        ...prev,
        y: dropletY,
        isHighlighting: false,
        currentTarget: null,
        isActive: dropletFormed,
      }));
    }
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  // Expose droplet formation trigger
  useEffect(() => {
    // @ts-ignore - Adding to window for WaterEdge component to access
    window.triggerDropletFormation = handleDropletFormed;
    
    return () => {
      // @ts-ignore
      delete window.triggerDropletFormation;
    };
  }, [handleDropletFormed]);

  return dropletState;
}

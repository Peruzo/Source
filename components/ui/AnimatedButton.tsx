'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useState, useRef, MouseEvent } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AnimatedButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: AnimatedButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-teal text-white hover:bg-teal-hover',
    secondary: 'bg-transparent text-teal border-2 border-teal hover:bg-teal hover:text-white',
    ghost: 'bg-transparent text-current border border-gray-200 hover:border-teal hover:text-teal',
  };

  const sizeStyles = {
    sm: 'px-6 py-3 text-sm rounded-lg',
    md: 'px-8 py-4 text-base rounded-xl',
    lg: 'px-10 py-5 text-lg rounded-xl',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      <motion.span
        className="relative z-10"
        animate={{ x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        {children}
      </motion.span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
          initial={false}
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        <motion.div
          ref={buttonRef as any}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-full flex items-center justify-center"
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      ref={buttonRef as any}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClassName}
    >
      {content}
    </motion.button>
  );
}


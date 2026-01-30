import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-teal text-white hover:bg-teal-hover active:bg-teal-dark disabled:bg-gray-400',
    secondary: 'bg-transparent text-teal border-2 border-teal hover:bg-teal hover:text-white',
    ghost: 'bg-transparent text-black border border-gray-200 hover:border-teal hover:text-teal',
  };
  
  const sizes = {
    sm: 'px-5 py-2.5 text-sm min-h-[40px]',
    md: 'px-7 py-3.5 text-base min-h-[48px]',
    lg: 'px-9 py-4.5 text-lg min-h-[56px]',
  };
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}


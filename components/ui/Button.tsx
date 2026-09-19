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
  'aria-pressed'?: boolean;
}

/**
 * Pill button that only frames its label: height comes from padding and line-height,
 * no fixed heights or minimum widths. Every variant carries a 1px border (transparent
 * on primary) so all three sit at exactly the same size side by side.
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  'aria-pressed': ariaPressed,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border font-medium leading-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'border-transparent bg-teal text-white hover:bg-teal-hover active:bg-teal-dark disabled:bg-gray-400',
    secondary: 'border-teal bg-transparent text-teal hover:bg-teal/10',
    ghost: 'border-gray-200 bg-transparent text-black hover:border-teal hover:text-teal',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-[13px]',
    md: 'px-[18px] py-2.5 text-sm',
    lg: 'px-[22px] py-3 text-[15px]',
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
      aria-pressed={ariaPressed}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}

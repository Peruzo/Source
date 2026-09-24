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
  /** Sätt på mörk sektion: secondary/ghost byter till vitt, som teal inte klarar mot svart. */
  onDark?: boolean;
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
  onDark = false,
  'aria-pressed': ariaPressed,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border font-medium leading-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-dark focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  // teal-dark (4.87:1 mot vitt) bär vit text i primary på både ljus och mörk
  // botten. secondary/ghost sätter däremot teal som TEXT, och där räcker
  // teal-dark bara mot ljus botten – mot svart ger den 4.31:1. Därför byter de
  // till vitt (21:1) när knappen står på en mörk sektion.
  const variants = {
    primary: 'border-transparent bg-teal-dark text-white hover:bg-teal-darker active:bg-teal-darkest disabled:bg-gray-400',
    secondary: onDark
      ? 'border-white bg-transparent text-white hover:bg-white/10'
      : 'border-teal-dark bg-transparent text-teal-dark hover:bg-teal-dark/10',
    ghost: onDark
      ? 'border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10'
      : 'border-gray-200 bg-transparent text-black hover:border-teal-dark hover:text-teal-dark',
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

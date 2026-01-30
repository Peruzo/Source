import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Container({ children, className = '', size = 'xl' }: ContainerProps) {
  const sizes = {
    sm: 'max-w-[640px]',
    md: 'max-w-[960px]',
    lg: 'max-w-[1280px]',
    xl: 'max-w-[1440px]',
  };

  return (
    <div className={`${sizes[size]} mx-auto px-6 md:px-10 lg:px-20 ${className}`}>
      {children}
    </div>
  );
}


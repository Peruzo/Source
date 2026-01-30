import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'beige' | 'gray' | 'dark' | 'black';
}

export function Section({ children, className = '', background = 'white' }: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    beige: 'bg-[#FDF8F3]',
    gray: 'bg-[#F4F7F6]',
    dark: 'bg-[#1F1F1F] text-white',
    black: 'bg-[#121212] text-white',
  };

  return (
    <section className={`py-16 md:py-24 lg:py-32 ${backgrounds[background]} ${className}`}>
      {children}
    </section>
  );
}


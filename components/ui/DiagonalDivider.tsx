'use client';

interface DiagonalDividerProps {
  flip?: boolean;
  color?: 'light' | 'dark';
  className?: string;
}

export function DiagonalDivider({
  flip = false,
  color = 'light',
  className = '',
}: DiagonalDividerProps) {
  const bgColor = color === 'light' ? '#FFFFFF' : '#121212';
  const transform = flip ? 'scale(-1, 1)' : 'scale(1, 1)';

  return (
    <div className={`relative h-12 md:h-24 w-full ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform }}
      >
        <path
          d="M0,0 L1440,120 L1440,0 Z"
          fill={bgColor}
        />
      </svg>
    </div>
  );
}


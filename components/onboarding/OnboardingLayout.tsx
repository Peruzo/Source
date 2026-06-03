import React from 'react';

type OnboardingLayoutProps = {
  children: React.ReactNode;
  currentStep?: number;   // 0-indexed position i progress (om undefined → inga dots)
  totalSteps?: number;    // totalt antal dots (om undefined → inga dots)
};

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
  const showDots = currentStep !== undefined && totalSteps !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Gradient bakgrund */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.10) 40%, transparent 70%)',
        }}
      />

      {/* Innehåll */}
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">

        {/* Logo + Progress dots */}
        <div className="flex flex-col items-center mb-12 gap-4">
          <img
            src="/twogreenarrows.png"
            alt="Source"
            className="h-16 w-auto"
          />
          {showDots && (
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? 24 : 8,
                    height: 8,
                    background: i <= currentStep ? '#10b981' : '#d1fae5',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

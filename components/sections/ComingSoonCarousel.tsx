'use client';

import { useState, useEffect, useRef } from 'react';

interface CarouselCard {
  id: string;
  image?: string;
  text: string;
  backgroundColor: string;
  textColor: string;
}

const carouselCards: CarouselCard[] = [
  {
    id: '1',
    text: 'Vi bygger just nu åt riktiga kunder',
    backgroundColor: '#E8E0F5',
    textColor: '#1A1A1A',
  },
  {
    id: '2',
    text: 'Portfolio uppdateras löpande',
    backgroundColor: '#2C2C2C',
    textColor: '#FFFFFF',
  },
  {
    id: '3',
    text: 'Nya projekt kommer snart',
    backgroundColor: '#E0F0FF',
    textColor: '#1A1A1A',
  },
  {
    id: '4',
    text: 'Vi arbetar med spännande projekt',
    backgroundColor: '#FFF8E0',
    textColor: '#1A1A1A',
  },
  {
    id: '5',
    text: 'Följ med oss på resan',
    backgroundColor: '#F5E6D3',
    textColor: '#1A1A1A',
  },
];

export function ComingSoonCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselCards.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  // Scroll to current card
  useEffect(() => {
    if (!carouselRef.current) return;

    const card = carouselRef.current.children[currentIndex] as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 16; // Match CSS gap
    const scrollPosition = currentIndex * (cardWidth + gap);

    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Two-column layout matching Revolut design */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
        {/* Text Section (Left) */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
            Mer projekt kommer
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
            Vi bygger just nu åt riktiga kunder. Portfolio uppdateras löpande.
          </p>
        </div>

        {/* Carousel Container (Right) */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {carouselCards.map((card) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-[240px] h-[339px] rounded-[20px] overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: card.backgroundColor,
                  }}
                >
                  {/* Card Content */}
                  <div className="h-full flex items-end p-6">
                    <p
                      className="text-lg font-semibold leading-tight"
                      style={{
                        color: card.textColor,
                      }}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Indicators */}
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Carousel navigation">
              {carouselCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-controls={`card-${index + 1}`}
                  className={`transition-all duration-200 ${
                    index === currentIndex
                      ? 'w-6 h-1.5 bg-black rounded-full'
                      : 'w-1.5 h-1.5 bg-[#8D969E] rounded-full hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

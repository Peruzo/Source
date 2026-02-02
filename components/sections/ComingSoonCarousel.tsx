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
    image: '/forthewebsitesource.png',
    text: 'Vi bygger just nu åt riktiga kunder',
    backgroundColor: '#E8E0F5',
    textColor: '#FFFFFF',
  },
  {
    id: '2',
    image: '/glowanotherone.png',
    text: 'Portfolio uppdateras löpande',
    backgroundColor: '#2C2C2C',
    textColor: '#FFFFFF',
  },
  {
    id: '3',
    image: '/mintilogo.png',
    text: 'Nya projekt kommer snart',
    backgroundColor: '#E0F0FF',
    textColor: '#FFFFFF',
  },
  {
    id: '4',
    image: '/Vattentrygg-logo-p-500.png',
    text: 'Vi arbetar med spännande projekt',
    backgroundColor: '#FFF8E0',
    textColor: '#FFFFFF',
  },
  {
    id: '5',
    image: '/forthebetterse.png',
    text: 'Följ med oss på resan',
    backgroundColor: '#F5E6D3',
    textColor: '#FFFFFF',
  },
];

export function ComingSoonCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect which card is centered based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;

      const container = carouselRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const centerX = scrollLeft + containerWidth / 2;

      // Find which card is closest to center
      let closestIndex = 0;
      let closestDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + cardWidth / 2;
        const distance = Math.abs(centerX - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex((prev) => {
        if (closestIndex !== prev) {
          return closestIndex;
        }
        return prev;
      });
    };

    const container = carouselRef.current;
    if (!container) return;

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => container.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % carouselCards.length;
        // Scroll to next card
        if (carouselRef.current) {
          const card = carouselRef.current.children[nextIndex] as HTMLElement;
          if (card) {
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            const containerWidth = carouselRef.current.clientWidth;
            const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;

            carouselRef.current.scrollTo({
              left: scrollPosition,
              behavior: 'smooth',
            });
          }
        }
        return nextIndex;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  // Scroll to current card on index change
  useEffect(() => {
    if (!carouselRef.current) return;

    const card = carouselRef.current.children[currentIndex] as HTMLElement;
    if (!card) return;

    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const containerWidth = carouselRef.current.clientWidth;
    const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;

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
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start mb-12">
        {/* Text Section (Left) - Moved more to the left */}
        <div className="flex-1 text-center md:text-left md:-ml-6 lg:-ml-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
            Mer projekt kommer
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Vi bygger just nu åt riktiga kunder. Portfolio uppdateras löpande.
          </p>
        </div>
      </div>

      {/* Full-width Carousel Container - Revolut-style: horizontal scroll, rounded corners, center scale */}
      <div className="relative -mx-6 md:-mx-10 lg:-mx-20 px-6 md:px-10 lg:px-20">
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {carouselCards.map((card, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={card.id}
                className="flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] h-[390px] md:h-[470px] lg:h-[520px] rounded-[24px] overflow-hidden cursor-pointer relative hover:shadow-xl"
                style={{
                  backgroundColor: card.backgroundColor,
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  zIndex: isActive ? 10 : 1,
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                  boxShadow: isActive ? '0 20px 40px -15px rgba(0,0,0,0.2)' : '0 4px 12px -2px rgba(0,0,0,0.08)',
                }}
              >
              {/* Background Image */}
              {card.image && (
                <div className="absolute inset-0">
                  <img
                    src={card.image}
                    alt={card.text}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              )}
              
              {/* Card Content */}
              <div className="h-full flex items-end p-6 relative z-10">
                <p
                  className="text-lg md:text-xl font-semibold leading-tight"
                  style={{
                    color: card.textColor,
                  }}
                >
                  {card.text}
                </p>
              </div>
              </div>
            );
          })}
        </div>

        {/* Tab Indicators */}
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Carousel navigation">
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
  );
}

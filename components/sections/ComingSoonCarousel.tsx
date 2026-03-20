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
  const rafRef = useRef<number | null>(null);
  const duplicatedCards = [...carouselCards, ...carouselCards];

  // Detect which card is centered based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;

      const container = carouselRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const centerX = scrollLeft + containerWidth / 2;
      const originalCount = carouselCards.length;

      // Find which card is closest to center
      let closestIndex = 0;
      let closestDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + cardWidth / 2;
        const distance = Math.abs(centerX - cardCenter);
        const normalizedIndex = index % originalCount;

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = normalizedIndex;
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

  // Continuous auto-scroll functionality
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const speed = 0.26; // px per frame

    const animate = () => {
      if (!isPaused) {
        container.scrollLeft += speed;
        container.scrollLeft = Math.round(container.scrollLeft * 1000) / 1000;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPaused]);

  // Keep index state for center-weighted visual styling
  useEffect(() => {
    // intentionally no scrollTo; continuous motion handled by RAF loop
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
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedCards.map((card, index) => {
            const total = carouselCards.length;
            const normalizedIndex = index % total;
            const rawDistance = Math.abs(normalizedIndex - currentIndex);
            const distance = Math.min(rawDistance, total - rawDistance);

            const scale =
              distance === 0 ? 1 :
              distance === 1 ? 0.93 :
              distance === 2 ? 0.88 : 0.85;

            const opacity =
              distance === 0 ? 1 :
              distance === 1 ? 0.8 :
              distance === 2 ? 0.7 : 0.6;

            return (
              <div
                key={card.id}
                className="flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] h-[390px] md:h-[470px] lg:h-[520px] rounded-[24px] overflow-hidden cursor-pointer relative hover:shadow-xl"
                style={{
                  backgroundColor: card.backgroundColor,
                  flex: '0 0 auto',
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: distance === 0 ? 10 : 1,
                  transition: 'transform 0.4s ease, opacity 0.4s ease',
                  willChange: 'transform, opacity',
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

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

type MenuContent = {
  title: string;
  description: string;
  features: string[];
  href: string;
};

const menuContent: Record<string, MenuContent> = {
  tjanster: {
    title: 'Tjänster',
    description: 'Allt du behöver för att växa online – på ett ställe',
    features: [
      'AI-driven design anpassad för din bransch',
      'E-handel med Stripe och inventory management',
      'Mikroanalys som ger konkreta handlingsråd',
      'Support från team med kundservice-DNA',
      'Hosting, SSL och säkerhet inkluderat',
      'Månatlig prenumeration utan bindningstid',
    ],
    href: '/tjanster',
  },
  portfolio: {
    title: 'Portfolio',
    description: 'Verkliga resultat från verkliga kunder',
    features: [
      'Fashion store som ökade trafiken med 200%',
      'SaaS-plattform levererad på 4 veckor',
      'Restaurant som ökade bokningar med 150%',
      'E-handel med 30% konverteringsökning',
      'Se komplett portfolio med case studies',
      'Läs om vår process och metodik',
    ],
    href: '/portfolio',
  },
  'om-oss': {
    title: 'Om oss',
    description: 'Tre grundare med en gemensam vision',
    features: [
      'Alla från kundservice-branchen',
      'Specialister inom AI, e-handel och design',
      'Fokus på långsiktiga relationer',
      'Transparens och ärlighet i allt vi gör',
      'Baserade i Sverige, arbetar globalt',
      'Vi bygger verktyg vi själva skulle använda',
    ],
    href: '/om-oss',
  },
  priser: {
    title: 'Priser',
    description: 'Transparent prenumeration utan dolda kostnader',
    features: [
      'Tre paket för olika behov och ambitioner',
      'Allt är inkluderat – inga överraskningar',
      'Ingen bindningstid eller uppsägningstid',
      'Byt eller avsluta när du vill',
      'Jämför funktioner och hitta rätt nivå',
      'Alla priser i svenska kronor',
    ],
    href: '/priser',
  },
  kontakt: {
    title: 'Kontakt',
    description: 'Låt oss prata om hur vi kan hjälpa dig växa',
    features: [
      'Boka en kostnadsfri 30-minuters demo',
      'Inga säljsnack – bara öppna samtal',
      'Svar inom 24 timmar på alla förfrågningar',
      'Vi hjälper dig förstå om vi passar',
      'E-post: help@source.com',
      'Telefon: +46 73 322 12 12',
    ],
    href: '/kontakt',
  },
};

export function MegaMenu({
  menuKey,
  isOpen,
  onClose,
}: {
  menuKey: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const content = menuContent[menuKey];

  if (!content) return null;


  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="dropdown-container"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="w-screen max-w-2xl"
        >
          <div className="relative bg-white/98 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-8 lg:p-10 overflow-hidden">
            {/* Content */}
            <div>
              {/* Content */}
              <div className="relative z-10 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {content.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {content.description}
                </p>
              </div>

              {/* Features - Two column layout on larger screens */}
              <ul className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-x-8 lg:gap-y-4 mb-10">
                {content.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="relative z-10">
                <Link
                  href={content.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm group transition-colors duration-200 px-4 py-2 -mx-4 -my-2 rounded-lg hover:bg-emerald-50"
                >
                  Utforska {content.title}
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


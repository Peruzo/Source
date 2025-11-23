'use client';

import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { faqCategories, searchQuestions, FAQItem } from '@/lib/data/faqData';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchQuestions(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  return (
    <>
      {/* Top Header Section - Black and Green */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-black relative overflow-hidden">
        {/* Green accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6]/30 via-transparent to-[#00BFA6]/10" />
        <div className="relative z-10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                  Behöver du hjälp?
                </h1>
                <p className="text-base md:text-lg text-white/80 mb-8">
                  Ställ din fråga nedan för att få svar
                </p>
              </FadeIn>
            </div>
          </Container>
        </div>
      </section>

      {/* Search Section - White Background */}
      <section className="py-8 md:py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Search Bar - Minimalist Style */}
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Berätta vad du letar efter"
                  className="w-full px-6 py-4 md:py-5 text-base rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                />
                <svg
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-3 px-2">
                        {searchResults.length} resultat
                      </p>
                      {searchResults.map((item) => {
                        const category = faqCategories.find(
                          (cat) => cat.id === item.category
                        );
                        return (
                          <Link
                            key={item.id}
                            href={`/hjalp/${item.category}#${item.id}`}
                            className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">
                                {category?.icon || '📄'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-black text-sm md:text-base">
                                  {item.question}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {category?.name}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">Inga resultat hittades</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Försök med andra sökord
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Category Grid - Minimalist Style */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqCategories.map((category, index) => {
              // Get first 2-3 questions as examples
              const exampleQuestions = category.questions.slice(0, 3);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <Link
                    href={`/hjalp/${category.id}`}
                    className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 h-full"
                  >
                    {/* Category Title */}
                    <h3 className="font-bold text-lg md:text-xl mb-4 text-black">
                      {category.name}
                    </h3>
                    
                    {/* Example Questions List */}
                    <ul className="space-y-2 mb-4">
                      {exampleQuestions.map((question) => (
                        <li
                          key={question.id}
                          className="text-sm text-gray-600 leading-relaxed"
                        >
                          {question.question}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Show All Link */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700 hover:text-black transition-colors inline-flex items-center gap-1">
                        Visa alla
                        <span>→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Contact Section - Lunar Style */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <Container size="xl">
          <FadeIn className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">
              Kontakta oss och få svar på dina frågor
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Existing Customer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] w-full"
            >
              <Image
                src="/customersupport.png"
                alt="Kundsupport"
                fill
                className="object-cover w-full h-full"
              />
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 text-white">
                <h3 className="text-section-title mb-4 text-white">
                  Kund hos Source?
                </h3>
                <p className="text-body-large text-gray-200 mb-6 leading-relaxed">
                  Få personlig hjälp via chatten i appen.
                </p>
                <AnimatedButton
                  href="/kontakt"
                  variant="primary"
                  size="md"
                  className="!bg-white !text-black hover:!bg-gray-100"
                >
                  Klicka här och få snabb hjälp
                </AnimatedButton>
              </div>
            </motion.div>

            {/* Non-Customer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] w-full"
            >
              <Image
                src="/moutainpicture.png"
                alt="Inte Source användare"
                fill
                className="object-cover w-full h-full"
              />
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 text-white">
                <h3 className="text-section-title mb-4 text-white">
                  Inte Source användare ännu?
                </h3>
                <p className="text-body-large text-gray-200 mb-6 leading-relaxed">
                  Få svar på allmänna frågor.
                </p>
                <AnimatedButton
                  href="/kontakt"
                  variant="primary"
                  size="md"
                  className="!bg-white !text-black hover:!bg-gray-100"
                >
                  Klicka här för att chatta med oss
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}


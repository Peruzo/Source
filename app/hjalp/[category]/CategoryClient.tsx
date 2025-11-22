'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import {
  faqCategories,
  FAQCategory,
  FAQItem,
} from '@/lib/data/faqData';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

interface CategoryClientProps {
  category: FAQCategory;
  categoryId: string;
}

export function CategoryClient({ category, categoryId }: CategoryClientProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  useEffect(() => {
    // Handle anchor links
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setExpandedFAQ(hash);
          }
        }, 100);
      }
    }
  }, []);

  // Group questions by subcategory
  const questionsBySubcategory = category.questions.reduce(
    (acc, question) => {
      const subcat = question.subcategory || 'Övrigt';
      if (!acc[subcat]) {
        acc[subcat] = [];
      }
      acc[subcat].push(question);
      return acc;
    },
    {} as Record<string, FAQItem[]>
  );

  return (
    <>
      {/* Header - Minimalist */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-200">
        <Container>
          <Link
            href="/hjalp"
            className="text-gray-600 hover:text-black font-medium inline-flex items-center gap-2 mb-6 text-sm"
          >
            ← Tillbaka till hjälpcenter
          </Link>

          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">
              {category.name}
            </h1>
            <p className="text-base text-gray-600">
              {category.questions.length} frågor
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Questions - Minimalist */}
      <section className="py-12 md:py-16 bg-white">
        <Container size="lg">
          <div className="space-y-10">
            {Object.entries(questionsBySubcategory).map(
              ([subcategory, questions], subIndex) => (
                <div key={subcategory}>
                  <FadeIn>
                    <h2 className="text-xl md:text-2xl font-bold text-black mb-6">
                      {subcategory}
                    </h2>
                  </FadeIn>

                  <div className="space-y-1">
                    {questions.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        id={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: (subIndex * 0.05) + (index * 0.02),
                          duration: 0.3,
                        }}
                        className="border-b border-gray-200 last:border-0"
                      >
                        <button
                          onClick={() =>
                            setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                          }
                          className="w-full py-5 px-0 flex justify-between items-center text-left hover:opacity-70 transition-opacity duration-200 group"
                        >
                          <span className="font-medium text-base md:text-lg text-black pr-4">
                            {faq.question}
                          </span>
                          <motion.span
                            animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400 flex-shrink-0 text-xl group-hover:text-gray-600"
                          >
                            ↓
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {expandedFAQ === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.2,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5 text-gray-600 leading-relaxed text-base">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </section>

      {/* Related Categories - Minimalist */}
      <section className="py-12 md:py-16 bg-gray-50">
        <Container>
          <FadeIn className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Andra kategorier
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faqCategories
              .filter((cat) => cat.id !== categoryId)
              .slice(0, 6)
              .map((cat, index) => {
                const exampleQuestions = cat.questions.slice(0, 2);
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    <Link
                      href={`/hjalp/${cat.id}`}
                      className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 h-full"
                    >
                      <h3 className="font-bold text-lg mb-3 text-black">
                        {cat.name}
                      </h3>
                      <ul className="space-y-1.5 mb-3">
                        {exampleQuestions.map((question) => (
                          <li
                            key={question.id}
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            {question.question}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-100">
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
        <Container>
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


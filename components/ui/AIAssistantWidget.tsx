'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, HomeIcon, QuestionMarkCircleIcon, ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  showFloatingButton?: boolean;
}

const suggestedTopics = [
  {
    id: 'vad-ar-source',
    title: 'Vad är Source?',
  },
  {
    id: 'hur-fungerar-plattformen',
    title: 'Hur fungerar plattformen?',
  },
  {
    id: 'hur-lagger-jag-till-produkter',
    title: 'Hur lägger jag till produkter?',
  },
  {
    id: 'hur-nar-jag-supporten',
    title: 'Hur når jag supporten?',
  },
];

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistantWidget({ isOpen, onClose, onOpen, showFloatingButton = true }: AIAssistantWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'hem' | 'hjalp' | 'meddelanden'>('hjalp');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const welcomeMessageAdded = useRef(false);
  const router = useRouter();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when widget is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const handleTopicClick = (topicId: string) => {
    // Map topic IDs to their categories
    const topicCategoryMap: Record<string, string> = {
      'vad-ar-source': 'kom-igang',
      'hur-fungerar-plattformen': 'kom-igang',
      'hur-lagger-jag-till-produkter': 'webbutik-produktadministration',
      'hur-nar-jag-supporten': 'support-hjalp',
    };
    
    const category = topicCategoryMap[topicId] || 'kom-igang';
    onClose();
    router.push(`/hjalp/${category}#${topicId}`);
  };

  const handleSendMessage = () => {
    setActiveTab('meddelanden');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'meddelanden' && messages.length === 0 && isOpen && !welcomeMessageAdded.current) {
      // Add welcome message when first opening chat
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: 'Hej! Jag är här för att hjälpa dig. Vad kan jag hjälpa dig med idag?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      welcomeMessageAdded.current = true;
    }
  }, [activeTab, isOpen, messages.length]);

  useEffect(() => {
    if (activeTab === 'meddelanden') {
      scrollToBottom();
      // Focus input when switching to messages tab
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [activeTab, messages]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // TODO: Replace with actual API call
    // For now, simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Tack för ditt meddelande! Vi kommer att integrera AI-funktionalitet här snart.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      {showFloatingButton && !isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-[10000] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#00BFA6] to-[#00806D] text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-[#00BFA6]/50 transition-all group"
          aria-label="Öppna chatt"
        >
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 bg-[#00BFA6] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <ChatBubbleLeftRightIcon className="w-6 h-6 md:w-7 md:h-7 relative z-10 group-hover:scale-110 transition-transform" />
        </motion.button>
      )}

      {/* Widget Popup */}
      <AnimatePresence>
        {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001]"
            onClick={onClose}
          />

          {/* Widget */}
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-4 md:inset-auto md:bottom-4 md:right-4 md:top-auto md:w-[420px] md:h-[600px] md:max-w-[calc(100vw-2rem)] md:max-h-[calc(100vh-2rem)] z-[10002] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header - Green/Black Background */}
            <div className="bg-black text-white p-6 pb-8 relative overflow-hidden">
              {/* Green accent gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6]/30 via-transparent to-[#00BFA6]/10" />
              <div className="relative z-10">
              {/* Top Bar with Logo and Close */}
              <div className="flex items-center justify-between mb-6">
                {/* Logo */}
                <div className="flex items-center">
                  <Image
                    src="/source-logo.png"
                    alt="Source"
                    width={300}
                    height={120}
                    className="h-24 md:h-32 w-auto brightness-0 invert opacity-90"
                    priority
                    unoptimized
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Stäng"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Greeting */}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Hej
                </h2>
                <p className="text-white/90 text-base">
                  Hur kan vi hjälpa till?
                </p>
              </div>
              </div>
            </div>

            {/* Content Area - White Background */}
            <div className="flex-1 overflow-y-auto bg-white">
              {activeTab === 'meddelanden' ? (
                /* Chat Interface */
                <div className="flex flex-col h-full">
                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                        <div className="w-16 h-16 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mb-4">
                          <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-[#00BFA6]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Starta en konversation
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                          Skriv ett meddelande nedan så hjälper vi dig med dina frågor.
                        </p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.sender === 'user'
                                  ? 'bg-[#00BFA6] text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.text}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 bg-white p-4">
                    <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Skriv ditt meddelande..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]/20 transition-all text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isTyping}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00BFA6] text-white hover:bg-[#00806D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Skicka meddelande"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* Help Interface */
                <div className="p-6 space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Sök efter hjälp"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]/20 transition-all"
                    />
                  </div>

                  {/* Suggested Topics */}
                  <div className="space-y-2">
                    {suggestedTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.id)}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00BFA6] hover:bg-[#00BFA6]/5 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700 font-medium group-hover:text-[#00BFA6] transition-colors">
                            {topic.title}
                          </span>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-[#00BFA6] transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Direct Message Button */}
                  <button
                    onClick={handleSendMessage}
                    className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-[#00BFA6] bg-[#00BFA6]/10 hover:bg-[#00BFA6] hover:text-white transition-all group"
                  >
                    <span className="font-semibold text-[#00BFA6] group-hover:text-white transition-colors">
                      Skicka ett meddelande till oss
                    </span>
                    <svg
                      className="w-5 h-5 text-[#00BFA6] group-hover:text-white transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="border-t border-gray-200 bg-white">
              <div className="flex items-center justify-around">
                {/* Home */}
                <button
                  onClick={() => setActiveTab('hjalp')}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors gap-1 ${
                    activeTab === 'hjalp'
                      ? 'text-[#00BFA6]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">Hem</span>
                </button>

                {/* Help */}
                <button
                  onClick={() => setActiveTab('hjalp')}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors gap-1 ${
                    activeTab === 'hjalp'
                      ? 'text-[#00BFA6]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <QuestionMarkCircleIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">Hjälp</span>
                </button>

                {/* Messages */}
                <button
                  onClick={() => setActiveTab('meddelanden')}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors gap-1 ${
                    activeTab === 'meddelanden'
                      ? 'text-[#00BFA6]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">Meddelanden</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
}


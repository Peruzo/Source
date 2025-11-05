'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { MegaMenu } from '@/components/ui/MegaMenu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);  // Trigger background at 50px
      handleMenuLeave(); // Close dropdown on scroll
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('nav')) {
        handleMenuLeave();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Hem', hasMenu: false },
    { href: '/tjanster', label: 'Tjänster', hasMenu: true, menuKey: 'tjanster' },
    { href: '/portfolio', label: 'Portfolio', hasMenu: true, menuKey: 'portfolio' },
    { href: '/om-oss', label: 'Om oss', hasMenu: true, menuKey: 'om-oss' },
    { href: '/priser', label: 'Priser', hasMenu: true, menuKey: 'priser' },
    { href: '/kontakt', label: 'Kontakt', hasMenu: true, menuKey: 'kontakt' },
  ];

  const handleMenuEnter = useCallback((menuKey: string | null) => {
    if (menuKey && activeMenu !== menuKey) {
      setActiveMenu(menuKey);
    }
  }, [activeMenu]);

  const handleMenuLeave = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveMenu(null);
      setIsMenuOpen(false);
    }
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex justify-between items-center h-12 md:h-14 lg:h-16">
          {/* Logo */}
          <div className="logo">
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="transition-all duration-300"
              >
                <Image
                  src="/source-logo.png"
                  alt="Source - Everything You Need in One Place"
                  width={120}
                  height={48}
                  className={`logo-img ${isScrolled ? 'logo-dark' : 'logo-light'}`}
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center" role="navigation" aria-label="Main navigation">
            <div
              onMouseLeave={handleMenuLeave}
              className="relative"
            >
              <ul className="flex gap-6 lg:gap-8">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="relative group"
                    onMouseEnter={() => {
                      if (link.hasMenu) {
                        handleMenuEnter(link.menuKey || null);
                      }
                    }}
                  >
                    {/* Expanded clickable area wrapper */}
                    <div className="relative flex items-center px-4 -mx-4 h-14">
                      <Link
                        href={link.href}
                        className={`relative text-sm lg:text-base font-medium transition-colors duration-200 ${
                          isScrolled ? 'text-gray-900 hover:text-emerald-600' : 'text-white hover:text-emerald-300'
                        }`}
                        aria-expanded={link.hasMenu ? activeMenu === link.menuKey : undefined}
                      >
                        {link.label}
                        {/* Visual indicator for dropdown items */}
                        {link.hasMenu && (
                          <svg 
                            className="inline-block w-3 h-3 ml-1 transition-transform group-hover:translate-y-0.5" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                          isScrolled ? 'bg-emerald-600' : 'bg-emerald-300'
                        }`}></span>
                      </Link>
                    </div>
                    
                    {/* Dropdown with hover bridge */}
                    {link.hasMenu && link.menuKey && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                        {/* Invisible hover bridge */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-transparent" />
                        <MegaMenu
                          menuKey={link.menuKey}
                          isOpen={activeMenu === link.menuKey}
                          onClose={handleMenuLeave}
                        />
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://portal.source.com"
              className={`border-2 rounded-lg font-semibold transition-all duration-300 px-4 lg:px-5 py-2 lg:py-2.5 text-sm lg:text-base ${
                isScrolled
                  ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                  : 'border-emerald-300 text-emerald-300 hover:bg-emerald-300 hover:text-white'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kundportal
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className={`md:hidden w-11 h-11 flex items-center justify-center transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-12 bg-white/95 backdrop-blur-lg"
          >
            <nav className="px-6 py-8 h-full overflow-y-auto" role="navigation" aria-label="Mobile navigation">
              <ul className="space-y-6">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-900 hover:text-emerald-600 transition-colors text-xl font-medium block py-3"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                  className="pt-6 border-t border-white/10"
                >
                  <a
                    href="https://portal.source.com"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors text-xl font-medium block py-3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Till kundportalen →
                  </a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

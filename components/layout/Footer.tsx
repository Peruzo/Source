'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/tjanster', label: 'Tjänster' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/om-oss', label: 'Om oss' },
    { href: '/priser', label: 'Priser' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <footer className="bg-black-secondary text-gray-300 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <FadeIn delay={0}>
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-white font-bold text-2xl mb-3 cursor-pointer inline-block"
              >
                SOURCE
              </motion.div>
              <p className="text-gray-400 text-sm mb-4">
                Allt du behöver på ett ställe
              </p>
              <div className="flex gap-4">
                {/* Social media icons - placeholder */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-teal/20 transition-colors"
                >
                  <span className="text-sm">LI</span>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-teal/20 transition-colors"
                >
                  <span className="text-sm">𝕏</span>
                </motion.a>
              </div>
            </div>
          </FadeIn>

          {/* Navigation Column */}
          <FadeIn delay={0.1}>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigering</h4>
              <ul className="space-y-3">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-teal transition-colors text-sm inline-block relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-teal transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Customer Portal Column */}
          <FadeIn delay={0.2}>
            <div>
              <h4 className="text-white font-semibold mb-4">För kunder</h4>
              <ul className="space-y-3">
                <li>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="https://portal.source.com"
                    className="text-teal hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Till kundportalen</span>
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </motion.a>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Contact Column */}
          <FadeIn delay={0.3}>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:help@source.com"
                    className="text-gray-400 hover:text-teal transition-colors text-sm block"
                  >
                    help@source.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+46733221212"
                    className="text-gray-400 hover:text-teal transition-colors text-sm block"
                  >
                    +46 73 322 12 12
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Source. Alla rättigheter förbehållna.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-teal transition-colors">
                Integritet
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-teal transition-colors">
                Villkor
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

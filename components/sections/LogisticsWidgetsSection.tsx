'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  CubeIcon,
  ArrowPathIcon,
  TruckIcon,
  InboxIcon,
  MapPinIcon,
  CheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

// Tab views for the interactive card
const tabViews = {
  orders: [
    { name: 'Ny beställning', amount: '12 st', icon: 'package', active: true },
    { name: 'Pågående', amount: '8 st', icon: 'refresh', active: false },
  ],
  shipping: [
    { name: 'PostNord Express', amount: '5 st', icon: 'truck', active: true },
    { name: 'PostNord Standard', amount: '3 st', icon: 'inbox', active: false },
  ],
  status: [
    { name: 'På väg', amount: '7 st', icon: 'location', active: true },
    { name: 'Levererat', amount: '13 st', icon: 'check', active: false },
  ],
};

// Icon mapping
const iconMap = {
  package: CubeIcon,
  refresh: ArrowPathIcon,
  truck: TruckIcon,
  inbox: InboxIcon,
  location: MapPinIcon,
  check: CheckIcon,
  bolt: BoltIcon,
};

export function LogisticsWidgetsSection() {
  const [activeTab, setActiveTab] = useState<'orders' | 'shipping' | 'status'>('orders');

  const currentView = tabViews[activeTab];

  return (
    <section className="relative overflow-hidden bg-white text-[#111111] py-28 md:py-36 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-12 lg:gap-16 items-start">
          {/* Left Column - Widgets Display Area */}
          <div className="relative">
            {/* Widgets Container - Large visual area with rounded corners */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[600px] overflow-hidden rounded-[32px] border border-black/10 bg-[#f7f8fb] p-8"
            >
              {/* Widgets Grid - Visual representation */}
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Widget 1: Ny beställning */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal/15">
                    <CubeIcon className="h-10 w-10 text-teal" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Ny beställning</h3>
                  <p className="text-xs text-gray-500">Skapa ny</p>
                </motion.div>

                {/* Widget 2: Frakta med PostNord */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal/15">
                    <TruckIcon className="h-10 w-10 text-teal" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Frakta med PostNord</h3>
                  <p className="text-xs text-gray-500">Integrerad</p>
                </motion.div>

                {/* Widget 3: Express/Standard */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal/15">
                    <BoltIcon className="h-10 w-10 text-teal" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Express/Standard</h3>
                  <p className="text-xs text-gray-500">Välj leverans</p>
                </motion.div>

                {/* Widget 4: Status påväg */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal/15">
                    <MapPinIcon className="h-10 w-10 text-teal" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Status påväg</h3>
                  <p className="text-xs text-gray-500">Realtid</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Interactive Card - Overlapping bottom-left of widgets container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 z-10 w-full max-w-[280px] rounded-2xl border border-black/10 bg-white p-5 shadow-2xl"
            >
              <div className="space-y-4">
                {currentView.map((item, index) => {
                  const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-teal flex items-center justify-center">
                        {item.active ? (
                          <CheckIcon className="w-6 h-6 text-white" />
                        ) : (
                          IconComponent && <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.amount}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Navigation Buttons - Below card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-3 mt-8 ml-0"
            >
              <button
                onClick={() => setActiveTab('orders')}
                className={`
                  px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                  ${
                    activeTab === 'orders'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }
                `}
              >
                Beställningar
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`
                  px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                  ${
                    activeTab === 'shipping'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }
                `}
              >
                Frakt
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`
                  px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                  ${
                    activeTab === 'status'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }
                `}
              >
                Status
              </button>
            </motion.div>
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-6 lg:pt-0">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Full kontroll över din logistik
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Ge ditt team verktygen som krävs för att organisera leveranser med våra logistikwidgets. 
                Med dessa anpassade funktioner kan ni hantera beställningar, frakt och leveransstatus – 
                oavsett om det handlar om en ny beställning eller att spåra en expressleverans.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-base md:text-lg text-gray-500">
                Alla logistikwidgets är integrerade i realtid och synkar automatiskt med dina partners.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link href="/logistik" className="inline-block mt-6 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-gray-800">
                Kom igång med logistik
              </Link>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}


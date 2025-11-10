'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useRef, useState } from 'react';

interface MetricData {
  label: string;
  value: number;
  suffix?: string;
  change: number;
}

interface ActivityItem {
  title: string;
  time: string;
  icon: string;
}

export function PortalDashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '0px' });
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // Generic metrics data - NO real user data
  const metrics: MetricData[] = [
    { label: 'Försäljning idag', value: 12450, suffix: ' kr', change: 8.2 },
    { label: 'Nya kunder', value: 8, change: 12.5 },
    { label: 'Konvertering', value: 3.2, suffix: '%', change: -2.1 },
    { label: 'Genomsnittligt värde', value: 1856, suffix: ' kr', change: 5.4 },
  ];

  // Generic activity data - NO real user data
  const activities: ActivityItem[] = [
    { title: 'Ny betalning mottagen', time: '2 min sedan', icon: '💳' },
    { title: 'Rapport genererad', time: '15 min sedan', icon: '📊' },
    { title: 'Kund registrerad', time: '1 timme sedan', icon: '👤' },
  ];

  // Generic chart data - bars for last 7 days
  const chartData = [65, 78, 70, 85, 75, 90, 82];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01 }}
      className="portal-preview-container relative"
    >
      {/* Subtle preview badge */}
      <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm z-10">
        Förhandsvisning
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <div className="portal-sidebar">
          <div className="logo">
            <a href="/hem" style={{ display: 'block', textAlign: 'center' }}>
              <Image
                src="/source-logo.png"
                alt="Logotyp"
                width={120}
                height={50}
                style={{
                  maxWidth: '120px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'block'
                }}
                className="logo-img"
                priority
              />
            </a>
          </div>
          <nav className="portal-nav" role="navigation" aria-label="Portal navigation">
            <div className="portal-nav-item active">
              <div className="portal-nav-icon">📊</div>
              <span>Översikt</span>
            </div>
            <div className="portal-nav-item">
              <div className="portal-nav-icon">💳</div>
              <span>Betalningar</span>
            </div>
            <div className="portal-nav-item">
              <div className="portal-nav-icon">📈</div>
              <span>Analyser</span>
            </div>
            <div className="portal-nav-item">
              <div className="portal-nav-icon">👥</div>
              <span>Kunder</span>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="portal-main">
          {/* Header */}
          <div className="portal-header">
            <h1 className="portal-h1" style={{ margin: 0 }}>Översikt</h1>
            <div 
              className="portal-profile-icon" 
              aria-label="User profile"
              onClick={() => setSelectedMetric(null)}
              style={{ cursor: 'pointer' }}
            >
              JD
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="portal-metrics-grid">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="portal-metric-card"
                role="article"
                aria-label={`${metric.label}: ${metric.value}${metric.suffix || ''}`}
                onClick={() => setSelectedMetric(selectedMetric === i ? null : i)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div className="portal-metric-label">{metric.label}</div>
                <div className="portal-metric-value">
                  <AnimatedCounter
                    end={metric.value}
                    suffix={metric.suffix}
                    duration={1}
                  />
                </div>
                <span
                  className={`portal-metric-change ${
                    metric.change > 0 ? 'up' : 'down'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {selectedMetric === i && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg"
                    >
                      Klicka för mer detaljer
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Chart Card */}
          <div
            className="portal-chart-card"
            role="figure"
            aria-label="Sales chart for the last 7 days"
          >
            <div className="portal-chart-header">
              <h3 className="portal-chart-title">Försäljning senaste 7 dagarna</h3>
              <span className="portal-small text-gray-500">
                Uppdaterad: Just nu
              </span>
            </div>
            <div className="portal-chart-container">
              <div className="portal-mini-bars">
                {chartData.map((height, i) => (
                  <div
                    key={i}
                    className="portal-mini-bar animate-bar-grow"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${i * 0.02}s`,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => setSelectedBar(selectedBar === i ? null : i)}
                    aria-label={`Day ${i + 1}: ${height}%`}
                  >
                    {/* Bar tooltip */}
                    <AnimatePresence>
                      {selectedBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg"
                        >
                          {height}%
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div
            className="portal-activity-list"
            role="list"
            aria-label="Recent activity"
          >
            <h3 className="portal-h3" style={{ marginBottom: '12px' }}>
              Senaste aktiviteten
            </h3>
            {activities.map((activity, i) => (
              <div
                key={i}
                className="portal-activity-item"
                role="listitem"
                style={{ cursor: 'pointer' }}
              >
                <div className="portal-activity-icon" aria-hidden="true">
                  {activity.icon}
                </div>
                <div className="portal-activity-content">
                  <div className="portal-activity-title">{activity.title}</div>
                  <div className="portal-activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


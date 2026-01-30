'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  change: number;
  changeType: 'up' | 'down' | 'neutral';
}

const beforeMetrics: Metric[] = [
  { label: 'Konvertering', value: 2.5, suffix: '%', change: 0, changeType: 'neutral' },
  { label: 'Cart abandonment', value: 75, suffix: '%', change: 0, changeType: 'neutral' },
  { label: 'Genomsnittligt ordervärde', value: 1750, suffix: ' kr', change: 0, changeType: 'neutral' },
  { label: 'Analystid per vecka', value: 8, suffix: ' h', change: 0, changeType: 'neutral' },
];

const afterMetrics: Metric[] = [
  { label: 'Konvertering', value: 5.0, suffix: '%', change: 100, changeType: 'up' },
  { label: 'Cart abandonment', value: 45, suffix: '%', change: -40, changeType: 'down' },
  { label: 'Genomsnittligt ordervärde', value: 2625, suffix: ' kr', change: 50, changeType: 'up' },
  { label: 'Analystid per vecka', value: 0, suffix: ' h', change: -100, changeType: 'up' },
];

function MetricCard({ 
  metric, 
  isAfter, 
  index 
}: { 
  metric: Metric; 
  isAfter: boolean; 
  index: number;
}) {
  // Special handling för cart abandonment och analys tid
  const isCartAbandonment = metric.label === 'Cart abandonment';
  const isAnalysisTime = metric.label === 'Analystid per vecka';
  
  // Bestäm change color och text baserat på metric
  let changeColor = 'text-gray-400';
  let changeText = '';
  let changeIcon = '';
  
  if (!isAfter) {
    // Före: ingen change indicator
    changeColor = 'text-gray-400';
    changeText = '';
  } else if (isCartAbandonment) {
    // Cart abandonment: negativ change är positivt resultat
    changeColor = 'text-green-400';
    changeIcon = '↓';
    changeText = `${Math.abs(metric.change)}% färre`;
  } else if (isAnalysisTime) {
    // Analys tid: negativ change är positivt resultat
    changeColor = 'text-green-400';
    changeIcon = '↑';
    changeText = 'Automatiserad';
  } else {
    // Normal metrics: använd changeType
    changeColor = 
      metric.changeType === 'up' ? 'text-green-400' :
      metric.changeType === 'down' ? 'text-red-400' :
      'text-gray-400';
    
    changeIcon = 
      metric.changeType === 'up' ? '↑' :
      metric.changeType === 'down' ? '↓' :
      '';
    
    changeText = `${metric.change > 0 ? '+' : ''}${metric.change}%`;
  }

  const cardClassName = isAfter
    ? 'bg-teal/10 border-teal/30'
    : 'bg-gray-800/40 border-gray-700/50';

  const valueClassName = isAfter
    ? 'text-teal'
    : 'text-gray-300';

  const labelClassName = isAfter
    ? 'text-teal/80'
    : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      <GlassCard
        className={`${cardClassName} relative p-6 md:p-8`}
        hover={false}
      >
        {/* Change indicator - visa bara för "Efter" */}
        {isAfter && changeText && (
          <div className={`absolute top-4 right-4 ${changeColor} text-xs font-semibold flex items-center gap-1`}>
            {changeIcon && <span>{changeIcon}</span>}
            <span>{changeText}</span>
          </div>
        )}

        {/* Value */}
        <div className={`${valueClassName} text-3xl md:text-4xl font-bold mb-2`}>
          <AnimatedCounter
            end={metric.value}
            suffix={metric.suffix}
            duration={2}
          />
        </div>

        {/* Label */}
        <p className={`${labelClassName} text-sm md:text-base`}>
          {metric.label}
        </p>
      </GlassCard>
    </motion.div>
  );
}

export function SplitScreenComparison() {
  return (
    <FadeIn delay={0.3}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Före Side */}
        <div className="space-y-4">
          <h3 className="text-gray-500 text-sm uppercase mb-4 tracking-wider">
            Genomsnittlig e-handlare
          </h3>
          {beforeMetrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              isAfter={false}
              index={index}
            />
          ))}
        </div>

        {/* Efter Side */}
        <div className="space-y-4">
          <h3 className="text-teal text-sm uppercase mb-4 tracking-wider">
            Med Source
          </h3>
          {afterMetrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              isAfter={true}
              index={index}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}


'use client';

import { motion } from 'framer-motion';

const services = [
  {
    label: 'Design',
    desc: 'AI-driven design',
  },
  {
    label: 'Development',
    desc: 'Snabb utveckling',
  },
  {
    label: 'Analytics',
    desc: 'Smarta insikter',
  },
];

export function LogoHeroShowcase() {
  return (
    <div className="relative h-80 md:h-96 lg:h-[32rem] bg-gradient-to-br from-black via-black-secondary to-black border border-white/10 rounded-2xl overflow-hidden">
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      {/* Glödande orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Huvudinnehåll */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
        {/* SOURCE logotyp */}
        <motion.div
          className="mb-12 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white">
              SOURCE
            </h2>
          </motion.div>

          {/* Glow effekt */}
          <motion.div
            className="absolute inset-0 blur-2xl bg-teal/20 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Tjänste-ikoner */}
        <div className="grid grid-cols-3 gap-8 lg:gap-12 mb-10">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30 flex items-center justify-center mb-3">
                <div className="w-6 h-6 bg-teal rounded-full"></div>
              </div>

              <h3 className="font-semibold text-white text-sm mb-1">
                {service.label}
              </h3>
              <p className="text-xs text-gray-400">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-gray-300 font-light">
            Everything You Need in One Place
          </p>
        </motion.div>
      </div>
    </div>
  );
}

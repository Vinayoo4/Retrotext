import { motion } from 'framer-motion';
import React from 'react';

export const Logo = () => {
  const glowAnimation = {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  const pathDraw = {
    initial: { pathLength: 0 },
    animate: {
      pathLength: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      className="relative w-32 h-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      aria-hidden="true"
    >
      {/* Blurred glowing background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300"
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          filter: 'blur(20px)',
        }}
        animate={glowAnimation}
      />

      {/* Centered SVG logo */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ mixBlendMode: 'overlay' }}>
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }}
        >
          <motion.path
            d="M50 10 L90 90 L10 90 Z"
            fill="none"
            stroke="gold"
            strokeWidth="2"
            {...pathDraw}
          />
        </svg>
      </div>
    </motion.div>
  );
};

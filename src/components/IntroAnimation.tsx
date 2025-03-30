import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#2c2c2c] z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative w-80 h-96 ancient-paper rounded-lg overflow-hidden page-flip"
            initial={{ rotateY: 90, x: -100 }}
            animate={{ rotateY: 0, x: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.div
                className="text-center"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
              >
                <motion.h1
                  className="text-4xl font-serif text-[#2c2c2c] ink-text text-shadow-elegant mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, duration: 1, type: "spring" }}
                >
                  Retro Notes
                </motion.h1>
                <motion.div
                  className="w-16 h-1 bg-amber-800/30 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute inset-0 leather-texture opacity-20"
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.05, 1],
                transition: { duration: 3, repeat: Infinity }
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
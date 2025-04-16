import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      onComplete();
    }, 900);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative w-80 h-96 bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl shadow-indigo-500/20"
            initial={{ rotateY: 90, x: -100 }}
            animate={{ rotateY: 0, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="text-center"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
              >
                <motion.h1
                  className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                >
                  Retro Notes
                </motion.h1>
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.05, 1],
                transition: { duration: 1.5, repeat: Infinity }
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface BossVictoryBannerProps {
  show: boolean;
  onClose: () => void;
}

export const BossVictoryBanner = ({ show, onClose }: BossVictoryBannerProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Dark vignette overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 20%, hsl(0 0% 0% / 0.7) 70%, hsl(0 0% 0% / 0.9) 100%)
              `,
            }}
          />

          {/* Golden light rays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.6, 0.3], scale: [0.8, 1.2, 1] }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 2, times: [0, 0.3, 1] }}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at center, hsl(45 80% 50% / 0.15) 0%, transparent 50%)
              `,
            }}
          />

          {/* Main banner container */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative"
          >
            {/* Decorative lines */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] h-px"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(45 80% 55%) 50%, transparent 100%)',
              }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] h-px"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(45 80% 55%) 50%, transparent 100%)',
              }}
            />

            {/* Text container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="px-12 py-6"
            >
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 1, delay: 0.8 }}
                className="font-display text-2xl sm:text-4xl md:text-5xl text-center tracking-[0.3em] uppercase"
                style={{
                  color: 'hsl(45 80% 55%)',
                  textShadow: `
                    0 0 30px hsl(45 80% 50% / 0.8),
                    0 0 60px hsl(45 80% 50% / 0.5),
                    0 0 90px hsl(45 80% 50% / 0.3),
                    0 2px 4px hsl(0 0% 0% / 0.9)
                  `,
                }}
              >
                Heir of Fire
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, letterSpacing: '0.8em' }}
                animate={{ opacity: 1, letterSpacing: '0.5em' }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="font-display text-3xl sm:text-5xl md:text-6xl text-center tracking-[0.5em] uppercase mt-2"
                style={{
                  color: 'hsl(45 90% 60%)',
                  textShadow: `
                    0 0 40px hsl(45 80% 50% / 0.9),
                    0 0 80px hsl(45 80% 50% / 0.6),
                    0 0 120px hsl(35 90% 50% / 0.4),
                    0 4px 8px hsl(0 0% 0% / 0.9)
                  `,
                }}
              >
                Destroyed
              </motion.h2>
            </motion.div>
          </motion.div>

          {/* Floating ember particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * 400 - 200,
                y: 100 + Math.random() * 100,
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -200 - Math.random() * 200,
                x: Math.random() * 400 - 200,
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                delay: 0.5 + Math.random() * 1.5,
                ease: 'easeOut'
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(${40 + Math.random() * 20} 90% ${50 + Math.random() * 20}%)`,
                boxShadow: `0 0 ${4 + Math.random() * 4}px hsl(45 80% 50% / 0.8)`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

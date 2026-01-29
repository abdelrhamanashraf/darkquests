import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface YouDiedOverlayProps {
  show: boolean;
  onClose: () => void;
}

export const YouDiedOverlay = ({ show, onClose }: YouDiedOverlayProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
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
          style={{
            background: 'radial-gradient(ellipse at center, rgba(20,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)',
          }}
        >
          {/* Blood vignette effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(139,0,0,0.4) 100%)',
            }}
          />

          {/* YOU DIED text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.5em' }}
            animate={{ 
              opacity: [0, 1, 1, 0.9],
              scale: [0.8, 1.02, 1, 1],
              letterSpacing: ['0.5em', '0.4em', '0.35em', '0.35em']
            }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.3, 0.5, 1],
              ease: 'easeOut'
            }}
            className="relative"
          >
            {/* Glow behind text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.5] }}
              transition={{ duration: 2, times: [0, 0.4, 1] }}
              className="absolute inset-0 blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(180,30,30,0.6) 0%, transparent 70%)',
                transform: 'scale(2)',
              }}
            />
            
            <h1
              className="relative font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.35em] select-none"
              style={{
                color: '#8B0000',
                textShadow: `
                  0 0 20px rgba(139,0,0,0.8),
                  0 0 40px rgba(139,0,0,0.6),
                  0 0 60px rgba(139,0,0,0.4),
                  0 0 80px rgba(139,0,0,0.2),
                  0 2px 4px rgba(0,0,0,0.8)
                `,
              }}
            >
              YOU DIED
            </h1>
          </motion.div>

          {/* Subtle particle/ember effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  y: '100vh',
                  x: `${10 + Math.random() * 80}vw`,
                }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  y: '-20vh',
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 1.5,
                  ease: 'easeOut',
                }}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `rgba(${150 + Math.random() * 50}, ${Math.random() * 30}, 0, 0.8)`,
                  boxShadow: '0 0 6px rgba(139,0,0,0.8)',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

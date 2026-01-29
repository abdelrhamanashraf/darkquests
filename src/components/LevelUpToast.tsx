import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface LevelUpToastProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export const LevelUpToast = ({ show, level, onClose }: LevelUpToastProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          onAnimationComplete={() => {
            setTimeout(onClose, 3000);
          }}
        >
          <div className="glass-panel-glow rounded-xl px-6 py-4 flex items-center gap-4 border-2 border-gold/30">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="p-3 rounded-lg bg-gold/20"
            >
              <Trophy className="w-8 h-8 text-gold" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="rpg-heading text-sm text-gold">Level Up!</h3>
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              </div>
              <p className="text-sm text-foreground mt-1">
                You've reached <span className="font-bold text-gold">Level {level}</span>!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

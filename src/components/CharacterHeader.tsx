import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Coins, Sparkles, Shield } from 'lucide-react';
import { PlayerStats, getXpProgress, getXpForNextLevel } from '@/types/game';

interface CharacterHeaderProps {
  stats: PlayerStats;
}

export const CharacterHeader = ({ stats }: CharacterHeaderProps) => {
  const xpProgress = getXpProgress(stats.xp);
  const xpNeeded = getXpForNextLevel(stats.level);
  const progressPercent = (xpProgress / xpNeeded) * 100;

  // Smooth spring animation for progress bar
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animate gold counter
  const springGold = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  const displayGold = useTransform(springGold, (value) => Math.round(value));

  useEffect(() => {
    springProgress.set(progressPercent);
  }, [progressPercent, springProgress]);

  useEffect(() => {
    springGold.set(stats.gold);
  }, [stats.gold, springGold]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="avatar-frame animate-pulse-glow">
            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          
          {/* Level Badge */}
          <motion.div 
            className="level-badge"
            key={stats.level}
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-display text-xs text-primary-foreground">
              {stats.level}
            </span>
          </motion.div>
        </div>

        {/* XP Bar Section */}
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Experience
            </span>
            <div className="flex items-center gap-1 text-xp">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-semibold">
                {xpProgress} / {xpNeeded} XP
              </span>
            </div>
          </div>
          
          <div className="xp-bar-container relative overflow-hidden">
            {/* Animated background glow */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                width: useTransform(springProgress, (v) => `${v}%`),
                background: 'linear-gradient(90deg, transparent, hsl(160 84% 50% / 0.5), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Main progress bar */}
            <motion.div 
              className="xp-bar-fill progress-glow-xp relative"
              style={{
                width: useTransform(springProgress, (v) => `${v}%`),
              }}
            >
              {/* Shimmer effect on the bar */}
              <div className="absolute inset-0 animate-shimmer opacity-40" />
            </motion.div>
          </div>
          
          <div className="mt-1 text-xs text-muted-foreground">
            Level {stats.level} Hero
          </div>
        </div>

        {/* Gold Display */}
        <motion.div 
          className="gold-display"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Coins className="w-5 h-5 text-gold" />
          <motion.span className="gold-text font-display text-sm">
            {displayGold}
          </motion.span>
        </motion.div>
      </div>
    </motion.header>
  );
};

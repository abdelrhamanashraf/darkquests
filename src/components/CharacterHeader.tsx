import { motion } from 'framer-motion';
import { Coins, Sparkles, Shield } from 'lucide-react';
import { PlayerStats, getXpProgress, getXpForNextLevel } from '@/types/game';

interface CharacterHeaderProps {
  stats: PlayerStats;
}

export const CharacterHeader = ({ stats }: CharacterHeaderProps) => {
  const xpProgress = getXpProgress(stats.xp);
  const xpNeeded = getXpForNextLevel(stats.level);
  const progressPercent = (xpProgress / xpNeeded) * 100;

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
          <div className="level-badge animate-float">
            <span className="font-display text-xs text-primary-foreground">
              {stats.level}
            </span>
          </div>
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
          
          <div className="xp-bar-container">
            <motion.div 
              className="xp-bar-fill progress-glow-xp"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
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
          <span className="gold-text font-display text-sm">
            {stats.gold}
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
};

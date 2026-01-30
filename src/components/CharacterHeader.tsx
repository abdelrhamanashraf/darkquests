import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Flame, Sparkles, Skull } from 'lucide-react';
import { PlayerStats, getXpProgress, getXpForNextLevel } from '@/types/game';
import { UserInventoryItem } from '@/types/store';

interface CharacterHeaderProps {
  stats: PlayerStats;
  equippedIcon?: UserInventoryItem | null;
  equippedTitle?: UserInventoryItem | null;
  equippedBanner?: UserInventoryItem | null;
  equippedCosmetic?: UserInventoryItem | null;
}

export const CharacterHeader = ({ stats, equippedIcon, equippedTitle, equippedBanner, equippedCosmetic }: CharacterHeaderProps) => {
  const xpProgress = getXpProgress(stats.xp);
  const xpNeeded = getXpForNextLevel(stats.level);
  const progressPercent = (xpProgress / xpNeeded) * 100;

  // Smooth spring animation for progress bar
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animate souls counter
  const springSouls = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  const displaySouls = useTransform(springSouls, (value) => Math.round(value));

  useEffect(() => {
    springProgress.set(progressPercent);
  }, [progressPercent, springProgress]);

  useEffect(() => {
    springSouls.set(stats.gold);
  }, [stats.gold, springSouls]);

  // Get cosmetic border style
  const getCosmeticBorderClass = () => {
    if (!equippedCosmetic?.store_items?.name) return '';
    const name = equippedCosmetic.store_items.name.toLowerCase();
    if (name.includes('ember') || name.includes('fire')) return 'cosmetic-border-ember';
    if (name.includes('frost') || name.includes('ice')) return 'cosmetic-border-frost';
    if (name.includes('abyss') || name.includes('dark')) return 'cosmetic-border-abyss';
    if (name.includes('gold') || name.includes('sun')) return 'cosmetic-border-gold';
    return 'cosmetic-border-default';
  };

  // Get banner frame style
  const getBannerFrameClass = () => {
    if (!equippedBanner?.store_items?.name) return '';
    const name = equippedBanner.store_items.name.toLowerCase();
    if (name.includes('gold') || name.includes('lord')) return 'banner-frame-gold';
    if (name.includes('abyss') || name.includes('dark')) return 'banner-frame-abyss';
    if (name.includes('ember') || name.includes('fire')) return 'banner-frame-ember';
    if (name.includes('dragon') || name.includes('scale')) return 'banner-frame-dragon';
    return 'banner-frame-default';
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel rounded-lg p-4 mb-6 relative overflow-hidden ${getCosmeticBorderClass()}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
        {/* Avatar with optional banner frame */}
        <div className="flex items-center gap-4">
          <div className={`avatar-frame animate-pulse-glow relative ${getBannerFrameClass()}`}>
            <div className="w-full h-full bg-gradient-to-br from-primary to-red-950 flex items-center justify-center">
              {equippedIcon?.store_items?.image_url ? (
                <img 
                  src={equippedIcon.store_items.image_url} 
                  alt={equippedIcon.store_items.name}
                  className="w-full h-full object-cover"
                />
              ) : equippedIcon?.store_items?.name ? (
                <span className="text-2xl">{equippedIcon.store_items.name.charAt(0)}</span>
              ) : (
                <Skull className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
          </div>
          
          {/* Level Badge - Bonfire */}
          <motion.div 
            className="level-badge"
            key={stats.level}
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-display text-xs text-primary-foreground">
              {stats.level}
            </span>
          </motion.div>
        </div>

        {/* Estus/XP Bar Section */}
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-display">
              Estus
            </span>
            <div className="flex items-center gap-1 text-xp">
              <Flame className="w-3 h-3 animate-ember" />
              <span className="text-xs font-semibold">
                {xpProgress} / {xpNeeded}
              </span>
            </div>
          </div>
          
          <div className="xp-bar-container relative overflow-hidden">
            {/* Animated background glow */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                width: useTransform(springProgress, (v) => `${v}%`),
                background: 'linear-gradient(90deg, transparent, hsl(30 100% 50% / 0.5), transparent)',
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
          
          <div className="mt-1 text-xs text-muted-foreground font-display flex items-center gap-2">
            <span>Soul Level {stats.level}</span>
            {equippedTitle?.store_items?.name && (
              <span className="text-amber-400 font-semibold">
                「{equippedTitle.store_items.name}」
              </span>
            )}
          </div>
        </div>

        {/* Souls Display */}
        <motion.div 
          className="gold-display"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Sparkles className="w-5 h-5 text-gold animate-ember" />
          <motion.span className="gold-text font-display text-sm">
            {displaySouls}
          </motion.span>
          <span className="text-xs text-muted-foreground">souls</span>
        </motion.div>
      </div>
    </motion.header>
  );
};

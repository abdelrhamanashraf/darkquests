import { motion } from 'framer-motion';
import { Swords, Brain, Heart, Zap } from 'lucide-react';
import { PlayerStats } from '@/types/game';

interface StatsPanelProps {
  stats: PlayerStats;
}

const attributeConfig = [
  { key: 'strength', label: 'Strength', icon: Swords, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  { key: 'intelligence', label: 'Intelligence', icon: Brain, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { key: 'charisma', label: 'Charisma', icon: Heart, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  { key: 'vitality', label: 'Vitality', icon: Zap, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
] as const;

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const maxStat = Math.max(...Object.values(stats.attributes));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
          <Swords className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="rpg-heading text-sm">Attributes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your hero stats
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {attributeConfig.map(({ key, label, icon: Icon, color, bgColor }, index) => {
          const value = stats.attributes[key];
          const percentage = (value / (maxStat + 5)) * 100;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${bgColor}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className={`font-display text-xs ${color}`}>{value}</span>
              </div>
              
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${bgColor.replace('/20', '')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  style={{
                    boxShadow: `0 0 10px ${color.replace('text-', 'rgb(var(--')}`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Points */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Points</span>
          <span className="font-display text-sm text-accent">
            {Object.values(stats.attributes).reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

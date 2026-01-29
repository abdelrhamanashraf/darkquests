import { motion } from 'framer-motion';
import { Sword, BookOpen, Users, Dumbbell, Sparkles, Flame, Check, Trash2 } from 'lucide-react';
import { Quest, DIFFICULTY_REWARDS } from '@/types/game';

interface QuestCardProps {
  quest: Quest;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  fitness: Dumbbell,
  career: Sword,
  social: Users,
  learning: BookOpen,
};

const categoryLabels = {
  fitness: 'Combat',
  career: 'Conquest',
  social: 'Alliance',
  learning: 'Knowledge',
};

const difficultyLabels = {
  easy: 'Hollow',
  medium: 'Knight',
  hard: 'Lord',
  legendary: 'Boss',
};

export const QuestCard = ({ quest, index, onComplete, onDelete }: QuestCardProps) => {
  const CategoryIcon = categoryIcons[quest.category];
  const rewards = DIFFICULTY_REWARDS[quest.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      layout
      className={`quest-card quest-card-${quest.difficulty} group`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Left Section: Icon and Content */}
        <div className="flex items-start gap-3 flex-1">
          {/* Category Icon */}
          <div className={`p-2 rounded bg-category-${quest.category}/10 border border-category-${quest.category}/20`}>
            <CategoryIcon className={`w-5 h-5 text-category-${quest.category}`} />
          </div>

          {/* Quest Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {quest.title}
            </h3>
            {quest.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {quest.description}
              </p>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`category-badge category-${quest.category}`}>
                {categoryLabels[quest.category]}
              </span>
              <span className={`difficulty-${quest.difficulty}`}>
                {difficultyLabels[quest.difficulty]}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Rewards and Actions */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          {/* Rewards */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-xp">
              <Flame className="w-3.5 h-3.5 animate-ember" />
              <span className="font-semibold">+{rewards.xp}</span>
            </div>
            <div className="flex items-center gap-1 text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">+{rewards.gold}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onDelete(quest.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => onComplete(quest.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-quest-complete flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline font-display text-xs">Victory</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Plus, X, Sword, BookOpen, Users, Dumbbell } from 'lucide-react';
import { Quest, Difficulty, Category } from '@/types/game';
import { QuestCard } from './QuestCard';

interface QuestLogProps {
  quests: Quest[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string, difficulty: Difficulty, category: Category, description?: string) => void;
}

export const QuestLog = ({ quests, onComplete, onDelete, onAdd }: QuestLogProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [newCategory, setNewCategory] = useState<Category>('career');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newTitle.trim(), newDifficulty, newCategory, newDescription.trim() || undefined);
      setNewTitle('');
      setNewDescription('');
      setNewDifficulty('medium');
      setNewCategory('career');
      setIsAdding(false);
    }
  };

  const categoryOptions: { value: Category; label: string; icon: typeof Sword }[] = [
    { value: 'fitness', label: 'Fitness', icon: Dumbbell },
    { value: 'career', label: 'Career', icon: Sword },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'learning', label: 'Learning', icon: BookOpen },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <Scroll className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="rpg-heading text-sm">Quest Log</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {quests.length} active {quests.length === 1 ? 'quest' : 'quests'}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => setIsAdding(!isAdding)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg transition-colors ${
            isAdding 
              ? 'bg-destructive/20 text-destructive border border-destructive/30' 
              : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
          }`}
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Add Quest Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mb-5 overflow-hidden"
          >
            <div className="glass-panel rounded-lg p-4 border border-primary/20 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quest Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter your quest..."
                  className="w-full mt-1 px-3 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="w-full mt-1 px-3 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {categoryOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setNewCategory(value)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                          newCategory === value
                            ? `category-${value} bg-opacity-30`
                            : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </label>
                  <div className="flex gap-2 mt-1">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setNewDifficulty(diff)}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          newDifficulty === diff
                            ? `difficulty-${diff}`
                            : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="w-full btn-quest-complete disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Quest
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Quest List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {quests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Scroll className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No active quests</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Click the + button to add your first quest!
              </p>
            </motion.div>
          ) : (
            quests.map((quest, index) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                index={index}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

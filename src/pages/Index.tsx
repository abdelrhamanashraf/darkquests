import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { CharacterHeader } from '@/components/CharacterHeader';
import { QuestLog } from '@/components/QuestLog';
import { StatsPanel } from '@/components/StatsPanel';
import { LevelUpToast } from '@/components/LevelUpToast';
import { useGameState } from '@/hooks/useGameState';

const Index = () => {
  const { activeQuests, stats, completeQuest, addQuest, deleteQuest } = useGameState();
  const [showLevelUp, setShowLevelUp] = useState(false);

  const handleCompleteQuest = useCallback((questId: string) => {
    const { leveledUp } = completeQuest(questId);
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#10b981', '#fbbf24', '#f59e0b'],
    });

    if (leveledUp) {
      // Extra confetti for level up
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#a855f7', '#6366f1', '#fbbf24', '#22c55e'],
        });
      }, 300);
      
      setShowLevelUp(true);
    }
  }, [completeQuest]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 animate-pulse-glow">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="rpg-heading text-lg sm:text-xl tracking-wider">
            QuestBoard
          </h1>
        </motion.div>

        {/* Character Header */}
        <CharacterHeader stats={stats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quest Log - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <QuestLog
              quests={activeQuests}
              onComplete={handleCompleteQuest}
              onDelete={deleteQuest}
              onAdd={addQuest}
            />
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1">
            <StatsPanel stats={stats} />
          </div>
        </div>

        {/* Level Up Toast */}
        <LevelUpToast
          show={showLevelUp}
          level={stats.level}
          onClose={() => setShowLevelUp(false)}
        />
      </div>
    </div>
  );
};

export default Index;

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Flame, LogOut, Loader2 } from 'lucide-react';
import { CharacterHeader } from '@/components/CharacterHeader';
import { QuestLog } from '@/components/QuestLog';
import { StatsPanel } from '@/components/StatsPanel';
import { Leaderboard } from '@/components/Leaderboard';
import { LevelUpToast } from '@/components/LevelUpToast';
import { useGameState } from '@/hooks/useGameState';
import { playQuestCompleteSound, playLevelUpSound } from '@/lib/sounds';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeQuests, stats, loading: dataLoading, completeQuest, addQuest, deleteQuest } = useGameState(user?.id);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleCompleteQuest = useCallback(async (questId: string) => {
    const { leveledUp } = await completeQuest(questId);
    
    // Play quest complete sound
    playQuestCompleteSound();
    
    // Ember/fire confetti effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#d97706', '#ea580c', '#dc2626', '#f59e0b', '#78350f'],
    });

    if (leveledUp) {
      // Play level up fanfare after a short delay
      setTimeout(() => {
        playLevelUpSound();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#d97706', '#ea580c', '#eab308', '#dc2626', '#78350f'],
        });
      }, 300);
      
      setShowLevelUp(true);
    }
  }, [completeQuest]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-primary/20 border border-primary/30 animate-pulse-glow">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <h1 className="rpg-heading text-lg sm:text-xl tracking-wider">
              DARK QUESTS
            </h1>
          </div>
          
          <motion.button
            onClick={handleSignOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-display text-xs">Leave</span>
          </motion.button>
        </motion.div>

        {/* Character Header */}
        <CharacterHeader stats={stats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quest Log */}
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

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard currentUserId={user.id} />
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

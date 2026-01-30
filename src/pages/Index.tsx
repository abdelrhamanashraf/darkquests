import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Flame, LogOut, Loader2 } from 'lucide-react';
import { CharacterHeader } from '@/components/CharacterHeader';
import { AmbientAudioControl } from '@/components/AmbientAudioControl';
import { QuestLog } from '@/components/QuestLog';
import { StatsPanel } from '@/components/StatsPanel';
import { Leaderboard } from '@/components/Leaderboard';
import { LevelUpToast } from '@/components/LevelUpToast';
import { YouDiedOverlay } from '@/components/YouDiedOverlay';
import { BossVictoryBanner } from '@/components/BossVictoryBanner';
import { StorePanel } from '@/components/store/StorePanel';
import { InventoryPanel } from '@/components/store/InventoryPanel';
import { useGameState } from '@/hooks/useGameState';
import { useStore } from '@/hooks/useStore';
import { playQuestCompleteSound, playLevelUpSound, playBossDefeatSound } from '@/lib/sounds';
import { playDeathSound } from '@/lib/deathSound';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeQuests, stats, loading: dataLoading, completeQuest, addQuest, deleteQuest, refetchStats } = useGameState(user?.id);
  const { inventory, refetch: refetchInventory } = useStore(user?.id);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showYouDied, setShowYouDied] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [showBossVictory, setShowBossVictory] = useState(false);

  const handleDeleteQuest = useCallback(async (questId: string) => {
    await deleteQuest(questId);
    playDeathSound();
    setShowYouDied(true);
  }, [deleteQuest]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleCompleteQuest = useCallback(async (questId: string) => {
    const { leveledUp, difficulty } = await completeQuest(questId);
    
    const isLegendary = difficulty === 'legendary';
    
    if (isLegendary) {
      // Boss defeat - epic effects!
      playBossDefeatSound();
      
      // Screen shake
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
      
      // Show "HEIR OF FIRE DESTROYED" banner
      setTimeout(() => setShowBossVictory(true), 300);
      
      // Golden confetti burst - multiple waves
      const goldenColors = ['#ffd700', '#ffb700', '#ffa500', '#fff8dc', '#daa520', '#f0e68c'];
      
      // Initial explosion
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: goldenColors,
        scalar: 1.2,
      });
      
      // Secondary bursts
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: goldenColors,
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: goldenColors,
        });
      }, 200);
      
      // Final shimmer
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          colors: goldenColors,
          scalar: 0.8,
          gravity: 0.5,
        });
      }, 400);
    } else {
      // Normal quest complete
      playQuestCompleteSound();
      
      // Ember/fire confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d97706', '#ea580c', '#dc2626', '#f59e0b', '#78350f'],
      });
    }

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
      }, isLegendary ? 600 : 300);
      
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
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${screenShake ? 'animate-screen-shake' : ''}`}>
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
          
          <div className="flex items-center gap-2">
            <StorePanel 
              userId={user.id} 
              currentGold={stats.gold} 
              onGoldChange={refetchStats} 
            />
            
            <InventoryPanel 
              inventory={inventory} 
              onRefresh={async () => { await refetchInventory(); }} 
            />
            
            <AmbientAudioControl />
            
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-display text-xs">Leave</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Character Header */}
        <CharacterHeader 
          stats={stats} 
          equippedIcon={inventory.find(i => i.equipped && i.store_items?.type === 'icon')}
          equippedTitle={inventory.find(i => i.equipped && i.store_items?.type === 'title')}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quest Log */}
          <div className="lg:col-span-2">
            <QuestLog
              quests={activeQuests}
              onComplete={handleCompleteQuest}
              onDelete={handleDeleteQuest}
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

        {/* You Died Overlay */}
        <YouDiedOverlay
          show={showYouDied}
          onClose={() => setShowYouDied(false)}
        />

        {/* Boss Victory Banner */}
        <BossVictoryBanner
          show={showBossVictory}
          onClose={() => setShowBossVictory(false)}
        />
      </div>
    </div>
  );
};

export default Index;

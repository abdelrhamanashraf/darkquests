import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Quest, 
  PlayerStats, 
  Difficulty, 
  Category, 
  DIFFICULTY_REWARDS, 
  CATEGORY_ATTRIBUTE_MAP,
  calculateLevel 
} from '@/types/game';

const defaultStats: PlayerStats = {
  xp: 0,
  gold: 50,
  level: 1,
  attributes: {
    strength: 5,
    intelligence: 5,
    charisma: 5,
    vitality: 5,
  },
};

export const useGameState = (userId: string | undefined) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [stats, setStats] = useState<PlayerStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  // Fetch quests and stats from database
  useEffect(() => {
    if (!userId) {
      setQuests([]);
      setStats(defaultStats);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch quests
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (questsError) {
        console.error('Error fetching quests:', questsError);
      } else if (questsData) {
        setQuests(questsData.map(q => ({
          id: q.id,
          title: q.title,
          description: q.description ?? undefined,
          difficulty: q.difficulty as Difficulty,
          category: q.category as Category,
          completed: q.completed,
          createdAt: new Date(q.created_at),
        })));
      }

      // Fetch player stats
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError) {
        console.error('Error fetching stats:', statsError);
      } else if (statsData) {
        setStats({
          xp: statsData.xp,
          gold: statsData.gold,
          level: calculateLevel(statsData.xp),
          attributes: {
            strength: statsData.strength,
            intelligence: statsData.intelligence,
            charisma: statsData.charisma,
            vitality: statsData.vitality,
          },
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const completeQuest = useCallback(async (questId: string): Promise<{ leveledUp: boolean; reward: { xp: number; gold: number }; difficulty: string }> => {
    if (!userId) return { leveledUp: false, reward: { xp: 0, gold: 0 }, difficulty: '' };

    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) {
      return { leveledUp: false, reward: { xp: 0, gold: 0 }, difficulty: '' };
    }

    const reward = DIFFICULTY_REWARDS[quest.difficulty];
    const attributeKey = CATEGORY_ATTRIBUTE_MAP[quest.category];
    
    const newXp = stats.xp + reward.xp;
    const oldLevel = calculateLevel(stats.xp);
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

    // Update quest in database
    const { error: questError } = await supabase
      .from('quests')
      .update({ completed: true })
      .eq('id', questId);

    if (questError) {
      console.error('Error completing quest:', questError);
      return { leveledUp: false, reward: { xp: 0, gold: 0 }, difficulty: '' };
    }

    // Update stats in database
    const newStats = {
      xp: newXp,
      gold: stats.gold + reward.gold,
      [attributeKey]: stats.attributes[attributeKey] + 1,
    };

    const { error: statsError } = await supabase
      .from('player_stats')
      .update(newStats)
      .eq('user_id', userId);

    if (statsError) {
      console.error('Error updating stats:', statsError);
      return { leveledUp: false, reward: { xp: 0, gold: 0 }, difficulty: '' };
    }

    // Update local state
    setStats(prev => ({
      ...prev,
      xp: newXp,
      gold: prev.gold + reward.gold,
      level: newLevel,
      attributes: {
        ...prev.attributes,
        [attributeKey]: prev.attributes[attributeKey] + 1,
      },
    }));

    setQuests(prev => 
      prev.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      )
    );

    return { leveledUp, reward, difficulty: quest.difficulty };
  }, [quests, stats, userId]);

  const addQuest = useCallback(async (title: string, difficulty: Difficulty, category: Category, description?: string) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: userId,
        title,
        description,
        difficulty,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding quest:', error);
      return;
    }

    if (data) {
      const newQuest: Quest = {
        id: data.id,
        title: data.title,
        description: data.description ?? undefined,
        difficulty: data.difficulty as Difficulty,
        category: data.category as Category,
        completed: data.completed,
        createdAt: new Date(data.created_at),
      };
      setQuests(prev => [newQuest, ...prev]);
    }
  }, [userId]);

  const deleteQuest = useCallback(async (questId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', questId);

    if (error) {
      console.error('Error deleting quest:', error);
      return;
    }

    setQuests(prev => prev.filter(q => q.id !== questId));
  }, [userId]);

  const refetchStats = useCallback(async () => {
    if (!userId) return;
    
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    } else if (statsData) {
      setStats({
        xp: statsData.xp,
        gold: statsData.gold,
        level: calculateLevel(statsData.xp),
        attributes: {
          strength: statsData.strength,
          intelligence: statsData.intelligence,
          charisma: statsData.charisma,
          vitality: statsData.vitality,
        },
      });
    }
  }, [userId]);

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return {
    quests,
    activeQuests,
    completedQuests,
    stats,
    loading,
    completeQuest,
    addQuest,
    deleteQuest,
    refetchStats,
  };
};

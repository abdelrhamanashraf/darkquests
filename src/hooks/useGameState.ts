import { useState, useCallback } from 'react';
import { 
  Quest, 
  PlayerStats, 
  Difficulty, 
  Category, 
  DIFFICULTY_REWARDS, 
  CATEGORY_ATTRIBUTE_MAP,
  calculateLevel 
} from '@/types/game';

const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Morning Workout',
    description: 'Complete a 30-minute exercise session',
    difficulty: 'medium',
    category: 'fitness',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Read for 20 minutes',
    description: 'Read a book or educational article',
    difficulty: 'easy',
    category: 'learning',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Complete project milestone',
    description: 'Finish the current sprint deliverable',
    difficulty: 'hard',
    category: 'career',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Call a friend',
    description: 'Catch up with someone you haven\'t talked to in a while',
    difficulty: 'easy',
    category: 'social',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '5',
    title: 'Learn a new skill',
    description: 'Spend 1 hour on a tutorial or course',
    difficulty: 'medium',
    category: 'learning',
    completed: false,
    createdAt: new Date(),
  },
];

const initialStats: PlayerStats = {
  xp: 75,
  gold: 120,
  level: 1,
  attributes: {
    strength: 5,
    intelligence: 8,
    charisma: 6,
    vitality: 7,
  },
};

export const useGameState = () => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [stats, setStats] = useState<PlayerStats>(initialStats);

  const completeQuest = useCallback((questId: string): { leveledUp: boolean; reward: { xp: number; gold: number } } => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) {
      return { leveledUp: false, reward: { xp: 0, gold: 0 } };
    }

    const reward = DIFFICULTY_REWARDS[quest.difficulty];
    const attributeKey = CATEGORY_ATTRIBUTE_MAP[quest.category];
    
    const newXp = stats.xp + reward.xp;
    const oldLevel = calculateLevel(stats.xp);
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

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

    return { leveledUp, reward };
  }, [quests, stats.xp]);

  const addQuest = useCallback((title: string, difficulty: Difficulty, category: Category, description?: string) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      description,
      difficulty,
      category,
      completed: false,
      createdAt: new Date(),
    };
    setQuests(prev => [newQuest, ...prev]);
  }, []);

  const deleteQuest = useCallback((questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  }, []);

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return {
    quests,
    activeQuests,
    completedQuests,
    stats,
    completeQuest,
    addQuest,
    deleteQuest,
  };
};

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'fitness' | 'career' | 'social' | 'learning';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  category: Category;
  completed: boolean;
  createdAt: Date;
}

export interface PlayerStats {
  xp: number;
  gold: number;
  level: number;
  attributes: {
    strength: number;
    intelligence: number;
    charisma: number;
    vitality: number;
  };
}

export interface Reward {
  xp: number;
  gold: number;
}

export const DIFFICULTY_REWARDS: Record<Difficulty, Reward> = {
  easy: { xp: 10, gold: 5 },
  medium: { xp: 25, gold: 15 },
  hard: { xp: 50, gold: 40 },
};

export const CATEGORY_ATTRIBUTE_MAP: Record<Category, keyof PlayerStats['attributes']> = {
  fitness: 'strength',
  career: 'intelligence',
  social: 'charisma',
  learning: 'vitality',
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (level: number): number => {
  return level * 100;
};

export const getXpProgress = (xp: number): number => {
  return xp % 100;
};

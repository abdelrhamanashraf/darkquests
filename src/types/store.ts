export type StoreItemType = 'icon' | 'title' | 'cosmetic' | 'banner';
export type Rarity = 'common' | 'rare' | 'legendary';

export interface StoreItem {
  id: string;
  name: string;
  description: string | null;
  type: StoreItemType;
  price: number;
  image_url: string | null;
  rarity: Rarity;
  created_at: string;
  updated_at: string;
}

export interface UserInventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  purchased_at: string;
  equipped: boolean;
  store_items?: StoreItem;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: 'text-muted-foreground border-muted',
  rare: 'text-blue-400 border-blue-500/50',
  legendary: 'text-amber-400 border-amber-500/50',
};

export const RARITY_BG: Record<Rarity, string> = {
  common: 'bg-muted/20',
  rare: 'bg-blue-500/10',
  legendary: 'bg-amber-500/10',
};

export const TYPE_ICONS: Record<StoreItemType, string> = {
  icon: '👤',
  title: '📜',
  cosmetic: '✨',
  banner: '🏴',
};

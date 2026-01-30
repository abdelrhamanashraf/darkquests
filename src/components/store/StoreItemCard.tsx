import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { StoreItem, RARITY_COLORS, RARITY_BG, TYPE_ICONS } from '@/types/store';
import { Button } from '@/components/ui/button';

interface StoreItemCardProps {
  item: StoreItem;
  owned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}

export const StoreItemCard = ({ item, owned, canAfford, onPurchase }: StoreItemCardProps) => {
  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityBg = RARITY_BG[item.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`rpg-panel p-4 border-2 ${rarityColor} ${rarityBg} flex flex-col`}
    >
      {/* Icon/Visual */}
      <div className="text-4xl text-center mb-3">
        {TYPE_ICONS[item.type]}
      </div>

      {/* Name */}
      <h3 className={`font-display text-sm text-center mb-1 ${rarityColor.split(' ')[0]}`}>
        {item.name}
      </h3>

      {/* Type & Rarity Badge */}
      <div className="flex justify-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {item.type}
        </span>
        <span className={`text-xs uppercase tracking-wider ${rarityColor.split(' ')[0]}`}>
          {item.rarity}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-muted-foreground text-center mb-3 flex-grow">
          {item.description}
        </p>
      )}

      {/* Price & Action */}
      <div className="mt-auto">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-amber-400 text-sm font-bold">{item.price}</span>
          <span className="text-xs text-muted-foreground">souls</span>
        </div>

        {owned ? (
          <Button
            disabled
            variant="outline"
            size="sm"
            className="w-full border-green-500/50 text-green-400"
          >
            <Check className="w-4 h-4 mr-1" />
            Owned
          </Button>
        ) : (
          <Button
            onClick={onPurchase}
            disabled={!canAfford}
            size="sm"
            className={`w-full ${
              canAfford
                ? 'bg-primary/80 hover:bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {canAfford ? 'Purchase' : 'Not enough souls'}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

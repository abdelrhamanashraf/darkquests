import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, X, Package } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { StoreItemCard } from './StoreItemCard';
import { StoreItemType } from '@/types/store';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StorePanelProps {
  userId: string;
  currentGold: number;
  onGoldChange: () => void;
}

const TABS: { type: StoreItemType | 'all'; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'icon', label: 'Icons' },
  { type: 'title', label: 'Titles' },
  { type: 'cosmetic', label: 'Cosmetics' },
  { type: 'banner', label: 'Banners' },
];

export const StorePanel = ({ userId, currentGold, onGoldChange }: StorePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StoreItemType | 'all'>('all');
  const { items, loading, purchaseItem, isOwned, refetch } = useStore(userId);

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

  const handlePurchase = async (item: typeof items[0]) => {
    const success = await purchaseItem(item, currentGold);
    if (success) {
      onGoldChange();
      await refetch();
    }
  };

  return (
    <>
      {/* Store Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded bg-amber-900/30 border border-amber-600/30 text-amber-400 hover:bg-amber-900/50 transition-colors text-sm"
      >
        <Store className="w-4 h-4" />
        <span className="hidden sm:inline font-display text-xs">Store</span>
      </motion.button>

      {/* Store Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rpg-panel w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Store className="w-6 h-6 text-amber-400" />
                  <h2 className="rpg-heading text-lg">Firelink Shrine Store</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{currentGold}</span>
                    <span className="text-xs text-muted-foreground">souls</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-secondary rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-2 border-b border-border/30 overflow-x-auto">
                {TABS.map((tab) => (
                  <Button
                    key={tab.type}
                    variant={activeTab === tab.type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.type)}
                    className="font-display text-xs whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mb-2 opacity-50" />
                    <p className="font-display">No items available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredItems.map((item) => (
                      <StoreItemCard
                        key={item.id}
                        item={item}
                        owned={isOwned(item.id)}
                        canAfford={currentGold >= item.price}
                        onPurchase={() => handlePurchase(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

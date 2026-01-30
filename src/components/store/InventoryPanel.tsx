import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Backpack, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserInventoryItem, RARITY_COLORS, RARITY_BG, TYPE_ICONS } from '@/types/store';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InventoryPanelProps {
  inventory: UserInventoryItem[];
  onRefresh: () => Promise<void>;
}

export const InventoryPanel = ({ inventory, onRefresh }: InventoryPanelProps) => {
  const [open, setOpen] = useState(false);
  const [equipping, setEquipping] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEquip = async (inventoryItem: UserInventoryItem) => {
    if (!inventoryItem.store_items) return;
    
    setEquipping(inventoryItem.id);
    
    // First, unequip any other items of the same type
    const sameTypeItems = inventory.filter(
      inv => inv.store_items?.type === inventoryItem.store_items?.type && inv.id !== inventoryItem.id
    );
    
    for (const item of sameTypeItems) {
      if (item.equipped) {
        await supabase
          .from('user_inventory')
          .update({ equipped: false })
          .eq('id', item.id);
      }
    }
    
    // Toggle the current item
    const { error } = await supabase
      .from('user_inventory')
      .update({ equipped: !inventoryItem.equipped })
      .eq('id', inventoryItem.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update equipment.",
        variant: "destructive",
      });
    } else {
      toast({
        title: inventoryItem.equipped ? "Unequipped" : "Equipped",
        description: `${inventoryItem.store_items.name} has been ${inventoryItem.equipped ? 'unequipped' : 'equipped'}.`,
      });
    }
    
    await onRefresh();
    setEquipping(null);
  };

  const groupedInventory = inventory.reduce((acc, item) => {
    const type = item.store_items?.type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, UserInventoryItem[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Backpack className="w-4 h-4" />
          <span className="hidden sm:inline font-display text-xs">Inventory</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="rpg-heading text-lg flex items-center gap-2">
            <Backpack className="w-5 h-5 text-primary" />
            Your Collection
          </DialogTitle>
        </DialogHeader>

        {inventory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Backpack className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Your inventory is empty.</p>
            <p className="text-sm">Visit the store to acquire items!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedInventory).map(([type, items]) => (
              <div key={type}>
                <h3 className="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <span>{TYPE_ICONS[type as keyof typeof TYPE_ICONS] || '📦'}</span>
                  <span className="capitalize">{type}s</span>
                </h3>
                <div className="grid gap-2">
                  <AnimatePresence>
                    {items.map((item) => {
                      const storeItem = item.store_items;
                      if (!storeItem) return null;
                      
                      const rarity = (storeItem.rarity || 'common') as 'common' | 'rare' | 'legendary';
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border ${RARITY_BG[rarity]} ${RARITY_COLORS[rarity]} ${item.equipped ? 'ring-2 ring-primary' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {storeItem.image_url && (
                                <img 
                                  src={storeItem.image_url} 
                                  alt={storeItem.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <h4 className="font-display text-sm flex items-center gap-2">
                                  {storeItem.name}
                                  {item.equipped && (
                                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                                      Equipped
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {rarity} {storeItem.type}
                                </p>
                              </div>
                            </div>
                            
                            <Button
                              size="sm"
                              variant={item.equipped ? "outline" : "default"}
                              disabled={equipping === item.id}
                              onClick={() => handleEquip(item)}
                              className="min-w-[80px]"
                            >
                              {equipping === item.id ? (
                                <span className="animate-pulse">...</span>
                              ) : item.equipped ? (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  Remove
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Equip
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

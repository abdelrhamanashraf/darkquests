import { Trash2, Edit } from 'lucide-react';
import { StoreItem, RARITY_COLORS, TYPE_ICONS } from '@/types/store';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/useStore';

interface AdminItemListProps {
  items: StoreItem[];
  onRefresh: () => void;
}

export const AdminItemList = ({ items, onRefresh }: AdminItemListProps) => {
  const { deleteItem } = useAdminStore();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      const success = await deleteItem(id);
      if (success) onRefresh();
    }
  };

  if (items.length === 0) {
    return (
      <div className="rpg-panel p-8 text-center text-muted-foreground">
        No items in the store yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rpg-panel p-3 flex items-center justify-between ${RARITY_COLORS[item.rarity].split(' ')[0]}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{TYPE_ICONS[item.type]}</span>
            <div>
              <span className="font-display text-sm">{item.name}</span>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{item.type}</span>
                <span>•</span>
                <span className="capitalize">{item.rarity}</span>
                <span>•</span>
                <span className="text-amber-400">{item.price} souls</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item.id)}
              className="text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

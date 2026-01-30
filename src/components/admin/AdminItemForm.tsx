import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoreItemType, Rarity } from '@/types/store';
import { useAdminStore } from '@/hooks/useStore';

interface AdminItemFormProps {
  onSuccess: () => void;
}

export const AdminItemForm = ({ onSuccess }: AdminItemFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<StoreItemType>('icon');
  const [price, setPrice] = useState(50);
  const [rarity, setRarity] = useState<Rarity>('common');
  const [loading, setLoading] = useState(false);
  const { addItem } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const success = await addItem({
      name: name.trim(),
      description: description.trim() || null,
      type,
      price,
      rarity,
      image_url: null,
    });

    if (success) {
      setName('');
      setDescription('');
      setPrice(50);
      setRarity('common');
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rpg-panel p-4 space-y-4">
      <h3 className="font-display text-sm text-primary">Add New Item</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs">Price (Souls)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            className="bg-secondary/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
          className="bg-secondary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as StoreItemType)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icon">Icon</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="cosmetic">Cosmetic</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Rarity</Label>
          <Select value={rarity} onValueChange={(v) => setRarity(v as Rarity)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading || !name.trim()} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </form>
  );
};

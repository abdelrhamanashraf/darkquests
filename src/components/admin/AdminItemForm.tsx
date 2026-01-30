import { useState, useRef } from 'react';
import { Plus, Upload, X, Image } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useAdminStore();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, GIF, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `icons/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('store-items')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('store-items')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl && type === 'icon') {
        // For icons, image is important but not required
        console.warn('Image upload failed, proceeding without image');
      }
    }

    const success = await addItem({
      name: name.trim(),
      description: description.trim() || null,
      type,
      price,
      rarity,
      image_url: imageUrl,
    });

    if (success) {
      setName('');
      setDescription('');
      setPrice(50);
      setRarity('common');
      clearImage();
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

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label className="text-xs">Image {type === 'icon' && '(Recommended for icons)'}</Label>
        
        {imagePreview ? (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded border border-border"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
          >
            <Image className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Click to upload image</span>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
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
        {loading ? 'Adding...' : 'Add Item'}
      </Button>
    </form>
  );
};

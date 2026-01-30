import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoreItem, UserInventoryItem, StoreItemType, Rarity } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

export const useStore = (userId?: string) => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [inventory, setInventory] = useState<UserInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('store_items')
      .select('*')
      .order('type', { ascending: true })
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching store items:', error);
      return;
    }

    setItems(data as StoreItem[]);
  }, []);

  const fetchInventory = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('user_inventory')
      .select('*, store_items(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching inventory:', error);
      return;
    }

    setInventory(data as UserInventoryItem[]);
  }, [userId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchItems(), fetchInventory()]);
      setLoading(false);
    };
    loadData();
  }, [fetchItems, fetchInventory]);

  const purchaseItem = useCallback(async (item: StoreItem, currentGold: number): Promise<boolean> => {
    if (!userId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to purchase items.",
        variant: "destructive",
      });
      return false;
    }

    if (currentGold < item.price) {
      toast({
        title: "Insufficient Souls",
        description: `You need ${item.price - currentGold} more souls to purchase this item.`,
        variant: "destructive",
      });
      return false;
    }

    // Check if already owned
    const alreadyOwned = inventory.some(inv => inv.item_id === item.id);
    if (alreadyOwned) {
      toast({
        title: "Already Owned",
        description: "You already own this item!",
        variant: "destructive",
      });
      return false;
    }

    // Insert into inventory
    const { error: insertError } = await supabase
      .from('user_inventory')
      .insert({ user_id: userId, item_id: item.id });

    if (insertError) {
      console.error('Error purchasing item:', insertError);
      toast({
        title: "Purchase Failed",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    // Deduct gold from player stats
    const { error: updateError } = await supabase
      .from('player_stats')
      .update({ gold: currentGold - item.price })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating gold:', updateError);
      return false;
    }

    toast({
      title: "Purchase Complete!",
      description: `You acquired ${item.name}!`,
    });

    await fetchInventory();
    return true;
  }, [userId, inventory, toast, fetchInventory]);

  const isOwned = useCallback((itemId: string) => {
    return inventory.some(inv => inv.item_id === itemId);
  }, [inventory]);

  return {
    items,
    inventory,
    loading,
    purchaseItem,
    isOwned,
    refetch: () => Promise.all([fetchItems(), fetchInventory()]),
  };
};

export const useAdminStore = () => {
  const { toast } = useToast();

  const addItem = async (item: Omit<StoreItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('store_items')
      .insert(item);

    if (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Make sure you have admin privileges.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item Added",
      description: `${item.name} has been added to the store.`,
    });
    return true;
  };

  const updateItem = async (id: string, updates: Partial<StoreItem>) => {
    const { error } = await supabase
      .from('store_items')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item Updated",
      description: "Item has been updated successfully.",
    });
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('store_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item Deleted",
      description: "Item has been removed from the store.",
    });
    return true;
  };

  return { addItem, updateItem, deleteItem };
};

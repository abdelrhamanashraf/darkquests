-- Add UPDATE policy for user_inventory so users can equip/unequip items
CREATE POLICY "Users can update their own inventory" 
ON public.user_inventory 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
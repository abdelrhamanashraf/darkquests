-- Allow anyone to view equipped items (for leaderboard display)
CREATE POLICY "Anyone can view equipped items" 
ON public.user_inventory 
FOR SELECT 
USING (equipped = true);
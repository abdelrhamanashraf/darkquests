-- Add display_name column to player_stats for leaderboard
ALTER TABLE public.player_stats 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Create a policy to allow all authenticated users to view leaderboard data
CREATE POLICY "Anyone can view leaderboard stats"
ON public.player_stats
FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own stats" ON public.player_stats;

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_stats;
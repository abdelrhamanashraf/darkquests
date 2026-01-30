import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Sparkles, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateLevel } from '@/types/game';

interface EquippedItem {
  type: string;
  name: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  xp: number;
  gold: number;
  level: number;
  display_name: string;
  equipped_title?: string;
}

interface LeaderboardProps {
  currentUserId: string;
}

export const Leaderboard = ({ currentUserId }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      // Fetch player stats
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select('id, user_id, xp, gold, display_name')
        .order('xp', { ascending: false })
        .limit(10) as { data: any[] | null; error: any };

      if (statsError) {
        console.error('Error fetching leaderboard:', statsError);
        setLoading(false);
        return;
      }

      if (!statsData || statsData.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Fetch equipped titles for all users in the leaderboard
      const userIds = statsData.map(s => s.user_id);
      const { data: inventoryData } = await supabase
        .from('user_inventory')
        .select('user_id, equipped, store_items(type, name)')
        .in('user_id', userIds)
        .eq('equipped', true) as { data: any[] | null };

      // Build a map of user_id -> equipped title
      const equippedTitles: Record<string, string> = {};
      if (inventoryData) {
        inventoryData.forEach((item: any) => {
          if (item.store_items?.type === 'title' && item.equipped) {
            equippedTitles[item.user_id] = item.store_items.name;
          }
        });
      }

      const leaderboardData = statsData.map((entry: any, index: number) => ({
        id: entry.id,
        user_id: entry.user_id,
        xp: entry.xp,
        gold: entry.gold,
        level: calculateLevel(entry.xp),
        display_name: entry.display_name || `Undead #${index + 1}`,
        equipped_title: equippedTitles[entry.user_id],
      }));
      setEntries(leaderboardData);
      
      setLoading(false);
    };

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_stats',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'leaderboard-rank leaderboard-rank-1';
    if (rank === 2) return 'leaderboard-rank leaderboard-rank-2';
    if (rank === 3) return 'leaderboard-rank leaderboard-rank-3';
    return 'leaderboard-rank bg-secondary text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4" />;
    return rank;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded bg-gold/20 border border-gold/30">
          <Trophy className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="rpg-heading text-sm">Leaderboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top Undead
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="leaderboard-row animate-pulse">
              <div className="w-8 h-8 rounded bg-secondary" />
              <div className="flex-1 h-4 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-6">
          <Flame className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">No champions yet</p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Be the first to kindle the flame
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.user_id === currentUserId;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`leaderboard-row ${isCurrentUser ? 'border-primary/50 bg-primary/10' : ''}`}
              >
                <div className={getRankStyle(rank)}>
                  {getRankIcon(rank)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                      {entry.display_name}
                      {isCurrentUser && <span className="text-xs text-muted-foreground ml-1">(you)</span>}
                    </span>
                    {entry.equipped_title && (
                      <span className="text-xs text-amber-400 font-display">
                        「{entry.equipped_title}」
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-display">Lv.{entry.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{entry.xp.toLocaleString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

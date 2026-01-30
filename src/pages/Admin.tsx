import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useStore } from '@/hooks/useStore';
import { AdminItemForm } from '@/components/admin/AdminItemForm';
import { AdminItemList } from '@/components/admin/AdminItemList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Admin credentials - in production, use proper authentication
const ADMIN_PASSWORD = 'darksouls123';

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, refetch: refetchAdmin } = useAdminAuth();
  const { items, loading: storeLoading, refetch: refetchStore } = useStore(user?.id);
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(() => {
    // Check if admin was authenticated via login page
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    // Allow access if authenticated via session or if user is logged in
    if (!authLoading && !user && !authenticated) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate, authenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      if (!isAdmin && user) {
        // Promote user to admin
        setPromoting(true);
        const { error } = await supabase
          .from('user_roles')
          .upsert({ user_id: user.id, role: 'admin' }, { onConflict: 'user_id,role' });
        
        if (error) {
          // If it's a duplicate, that's fine - user is already admin
          if (!error.message.includes('duplicate')) {
            toast({
              title: "Error",
              description: "Failed to grant admin access.",
              variant: "destructive",
            });
            setPromoting(false);
            return;
          }
        }
        
        await refetchAdmin();
        setPromoting(false);
      }
      setAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome, Administrator.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
    setPassword('');
  };

  const handleRefresh = async () => {
    await refetchStore();
  };

  // Show loading only if we're checking auth and not already authenticated via session
  if ((authLoading || adminLoading) && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated via sessionStorage, allow access even without user
  // If not authenticated and no user, redirect will happen via useEffect

  // Show password gate if not authenticated this session and user is logged in but not admin
  if (!authenticated && !isAdmin && user) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rpg-panel p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-primary" />
              <h1 className="rpg-heading text-xl">Admin Access</h1>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-secondary/50"
                />
              </div>

              <Button type="submit" disabled={promoting} className="w-full">
                {promoting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                Enter
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // If not authenticated at all, show nothing (redirect will happen)
  if (!authenticated && !isAdmin && !user) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="rpg-heading text-lg">Admin Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add Item Form */}
          <div>
            <h2 className="font-display text-sm text-muted-foreground mb-3">Add New Item</h2>
            <AdminItemForm onSuccess={handleRefresh} />
          </div>

          {/* Item List */}
          <div>
            <h2 className="font-display text-sm text-muted-foreground mb-3">
              Store Items ({items.length})
            </h2>
            {storeLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <AdminItemList items={items} onRefresh={handleRefresh} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

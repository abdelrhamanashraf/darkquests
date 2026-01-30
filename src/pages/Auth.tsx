import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, LogIn, UserPlus, Loader2, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Admin credentials
const ADMIN_EMAIL = 'admin@darkquests.com';
const ADMIN_PASSWORD = 'darksouls123';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Admin mode - check hardcoded credentials
    if (isAdminMode) {
      setLoading(true);
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session temporarily
        sessionStorage.setItem('admin_authenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid admin credentials.');
      }
      setLoading(false);
      return;
    }

    // Validate inputs
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        if (result.error) {
          if (result.error.message.includes('already registered')) {
            setError('This email is already registered. Try signing in instead.');
          } else {
            setError(result.error.message);
          }
        } else if (result.data?.user && displayName.trim()) {
          // Update display name after signup - cast to handle type not updated yet
          await (supabase
            .from('player_stats')
            .update({ display_name: displayName.trim() } as any)
            .eq('user_id', result.data.user.id));
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex p-3 rounded border animate-pulse-glow mb-4 ${
              isAdminMode 
                ? 'bg-amber-500/20 border-amber-500/30' 
                : 'bg-primary/20 border-primary/30'
            }`}
          >
            {isAdminMode ? (
              <Shield className="w-8 h-8 text-amber-500" />
            ) : (
              <Flame className="w-8 h-8 text-primary" />
            )}
          </motion.div>
          <h1 className="rpg-heading text-xl tracking-wider mb-2">
            {isAdminMode ? 'ADMIN ACCESS' : 'DARK QUESTS'}
          </h1>
          <p className="text-muted-foreground font-display text-sm">
            {isAdminMode 
              ? 'Enter admin credentials' 
              : isSignUp 
                ? 'Create a new undead' 
                : 'Welcome back, Ashen One'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (Signup only, not admin mode) */}
            {isSignUp && !isAdminMode && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-display">
                  Character Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Chosen Undead"
                    className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-display">
                {isAdminMode ? 'Admin Email' : 'Email'}
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAdminMode ? 'admin@darkquests.com' : 'undead@lordran.com'}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-display">
                {isAdminMode ? 'Admin Password' : 'Password'}
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded bg-destructive/20 border border-destructive/30 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full btn-quest-complete flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-display"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isAdminMode ? (
                <>
                  <Shield className="w-5 h-5" />
                  Access Dashboard
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Character
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Enter the World
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-border text-center space-y-3">
            {!isAdminMode && (
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Already have a character?' : "Don't have a character?"}
                <button
                  onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                  className="ml-1 text-primary hover:underline font-medium font-display"
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            )}
            
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setIsSignUp(false);
                setError(null);
                setEmail('');
                setPassword('');
              }}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors font-display"
            >
              {isAdminMode ? '← Back to player login' : 'Admin access'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

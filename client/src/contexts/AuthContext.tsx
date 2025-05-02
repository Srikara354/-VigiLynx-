import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  userType: 'user' | 'guest' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'user' | 'guest' | 'admin' | null>(null);
  const navigate = useNavigate();
  
  // Compute isLoggedIn based on user state
  const isLoggedIn = user !== null;

  // Determine user type when user state changes
  useEffect(() => {
    if (!user) {
      setUserType(null);
      return;
    }
    
    // Check if the user is an admin (you might want to check a specific claim or role)
    // This is a simple example - implement your actual admin check logic here
    if (user.email?.endsWith('@admin.vigilynx.com')) {
      setUserType('admin');
    } else if (user.email === 'guest@example.com') {
      setUserType('guest');
    } else {
      setUserType('user');
    }
  }, [user]);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Check your email for the confirmation link');
    } catch (error) {
      toast.error('Failed to sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        userType,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
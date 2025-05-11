import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    let isMounted = true;
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('Auth check taking too long, forcing load completion');
        setIsLoading(false);
        setAuthError('Authentication service may be unavailable. Please try again later.');
      }
    }, 5000); // 5 seconds timeout
    
    const getSession = async () => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session?.user) {
          setUser(data.session.user);
          setIsLoggedIn(true);

          let userAccountType = data.session.user.user_metadata?.user_type || 
                              localStorage.getItem('vigilynx_account_type') || 'normal';
          
          if (!data.session.user.user_metadata?.user_type) {
            await supabase.auth.updateUser({ data: { user_type: userAccountType } });
          }
          
          setUserType(userAccountType);
          localStorage.removeItem('vigilynx_account_type');
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setUserType(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setAuthError(error.message || "Failed to connect to authentication service");
        setUser(null);
        setIsLoggedIn(false);
        setUserType(null);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsLoading(false), 500);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);

        let userAccountType = session.user.user_metadata?.user_type || 
                            localStorage.getItem('vigilynx_account_type') || 'normal';
        
        if (!session.user.user_metadata?.user_type) {
          try {
            await supabase.auth.updateUser({ data: { user_type: userAccountType } });
          } catch (updateError) {
            console.error("Error updating user metadata:", updateError);
          }
        }
        
        setUserType(userAccountType);
        localStorage.removeItem('vigilynx_account_type');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserType(null);
      }
      setAuthError(null);
      setIsLoading(false); // Ensure loading state is off after auth state change
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, accountType) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { user_type: accountType } }
      });
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (accountType) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      localStorage.setItem('vigilynx_account_type', accountType);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        },
      });
      
      if (error) throw new Error(error.message);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
    // Note: setIsLoading(false) handled by onAuthStateChange when user returns
  };

  const logout = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      setAuthError(error.message);
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsLoggedIn(true);
    setUser(null);
    setUserType('guest');
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        userType,
        isLoading,
        authError,
        login,
        signUp,
        loginWithGoogle,
        logout,
        continueAsGuest,
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

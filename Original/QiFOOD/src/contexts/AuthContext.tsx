import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/api/supabase';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user as User | null,
        isLoading: false,
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user as User | null,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }: LoginCredentials) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Update the user state after successful login
      setState(prev => ({
        ...prev,
        user: data.user,
        session: data.session,
      }));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async ({ email, password, name }: RegisterCredentials) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshSession = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        refreshSession,
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
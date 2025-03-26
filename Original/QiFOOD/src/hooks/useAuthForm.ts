import { useState } from 'react';
import { LoginCredentials, RegisterCredentials } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

interface AuthError {
  message: string;
  field?: keyof (LoginCredentials | RegisterCredentials);
}

export function useAuthForm() {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSignIn = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(credentials);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to sign in',
        field: err.field,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await signUp(credentials);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to sign up',
        field: err.field,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSignIn,
    handleSignUp,
    clearError: () => setError(null),
  };
} 
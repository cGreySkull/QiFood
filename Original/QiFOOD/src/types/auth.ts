export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  dietary_preferences: Record<string, any> | null;
  is_email_verified: boolean;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
} 
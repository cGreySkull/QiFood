import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/common/LoadingScreen';

export default function Index() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Redirect href={user ? '/(main)/home' : '/(auth)/login'} />;
} 
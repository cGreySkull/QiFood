import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuthForm } from '../../hooks/useAuthForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignIn, isLoading, error, clearError } = useAuthForm();

  const onSubmit = async () => {
    try {
      await handleSignIn({ email, password });
      router.replace('/(main)/home');
    } catch (err) {
      // Error is handled by useAuthForm
      console.error('Login error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearError();
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          error={error?.field === 'email'}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError();
          }}
          secureTextEntry
          error={error?.field === 'password'}
          style={styles.input}
        />

        {error && (
          <Text style={styles.error}>{error.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Sign In
        </Button>

        <Link href="/(auth)/register">
          <Button mode="text">
            Don't have an account? Sign Up
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome, {user?.email || 'User'}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Take a picture of your ingredients to get started
        </Text>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {
              // TODO: Implement camera functionality
            }}
            style={styles.button}
          >
            Open Camera
          </Button>

          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => {
              // TODO: Implement manual input
            }}
            style={styles.button}
          >
            Write Text
          </Button>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 
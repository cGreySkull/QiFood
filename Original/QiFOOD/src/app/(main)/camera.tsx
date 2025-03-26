import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCamera } from '../../hooks/useCamera';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function CameraScreen() {
  const { captureIngredients, isLoading, error } = useCamera();

  const handleCapture = async () => {
    try {
      console.log('Starting capture...');
      const photo = await captureIngredients();
      console.log('Capture result:', photo);

      if (photo?.id) {
        router.push({
          pathname: '/(main)/process',
          params: { photoId: photo.id }
        });
      }
    } catch (err) {
      console.error('Capture error:', err);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Processing photo..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Take a Photo
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Position your ingredients in the frame and take a clear photo
        </Text>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <View style={styles.buttons}>
          <Button
            mode="contained"
            icon="camera"
            onPress={handleCapture}
            style={styles.button}
          >
            Take Photo
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Cancel
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 
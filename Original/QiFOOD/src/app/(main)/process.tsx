import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text, ProgressBar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipeGeneration } from '../../hooks/useRecipeGeneration';

export default function ProcessScreen() {
  const { photoId } = useLocalSearchParams();
  const { state, error, generateFromPhoto } = useRecipeGeneration();

  useEffect(() => {
    if (photoId) {
      processPhoto().catch(console.error);
    }
  }, [photoId]);

  const processPhoto = async () => {
    try {
      console.log('Starting photo processing:', photoId);
      const recipe = await generateFromPhoto(photoId as string);
      console.log('Processing result:', recipe);

      if (recipe) {
        router.replace({
          pathname: '/(main)/recipe/[id]',
          params: { id: recipe.id }
        });
      } else {
        console.log('No recipe generated, going back');
        router.back();
      }
    } catch (err) {
      console.error('Processing error:', err);
      // Stay on screen to show error
    }
  };

  const handleRetry = () => {
    processPhoto().catch(console.error);
  };

  const handleCancel = () => {
    router.back();
  };

  const getMessage = (step: string) => {
    switch (step) {
      case 'detecting':
        return 'Detecting ingredients...';
      case 'generating':
        return 'Generating recipe...';
      case 'creating-image':
        return 'Creating recipe image...';
      case 'saving':
        return 'Saving recipe...';
      case 'done':
        return 'Done!';
      default:
        return 'Processing...';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {error ? 'Processing Failed' : getMessage(state.step)}
        </Text>

        {!error && <ProgressBar progress={state.progress} style={styles.progress} />}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
            <Button mode="contained" onPress={handleRetry} style={styles.button}>
              Retry
            </Button>
            <Button mode="outlined" onPress={handleCancel} style={styles.button}>
              Cancel
            </Button>
          </View>
        )}
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
    marginBottom: 32,
    textAlign: 'center',
  },
  progress: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
}); 
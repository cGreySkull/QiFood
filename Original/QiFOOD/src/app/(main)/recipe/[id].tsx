import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { database, Recipe } from '../../../services/api/database';
import { LoadingScreen } from '../../../components/common/LoadingScreen';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await database.getRecipe(id as string);
      setRecipe(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>
          {error || 'Recipe not found'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {recipe.title}
        </Text>

        {recipe.ai_generated_image_url && (
          <Image
            source={{ uri: recipe.ai_generated_image_url }}
            style={styles.image}
          />
        )}

        <View style={styles.section}>
          <Text variant="titleMedium">Ingredients</Text>
          <Divider style={styles.divider} />
          {Object.entries(recipe.ingredients).map(([ingredient, amount]) => (
            <Text key={ingredient} style={styles.ingredient}>
              • {ingredient}: {amount}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Instructions</Text>
          <Divider style={styles.divider} />
          {recipe.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instruction}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implement recipe saving/favoriting
          }}
          style={styles.button}
        >
          Save Recipe
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  divider: {
    marginVertical: 8,
  },
  ingredient: {
    marginBottom: 4,
  },
  instruction: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
}); 
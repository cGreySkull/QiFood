import { useState } from 'react';
import { ai } from '../services/ai/deepseek';
import { database } from '../services/api/database';
import { useAuth } from '../contexts/AuthContext';

export function useRecipeGeneration() {
  const { user } = useAuth();
  const [state, setState] = useState({
    step: 'detecting',
    progress: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const generateFromPhoto = async (photoId: string) => {
    if (!user) return null;

    try {
      // Get photo from database
      setState({ step: 'detecting', progress: 0.25 });
      const photo = await database.getIngredientsPhoto(photoId);
      console.log('Processing photo:', photo);

      // Detect ingredients
      const ingredients = await ai.detectIngredients(photo.photo_url);
      const ingredientsList = Object.keys(ingredients);
      console.log('Detected ingredients:', ingredients);

      if (ingredientsList.length === 0) {
        setError('No ingredients detected in the image');
        return null;
      }

      // Generate recipe
      setState({ step: 'generating', progress: 0.5 });
      const recipeText = await ai.generateRecipe(ingredientsList);
      
      if (!recipeText) {
        setError('Failed to generate recipe');
        return null;
      }

      try {
        // Parse recipe text
        const lines = recipeText.split('\n').filter(line => line.trim());
        const title = lines[0]
          .replace(/^#+\s*/, '')  // Remove markdown headers
          .replace(/\*\*/g, '')   // Remove bold formatting
          .replace(/Zesty\s+/, '') // Remove "Zesty" prefix
          .trim();
        
        const instructions = lines
          .slice(1)
          .filter(line => /^\d+\./.test(line))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line);

        console.log('Parsed title:', title);
        console.log('Parsed instructions:', instructions);
        console.log('Ingredients:', ingredients);

        if (!title || instructions.length === 0) {
          console.error('Invalid recipe format - Title:', title, 'Instructions length:', instructions.length);
          setError('Invalid recipe format');
          return null;
        }

        // Save recipe
        setState({ step: 'saving', progress: 0.9 });
        try {
          const recipe = await database.createRecipe({
            user_id: user.id,
            title,
            description: '',
            ingredients,
            instructions,
            image_url: photo.photo_url,
            ai_generated_image_url: null,
            is_favorite: false,
            cooking_time: null,
            difficulty_level: null,
            servings: null,
            tags: null
          });

          setState({ step: 'done', progress: 1 });
          return recipe;
        } catch (dbError) {
          console.error('Database error:', dbError);
          setError('Failed to save recipe');
          return null;
        }
      } catch (parseError) {
        console.error('Recipe parsing error:', parseError);
        setError('Failed to parse recipe');
        return null;
      }
    } catch (err: any) {
      console.error('Recipe generation error:', err);
      setError(err.message || 'Failed to generate recipe');
      return null;
    }
  };

  return {
    state,
    error,
    generateFromPhoto,
  };
} 
import { supabase } from './supabase';
import { User } from '../../types/auth';
import { Recipe, IngredientsPhoto } from '../../types/database';

export const database = {
  // User Preferences
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserPreferences(userId: string, preferences: Partial<User>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Recipes
  async getRecipes(userId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Recipe[];
  },

  async getRecipe(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Simplify the recipe format
      const formattedRecipe = {
        user_id: recipe.user_id,
        title: recipe.title.replace('Title: ', ''),
        description: recipe.description || '',
        ingredients: recipe.ingredients,  // Don't stringify, keep as object
        instructions: recipe.instructions,
        image_url: recipe.image_url,
        ai_generated_image_url: null,
        is_favorite: false,
        cooking_time: null,
        difficulty_level: null,
        servings: null,
        tags: null
      };

      console.log('Creating recipe with format:', formattedRecipe);

      // Test connection first
      const { error: testError } = await supabase
        .from('recipes')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Supabase connection error:', testError);
        throw new Error('Database connection failed');
      }

      // Create recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert(formattedRecipe)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message || 'Failed to create recipe');
      }

      if (!data) {
        throw new Error('No data returned from database');
      }

      console.log('Recipe created successfully:', data);
      return data as Recipe;
    } catch (error: any) {
      console.error('Full database error:', error);
      throw new Error('Failed to create recipe: ' + (error.message || 'Unknown error'));
    }
  },

  async updateRecipe(id: string, updates: Partial<Recipe>) {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async deleteRecipe(id: string) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Ingredients Photos
  async saveIngredientsPhoto(data: { user_id: string; photo_url: string }) {
    try {
      const { data: photo, error } = await supabase
        .from('ingredients_photos')
        .insert({
          user_id: data.user_id,
          photo_url: data.photo_url,
          created_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to save photo to database');
      }

      return photo;
    } catch (error) {
      console.error('Save photo error:', error);
      throw error;
    }
  },

  async updateIngredientsPhotoResults(
    id: string,
    results: {
      detected_ingredients: Record<string, any>;
      confidence_scores: Record<string, any>;
    }
  ) {
    const { data, error } = await supabase
      .from('ingredients_photos')
      .update({
        ...results,
        processed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IngredientsPhoto;
  },

  // Recipe History
  async addToHistory(userId: string, recipeId: string, rating?: number, notes?: string) {
    const { data, error } = await supabase
      .from('recipe_history')
      .insert({
        user_id: userId,
        recipe_id: recipeId,
        rating,
        notes,
        cooked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRecipeHistory(userId: string) {
    const { data, error } = await supabase
      .from('recipe_history')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getIngredientsPhoto(id: string) {
    try {
      const { data, error } = await supabase
        .from('ingredients_photos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Get photo error:', error);
        throw new Error('Failed to get photo');
      }

      return data as IngredientsPhoto;
    } catch (error) {
      console.error('Get photo error:', error);
      throw error;
    }
  },
}; 
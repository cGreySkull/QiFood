import { useState } from 'react';
import { database, Recipe } from '../services/api/database';
import { useAuth } from '../contexts/AuthContext';

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await database.getRecipes(user.id);
      setRecipes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const newRecipe = await database.createRecipe(recipe);
      setRecipes(prev => [newRecipe, ...prev]);
      return newRecipe;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedRecipe = await database.updateRecipe(id, updates);
      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        )
      );
      return updatedRecipe;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await database.deleteRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recipes,
    isLoading,
    error,
    loadRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
} 
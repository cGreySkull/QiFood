export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Record<string, string>;
  instructions: string[];
  image_url: string | null;
  ai_generated_image_url: string | null;
  cooking_time: number | null;
  difficulty_level: string | null;
  servings: number | null;
  tags: string[] | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface IngredientsPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  detected_ingredients: Record<string, any> | null;
  confidence_scores: Record<string, any> | null;
  created_at: string;
  processed_at: string | null;
  status: 'pending' | 'processed' | 'failed';
} 
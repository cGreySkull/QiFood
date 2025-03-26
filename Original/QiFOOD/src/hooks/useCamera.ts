import { useState } from 'react';
import { camera } from '../services/camera';
import { storage } from '../services/storage';
import { database } from '../services/api/database';
import { useAuth } from '../contexts/AuthContext';

export function useCamera() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureIngredients = async () => {
    if (!user) return null;

    try {
      setIsLoading(true);
      setError(null);

      // Take photo
      const photo = await camera.takePhoto();
      if (!photo) return null;

      // Convert to blob
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      // Upload to storage
      const path = `ingredients/${user.id}/${Date.now()}.jpg`;
      const uploadResult = await storage.uploadImage(path, blob);
      if (!uploadResult) throw new Error('Failed to upload image');

      const photoUrl = await storage.getImageUrl(uploadResult.path);
      console.log('Photo URL:', photoUrl);

      // Save to database
      const ingredientsPhoto = await database.saveIngredientsPhoto({
        user_id: user.id,
        photo_url: photoUrl,
      });

      return ingredientsPhoto;
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to process photo');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    captureIngredients,
  };
} 
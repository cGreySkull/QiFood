import { supabase } from './api/supabase';
import { decode } from 'base64-arraybuffer';

export const storage = {
  async uploadImage(path: string, file: Blob) {
    try {
      const fileName = `${Date.now()}.jpg`;
      console.log('Uploading image:', fileName);

      // Convert to base64 with proper format
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Storage error:', error);
      throw new Error('Failed to upload image');
    }
  },

  async getImageUrl(path: string) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  async deleteImage(path: string) {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image');
    }
  },
}; 
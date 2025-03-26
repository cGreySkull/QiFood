import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const camera = {
  async takePhoto() {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission not granted');
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.assets || result.canceled) {
        return null;
      }

      // Compress the image
      const compressed = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      return compressed;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  },
}; 
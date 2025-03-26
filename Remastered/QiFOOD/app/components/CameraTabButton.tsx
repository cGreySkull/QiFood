import { Ionicons } from '@expo/vector-icons';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { useRef } from 'react';

type Props = {
  onPress?: () => void;
};

export default function CameraTabButton({ onPress }: Props) {
  const focused = true;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={() => {
        animatePress();
        onPress?.();
      }}
      android_ripple={{ color: 'transparent' }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: focused ? '#1976D2' : '#2196F3',
          },
        ]}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  button: {
    top: -40,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});

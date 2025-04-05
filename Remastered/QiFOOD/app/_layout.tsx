import { Stack, Slot } from "expo-router";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext"; // Import AuthProvider and useAuth

function RootLayoutContent() {
  const { isLoggedIn, checkAuthState } = useAuth(); // Use global auth state
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track if auth state is checked

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthState(); // Check authentication state
      setIsAuthChecked(true); // Mark auth check as complete
    };
    initializeAuth();
  }, [checkAuthState]);

  if (!isAuthChecked) {
    return null; // Render nothing until auth state is checked
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isLoggedIn ? (
        // Render the main app layout (tabs)
        <Slot />
      ) : (
        // Render the login/register stack
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // Import AuthProvider and useAuth

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const router = useRouter();
  const { isLoggedIn, isAuthChecked } = useAuth(); // Use global auth state
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && isAuthChecked) {
      SplashScreen.hideAsync();

      if (isLoggedIn) {
        router.replace("/food"); // Redirect to the food page if logged in
      } else {
        router.replace("/"); // Redirect to the login page if not logged in
      }
    }
  }, [isLoggedIn, isAuthChecked, router, loaded]);

  if (!loaded || !isAuthChecked) {
    return null; // Render nothing until fonts and auth state are loaded
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Sign Up for QiFood" }} />
      <Stack.Screen name="food" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
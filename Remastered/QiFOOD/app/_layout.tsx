import { Stack, Slot } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  const isLoggedIn = false;

  if (!isLoggedIn){
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff"}}>
      <Slot/>
    </View>
  );
}

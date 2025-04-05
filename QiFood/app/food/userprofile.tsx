import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Import useAuth to access logout
import { useRouter } from "expo-router"; // Import useRouter for navigation

export default function UserProfile() {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Log the user out
    router.replace("/"); // Navigate back to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} color="#FF3B30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 16,
  },
});
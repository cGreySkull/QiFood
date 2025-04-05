import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import { supabase } from "@/lib/supabase"; // Import your Supabase client
import { useAuth } from "@/context/AuthContext"; // Import AuthContext to get the user
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function Food() {
  const router = useRouter();
  const { user } = useAuth(); // Get the logged-in user's details
  const [recipes, setRecipes] = useState([]); // Store recipes
  const [loading, setLoading] = useState(true); // Loading state

  const fetchRecipes = async () => {
    if (!user) return; // Ensure user is logged in

    setLoading(true);

    // Fetch recipes sorted by user_rating in descending order
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id) // Filter by the logged-in user's ID
      .order("user_rating", { ascending: false }) // Sort by rating (highest first)
      .limit(5); // Limit to top 5 recipes

    if (error) {
      console.error("Error fetching recipes:", error.message);
    } else {
      setRecipes(data || []); // Set recipes or an empty array
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes(); // Initial fetch when the component mounts
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes(); // Refresh recipes when the tab is revisited
    }, [user])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profilePic}>
          <Text style={{ color: "#000", fontSize: 28, fontWeight: "800" }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </Text>
        </View>
        <View>
          <Text
            style={styles.greeting}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            Hello, {user?.email?.split("@")[0] || "User"} 👋
          </Text>
          <Text style={styles.recipeCount}>
            Recipes saved: {recipes.length}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Loading recipes...</Text>
        </View>
      ) : recipes.length > 0 ? (
        <View style={styles.recipeList}>
          <Text style={styles.sectionTitle}>Your Top Recipes</Text>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`recipes/${item.id}`)} // Navigate to the recipe details page
              >
                <View style={styles.recipeCard}>
                  <View style={styles.recipeCardContent}>
                    {/* Placeholder Image */}
                    <Image
                      source={{ uri: "https://foodish-api.com/images/rice/rice31.jpg" }} // Placeholder image URL
                      style={styles.recipeImage}
                    />
                    <View style={styles.recipeTextContainer}>
                      <Text style={styles.recipeTitle}>{item.recipe_name}</Text>
                      <Text style={styles.recipeDetails}>
                        Rating: {item.user_rating} ⭐
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            You have no recipes yet. Start by adding one!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#EEE",
  },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#9AF",
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
  },
  recipeCount: {
    fontSize: 14,
    color: "#898",
    marginTop: 4,
  },
  recipeList: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "500",
  },
  recipeCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
  },
  recipeCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ddd",
  },
  recipeTextContainer: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useRouter, useGlobalSearchParams, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function RecipeDetails() {
  const { recipeId } = useGlobalSearchParams(); // Get the recipeId from the route
  const [recipe, setRecipe] = useState(null); // Store the recipe details
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId) // Fetch the recipe by ID
        .single(); // Expect a single result

      if (error) {
        console.error("Error fetching recipe:", error.message);
      } else {
        setRecipe(data);
      }
      setLoading(false);
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Set the header title dynamically */}
      <Stack.Screen options={{ title: recipe.recipe_name }} />

      {/* Recipe Image */}
      <Image
        source={{ uri: "https://foodish-api.com/images/rice/rice31.jpg" }} // Placeholder image
        style={styles.recipeImage}
      />

      {/* Recipe Name and Rating */}
      <View style={styles.header}>
        <Text style={styles.recipeName}>{recipe.recipe_name}</Text>
        <Text style={styles.recipeRating}>
          {"⭐".repeat(recipe.user_rating)}{" "}
          {Array(5 - recipe.user_rating)
            .fill("☆")
            .join("")}
        </Text>
      </View>

      {/* Ingredients Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <FlatList
          data={recipe.ingredient_list}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.ingredient}>
              - {item.quantity} {item.unit} {item.name}
              {item.notes ? ` (${item.notes})` : ""}
            </Text>
          )}
        />
      </View>

      {/* Preparation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preparation</Text>
        <Text style={styles.preparation}>{recipe.preparation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  recipeImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  recipeRating: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFD700", // Gold color for stars
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
  },
  preparation: {
    fontSize: 16,
    lineHeight: 24,
  },
});
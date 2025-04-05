import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function Recipes() {
  const router = useRouter();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("user_rating", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error.message);
    } else {
      setRecipes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading recipes...</Text>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => router.push(`/recipes/${item.id}`)}
            >
              <View style={styles.recipeCardContent}>
                <Image
                  source={{ uri: item.image_url || "https://foodish-api.com/images/rice/rice31.jpg" }}
                  style={styles.recipeImage}
                />
                <View style={styles.recipeTextContainer}>
                  <Text style={styles.recipeTitle}>{item.recipe_name}</Text>
                  <Text style={styles.recipeRating}>Rating: {item.user_rating} ⭐</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noRecipesText}>No recipes found. Add some!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  recipeCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  recipeRating: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
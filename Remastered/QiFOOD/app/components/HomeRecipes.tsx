import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy recipes
const allRecipes = [
  {
    id: '1',
    title: 'Spicy Tomato Pasta',
    rating: 4,
    difficulty: 2,
    image: null,
  },
  {
    id: '2',
    title: 'Zucchini Salad',
    rating: 5,
    difficulty: 1,
    image: null,
  },
  {
    id: '3',
    title: 'Creamy Mushroom Risotto',
    rating: 3,
    difficulty: 4,
    image: null,
  },
  // Add more...
];

export default function HomeRecipes({ }) {
  const topRecipes = allRecipes
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.sectionTitle}>Your Top Recipes</Text>

      <FlatList
        data={topRecipes}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeBox}>
            <View style={styles.recipeImage}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.imageStyle} />
              ) : (
                <Ionicons name="image-outline" size={40} color="#aaa" />
              )}
            </View>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <View style={styles.recipeMeta}>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{item.rating}/5</Text>
                </View>
                <View style={styles.difficultyBox}>
                  <Ionicons name="barbell-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>Difficulty: {item.difficulty}/5</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.showAllBtn}
        onPress={() => console.log('Go to all recipes')}
      >
        <Text style={styles.showAllText}>Show All Recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recipeBox: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  recipeImage: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  recipeMeta: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  difficultyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#555',
  },
  showAllBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  showAllText: {
    color: '#1976D2',
    fontSize: 15,
    fontWeight: '500',
  },
});

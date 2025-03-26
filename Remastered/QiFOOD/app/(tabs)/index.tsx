import {View, Text, Image, FlatList, StyleSheet} from "react-native";

const MOCK_USER = {
    name: 'John Doe',
    profilePic: null,
    recipes: [
        { id: '1', title: 'Spicy tomato pasta'},
        { id: '2', title: 'Grilled zucchini salad'}
    ]
};

export default function HomePage() {
    const { name, profilePic, recipes } = MOCK_USER;
    const hasRecipes = recipes.length > 0;
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profilePic}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <Text style={{ color: '#000', fontSize: 28, fontWeight:"800"}}>JD</Text>
            )}
          </View>
          <View>
            <Text style={styles.greeting}>Hello, {name} 👋</Text>
            <Text style={styles.recipeCount}>
              Recipes saved: {recipes.length}
            </Text>
          </View>
        </View>
  
        {/* Content */}
        {hasRecipes ? (
          <View style={styles.recipeList}>
            <Text style={styles.sectionTitle}>Your Recipes</Text>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.recipeCard}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              You have no recipes yet. Start by taking a picture of your veggies!
            </Text>
          </View>
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingTop: 20,
      flex: 1,
      backgroundColor: "#CCC"
    },
    header: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      marginBottom: 30,
      borderRadius: 5,
      padding: 10,
      backgroundColor: "#fff"
    },
    profilePic: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: '#9AF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    greeting: {
      fontSize: 22,
      fontWeight: '600',
    },
    recipeCount: {
      fontSize: 14,
      color: '#898',
      marginTop: 4,
    },
    recipeList: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#fff"
    },
    sectionTitle: {
      fontSize: 24,
      marginBottom: 10,
      fontWeight: '500',
    },
    recipeCard: {
      padding: 16,
      borderRadius: 10,
      backgroundColor: '#f3f3f3',
      marginBottom: 10,
    },
    recipeTitle: {
      fontSize: 16,
    },
    placeholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    placeholderText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
    },
  });
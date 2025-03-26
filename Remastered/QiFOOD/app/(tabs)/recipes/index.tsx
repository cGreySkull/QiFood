import {View, Text} from "react-native";

export default function RecipesPage() {
    const hasRecipes = false;

    return (
        <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
            {hasRecipes ? (
                <Text>Your recipes will appear here.</Text>
            ) : (
                <Text>Start by taking a picture of your vegetables to generate recipes!</Text>
            )}
        </View>
    );
}
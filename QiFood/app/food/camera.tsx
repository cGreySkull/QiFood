import React, { useState, useRef } from "react";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import OpenAI from "openai";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import { useRouter } from "expo-router"; // Import useRouter for navigation

export default function Camera() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const fileInputRef = useRef(null); // Ref for the file input element
    const { addRecipe, user } = useAuth(); // Get addRecipe function and user from AuthContext
    const router = useRouter(); // Router for navigation

    const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser: true,
    });

    const takePicture = async () => {
        if (Platform.OS === "web") {
            fileInputRef.current.click(); // Trigger file picker on web
        } else {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                alert("Camera access is required to take pictures.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync();
            if (!result.cancelled) {
                setImage(result.assets[0].uri);
            }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result); // Set the Base64 string as the image
            };
            reader.readAsDataURL(file); // Convert file to Base64
        }
    };

    const generateRecipe = async () => {
        if (!image) {
            alert("Please take a picture or upload an image first.");
            return;
        }

        setLoading(true);
        try {
            let base64Image;

            if (Platform.OS === "web") {
                // Extract Base64 data from the Data URL
                base64Image = image.split(",")[1];
            } else {
                base64Image = await FileSystem.readAsStringAsync(image, {
                    encoding: FileSystem.EncodingType.Base64,
                });
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional chef.",
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Based on the ingredients in this image, create a recipe. Return the recipe name, preparation method, and ingredient list in the following JSON format: { \"name\": \"Recipe Name\", \"preparation\": \"Preparation steps\", \"ingredients\": [{ \"name\": \"Ingredient Name\", \"quantity\": \"Quantity\", \"unit\": \"Unit\", \"notes\": \"Notes\" }] }",
                            },
                            {
                                type: "image_url",
                                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                            },
                        ],
                    },
                ],
                max_tokens: 5000,
            });

            if (!response.choices || response.choices.length === 0) {
                throw new Error("No recipe generated.");
            }

            // Sanitize the response content
            const rawContent = response.choices[0].message.content;
            const sanitizedContent = rawContent.replace(/```(?:json)?/g, "").trim(); // Remove Markdown code blocks

            // Parse the sanitized content
            let parsedRecipe;
            try {
                parsedRecipe = JSON.parse(sanitizedContent);
            } catch (parseError) {
                console.error("Error parsing recipe JSON:", parseError);
                console.error("Raw response content:", sanitizedContent);
                alert("Failed to parse recipe. Please try again.");
                return;
            }

            setRecipe(parsedRecipe); // Set the parsed recipe
            setModalVisible(true); // Show modal with recipe
        } catch (error) {
            console.error("Error generating recipe:", error);
            alert("Failed to generate recipe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveRecipe = async () => {
        if (!user || !user.id) {
            alert("You must be logged in to save a recipe.");
            return;
        }

        try {
            const { success, data, error } = await addRecipe({
                recipe_name: recipe.name,
                ingredient_list: recipe.ingredients,
                preparation: recipe.preparation,
                user_rating: 0, // Default rating
                user_id: user.id, // Use user ID from AuthContext
            });

            if (success) {
                setModalVisible(false); // Close modal
                router.push(`/recipes/${data[0].id}`); // Navigate to recipe details
            } else {
                alert("Failed to save recipe: " + error);
            }
        } catch (err) {
            console.error("Error saving recipe:", err);
            alert("An error occurred while saving the recipe.");
        }
    };

    return (
        <View style={styles.container}>
            {Platform.OS === "web" && (
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            )}
            <View style={styles.imageBox}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.placeholderText}>Image will appear here</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Take Picture" onPress={takePicture} />
                <Button title="Generate Recipe" onPress={generateRecipe} />
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{recipe?.name}</Text>
                        <Image source={{ uri: image }} style={styles.modalImage} />
                        <Text style={styles.modalText}>Ingredients:</Text>
                        {recipe?.ingredients.map((ingredient, index) => (
                            <Text key={index} style={styles.modalText}>
                                - {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                            </Text>
                        ))}
                        <View style={styles.modalButtons}>
                            <Button title="Save" onPress={saveRecipe} />
                            <Button title="Decline" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    imageBox: {
        width: "100%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        marginBottom: 16,
    },
    placeholderText: {
        color: "#888",
        fontSize: 14,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginVertical: 16,
    },
    recipeContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    recipeText: {
        fontSize: 16,
        color: "#333",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
});
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
    const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const router = useRouter();

  const validateFields = () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    setErrorMessage(""); // Clear error message if validation passes
    return true;
  };

  const handleLogin = async () => {
    if (validateFields()) {
        const result = await login(email, password);
        if(result.success){
            router.replace("/food");
        } else {
            setErrorMessage("Invalid email or password.");
        }
    }
  };

  const handleRegister = () => {
    router.push("/register"); // Navigate to the register page
  };

  return (
      <View style={styles.container}>
        {/* Brand */}
        <Text style={styles.brand}>Welcome to QiFood</Text>

        {/* Error Message */}
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        {/* Email Field */}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Field */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Remember Me */}
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
            {rememberMe && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 LSFD. All rights reserved.</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    backgroundColor: "#EEFFEE",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 40,
  },
  errorMessage: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: "#007BFF",
    borderRadius: 2,
  },
  rememberMeText: {
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    color: "#888",
  },
});
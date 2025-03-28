import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => {} } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
  error: { color: "red", marginBottom: 12 },
});

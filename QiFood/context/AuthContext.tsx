import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  const checkAuthState = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session) {
      setIsLoggedIn(true);
      setUser(session.user); // Store the user details
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    setIsAuthChecked(true); // Mark auth check as complete
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }

    setIsLoggedIn(true);
    setUser(data.user); // Update user state
    return { success: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
    setIsLoggedIn(false);
    setUser(null);
  };

  const addRecipe = async (recipe) => {
    const { data, error } = await supabase
      .from("recipes")
      .insert([recipe])
      .select(); // Request the inserted rows

    if (error) {
      console.error("Error adding recipe:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthChecked, user, login, logout, checkAuthState, addRecipe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return context;
}
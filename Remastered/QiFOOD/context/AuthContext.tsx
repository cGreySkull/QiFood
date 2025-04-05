import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  const checkAuthState = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session) {
      const { user } = session;
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

        if (error) {
            console.error("Supabase query error:", error.message);
        } else if (userData.length === 0) {
            console.warn("No user found with the given user_id.");
        } else {
            setUser(userData); // Set the first user if rows exist
        } 
    }
  }, []);

  useEffect(() => {
    checkAuthState();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        checkAuthState(); // Re-fetch user details on auth state change
      } else {
        setUser(null); // Clear user details on logout
      }
    });

    return () => data.subscription.unsubscribe();
  }, [checkAuthState]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, checkAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

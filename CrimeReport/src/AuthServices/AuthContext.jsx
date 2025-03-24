import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
//create authContext
const AuthContext = createContext();

//custom Hook to use context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
//Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // Load user from localStorage when app starts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializedUser);
    return unsubscribe;
  }, []);
  async function initializedUser(user) {
    if (user) {
      setUser({ ...user });
      setLoggedIn(true);
    } else {
      setUser(null);
      setLoggedIn(false);
    }
    setLoading(false);
  }
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLoggedIn(false);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };
  const value = {
    user,
    loggedIn,
    loading,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

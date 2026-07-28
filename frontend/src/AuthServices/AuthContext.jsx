import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile using token on app load
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          setLoggedIn(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          setUser(null);
          setLoggedIn(false);
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);
  };

  const value = {
    user,
    loggedIn,
    loading,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

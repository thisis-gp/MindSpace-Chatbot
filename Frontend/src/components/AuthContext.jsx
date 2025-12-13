import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

// Create the context
const AuthContext = createContext();

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get and refresh Firebase ID token
  const getToken = async (forceRefresh = false) => {
    if (!auth.currentUser) {
      setToken(null);
      return null;
    }

    try {
      const idToken = await auth.currentUser.getIdToken(forceRefresh);
      setToken(idToken);
      localStorage.setItem("authToken", idToken);
      return idToken;
    } catch (error) {
      console.error("Error getting token:", error);
      setToken(null);
      localStorage.removeItem("authToken");
      return null;
    }
  };

  // Monitor auth state changes and token refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get initial token
        const idToken = await getToken();
        
        // Set up token refresh (Firebase tokens expire after 1 hour)
        const refreshTokenInterval = setInterval(async () => {
          await getToken(true); // Force refresh
        }, 50 * 60 * 1000); // Refresh every 50 minutes (before 1 hour expiry)

        // Store cleanup function
        window.tokenRefreshInterval = refreshTokenInterval;

        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL,
        });
        localStorage.setItem("userId", firebaseUser.uid);
      } else {
        // User signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");
        
        // Clear token refresh interval
        if (window.tokenRefreshInterval) {
          clearInterval(window.tokenRefreshInterval);
          delete window.tokenRefreshInterval;
        }
      }
      setLoading(false);
    });

    // Check for existing token on mount
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && auth.currentUser) {
      setToken(storedToken);
      // Verify token is still valid by refreshing it
      getToken(true);
    }

    return () => {
      unsubscribe();
      if (window.tokenRefreshInterval) {
        clearInterval(window.tokenRefreshInterval);
      }
    };
  }, []);

  // Login function
  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("userId", userData.id);
    // Token will be set by onAuthStateChanged
    await getToken();
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      
      // Clear token refresh interval
      if (window.tokenRefreshInterval) {
        clearInterval(window.tokenRefreshInterval);
        delete window.tokenRefreshInterval;
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to get current token (refreshes if needed)
  const getCurrentToken = async (forceRefresh = false) => {
    return await getToken(forceRefresh);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, getCurrentToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// PUBLIC_INTERFACE
const AuthContext = createContext();

/**
 * AuthProvider gives access to currentUser, loading, and auth methods
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for authentication state to change.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // PUBLIC_INTERFACE
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(error);
    }
  };

  // PUBLIC_INTERFACE
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error);
    }
  };

  // PUBLIC_INTERFACE
  const signupWithEmail = async (email, password, displayName = "") => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (error) {
      setAuthError(error);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loading,
    authError,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Usage: const {currentUser, loginWithGoogle, ...} = useAuth(); */
  return useContext(AuthContext);
}

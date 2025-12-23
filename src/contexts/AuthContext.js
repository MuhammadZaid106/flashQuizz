import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, displayName) => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCred.user, { displayName });
    }
    return userCred.user;
  };

  const login = (email, password) => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    if (!auth) return Promise.reject(new Error('Firebase not configured'));
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  useEffect(() => {
    if (!auth) {
      // no firebase - mark loading false so UI renders with local fallback
      setLoading(false);
      return () => {};
    }
    const un = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return un;
  }, []);

  const value = { currentUser, signup, login, logout, signInWithGoogle };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

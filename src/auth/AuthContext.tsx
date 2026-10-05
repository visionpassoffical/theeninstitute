import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { firebaseAuthService } from '../firebase/auth';
import { firestoreService } from '../firebase/firestore';
import { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await firestoreService.getUserProfile(user.uid, user.email || undefined);
          setUserProfile(profile);
        } catch (err) {
          console.warn('Profile load error:', err);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setError(null);
    setLoading(true);

    try {
      const user = await firebaseAuthService.signIn(email, pass);
      setCurrentUser(user);

      const profile = await firestoreService.getUserProfile(user.uid, user.email || email);
      if (!profile) {
        throw new Error('Your account profile could not be verified. Please contact THEEN administration.');
      }

      if (!profile.isActive) {
        throw new Error('Your account is currently inactive. Please contact THEEN administration.');
      }

      setUserProfile(profile);
      setLoading(false);
      return profile;
    } catch (err: any) {
      setLoading(false);
      const friendlyMsg = err.message || 'Unable to sign in. Please verify your credentials.';
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseAuthService.signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await firebaseAuthService.sendPasswordReset(email);
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset.');
      throw err;
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (currentUser) {
      const profile = await firestoreService.getUserProfile(currentUser.uid, currentUser.email || undefined);
      setUserProfile(profile);
      return profile;
    }
    return null;
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        error,
        login,
        logout,
        resetPassword,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

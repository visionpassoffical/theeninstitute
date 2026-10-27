import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { supabaseProfileService } from '../services/supabaseProfileService';
import { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        setCurrentUser(session.user);
        try {
          const profile = await supabaseProfileService.getUserProfile(
            session.user.id,
            session.user.email || undefined
          );
          setUserProfile(profile);
        } catch (err: any) {
          console.warn('Initial session profile load notice:', err?.message || err);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setLoading(true);
      if (session?.user) {
        setCurrentUser(session.user);
        try {
          const profile = await supabaseProfileService.getUserProfile(
            session.user.id,
            session.user.email || undefined
          );
          setUserProfile(profile);
        } catch (err: any) {
          console.warn('Auth state change profile load notice:', err?.message || err);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      const msg =
        supabaseConfigError ||
        'Supabase integration credentials are not configured in environment variables.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      // 1. Sign in with Supabase Auth
      const { user } = await supabaseAuthService.signIn(email, pass);
      setCurrentUser(user);

      // 2. Fetch and verify database profile
      let profile: UserProfile;
      try {
        profile = await supabaseProfileService.getUserProfile(user.id, user.email || email);
      } catch (profileErr: any) {
        // Expose the precise cause (e.g. 42P17 recursion, missing profile row, or permission denied)
        throw new Error(
          profileErr.message ||
            'Your account profile could not be verified in the database. Please contact THEEN administration.'
        );
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
      await supabaseAuthService.signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }
    try {
      await supabaseAuthService.sendPasswordReset(email);
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset.');
      throw err;
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (currentUser && isSupabaseConfigured) {
      try {
        const profile = await supabaseProfileService.getUserProfile(
          currentUser.id,
          currentUser.email || undefined
        );
        setUserProfile(profile);
        return profile;
      } catch (err: any) {
        console.warn('Profile refresh notice:', err?.message || err);
        return null;
      }
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

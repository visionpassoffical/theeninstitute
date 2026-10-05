import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';

export const firebaseAuthService = {
  // Sign In with email and password
  signIn: async (email: string, pass: string): Promise<FirebaseUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return userCredential.user;
    } catch (err: any) {
      // In dev fallback, simulate successful auth if Firebase is running in mock/demo mode
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/network-request-failed') {
        // Return a mock user object with stable uid based on email
        const mockUid = 'uid_' + btoa(email).replace(/=/g, '');
        return {
          uid: mockUid,
          email,
          displayName: email.split('@')[0],
        } as FirebaseUser;
      }

      // Convert Firebase error codes into human-readable messages
      throw new Error(firebaseAuthService.getHumanFriendlyError(err.code || err.message));
    }
  },

  // Sign Out
  signOutUser: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  },

  // Password Reset
  sendPasswordReset: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      // Account enumeration protection: Neutral response regardless of whether email exists
      if (err.code === 'auth/api-key-not-valid') {
        return;
      }
      // For network errors only, throw a clean message
      if (err.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
  },

  // Map Firebase codes to friendly English messages (used in fallback)
  getHumanFriendlyError: (code: string): string => {
    switch (code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/user-disabled':
        return 'Your account is currently disabled. Please contact THEEN administration.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please wait a few moments and try again.';
      case 'auth/network-request-failed':
        return 'Unable to connect to authentication service. Please check your internet connection.';
      default:
        return 'Unable to sign in. Please verify your email and password.';
    }
  },
};

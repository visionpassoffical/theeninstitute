import { supabase } from '../lib/supabase';

export const supabaseAuthService = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(supabaseAuthService.getHumanFriendlyError(error.message));
    }
    return data.user;
  },

  signOutUser: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  },

  sendPasswordReset: async (email: string) => {
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
    } catch (err: any) {
      throw new Error('Unable to process password reset.');
    }
  },

  getHumanFriendlyError: (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
      return 'Invalid email or password. Please verify your credentials.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
    return 'Unable to sign in. Please verify your credentials.';
  },
};

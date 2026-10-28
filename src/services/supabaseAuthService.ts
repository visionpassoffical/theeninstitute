import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';

export const supabaseAuthService = {
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error(supabaseAuthService.getHumanFriendlyError(error.message));
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication failed: No active session was returned by Supabase.');
    }

    return {
      user: data.user,
      session: data.session,
    };
  },

  signOutUser: async () => {
    if (!isSupabaseConfigured) return;

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  },

  sendPasswordReset: async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      throw new Error(err?.message || 'Unable to process password reset.');
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
    return message || 'Unable to sign in. Please verify your credentials.';
  },
};

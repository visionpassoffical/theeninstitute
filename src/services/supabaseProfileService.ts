import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/auth';

export const supabaseProfileService = {
  /**
   * Fetch authenticated user's role and verified profile strictly from Supabase public.profiles table.
   * No fake role fallbacks or offline email parsing are permitted.
   */
  getUserProfile: async (uid: string, email?: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) {
      console.warn(supabaseConfigError);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error || !data) {
        console.warn('No database profile found for user:', uid, error?.message);
        return null;
      }

      const profile: UserProfile = {
        uid: data.id || uid,
        email: data.email || email || '',
        displayName: data.display_name || '',
        role: data.role as UserRole,
        isActive: data.is_active !== false,
        teacherId: data.teacher_id || undefined,
        gender: data.gender || undefined,
        phone: data.phone || undefined,
        permissions: data.permissions || {
          admissions: true,
          students: true,
          teachers: true,
          batches: true,
          attendance: true,
          reports: true,
          finance: data.role === 'SUPER_ADMIN',
          settings: data.role === 'SUPER_ADMIN',
        },
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };

      return profile;
    } catch (err) {
      console.error('Supabase profile query failed:', err);
      return null;
    }
  },
};

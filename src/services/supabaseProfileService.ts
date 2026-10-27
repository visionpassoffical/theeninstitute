import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/auth';

export const supabaseProfileService = {
  /**
   * Fetch authenticated user's role and verified profile strictly from Supabase public.profiles table.
   * Throws informative, safe errors to distinguish authentication, RLS policy recursion, permission, and missing row errors.
   */
  getUserProfile: async (uid: string, email?: string): Promise<UserProfile> => {
    if (!isSupabaseConfigured) {
      throw new Error(
        supabaseConfigError ||
          'Supabase integration credentials are not configured in environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'
      );
    }

    if (!uid) {
      throw new Error('Invalid user ID provided for profile verification.');
    }

    try {
      // Use maybeSingle to prevent generic PGRST116 errors and expose real database errors (e.g. 42P17 recursion)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        console.error('Supabase profile query database error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // 1. Infinite recursion detection in RLS policies (PostgreSQL code 42P17)
        if (error.code === '42P17' || error.message?.toLowerCase().includes('infinite recursion')) {
          throw new Error(
            'Database Policy Recursion Error (42P17): The "profiles" table Row-Level Security policy contains a recursive helper function call. Please execute the non-recursive RLS migration in your Supabase SQL Editor.'
          );
        }

        // 2. Permission denied (PostgreSQL code 42501)
        if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
          throw new Error(
            `Database Permission Denied (42501): RLS policy prevented loading the profile for UID ${uid}. Verify that authenticated users have SELECT permission on their own profile row.`
          );
        }

        // 3. Other database errors
        throw new Error(
          `Database error verifying profile: ${error.message} (Code: ${error.code || 'UNKNOWN'}).`
        );
      }

      if (!data) {
        throw new Error(
          `No profile record found in the "profiles" table for user ID: ${uid} (${email || 'unknown email'}). Please ensure a corresponding row exists in public.profiles.`
        );
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
    } catch (err: any) {
      if (err.message) {
        throw err;
      }
      throw new Error(
        'An unexpected error occurred while verifying your account profile in the database.'
      );
    }
  },
};

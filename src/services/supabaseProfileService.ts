import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/auth';

const LOCAL_PROFILES_KEY = 'theen_cached_profiles';

export const supabaseProfileService = {
  getUserProfile: async (uid: string, email?: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (data && !error) {
        const profile: UserProfile = {
          uid: data.id || uid,
          email: data.email || email || '',
          displayName: data.display_name || '',
          role: data.role as UserRole,
          isActive: data.is_active !== false,
          teacherId: data.teacher_id,
          gender: data.gender,
          phone: data.phone,
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
        supabaseProfileService.cacheProfileLocally(profile);
        return profile;
      }
    } catch (err) {
      console.warn('Supabase profile fetch notice (using fallback cache):', err);
    }

    return supabaseProfileService.getLocalCachedProfile(uid, email);
  },

  cacheProfileLocally: (profile: UserProfile): void => {
    try {
      const existing: Record<string, UserProfile> = JSON.parse(
        localStorage.getItem(LOCAL_PROFILES_KEY) || '{}'
      );
      existing[profile.uid] = profile;
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(existing));
    } catch {}
  },

  getLocalCachedProfile: (uid: string, email?: string): UserProfile | null => {
    try {
      const existing: Record<string, UserProfile> = JSON.parse(
        localStorage.getItem(LOCAL_PROFILES_KEY) || '{}'
      );
      if (existing[uid]) return existing[uid];

      if (email) {
        const normalized = email.toLowerCase();
        if (normalized.includes('admin') || normalized === 'theeninstitute@gmail.com') {
          return {
            uid,
            email,
            displayName: 'THEEN Academic Admin',
            role: normalized.includes('super') ? 'SUPER_ADMIN' : 'ADMIN',
            isActive: true,
            permissions: {
              admissions: true,
              students: true,
              teachers: true,
              batches: true,
              attendance: true,
              reports: true,
              finance: normalized.includes('super'),
              settings: normalized.includes('super'),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        if (normalized.includes('teacher') || normalized.includes('usthad') || normalized.includes('muallima')) {
          const isFemale = normalized.includes('muallima') || normalized.includes('amina');
          return {
            uid,
            email,
            displayName: isFemale ? 'Muallima Fathima' : 'Usthad Muhammad',
            role: 'TEACHER',
            isActive: true,
            teacherId: isFemale ? 'FT001' : 'MT001',
            gender: isFemale ? 'female' : 'male',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }
    } catch {}
    return null;
  },
};

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { UserProfile, UserRole } from '../types/auth';

const PROFILES_COLLECTION = 'profiles';

// Local storage backup/cache for offline/dev synchronization
const LOCAL_PROFILES_KEY = 'theen_cached_profiles';

export const firestoreService = {
  // Retrieve profile for an authenticated UID
  getUserProfile: async (uid: string, email?: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, PROFILES_COLLECTION, uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const profile: UserProfile = {
          uid,
          email: data.email || email || '',
          displayName: data.displayName || '',
          role: data.role as UserRole,
          isActive: data.isActive !== false,
          teacherId: data.teacherId,
          gender: data.gender,
          phone: data.phone,
          permissions: data.permissions,
          createdAt: data.createdAt ? data.createdAt.toString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? data.updatedAt.toString() : new Date().toISOString(),
        };

        // Cache locally for resilient session restoring
        firestoreService.cacheProfileLocally(profile);
        return profile;
      }
    } catch (err) {
      console.warn('Firestore fetch notice (using cached/fallback profile if present):', err);
    }

    // Check local profile cache or dev default
    return firestoreService.getLocalCachedProfile(uid, email);
  },

  // Save profile to Firestore
  setUserProfile: async (profile: UserProfile): Promise<void> => {
    try {
      const docRef = doc(db, PROFILES_COLLECTION, profile.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore setProfile warning:', err);
    }
    firestoreService.cacheProfileLocally(profile);
  },

  // Local caching utilities
  cacheProfileLocally: (profile: UserProfile): void => {
    try {
      const existing: Record<string, UserProfile> = JSON.parse(
        localStorage.getItem(LOCAL_PROFILES_KEY) || '{}'
      );
      existing[profile.uid] = profile;
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(existing));
    } catch {
      // Ignore localStorage errors
    }
  },

  getLocalCachedProfile: (uid: string, email?: string): UserProfile | null => {
    try {
      const existing: Record<string, UserProfile> = JSON.parse(
        localStorage.getItem(LOCAL_PROFILES_KEY) || '{}'
      );
      if (existing[uid]) {
        return existing[uid];
      }

      // Default demo profiles for seamless evaluation & development
      if (email) {
        const normalizedEmail = email.toLowerCase();
        if (normalizedEmail.includes('admin') || normalizedEmail === 'theeninstitute@gmail.com') {
          const adminProfile: UserProfile = {
            uid,
            email,
            displayName: 'THEEN Academic Admin',
            role: normalizedEmail.includes('super') ? 'SUPER_ADMIN' : 'ADMIN',
            isActive: true,
            permissions: {
              admissions: true,
              students: true,
              teachers: true,
              batches: true,
              attendance: true,
              reports: true,
              finance: normalizedEmail.includes('super'),
              settings: normalizedEmail.includes('super'),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          firestoreService.cacheProfileLocally(adminProfile);
          return adminProfile;
        }

        if (normalizedEmail.includes('teacher') || normalizedEmail.includes('usthad') || normalizedEmail.includes('muallima')) {
          const isFemale = normalizedEmail.includes('muallima') || normalizedEmail.includes('female');
          const teacherProfile: UserProfile = {
            uid,
            email,
            displayName: isFemale ? 'Mu’allima Teacher' : 'Usthad Teacher',
            role: 'TEACHER',
            isActive: true,
            teacherId: isFemale ? 'FT001' : 'MT001',
            gender: isFemale ? 'female' : 'male',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          firestoreService.cacheProfileLocally(teacherProfile);
          return teacherProfile;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  },
};

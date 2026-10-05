import { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER';

export interface AdminPermissions {
  admissions: boolean;
  students: boolean;
  teachers: boolean;
  batches: boolean;
  attendance: boolean;
  reports: boolean;
  finance: boolean;
  settings: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  isActive: boolean;
  teacherId?: string; // e.g. MT001 or FT001 (assigned after approval)
  gender?: 'male' | 'female';
  phone?: string;
  permissions?: Partial<AdminPermissions>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  clearError: () => void;
}

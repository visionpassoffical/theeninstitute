import React from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from '../context/RouterContext';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  loginPath: '/admin/login' | '/teacher/login';
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  loginPath,
  children,
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const { navigate } = useRouter();

  // Loading Screen to prevent visual flickering of protected content
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#060D1A] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="w-12 h-12 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] animate-pulse">
          <span className="font-arabic text-xl font-bold">ت</span>
        </div>
        <div className="space-y-1">
          <p className="font-brand-display text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6] uppercase tracking-widest">
            THEEN – INSTITUTE OF QUR’AN
          </p>
          <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
            Verifying account & security credentials...
          </p>
        </div>
      </div>
    );
  }

  // Case 1: Unauthenticated
  if (!currentUser) {
    navigate(loginPath);
    return null;
  }

  // Case 2: Authenticated but missing profile in Firestore
  if (!userProfile) {
    navigate('/unauthorized', {
      reason: 'missing_profile',
      message: 'Your account profile could not be verified. Please contact THEEN administration.',
    });
    return null;
  }

  // Case 3: Inactive status
  if (!userProfile.isActive) {
    navigate('/unauthorized', {
      reason: 'inactive',
      message: 'Your account is currently inactive. Please contact THEEN administration.',
    });
    return null;
  }

  // Case 4: Role not authorized (e.g. Teacher trying to access Admin dashboard)
  if (!allowedRoles.includes(userProfile.role)) {
    navigate('/unauthorized', {
      reason: 'unauthorized_role',
      message: 'You do not have permission to access this portal.',
    });
    return null;
  }

  // Authorized
  return <>{children}</>;
};

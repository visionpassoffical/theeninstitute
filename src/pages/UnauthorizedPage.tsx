import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../auth/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { t, isRtl, fontClass } = useLanguage();
  const { navigate, routeState } = useRouter();
  const { userProfile, logout } = useAuth();

  const customMessage =
    routeState?.message ||
    'You do not have permission to access this protected area.';

  return (
    <div className="pt-32 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-8 sm:p-10 shadow-xl text-center space-y-6">
          {/* Shield Alert Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center border border-red-200 dark:border-red-900">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
              Access Restricted
            </span>
            <h1 className={`text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              Access Denied
            </h1>
            <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
              {customMessage}
            </p>
          </div>

          {userProfile && (
            <div className="p-3.5 rounded-lg bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-xs text-start space-y-1">
              <p className="text-[#5E6D84] dark:text-[#9EADC4]">
                Signed in as: <span className="font-semibold text-[#071A3D] dark:text-white">{userProfile.email}</span>
              </p>
              <p className="text-[#5E6D84] dark:text-[#9EADC4]">
                Role: <span className="font-mono font-bold text-[#C5A869]">{userProfile.role}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </button>

            {userProfile ? (
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-[#41536E] dark:text-[#C5D2E5] hover:text-[#071A3D] dark:hover:text-white bg-transparent hover:bg-[#EDE8DC]/50 dark:hover:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md transition-colors cursor-pointer"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-[#071A3D] dark:text-[#F3EFE6] bg-transparent hover:bg-[#EDE8DC]/50 dark:hover:bg-[#060D1A] border border-[#C5A869]/50 rounded-md transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5A869]" />
                <span>Go to Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

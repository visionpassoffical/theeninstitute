import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, LogOut, CheckCircle2, ArrowLeft, BookOpen, Clock } from 'lucide-react';

export const TeacherDashboardPlaceholder: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { navigate } = useRouter();
  const { fontClass } = useLanguage();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Operational Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5] dark:border-[#1F3354]">
          <div className="text-start">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
                Faculty Session Active
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              THEEN Faculty Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Authenticated Teacher Details Card */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 sm:p-8 shadow-md text-start space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  {userProfile?.displayName || 'Faculty Member'}
                </h2>
                <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                  {userProfile?.email}
                </p>
              </div>
            </div>

            {/* Teacher ID Badge */}
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block">
                Teacher ID
              </span>
              <span className="font-mono text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                {userProfile?.teacherId || 'MT001'}
              </span>
            </div>
          </div>

          {/* Verification Indicators */}
          <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82]">
              Security & Role Status
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#41536E] dark:text-[#C5D2E5]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Role: TEACHER</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Account Status: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Authorized Faculty Member</span>
              </div>
            </div>
          </div>

          {/* Phase Notice */}
          <div className="p-5 rounded-xl bg-[#F4EFE6]/60 dark:bg-[#060D1A] border border-[#C5A869]/30 text-start space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
              Teacher Dashboard Coming Soon
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed">
              Teacher authentication, session persistence, and security isolation are established. Full classroom management, student rosters, live session links, and student attendance tools will be delivered in upcoming parts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

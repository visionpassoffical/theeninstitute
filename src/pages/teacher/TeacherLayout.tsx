import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter, AppRoute } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Language } from '../../types';
import { formatKolkataDate } from '../../utils/timezone';

interface TeacherLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'students' | 'today' | 'attendance' | 'progress' | 'profile';
  title?: string;
  subtitle?: string;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({
  children,
  activeTab,
  title,
  subtitle,
}) => {
  const { userProfile, logout } = useAuth();
  const { navigate, currentRoute } = useRouter();
  const { language, setLanguage, fontClass, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const teacherId = userProfile?.teacherId || 'MT001';
  const teacherName = userProfile?.displayName || 'Faculty Member';
  const todayStr = formatKolkataDate(new Date());

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const navItems: {
    id: 'dashboard' | 'students' | 'today' | 'attendance' | 'progress' | 'profile';
    label: { en: string; ml: string; ur: string };
    route: AppRoute;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }[] = [
    {
      id: 'today',
      label: { en: "Today's Classes", ml: 'ഇന്നത്തെ ക്ലാസുകൾ', ur: 'آج کی کلاسیں' },
      route: '/teacher/today',
      icon: CalendarCheck,
      highlight: true,
    },
    {
      id: 'dashboard',
      label: { en: 'Dashboard', ml: 'ഡാഷ്‌ബോർഡ്', ur: 'ڈیش بورڈ' },
      route: '/teacher/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'students',
      label: { en: 'My Students', ml: 'എന്റെ വിദ്യാർത്ഥികൾ', ur: 'میرے طلباء' },
      route: '/teacher/students',
      icon: Users,
    },
    {
      id: 'attendance',
      label: { en: 'Attendance History', ml: 'ഹാജർ നില', ur: 'حاضری کا ریکارڈ' },
      route: '/teacher/attendance',
      icon: ClipboardList,
    },
    {
      id: 'progress',
      label: { en: 'Student Progress', ml: 'പുരോഗതി റിപ്പോർട്ട്', ur: 'طلباء کی پیش رفت' },
      route: '/teacher/progress',
      icon: TrendingUp,
    },
    {
      id: 'profile',
      label: { en: 'Faculty Profile', ml: 'പ്രൊഫൈൽ', ur: 'میری پروفائل' },
      route: '/teacher/profile',
      icon: UserCheck,
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row bg-[#FBF9F5] dark:bg-[#060D1A] text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300 ${fontClass}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Mobile Top App Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#071A3D] text-white border-b border-[#C5A869]/30 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md hover:bg-white/10 text-[#C5A869] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm tracking-wide text-[#F3EFE6]">
                THEEN FACULTY
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#C5A869]/20 text-[#D4BC82] border border-[#C5A869]/40 rounded">
                {teacherId}
              </span>
            </div>
            <p className="text-[10px] text-[#9EADC4]">{todayStr} (IST)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/teacher/today')}
            className="px-2.5 py-1 text-xs font-semibold bg-[#C5A869] text-[#071A3D] rounded hover:bg-[#D4BC82] transition-colors flex items-center gap-1 shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded text-[#D4BC82] hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#071A3D]/80 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#071A3D] text-white h-full p-5 flex flex-col justify-between border-r border-[#C5A869]/30 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F3EFE6] truncate max-w-[150px]">
                      {teacherName}
                    </h3>
                    <span className="text-[10px] font-mono text-[#D4BC82]">{teacherId}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#9EADC4] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.route);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-start cursor-pointer ${
                        isActive
                          ? 'bg-[#C5A869] text-[#071A3D] font-bold shadow-sm'
                          : item.highlight
                          ? 'bg-white/10 text-[#F3EFE6] hover:bg-white/15'
                          : 'text-[#9EADC4] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#071A3D]' : 'text-[#C5A869]'}`} />
                      <span className="flex-1">{item.label[language] || item.label.en}</span>
                      {item.highlight && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Language Selector */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#8A7038] dark:text-[#D4BC82] tracking-wider">
                  Language / ഭാഷ / زبان
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['ml', 'en', 'ur'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLanguage(l)}
                      className={`px-2 py-1 text-xs rounded text-center transition-colors cursor-pointer ${
                        language === l
                          ? 'bg-[#C5A869] text-[#071A3D] font-bold'
                          : 'bg-white/5 text-[#9EADC4] hover:bg-white/10'
                      }`}
                    >
                      {l === 'ml' ? 'മലയാളം' : l === 'ur' ? 'اردو' : 'English'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-[#9EADC4] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Website</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#071A3D] text-white border-r border-[#C5A869]/30 p-6 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Faculty Header Brand */}
          <div className="pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4BC82]">
                Faculty Portal
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-white tracking-wide">
              THEEN INSTITUTE
            </h2>
            <p className="text-[11px] text-[#9EADC4]">Qur’an & Sacred Islamic Studies</p>
          </div>

          {/* Teacher Badge Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 text-start">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-[#D4BC82] tracking-wider">
                Assigned Faculty
              </span>
              <span className="font-mono text-xs font-bold text-[#C5A869] bg-[#C5A869]/10 px-2 py-0.5 rounded border border-[#C5A869]/30">
                {teacherId}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{teacherName}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#9EADC4] pt-1">
              <Clock className="w-3 h-3 text-[#D4BC82]" />
              <span>{todayStr} (IST)</span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-start cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A869] text-[#071A3D] font-bold shadow-sm'
                      : item.highlight
                      ? 'bg-white/10 text-[#F3EFE6] hover:bg-white/15'
                      : 'text-[#9EADC4] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#071A3D]' : 'text-[#C5A869]'}`} />
                  <span className="flex-1">{item.label[language] || item.label.en}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Language & Theme Switchers, Public Link, Logout */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          {/* Trilingual Switcher */}
          <div className="space-y-1.5 text-start">
            <span className="text-[10px] uppercase font-semibold text-[#8A7038] dark:text-[#D4BC82] tracking-wider block">
              Language / ഭാഷ / زبان
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['ml', 'en', 'ur'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-1.5 py-1 text-[11px] rounded text-center transition-colors cursor-pointer ${
                    language === l
                      ? 'bg-[#C5A869] text-[#071A3D] font-bold'
                      : 'bg-white/5 text-[#9EADC4] hover:bg-white/10'
                  }`}
                >
                  {l === 'ml' ? 'മലയാളം' : l === 'ur' ? 'اردو' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-[#9EADC4] hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#D4BC82]" /> : <Moon className="w-3.5 h-3.5 text-[#D4BC82]" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#9EADC4] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public</span>
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white dark:bg-[#0B172B] border-b border-[#E8E2D5] dark:border-[#1F3354] shadow-2xs">
          <div className="text-start">
            <h1 className="text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              {title || 'Faculty Portal'}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/teacher/today')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#C5A869] text-[#071A3D] hover:bg-[#D4BC82] rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Today's Classes</span>
            </button>

            <div className="h-6 w-px bg-[#E8E2D5] dark:bg-[#1F3354]" />

            <div className="flex items-center gap-2.5 text-start">
              <div className="w-9 h-9 rounded-full bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#071A3D] dark:text-[#F3EFE6] leading-tight">
                  {teacherName}
                </p>
                <p className="text-[10px] font-mono text-[#8A7038] dark:text-[#D4BC82]">
                  {teacherId} • Active Faculty
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};

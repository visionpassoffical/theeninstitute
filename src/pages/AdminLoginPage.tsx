import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../auth/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, X, CheckCircle2, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { t, isRtl, fontClass } = useLanguage();
  const { navigate } = useRouter();
  const { login, resetPassword, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await login(email, password);

      // Verify role
      if (profile.role !== 'SUPER_ADMIN' && profile.role !== 'ADMIN') {
        setLocalError('This account does not have administrative privileges. Please log in through the Teacher portal.');
        setIsSubmitting(false);
        return;
      }

      // Success -> navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch {
      // Enumeration protection: always show sent message
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300 flex items-center justify-center">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-islamic-grid dark:bg-islamic-grid-dark opacity-60 pointer-events-none" />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 w-full">
        {/* Back Link */}
        <div className="mb-6 text-start">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-8 sm:p-10 shadow-xl text-start space-y-6">
          {/* Header & Emblem */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 mx-auto flex items-center justify-center text-[#C5A869] shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
                Administrative Portal
              </span>
              <h1 className={`text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-tight ${fontClass}`}>
                Admin Sign In
              </h1>
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] mt-1">
                THEEN – INSTITUTE OF QUR’AN
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 leading-relaxed animate-in fade-in">
              {localError || authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9AA8] dark:text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@theeninstitute.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetSent(false);
                    setForgotModalOpen(true);
                  }}
                  className="text-[11px] font-medium text-[#8A7038] dark:text-[#D4BC82] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9AA8] dark:text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C9AA8] dark:text-[#64748B] hover:text-[#071A3D] dark:hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Notice */}
          <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354] text-center">
            <p className="text-[11px] text-[#8C9AA8] dark:text-[#64748B]">
              Are you a faculty member?{' '}
              <button
                onClick={() => navigate('/teacher/login')}
                className="font-semibold text-[#071A3D] dark:text-[#C5A869] hover:underline cursor-pointer"
              >
                Teacher Sign In →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setForgotModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-2xl z-10 text-start space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3">
              <h3 className="text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                Reset Administrator Password
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 text-[#8C9AA8] hover:text-[#071A3D] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs text-[#41536E] dark:text-[#B1BFD4] leading-relaxed">
                  If an account exists with this email, a password reset link has been dispatched to your inbox.
                </p>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                  Enter your official administrator email to receive a password reset authorization email.
                </p>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@theeninstitute.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#5E6D84] dark:text-[#9EADC4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md transition-colors"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const TeacherSuccessPage: React.FC = () => {
  const { t, isRtl, fontClass } = useLanguage();
  const { navigate, routeState } = useRouter();

  const application = routeState?.application;
  const applicationId = application?.applicationId || 'TAPP-0001';

  return (
    <div className="pt-32 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-8 sm:p-12 shadow-xl text-center space-y-7">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-[#C5A869]/20 text-[#8A7038] dark:text-[#C5A869] mx-auto flex items-center justify-center border border-[#C5A869]/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          {/* Badge & Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE6] dark:bg-[#060D1A] text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] border border-[#C5A869]/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.teacherApply.success.badge}</span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-medium text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${fontClass}`}
            >
              {t.teacherApply.success.title}
            </h1>

            <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed max-w-md mx-auto ${fontClass}`}>
              {t.teacherApply.success.desc}
            </p>
          </div>

          {/* Structured Teacher App ID Card */}
          <div className="p-5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]/70 dark:border-[#1F3354]/70">
              <span className="text-xs uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] font-semibold">
                {t.teacherApply.success.idLabel}
              </span>
              <span className="font-mono text-base font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-wider">
                {applicationId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                {t.teacherApply.success.statusLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>PENDING REVIEW</span>
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-start bg-[#F4EFE6]/50 dark:bg-[#091528] rounded-xl p-5 border border-[#E8E2D5] dark:border-[#1F3354] space-y-2.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              {t.teacherApply.success.nextStepsTitle}
            </h2>
            <ul className={`space-y-2 text-xs text-[#41536E] dark:text-[#B1BFD4] ${fontClass}`}>
              <li className="flex items-start gap-2">
                <span className="text-[#C5A869] font-bold">1.</span>
                <span>{t.teacherApply.success.nextStep1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C5A869] font-bold">2.</span>
                <span>{t.teacherApply.success.nextStep2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C5A869] font-bold">3.</span>
                <span>{t.teacherApply.success.nextStep3}</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors"
            >
              <span>{t.teacherApply.success.backHome}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

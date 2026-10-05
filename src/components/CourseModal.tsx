import React from 'react';
import { Course } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApply: (courseId: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onApply,
}) => {
  const { language, t, isRtl, fontClass } = useLanguage();

  if (!course) return null;

  const name = course.name[language] || course.name.en;
  const subtitle = course.subtitle[language] || course.subtitle.en;
  const description = course.description[language] || course.description.en;
  const highlights = course.highlights[language] || course.highlights.en;
  const suitableFor = course.suitableFor[language] || course.suitableFor.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] shadow-2xl overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#091528]">
          <div className="flex items-center gap-3 text-start">
            <span className="font-brand-display text-xs font-semibold px-2.5 py-1 bg-[#071A3D] text-[#C5A869] dark:bg-[#C5A869]/20 rounded-xs">
              COURSE {course.number}
            </span>
            <h3 className={`text-lg sm:text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              {name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5E6D84] hover:text-[#071A3D] dark:text-[#9EADC4] dark:hover:text-white rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-start max-h-[75vh] overflow-y-auto">
          {/* Subtitle & Description */}
          <div>
            <p className={`text-sm font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider mb-2 ${fontClass}`}>
              {subtitle}
            </p>
            <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#C5D2E5] leading-relaxed ${fontClass}`}>
              {description}
            </p>
          </div>

          {/* Madhhab Section for Fiqh */}
          {course.madhhabs && (
            <div className="p-4 rounded-lg bg-[#F4EFE6]/70 dark:bg-[#060D1A] border border-[#C5A869]/30 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A869]" />
                <h4 className={`text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.courses.madhhabNote}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#41536E] dark:text-[#B1BFD4]">
                <div className="p-3 bg-white dark:bg-[#0B172B] rounded-md border border-[#E8E2D5] dark:border-[#1F3354]">
                  <p className="font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-1">
                    {language === 'ml' ? 'ശാഫിഈ മദ്ഹബ്' : language === 'ur' ? 'فقہ شافعی' : 'Shafi Madhhab'}
                  </p>
                  <p className={fontClass}>{course.madhhabs.shafi[language] || course.madhhabs.shafi.en}</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0B172B] rounded-md border border-[#E8E2D5] dark:border-[#1F3354]">
                  <p className="font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-1">
                    {language === 'ml' ? 'ഹനഫീ മദ്ഹബ്' : language === 'ur' ? 'فقہ حنفی' : 'Hanafi Madhhab'}
                  </p>
                  <p className={fontClass}>{course.madhhabs.hanafi[language] || course.madhhabs.hanafi.en}</p>
                </div>
              </div>
            </div>
          )}

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              {t.courses.keyFocusLabel}
            </h4>
            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                  <span className={`text-xs sm:text-sm text-[#41536E] dark:text-[#C5D2E5] ${fontClass}`}>
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div className="p-4 rounded-lg bg-[#FBF9F5] dark:bg-[#091528] border border-[#E8E2D5] dark:border-[#1F3354]">
            <h4 className={`text-xs font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] mb-1 ${fontClass}`}>
              {t.courses.suitableForLabel}
            </h4>
            <p className={`text-xs sm:text-sm text-[#41536E] dark:text-[#B1BFD4] ${fontClass}`}>
              {suitableFor}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#091528]">
          <span className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
            Group (Max 5) & 1-on-1 Sessions Available
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#41536E] dark:text-[#B1BFD4] hover:text-[#071A3D] dark:hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(course.id);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-xs transition-colors"
            >
              <span>{t.courses.applyForCourse}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 ${
                  isRtl ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

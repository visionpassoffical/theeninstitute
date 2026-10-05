import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

interface AdmissionsSectionProps {
  onOpenAdmission: () => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({ onOpenAdmission }) => {
  const { t, isRtl, fontClass } = useLanguage();

  return (
    <section
      id="admissions"
      className="py-20 lg:py-28 bg-[#071A3D] dark:bg-[#060D1A] text-white transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background Islamic Pattern Accent */}
      <div className="absolute inset-0 bg-islamic-grid opacity-10 pointer-events-none" />

      {/* Decorative Golden Arch Silhouette */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-t-[350px] border border-[#C5A869]/20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A869]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#D4BC82]">
            {t.admissions.kicker}
          </span>
          <Sparkles className="w-4 h-4 text-[#C5A869]" />
        </div>

        {/* Headline */}
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.2] text-[#F3EFE6] font-editorial-serif max-w-3xl mx-auto text-balance ${
            fontClass === 'font-urdu' ? 'font-urdu text-4xl sm:text-5xl leading-[1.8]!' : ''
          }`}
        >
          {t.admissions.title}
        </h2>

        {/* Subtitle */}
        <p className={`text-sm sm:text-base text-[#B1BFD4] max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
          {t.admissions.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenAdmission}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#071A3D] bg-[#C5A869] hover:bg-[#D4BC82] rounded-md shadow-lg transition-all duration-200 group cursor-pointer"
          >
            <span>{t.admissions.applyBtn}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
              }`}
            />
          </button>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-medium text-[#F3EFE6] bg-transparent hover:bg-white/10 border border-[#C5A869]/50 rounded-md transition-colors duration-200"
          >
            <Mail className="w-4 h-4 text-[#C5A869]" />
            <span>{t.admissions.contactBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users2, UserCheck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ClassSystemSectionProps {
  onOpenAdmission: () => void;
}

export const ClassSystemSection: React.FC<ClassSystemSectionProps> = ({ onOpenAdmission }) => {
  const { t, isRtl, fontClass } = useLanguage();

  return (
    <section
      id="class-formats"
      className="py-20 lg:py-28 bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.classSystem.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.classSystem.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.classSystem.subtitle}
          </p>
        </div>

        {/* 2 Primary Cards: Group vs Individual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Group Classes */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A869]/60 dark:hover:border-[#C5A869]/60 transition-all duration-300 shadow-xs hover:shadow-md text-start relative">
            <div>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8E2D5]/70 dark:border-[#1F3354]/70">
                <div className="w-12 h-12 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/15 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869]">
                  <Users2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82]">
                  {t.classSystem.group.tag}
                </span>
              </div>

              <h3 className={`text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-tight mb-3 ${fontClass}`}>
                {t.classSystem.group.title}
              </h3>

              <p className={`text-sm text-[#41536E] dark:text-[#B1BFD4] leading-relaxed mb-6 ${fontClass}`}>
                {t.classSystem.group.desc}
              </p>

              <div className="space-y-3 mb-8">
                {t.classSystem.group.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                    <span className={`text-xs sm:text-sm text-[#41536E] dark:text-[#C5D2E5] ${fontClass}`}>
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenAdmission}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors shadow-xs"
            >
              <span>{t.classSystem.group.action}</span>
              <ArrowRight
                className={`w-4 h-4 ${
                  isRtl ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Card 2: Individual Classes */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border-2 border-[#C5A869]/50 dark:border-[#C5A869]/40 p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A869] transition-all duration-300 shadow-sm hover:shadow-lg text-start relative">
            <div>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8E2D5]/70 dark:border-[#1F3354]/70">
                <div className="w-12 h-12 rounded-sm bg-[#C5A869] text-[#071A3D] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82]">
                  {t.classSystem.individual.tag}
                </span>
              </div>

              <h3 className={`text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-tight mb-3 ${fontClass}`}>
                {t.classSystem.individual.title}
              </h3>

              <p className={`text-sm text-[#41536E] dark:text-[#B1BFD4] leading-relaxed mb-6 ${fontClass}`}>
                {t.classSystem.individual.desc}
              </p>

              <div className="space-y-3 mb-8">
                {t.classSystem.individual.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                    <span className={`text-xs sm:text-sm text-[#41536E] dark:text-[#C5D2E5] ${fontClass}`}>
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenAdmission}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors shadow-xs"
            >
              <span>{t.classSystem.individual.action}</span>
              <ArrowRight
                className={`w-4 h-4 ${
                  isRtl ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Separate Ladies & Gents Batches Notice Bar */}
        <div className="rounded-xl bg-[#F4EFE6] dark:bg-[#091528] border border-[#C5A869]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 text-start">
          <div className="w-12 h-12 rounded-full bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className={`text-base font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              {t.classSystem.separateBatchesNotice.title}
            </h4>
            <p className={`text-xs sm:text-sm text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
              {t.classSystem.separateBatchesNotice.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

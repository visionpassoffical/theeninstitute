import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenAdmission: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAdmission }) => {
  const { t, isRtl, fontClass } = useLanguage();

  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Outer Decorative Line Frame */}
              <div className="absolute -inset-3 rounded-2xl border border-[#C5A869]/30 dark:border-[#C5A869]/20 -z-10 translate-x-3 translate-y-3" />

              <div className="overflow-hidden rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] shadow-lg bg-white dark:bg-[#0B172B]">
                <img
                  src="/src/assets/images/theen_about_architecture_1791182373341.jpg"
                  alt="Contemporary Islamic academy architecture with serene arches"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Subtle Arch Inscription Overlay */}
                <div className="p-5 bg-[#F4EFE6]/90 dark:bg-[#0B172B]/90 border-t border-[#E8E2D5] dark:border-[#1F3354] text-start">
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                    THEEN – INSTITUTE OF QUR’AN
                  </p>
                  <p className="font-arabic text-sm text-[#071A3D] dark:text-[#F3EFE6] mt-1">
                    وَالتِّينِ وَالزَّيْتُونِ — بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col text-start space-y-6">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2">
              <span className="h-[1px] w-6 bg-[#C5A869]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                {t.about.kicker}
              </span>
            </div>

            {/* Section Title */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
                fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
              }`}
            >
              {t.about.title}
            </h2>

            {/* Hairline Divider */}
            <div className="w-16 h-[1.5px] bg-[#C5A869]" />

            {/* Paragraphs */}
            <div className={`space-y-4 text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {t.about.values.map((val, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A869] shrink-0 mt-1" />
                  <span className={`text-xs sm:text-sm font-medium text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="pt-4">
              <button
                onClick={onOpenAdmission}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-xs transition-all duration-200 group"
              >
                <span>{t.about.cta}</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                    isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

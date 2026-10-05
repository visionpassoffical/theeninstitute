import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const WhyTheenSection: React.FC = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section
      id="why-theen"
      className="py-20 lg:py-28 bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.whyTheen.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.whyTheen.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.whyTheen.subtitle}
          </p>
        </div>

        {/* 9 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.whyTheen.pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-7 text-start flex flex-col justify-between hover:border-[#C5A869]/50 transition-all duration-300 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-brand-display text-sm font-bold text-[#C5A869]">
                    {pillar.num}
                  </span>
                  <span className="w-2 h-[1px] bg-[#C5A869]/50" />
                </div>

                <h3
                  className={`text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-2 tracking-tight ${fontClass}`}
                >
                  {pillar.title}
                </h3>

                <p
                  className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}
                >
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

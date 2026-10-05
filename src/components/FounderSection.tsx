import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Quote } from 'lucide-react';

export const FounderSection: React.FC = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section
      id="founder"
      className="py-20 lg:py-28 bg-[#F4EFE6]/70 dark:bg-[#081222] transition-colors duration-300 relative border-y border-[#E8E2D5] dark:border-[#152744]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.founder.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.founder.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.founder.subtitle}
          </p>
        </div>

        {/* Founder Institutional Card */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] shadow-md overflow-hidden p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Portrait Column: Arch-Framed Silhouette */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-56 sm:w-64">
                {/* Mihrab / Arch Outer Rim */}
                <div className="absolute -inset-2.5 rounded-t-[140px] rounded-b-xl border border-[#C5A869]/40 dark:border-[#C5A869]/30 -z-10 translate-y-1" />

                {/* Portrait Frame */}
                <div className="overflow-hidden rounded-t-[130px] rounded-b-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] shadow-sm">
                  <img
                    src="/src/assets/images/theen_founder_placeholder_1791182385315.jpg"
                    alt="Founder portrait silhouette"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 sm:h-80 object-cover object-top filter grayscale-20 hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Founder Title & Designation */}
              <div className="mt-5 space-y-1">
                <h3 className="text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-tight">
                  {t.founder.namePlaceholder}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
                  {t.founder.role}
                </p>
                <p className="text-[11px] text-[#5E6D84] dark:text-[#9EADC4] font-medium tracking-wider">
                  {t.founder.institute}
                </p>
              </div>
            </div>

            {/* Founder Message & Bio Column */}
            <div className="lg:col-span-8 flex flex-col text-start space-y-6">
              {/* Quote Icon & Headline */}
              <div className="flex items-center gap-3 text-[#C5A869]">
                <Quote className="w-8 h-8 opacity-60" />
                <span className={`text-xs uppercase tracking-widest font-bold ${fontClass}`}>
                  {t.founder.messageTitle}
                </span>
              </div>

              {/* Message Content */}
              <div className="relative pl-4 sm:pl-6 border-l-2 border-[#C5A869]/40 dark:border-[#C5A869]/30">
                <blockquote
                  className={`text-sm sm:text-base text-[#071A3D] dark:text-[#E2EAF4] italic leading-relaxed whitespace-pre-line font-editorial-serif ${
                    fontClass === 'font-urdu' ? 'font-urdu not-italic text-base sm:text-lg leading-[2]!' : ''
                  }`}
                >
                  {t.founder.messagePlaceholder}
                </blockquote>
              </div>

              {/* Bio Section */}
              <div className="pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
                <h4 className={`text-xs font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] mb-2 ${fontClass}`}>
                  {t.founder.bioTitle}
                </h4>
                <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                  {t.founder.bioPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

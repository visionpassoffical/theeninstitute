import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { Globe, Check } from 'lucide-react';

export const LanguageSection: React.FC = () => {
  const { language, setLanguage, t, fontClass } = useLanguage();

  const langCards: {
    code: Language;
    name: string;
    nativeName: string;
    scriptSample: string;
    fontFamily: string;
    isRtlCard?: boolean;
    description: string;
  }[] = [
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      scriptSample: 'വിശുദ്ധ ഖുർആൻ പഠനത്തിൽ ഉന്നത നിലവാരം',
      fontFamily: 'font-malayalam',
      description: t.languageSection.languages.ml.desc,
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      scriptSample: 'Excellence in Qur’anic Education & Sacred Knowledge',
      fontFamily: 'font-sans',
      description: t.languageSection.languages.en.desc,
    },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      scriptSample: 'قرآنی تعلیم اور علومِ اسلامیہ میں اعلیٰ معیار',
      fontFamily: 'font-urdu',
      isRtlCard: true,
      description: t.languageSection.languages.ur.desc,
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#F4EFE6]/50 dark:bg-[#081222] transition-colors duration-300 relative border-t border-[#E8E2D5] dark:border-[#152744]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.languageSection.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.languageSection.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.languageSection.subtitle}
          </p>
        </div>

        {/* Trilingual Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {langCards.map((item) => {
            const isSelected = language === item.code;

            return (
              <div
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-xl p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer text-start relative border ${
                  isSelected
                    ? 'bg-white dark:bg-[#0B172B] border-2 border-[#C5A869] shadow-md -translate-y-1'
                    : 'bg-[#FBF9F5] dark:bg-[#060D1A] border-[#E8E2D5] dark:border-[#1F3354] hover:border-[#C5A869]/50'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] bg-[#F4EFE6] dark:bg-[#060D1A] px-2 py-0.5 rounded-full border border-[#C5A869]/40">
                    <Check className="w-3 h-3 text-[#C5A869]" />
                    <span>Active View</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-[#C5A869]" />
                    <span className="text-xs uppercase tracking-widest text-[#8C9AA8] dark:text-[#64748B] font-semibold">
                      {item.name}
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-3 ${item.fontFamily}`}>
                    {item.nativeName}
                  </h3>

                  {/* Sample Calligraphy / Script Presentation */}
                  <div
                    dir={item.isRtlCard ? 'rtl' : 'ltr'}
                    className={`p-4 rounded-lg bg-[#EDE8DC]/40 dark:bg-[#0E1B33] border border-[#E8E2D5] dark:border-[#1F3354] mb-4 text-[#071A3D] dark:text-[#E2EAF4] ${
                      item.fontFamily
                    } ${item.code === 'ur' ? 'text-base sm:text-lg leading-[2]!' : 'text-sm font-medium'}`}
                  >
                    “{item.scriptSample}”
                  </div>

                  <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E2D5]/70 dark:border-[#1F3354]/70">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected
                        ? 'text-[#C5A869]'
                        : 'text-[#5E6D84] dark:text-[#9EADC4] group-hover:text-[#071A3D]'
                    }`}
                  >
                    {isSelected ? '✓ Currently Selected' : 'Click to Switch Language →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

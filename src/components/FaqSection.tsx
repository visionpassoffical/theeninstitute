import React, { useState } from 'react';
import { faqData } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { language, t, fontClass } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="py-20 lg:py-28 bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors duration-300 relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.faq.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.faq.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqData.map((item, idx) => {
            const isOpen = openId === item.id;
            const question = item.question[language] || item.question.en;
            const answer = item.answer[language] || item.answer.en;

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden text-start ${
                  isOpen
                    ? 'bg-white dark:bg-[#0B172B] border-[#C5A869]/60 shadow-xs'
                    : 'bg-[#F4EFE6]/40 dark:bg-[#081222] border-[#E8E2D5] dark:border-[#1F3354] hover:border-[#C5A869]/40'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-start gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-brand-display text-xs font-semibold text-[#C5A869] shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}
                    >
                      {question}
                    </h3>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[#8A7038] dark:text-[#D4BC82] bg-[#EDE8DC]/50 dark:bg-[#060D1A] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-start border-t border-[#E8E2D5]/50 dark:border-[#1F3354]/50 animate-in fade-in duration-200">
                    <p
                      className={`text-xs sm:text-sm text-[#41536E] dark:text-[#B1BFD4] leading-relaxed pl-7 ${fontClass}`}
                    >
                      {answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

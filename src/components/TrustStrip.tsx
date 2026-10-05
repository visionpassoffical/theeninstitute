import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Video, Users2, ShieldCheck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const { t, fontClass } = useLanguage();

  const items = [
    {
      icon: BookOpen,
      title: t.trustStrip.quranFocused.title,
      desc: t.trustStrip.quranFocused.desc,
    },
    {
      icon: Video,
      title: t.trustStrip.liveOnline.title,
      desc: t.trustStrip.liveOnline.desc,
    },
    {
      icon: Users2,
      title: t.trustStrip.groupIndividual.title,
      desc: t.trustStrip.groupIndividual.desc,
    },
    {
      icon: ShieldCheck,
      title: t.trustStrip.ladiesGents.title,
      desc: t.trustStrip.ladiesGents.desc,
    },
  ];

  return (
    <section className="relative border-y border-[#E8E2D5] dark:border-[#152744] bg-[#F4EFE6]/70 dark:bg-[#091528] py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-2 transition-transform duration-200 group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/15 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0 group-hover:bg-[#C5A869] group-hover:text-[#071A3D] transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-start space-y-1">
                  <h2
                    className={`text-sm font-semibold tracking-wide text-[#071A3D] dark:text-[#F3EFE6] uppercase ${fontClass}`}
                  >
                    {item.title}
                  </h2>
                  <p
                    className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

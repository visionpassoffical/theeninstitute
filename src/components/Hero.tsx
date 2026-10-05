import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, BookOpen, Users, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenAdmission: (courseId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAdmission }) => {
  const { t, isRtl, fontClass } = useLanguage();

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors duration-300"
    >
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-islamic-grid dark:bg-islamic-grid-dark opacity-70 pointer-events-none" />

      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A869]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Content Column */}
          <div className="lg:col-span-7 flex flex-col text-start space-y-6 lg:space-y-8">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2">
              <span className="h-[1px] w-6 bg-[#C5A869]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                {t.hero.kicker}
              </span>
              <span className="text-[11px] font-arabic text-[#C5A869]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            {/* Display Headline */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.18] tracking-tight text-[#071A3D] dark:text-[#F3EFE6] text-balance font-editorial-serif ${
                fontClass === 'font-urdu' ? 'font-urdu text-4xl sm:text-5xl leading-[1.8]!' : ''
              }`}
            >
              {t.hero.title}
            </h1>

            {/* Thin Ornamental Hairline */}
            <div className="w-24 h-[1.5px] bg-gradient-to-r from-[#C5A869] to-transparent" />

            {/* Subtitle / Program Explanation */}
            <p
              className={`text-base sm:text-lg text-[#41536E] dark:text-[#B1BFD4] leading-relaxed max-w-2xl ${fontClass}`}
            >
              {t.hero.subtitle}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenAdmission()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide uppercase text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <span>{t.hero.applyCta}</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                    isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
                  }`}
                />
              </button>

              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#071A3D] dark:text-[#F3EFE6] bg-transparent hover:bg-[#EDE8DC]/50 dark:hover:bg-[#0B172B] border border-[#C5A869]/50 rounded-md transition-colors duration-200"
              >
                <BookOpen className="w-4 h-4 text-[#C5A869]" />
                <span>{t.hero.exploreCta}</span>
              </a>
            </div>

            {/* Quiet Unboxed Feature Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5E6D84] dark:text-[#9EADC4] border-t border-[#E8E2D5] dark:border-[#152744]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A869]" />
                Hifz & Nazira
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-[#C5A869]" />
                Shafi & Hanafi Fiqh
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
                Madrasa Studies
              </span>
            </div>
          </div>

          {/* Visual Column: Architectural Arch Framing */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Outer Decorative Mihrab Border Accent */}
              <div className="absolute -inset-2.5 rounded-t-[150px] rounded-b-2xl border border-[#C5A869]/30 dark:border-[#C5A869]/20 -z-10 translate-x-2 translate-y-2 hidden sm:block" />

              {/* Main Image Frame with Islamic Arch Silhouette */}
              <div className="relative overflow-hidden rounded-t-[140px] rounded-b-xl border border-[#E8E2D5] dark:border-[#1F3354] bg-[#EDE8DC]/30 dark:bg-[#0B172B] shadow-xl">
                <img
                  src="/src/assets/images/theen_hero_study_1791182360885.jpg"
                  alt="Holy Quran on handcrafted stand in serene sacred atmosphere"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A3D]/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Architectural Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#071A3D]/95 backdrop-blur-md p-3.5 rounded-lg border border-[#C5A869]/30 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#071A3D] dark:text-[#F3EFE6] uppercase tracking-wider">
                        THEEN – INSTITUTE OF QUR’AN
                      </p>
                      <p className="text-[11px] text-[#5E6D84] dark:text-[#9EADC4] mt-0.5">
                        {t.hero.classFormatsPreview}
                      </p>
                    </div>
                    <span className="font-arabic text-xl font-bold text-[#C5A869]">
                      التِّين
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

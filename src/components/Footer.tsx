import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from '../context/RouterContext';
import { Language } from '../types';
import { Mail, Globe, Sun, Moon, ArrowUp, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage, t, fontClass } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentRoute, navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      navigate(href as any);
      return;
    }
    if (href.startsWith('#')) {
      if (currentRoute !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#courses', label: t.nav.courses },
    { href: '#class-formats', label: t.nav.classSystem },
    { href: '/admissions', label: t.nav.admissions, isRoute: true },
    { href: '/teachers/apply', label: t.nav.teachers, isRoute: true },
    { href: '#why-theen', label: t.nav.whyTheen },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact },
  ];

  const programLinks = [
    { href: '#courses', label: '01 — HIFZ (Memorization)' },
    { href: '#courses', label: '02 — NAZIRA (Tajweed & Recitation)' },
    { href: '#courses', label: '03 — FIQH (Shafi & Hanafi)' },
    { href: '#courses', label: '04 — MADRASA (Islamic Studies)' },
  ];

  return (
    <footer className="bg-[#050E1F] text-[#E2EAF4] pt-16 pb-12 border-t border-[#1F3354] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#1F3354]">
          {/* Brand Column (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col text-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#C5A869]/15 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869]">
                <span className="font-arabic text-lg font-bold">ت</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-brand-display text-xl font-bold tracking-wider text-white">
                    {t.brand.name}
                  </span>
                  <span className="font-arabic text-sm text-[#C5A869]">
                    {t.brand.arabic}
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#9EADC4] font-medium">
                  {t.brand.suffix}
                </p>
              </div>
            </div>

            <p className={`text-xs text-[#9EADC4] leading-relaxed max-w-sm ${fontClass}`}>
              {t.footer.brandDesc}
            </p>

            <div className="pt-2">
              <a
                href="mailto:theeninstitute@gmail.com"
                className="inline-flex items-center gap-2 text-xs text-[#C5A869] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>theeninstitute@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Col 6-8) */}
          <div className="lg:col-span-3 flex flex-col text-start space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4BC82]">
              {t.footer.navigationTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href, link.isRoute)}
                    className="text-[#9EADC4] hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Programs & Recruitment (Col 9-12) */}
          <div className="lg:col-span-4 flex flex-col text-start space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4BC82]">
              {t.footer.programsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {programLinks.map((prog, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(prog.href)}
                    className="text-[#9EADC4] hover:text-white transition-colors font-mono text-[11px] text-left cursor-pointer"
                  >
                    {prog.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Teacher Registration Link in Footer */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/teachers/apply')}
                className="inline-flex items-center gap-2 text-xs text-[#C5A869] hover:underline cursor-pointer font-medium"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.footer.teacherApplyLink}</span>
              </button>
            </div>

            {/* Language and Theme Switcher Row in Footer */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#0B172B] border border-[#1F3354] rounded-md p-1">
                <Globe className="w-3 h-3 text-[#C5A869] ml-1 mr-0.5" />
                {(['ml', 'en', 'ur'] as Language[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                      language === code
                        ? 'bg-[#C5A869] text-[#071A3D] font-bold'
                        : 'text-[#9EADC4] hover:text-white'
                    }`}
                  >
                    {code === 'ml' ? 'മലയാളം' : code === 'ur' ? 'اردو' : 'EN'}
                  </button>
                ))}
              </div>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md bg-[#0B172B] border border-[#1F3354] text-[#9EADC4] hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-[#C5A869]" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-md bg-[#0B172B] border border-[#1F3354] text-[#9EADC4] hover:text-white transition-colors ml-auto cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>{t.footer.copyright}</p>
          <p className="text-[11px] font-arabic text-[#C5A869]">
            التِّين – مَعْهَدُ الْقُرْآنِ الْكَرِيم
          </p>
        </div>
      </div>
    </footer>
  );
};

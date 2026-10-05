import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from '../context/RouterContext';
import { Language } from '../types';
import { Sun, Moon, Menu, X, Globe, ChevronDown, Check, UserPlus } from 'lucide-react';

interface HeaderProps {
  onOpenAdmission: (courseId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmission }) => {
  const { language, setLanguage, t, isRtl, fontClass } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentRoute, navigate } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      if (currentRoute !== '/') {
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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

  const languageOptions: { code: Language; label: string; native: string }[] = [
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF9F5]/95 dark:bg-[#060D1A]/95 backdrop-blur-md shadow-xs border-b border-[#E8E2D5]/80 dark:border-[#152744]'
          : 'bg-[#FBF9F5] dark:bg-[#060D1A] border-b border-[#E8E2D5]/50 dark:border-[#152744]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Lockup */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C5A869] text-left cursor-pointer"
          >
            {/* Typographic Monogram Emblem */}
            <div className="w-10 h-10 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/15 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] transition-transform duration-300 group-hover:scale-105 shrink-0">
              <span className="font-arabic text-lg font-bold">ت</span>
            </div>
            <div className="flex flex-col text-start">
              <div className="flex items-baseline gap-1.5">
                <span className="font-brand-display text-xl sm:text-2xl font-bold tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
                  {t.brand.name}
                </span>
                <span className="font-arabic text-xs sm:text-sm text-[#C5A869] font-medium tracking-normal">
                  {t.brand.arabic}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-medium text-[#5E6D84] dark:text-[#9EADC4] -mt-1">
                {t.brand.suffix}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.slice(0, 6).map((link) => {
              if (link.isRoute) {
                const isActive = currentRoute === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href as any)}
                    className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                      isActive
                        ? 'text-[#071A3D] dark:text-white font-bold after:w-full'
                        : 'text-[#41536E] dark:text-[#C5D2E5] hover:text-[#071A3D] dark:hover:text-white'
                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#C5A869] hover:after:w-full after:transition-all after:duration-200 ${fontClass}`}
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className={`text-sm font-medium text-[#41536E] dark:text-[#C5D2E5] hover:text-[#071A3D] dark:hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C5A869] hover:after:w-full after:transition-all after:duration-200 ${fontClass}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language Selector, Theme Toggle, Primary CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#071A3D] dark:text-[#F3EFE6] bg-[#EDE8DC]/50 dark:bg-[#0B172B] hover:bg-[#EDE8DC] dark:hover:bg-[#152744] border border-[#E8E2D5] dark:border-[#152744] rounded-md transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C5A869]"
                aria-label="Change Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A869]" />
                <span className="font-medium">
                  {language === 'ml' ? 'മലയാളം' : language === 'ur' ? 'اردو' : 'EN'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#5E6D84] dark:text-[#9EADC4]" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div
                    className={`absolute ${
                      isRtl ? 'left-0' : 'right-0'
                    } mt-2 w-44 bg-white dark:bg-[#0B172B] rounded-lg shadow-lg border border-[#E8E2D5] dark:border-[#152744] py-1.5 z-50`}
                  >
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLanguage(opt.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                          language === opt.code
                            ? 'bg-[#F4EFE6] dark:bg-[#152744] text-[#071A3D] dark:text-[#F3EFE6] font-semibold'
                            : 'text-[#41536E] dark:text-[#9EADC4] hover:bg-[#FBF9F5] dark:hover:bg-[#11203A]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{opt.native}</span>
                          <span className="text-[11px] text-[#8C9AA8] dark:text-[#64748B]">
                            ({opt.label})
                          </span>
                        </span>
                        {language === opt.code && (
                          <Check className="w-3.5 h-3.5 text-[#C5A869]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#41536E] dark:text-[#C5D2E5] hover:text-[#071A3D] dark:hover:text-white bg-[#EDE8DC]/50 dark:bg-[#0B172B] hover:bg-[#EDE8DC] dark:hover:bg-[#152744] border border-[#E8E2D5] dark:border-[#152744] rounded-md transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C5A869]"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#C5A869]" />
              ) : (
                <Moon className="w-4 h-4 text-[#071A3D]" />
              )}
            </button>

            {/* Primary CTA: Apply Now (Navigates to /admissions) */}
            <button
              onClick={() => navigate('/admissions')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-xs transition-all duration-200 whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C5A869] cursor-pointer"
            >
              {t.nav.applyNow}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#071A3D] dark:text-[#F3EFE6] bg-[#EDE8DC]/50 dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#152744] rounded-md focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF9F5] dark:bg-[#060D1A] border-b border-[#E8E2D5] dark:border-[#1F3354] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              if (link.isRoute) {
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(link.href as any);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      currentRoute === link.href
                        ? 'bg-[#F4EFE6] dark:bg-[#152744] text-[#071A3D] dark:text-white font-bold'
                        : 'text-[#41536E] dark:text-[#C5D2E5] hover:bg-[#EDE8DC]/50 dark:hover:bg-[#0B172B]'
                    } ${fontClass}`}
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(link.href, e);
                  }}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium text-[#41536E] dark:text-[#C5D2E5] hover:text-[#071A3D] dark:hover:text-white hover:bg-[#EDE8DC]/50 dark:hover:bg-[#0B172B] transition-colors ${fontClass}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#E8E2D5] dark:border-[#152744]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/admissions');
              }}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md shadow-xs cursor-pointer"
            >
              {t.nav.applyNow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

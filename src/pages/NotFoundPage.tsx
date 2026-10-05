import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { fontClass } = useLanguage();
  const { navigate } = useRouter();

  return (
    <div className={`pt-32 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300 flex items-center justify-center ${fontClass}`}>
      <div className="max-w-md mx-auto px-4 sm:px-6 w-full text-center">
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-8 sm:p-10 shadow-xl space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#C5A869]/10 text-[#C5A869] mx-auto flex items-center justify-center border border-[#C5A869]/30">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
              404 Error
            </span>
            <h1 className="text-2xl font-bold font-serif text-[#071A3D] dark:text-[#F3EFE6]">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#071A3D] bg-[#C5A869] hover:bg-[#D4BC82] rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

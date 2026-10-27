import React, { useState } from 'react';
import { coursesData } from '../data/coursesData';
import { useLanguage } from '../context/LanguageContext';
import { Course } from '../types';
import { CourseModal } from './CourseModal';
import {
  BookOpen,
  Scale,
  GraduationCap,
  HeartHandshake,
  Award,
  Clock,
  Moon,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CoursesSectionProps {
  onOpenAdmission: (courseId?: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onOpenAdmission }) => {
  const { language, t, isRtl, fontClass } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getCourseIcon = (id: string) => {
    switch (id) {
      case 'quran_studies':
        return BookOpen;
      case 'islamic_studies':
        return Scale;
      case 'madrasa_education':
        return GraduationCap;
      case 'tarbiyah':
        return HeartHandshake;
      case 'womens_education':
        return Award;
      case 'short_courses':
        return Clock;
      case 'ramadan_daurah':
        return Moon;
      case 'khatmul_quran':
        return CheckCircle2;
      default:
        return BookOpen;
    }
  };

  return (
    <section
      id="courses"
      className="py-20 lg:py-28 bg-[#F4EFE6]/50 dark:bg-[#081222] transition-colors duration-300 relative border-t border-[#E8E2D5] dark:border-[#152744]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.courses.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.courses.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.courses.subtitle}
          </p>
        </div>

        {/* Courses 8-Card Grid (Responsive 1-col on mobile, 2-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {coursesData.map((course) => {
            const Icon = getCourseIcon(course.id);
            const currentName = course.name[language] || course.name.en;
            const altName = language === 'ml' ? course.name.en : course.name.ml;
            const courseSubtitle = course.subtitle[language] || course.subtitle.en;
            const courseDesc = course.description[language] || course.description.en;
            const highlights = course.highlights[language] || course.highlights.en;

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5A869]/70 dark:hover:border-[#C5A869]/70 transition-all duration-300 hover:shadow-lg group text-start relative"
              >
                {/* Top Section */}
                <div>
                  {/* Top Row: Number, Tag & Icon */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]/70 dark:border-[#1F3354]/70 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-brand-display text-sm sm:text-base font-bold text-[#C5A869] tracking-wider">
                        {course.number}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]/60" />
                      <span className="text-[11px] uppercase tracking-widest text-[#8C9AA8] dark:text-[#64748B] font-semibold">
                        PROGRAM
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] flex items-center justify-center text-[#071A3D] dark:text-[#C5A869] group-hover:bg-[#071A3D] group-hover:text-[#C5A869] dark:group-hover:bg-[#C5A869] dark:group-hover:text-[#060D1A] transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title in Current Language & Bilingual Sub-heading */}
                  <div className="space-y-1 mb-3">
                    <h3
                      className={`text-xl sm:text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-tight ${fontClass}`}
                    >
                      {currentName}
                    </h3>
                    <p className="text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] tracking-wide">
                      {altName}
                    </p>
                    <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] pt-1 leading-normal ${fontClass}`}>
                      {courseSubtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-sm text-[#41536E] dark:text-[#B1BFD4] leading-relaxed mb-5 ${fontClass}`}
                  >
                    {courseDesc}
                  </p>

                  {/* Key Curriculum Badges/Highlights */}
                  <div className="mb-6 space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#071A3D] dark:text-[#E2EAF4]">
                      {language === 'ml' ? 'പ്രധാന പഠനവിഷയങ്ങൾ:' : language === 'ur' ? 'اہم نصابی موضوعات:' : 'Core Topics:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-block px-2.5 py-1 text-[11px] rounded bg-[#F4EFE6] dark:bg-[#060D1A] text-[#41536E] dark:text-[#C5D2E5] border border-[#E8E2D5] dark:border-[#1F3354]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="pt-4 border-t border-[#E8E2D5]/70 dark:border-[#1F3354]/70 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#071A3D] dark:text-[#E2EAF4] hover:text-[#C5A869] dark:hover:text-[#C5A869] transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{t.courses.viewDetails}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAdmission(course.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    <span>{t.nav.applyNow}</span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isRtl ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onApply={(courseId) => {
          setSelectedCourse(null);
          onOpenAdmission(courseId);
        }}
      />
    </section>
  );
};

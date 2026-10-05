import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { createTeacherSchema, TeacherFormValues } from '../utils/teacherValidation';
import { teacherService } from '../services/teacherService';
import {
  GraduationCap,
  BookOpen,
  Globe,
  Users,
  Laptop,
  HeartHandshake,
  Send,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const TeacherApplicationPage: React.FC = () => {
  const { language, t, isRtl, fontClass } = useLanguage();
  const { navigate } = useRouter();

  const validationMessages = t.teacherApply.validation as Record<string, string>;
  const schema = createTeacherSchema(validationMessages);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      dateOfBirth: '',
      age: undefined as any,
      country: '',
      city: '',
      whatsapp: '',
      email: '',
      qualification: '',
      institution: '',
      experience: '',
      quranBackground: '',
      otherQualifications: '',
      subjects: ['nazira'],
      languages: [language],
      preferredStudents: 'both',
      preferredTeachingTimes: '',
      device: 'laptop',
      internetQuality: 'good',
      motivation: '',
      additionalInformation: '',
      consent: undefined as any,
    },
  });

  const selectedDob = watch('dateOfBirth');
  const selectedSubjects = watch('subjects') || [];
  const selectedLanguages = watch('languages') || [];

  // Calculate age automatically from DOB
  useEffect(() => {
    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge >= 0) {
        setValue('age', calculatedAge, { shouldValidate: true });
      }
    }
  }, [selectedDob, setValue]);

  const handleSubjectToggle = (subject: 'hifz' | 'nazira' | 'fiqh' | 'madrasa') => {
    const current = [...selectedSubjects];
    const index = current.indexOf(subject);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(subject);
    }
    setValue('subjects', current as any, { shouldValidate: true });
  };

  const handleLanguageToggle = (langCode: 'ml' | 'en' | 'ur') => {
    const current = [...selectedLanguages];
    const index = current.indexOf(langCode);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(langCode);
    }
    setValue('languages', current as any, { shouldValidate: true });
  };

  const onSubmit = async (data: TeacherFormValues) => {
    try {
      const savedApplication = await teacherService.submitApplication({
        fullName: data.fullName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        age: Number(data.age),
        country: data.country,
        city: data.city,
        whatsapp: data.whatsapp,
        email: data.email,
        qualification: data.qualification,
        institution: data.institution,
        experience: data.experience,
        quranBackground: data.quranBackground,
        otherQualifications: data.otherQualifications,
        subjects: data.subjects,
        languages: data.languages,
        preferredStudents: data.preferredStudents,
        preferredTeachingTimes: data.preferredTeachingTimes,
        device: data.device,
        internetQuality: data.internetQuality,
        motivation: data.motivation,
        additionalInformation: data.additionalInformation,
        consent: data.consent,
      });

      navigate('/teachers/application-success', { application: savedApplication });
    } catch (error) {
      console.error('Teacher application error:', error);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-islamic-grid dark:bg-islamic-grid-dark opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t.teacherApply.success.backHome}</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.teacherApply.kicker}
            </span>
            <span className="h-[1px] w-8 bg-[#C5A869]" />
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-medium text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-4xl sm:text-5xl leading-[1.8]!' : ''
            }`}
          >
            {t.teacherApply.pageTitle}
          </h1>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
            {t.teacherApply.pageSubtitle}
          </p>
        </div>

        {/* Teacher Criteria Reassurance Box */}
        <div className="mb-10 bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-start text-xs text-[#41536E] dark:text-[#C5D2E5]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A869] shrink-0" />
              <span>Dedicated Female Faculty & Male Faculty</span>
            </div>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#C5A869] shrink-0" />
              <span>Sanad / Islamic Degree & Tajweed Expertise</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-[#C5A869] shrink-0" />
              <span>Structured Live Online Classrooms</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 sm:p-10 shadow-lg text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* ======================================================
                SECTION A — PERSONAL INFORMATION
            ====================================================== */}
            <div className="space-y-5">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.personal}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  01 / 08
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder={t.teacherApply.fields.fullNamePlaceholder}
                  className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white transition-colors ${
                    errors.fullName
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-[#E8E2D5] dark:border-[#1F3354]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Gender Radio */}
              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.gender} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] cursor-pointer hover:border-[#C5A869]/60 transition-colors">
                    <input
                      type="radio"
                      value="male"
                      {...register('gender')}
                      className="accent-[#071A3D] dark:accent-[#C5A869]"
                    />
                    <span className="text-xs font-semibold text-[#071A3D] dark:text-[#F3EFE6]">
                      {t.teacherApply.fields.male}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] cursor-pointer hover:border-[#C5A869]/60 transition-colors">
                    <input
                      type="radio"
                      value="female"
                      {...register('gender')}
                      className="accent-[#071A3D] dark:accent-[#C5A869]"
                    />
                    <span className="text-xs font-semibold text-[#071A3D] dark:text-[#F3EFE6]">
                      {t.teacherApply.fields.female}
                    </span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.gender.message}</p>
                )}
              </div>

              {/* DOB & Age Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.dateOfBirth} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white transition-colors ${
                      errors.dateOfBirth
                        ? 'border-red-400 dark:border-red-500'
                        : 'border-[#E8E2D5] dark:border-[#1F3354]'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.age} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white transition-colors ${
                      errors.age
                        ? 'border-red-400 dark:border-red-500'
                        : 'border-[#E8E2D5] dark:border-[#1F3354]'
                    }`}
                  />
                  {errors.age && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.age.message}</p>
                  )}
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.country} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    placeholder="e.g. India, UAE, Saudi Arabia, Qatar..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.country && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.city} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="e.g. Malappuram, Calicut, Dubai..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.whatsapp} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('whatsapp')}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.whatsapp && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.whatsapp.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="teacher@example.com"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ======================================================
                SECTION B — TEACHER QUALIFICATIONS
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.qualifications}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  02 / 08
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.qualification} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('qualification')}
                    placeholder={t.teacherApply.fields.qualificationPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.qualification && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.qualification.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.institution} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('institution')}
                    placeholder={t.teacherApply.fields.institutionPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.institution && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.institution.message}</p>
                  )}
                </div>
              </div>

              {/* Teaching Experience */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.experience} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  {...register('experience')}
                  placeholder={t.teacherApply.fields.experiencePlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
                {errors.experience && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.experience.message}</p>
                )}
              </div>

              {/* Quran Background & Other Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.quranBackground}
                  </label>
                  <input
                    type="text"
                    {...register('quranBackground')}
                    placeholder={t.teacherApply.fields.quranBackgroundPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.teacherApply.fields.otherQualifications}
                  </label>
                  <input
                    type="text"
                    {...register('otherQualifications')}
                    placeholder="e.g. B.A. Arabic, B.Ed, Online pedagogy certificates..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* ======================================================
                SECTION C — TEACHING SUBJECTS (MULTIPLE SELECT)
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.subjects}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  03 / 08
                </span>
              </div>

              <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] ${fontClass}`}>
                {t.teacherApply.fields.subjectsLabel} <span className="text-red-500">*</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'hifz', label: t.teacherApply.fields.subjectHifz },
                  { id: 'nazira', label: t.teacherApply.fields.subjectNazira },
                  { id: 'fiqh', label: t.teacherApply.fields.subjectFiqh },
                  { id: 'madrasa', label: t.teacherApply.fields.subjectMadrasa },
                ].map((item) => {
                  const isSelected = selectedSubjects.includes(item.id as any);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSubjectToggle(item.id as any)}
                      className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#C5A869] bg-[#F4EFE6]/60 dark:bg-[#060D1A] text-[#071A3D] dark:text-[#F3EFE6] font-semibold'
                          : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] text-[#41536E] dark:text-[#C5D2E5] hover:border-[#C5A869]/40'
                      }`}
                    >
                      <span className="text-xs">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-xs accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                    </div>
                  );
                })}
              </div>
              {errors.subjects && (
                <p className="text-[11px] text-red-500 font-medium">{errors.subjects.message}</p>
              )}
            </div>

            {/* ======================================================
                SECTION D — TEACHING LANGUAGES (MULTIPLE SELECT)
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.languages}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  04 / 08
                </span>
              </div>

              <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] ${fontClass}`}>
                {t.teacherApply.fields.languagesLabel} <span className="text-red-500">*</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'ml', label: t.teacherApply.fields.langMl },
                  { code: 'en', label: t.teacherApply.fields.langEn },
                  { code: 'ur', label: t.teacherApply.fields.langUr },
                ].map((item) => {
                  const isSelected = selectedLanguages.includes(item.code as any);
                  return (
                    <div
                      key={item.code}
                      onClick={() => handleLanguageToggle(item.code as any)}
                      className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#C5A869] bg-[#F4EFE6]/60 dark:bg-[#060D1A] text-[#071A3D] dark:text-[#F3EFE6] font-semibold'
                          : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] text-[#41536E] dark:text-[#C5D2E5] hover:border-[#C5A869]/40'
                      }`}
                    >
                      <span className="text-xs">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded-xs accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                    </div>
                  );
                })}
              </div>
              {errors.languages && (
                <p className="text-[11px] text-red-500 font-medium">{errors.languages.message}</p>
              )}
            </div>

            {/* ======================================================
                SECTION E — TEACHING PREFERENCES
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.preferences}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  05 / 08
                </span>
              </div>

              {/* Preferred Students Allocation */}
              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.preferredStudents} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: t.teacherApply.fields.prefMaleOnly },
                    { value: 'female', label: t.teacherApply.fields.prefFemaleOnly },
                    { value: 'both', label: t.teacherApply.fields.prefBoth },
                  ].map((pref) => (
                    <label
                      key={pref.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        value={pref.value}
                        {...register('preferredStudents')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                      <span>{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Teaching Times */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.preferredTeachingTimes} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('preferredTeachingTimes')}
                  placeholder={t.teacherApply.fields.preferredTeachingTimesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
                {errors.preferredTeachingTimes && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.preferredTeachingTimes.message}</p>
                )}
              </div>
            </div>

            {/* ======================================================
                SECTION F — DEVICE / INTERNET
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.deviceInternet}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  06 / 08
                </span>
              </div>

              {/* Device */}
              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.deviceLabel} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'smartphone', label: t.teacherApply.fields.devicePhone },
                    { value: 'tablet', label: t.teacherApply.fields.deviceTablet },
                    { value: 'laptop', label: t.teacherApply.fields.deviceLaptop },
                    { value: 'desktop', label: t.teacherApply.fields.deviceDesktop },
                  ].map((dev) => (
                    <label
                      key={dev.value}
                      className="flex items-center gap-2 p-3 rounded-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        value={dev.value}
                        {...register('device')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                      <span>{dev.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Internet */}
              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.internetLabel} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'good', label: t.teacherApply.fields.internetGood },
                    { value: 'average', label: t.teacherApply.fields.internetAverage },
                    { value: 'limited', label: t.teacherApply.fields.internetLimited },
                  ].map((net) => (
                    <label
                      key={net.value}
                      className="flex items-center gap-2 p-3 rounded-lg border border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#060D1A] cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        value={net.value}
                        {...register('internetQuality')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                      <span>{net.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================================
                SECTION G — MOTIVATION
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.motivation}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  07 / 08
                </span>
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.motivation} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register('motivation')}
                  placeholder={t.teacherApply.fields.motivationPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
                {errors.motivation && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.motivation.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.teacherApply.fields.additionalInformation}
                </label>
                <textarea
                  rows={2}
                  {...register('additionalInformation')}
                  placeholder="Any other certifications, publications, or special notes..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>
            </div>

            {/* ======================================================
                SECTION H — DECLARATION & CONSENT
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.teacherApply.sections.consent}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  08 / 08
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#F4EFE6]/60 dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    className="w-4 h-4 rounded-xs accent-[#071A3D] dark:accent-[#C5A869] mt-0.5"
                  />
                  <span className={`text-xs font-semibold text-[#071A3D] dark:text-[#F3EFE6] leading-relaxed ${fontClass}`}>
                    {t.teacherApply.fields.consentCheckbox} <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-red-500 font-medium pl-7">{errors.consent.message}</p>
                )}

                <p className={`text-[11px] text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed pl-7 ${fontClass}`}>
                  {t.teacherApply.fields.privacyNotice}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.teacherApply.fields.submitting}</span>
                  ) : (
                    <>
                      <span>{t.teacherApply.fields.submit}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { createAdmissionSchema, AdmissionFormValues } from '../utils/admissionValidation';
import { admissionService } from '../services/admissionService';
import {
  BookOpen,
  Users2,
  UserCheck,
  ShieldCheck,
  Send,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const { language, t, isRtl, fontClass } = useLanguage();
  const { navigate, routeState } = useRouter();

  const validationMessages = t.admissions.validation as Record<string, string>;
  const schema = createAdmissionSchema(validationMessages);

  const defaultCourse = (routeState?.courseId as any) || 'hifz';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      age: undefined as any,
      gender: 'male',
      country: '',
      state: '',
      city: '',
      whatsapp: '',
      email: '',
      isApplyingForSelf: false,
      guardianName: '',
      guardianWhatsapp: '',
      guardianRelationship: '',
      course: defaultCourse,
      classType: 'group',
      classLanguage: language,
      previousLearning: 'beginner',
      previousLearningDetails: '',
      preferredContact: 'whatsapp',
      notes: '',
      consent: undefined as any,
    },
  });

  const selectedDob = watch('dateOfBirth');
  const isApplyingForSelf = watch('isApplyingForSelf');
  const selectedCourse = watch('course');
  const selectedClassType = watch('classType');
  const selectedClassLang = watch('classLanguage');
  const selectedPrevious = watch('previousLearning');

  // Automatic Age calculation from DOB
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
        if (calculatedAge >= 18) {
          setValue('isApplyingForSelf', true);
        }
      }
    }
  }, [selectedDob, setValue]);

  const onSubmit = async (data: AdmissionFormValues) => {
    try {
      const savedApplication = await admissionService.submitApplication({
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        age: Number(data.age),
        gender: data.gender,
        country: data.country,
        state: data.state,
        city: data.city,
        whatsapp: data.whatsapp,
        email: data.email,
        isApplyingForSelf: data.isApplyingForSelf,
        guardianName: data.guardianName,
        guardianWhatsapp: data.guardianWhatsapp,
        guardianRelationship: data.guardianRelationship,
        course: data.course,
        classType: data.classType,
        classLanguage: data.classLanguage,
        previousLearning: data.previousLearning,
        previousLearningDetails: data.previousLearningDetails,
        preferredContact: data.preferredContact,
        notes: data.notes,
        consent: data.consent,
      });

      navigate('/admissions/success', { application: savedApplication });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-islamic-grid dark:bg-islamic-grid-dark opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t.admissions.success.backHome}</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.admissions.kicker}
            </span>
            <span className="h-[1px] w-8 bg-[#C5A869]" />
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-medium text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif text-balance ${
              fontClass === 'font-urdu' ? 'font-urdu text-4xl sm:text-5xl leading-[1.8]!' : ''
            }`}
          >
            {t.admissions.pageTitle}
          </h1>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
            {t.admissions.pageSubtitle}
          </p>
        </div>

        {/* Admission Guidelines / Reassurance Strip */}
        <div className="mb-10 bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-start text-xs text-[#41536E] dark:text-[#C5D2E5]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A869] shrink-0" />
              <span>Dedicated Separate Ladies & Gents Batches</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users2 className="w-4 h-4 text-[#C5A869] shrink-0" />
              <span>Small Groups (Max 5) or 1-on-1 Sessions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C5A869]" />
              <span>Malayalam, English & Urdu Instruction</span>
            </div>
          </div>
        </div>

        {/* Main Admission Form Card */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 sm:p-10 shadow-lg text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* ======================================================
                SECTION A — STUDENT INFORMATION
            ====================================================== */}
            <div className="space-y-5">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.studentInfo}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  01 / 08
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder={t.admissions.fields.fullNamePlaceholder}
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

              {/* DOB & Age Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.dateOfBirth} <span className="text-red-500">*</span>
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
                    {t.admissions.fields.age} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    placeholder={t.admissions.fields.agePlaceholder}
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

              {/* Gender Radio Selector (Separate Ladies & Gents batch placement) */}
              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.gender} <span className="text-red-500">*</span>
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
                      {t.admissions.fields.male}
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
                      {t.admissions.fields.female}
                    </span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.gender.message}</p>
                )}
              </div>

              {/* Location: Country, State, City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.country} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    placeholder={t.admissions.fields.countryPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.country && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.state} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    placeholder={t.admissions.fields.statePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.state && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.city} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder={t.admissions.fields.cityPlaceholder}
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
                    {t.admissions.fields.whatsapp} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('whatsapp')}
                    placeholder={t.admissions.fields.whatsappPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.whatsapp && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.whatsapp.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder={t.admissions.fields.emailPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ======================================================
                SECTION B — PARENT / GUARDIAN INFORMATION
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.guardianInfo}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  02 / 08
                </span>
              </div>

              {/* Adult self-apply toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F4EFE6]/60 dark:bg-[#060D1A] border border-[#C5A869]/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isApplyingForSelf')}
                  className="w-4 h-4 rounded-xs accent-[#071A3D] dark:accent-[#C5A869]"
                />
                <span className="text-xs font-semibold text-[#071A3D] dark:text-[#F3EFE6]">
                  {t.admissions.fields.isApplyingForSelf}
                </span>
              </label>

              {/* Guardian Fields (Rendered if not self-applying) */}
              {!isApplyingForSelf && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                        {t.admissions.fields.guardianName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('guardianName')}
                        placeholder={t.admissions.fields.guardianNamePlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                      />
                      {errors.guardianName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.guardianName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                        {t.admissions.fields.guardianWhatsapp} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('guardianWhatsapp')}
                        placeholder={t.admissions.fields.guardianWhatsappPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                      />
                      {errors.guardianWhatsapp && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.guardianWhatsapp.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                        {t.admissions.fields.guardianRelationship} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('guardianRelationship')}
                        placeholder={t.admissions.fields.guardianRelationshipPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                      />
                      {errors.guardianRelationship && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.guardianRelationship.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ======================================================
                SECTION C — COURSE SELECTION
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.courseSelection}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  03 / 08
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'hifz',
                    num: '01',
                    label: t.admissions.fields.courseHifz,
                    desc: 'Systematic Qur’an memorization with daily new lessons, revision, and Tajweed reinforcement.',
                  },
                  {
                    id: 'nazira',
                    num: '02',
                    label: t.admissions.fields.courseNazira,
                    desc: 'Reading fluency directly from the Mushaf with precise Makharij and applied Tajweed rules.',
                  },
                  {
                    id: 'fiqh',
                    num: '03',
                    label: t.admissions.fields.courseFiqh,
                    desc: 'Islamic jurisprudence studies covering worship acts according to Shafi or Hanafi schools.',
                  },
                  {
                    id: 'madrasa',
                    num: '04',
                    label: t.admissions.fields.courseMadrasa,
                    desc: 'Foundational Islamic studies covering Aqeedah, Akhlaq, Adhkar, and essential rulings.',
                  },
                ].map((courseItem) => {
                  const isChecked = selectedCourse === courseItem.id;
                  return (
                    <label
                      key={courseItem.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'border-2 border-[#C5A869] bg-[#F4EFE6]/50 dark:bg-[#060D1A] shadow-xs'
                          : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] hover:border-[#C5A869]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-brand-display text-xs font-bold text-[#C5A869]">
                            {courseItem.num}
                          </span>
                          <input
                            type="radio"
                            value={courseItem.id}
                            {...register('course')}
                            className="accent-[#071A3D] dark:accent-[#C5A869]"
                          />
                        </div>
                        <h3 className={`text-xs sm:text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-1 ${fontClass}`}>
                          {courseItem.label}
                        </h3>
                        <p className={`text-[11px] text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                          {courseItem.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.course && (
                <p className="text-[11px] text-red-500 font-medium">{errors.course.message}</p>
              )}
            </div>

            {/* ======================================================
                SECTION D — CLASS FORMAT (NO PRICES!)
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.classType}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  04 / 08
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Group class card */}
                <label
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedClassType === 'group'
                      ? 'border-2 border-[#C5A869] bg-[#F4EFE6]/50 dark:bg-[#060D1A] shadow-xs'
                      : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] hover:border-[#C5A869]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-sm bg-[#071A3D] dark:bg-[#C5A869]/20 text-[#C5A869] flex items-center justify-center">
                        <Users2 className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        value="group"
                        {...register('classType')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                    </div>
                    <h3 className={`text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-1.5 ${fontClass}`}>
                      {t.admissions.fields.groupClass}
                    </h3>
                    <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                      {t.admissions.fields.groupDesc}
                    </p>
                  </div>
                </label>

                {/* Individual class card */}
                <label
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedClassType === 'individual'
                      ? 'border-2 border-[#C5A869] bg-[#F4EFE6]/50 dark:bg-[#060D1A] shadow-xs'
                      : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] hover:border-[#C5A869]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-sm bg-[#C5A869] text-[#071A3D] flex items-center justify-center">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        value="individual"
                        {...register('classType')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                    </div>
                    <h3 className={`text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-1.5 ${fontClass}`}>
                      {t.admissions.fields.individualClass}
                    </h3>
                    <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                      {t.admissions.fields.individualDesc}
                    </p>
                  </div>
                </label>
              </div>
              {errors.classType && (
                <p className="text-[11px] text-red-500 font-medium">{errors.classType.message}</p>
              )}
            </div>

            {/* ======================================================
                SECTION E — PREFERRED CLASS LANGUAGE
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.classLanguage}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  05 / 08
                </span>
              </div>

              <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] ${fontClass}`}>
                {t.admissions.fields.classLangNotice}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'ml', label: t.admissions.fields.langMl, sample: 'മലയാളം' },
                  { code: 'en', label: t.admissions.fields.langEn, sample: 'English' },
                  { code: 'ur', label: t.admissions.fields.langUr, sample: 'اردو' },
                ].map((langItem) => {
                  const isChecked = selectedClassLang === langItem.code;
                  return (
                    <label
                      key={langItem.code}
                      className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-2 border-[#C5A869] bg-[#F4EFE6]/60 dark:bg-[#060D1A]'
                          : 'border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#0B172B] hover:border-[#C5A869]/50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                          {langItem.label}
                        </span>
                      </div>
                      <input
                        type="radio"
                        value={langItem.code}
                        {...register('classLanguage')}
                        className="accent-[#071A3D] dark:accent-[#C5A869]"
                      />
                    </label>
                  );
                })}
              </div>
              {errors.classLanguage && (
                <p className="text-[11px] text-red-500 font-medium">{errors.classLanguage.message}</p>
              )}
            </div>

            {/* ======================================================
                SECTION F — PREVIOUS LEARNING
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.previousLearning}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  06 / 08
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: t.admissions.fields.prevBeginner },
                  { value: 'some_reading', label: t.admissions.fields.prevSomeReading },
                  { value: 'nazira_ongoing', label: t.admissions.fields.prevNaziraOngoing },
                  { value: 'hifz_ongoing', label: t.admissions.fields.prevHifzOngoing },
                  { value: 'madrasa_studies', label: t.admissions.fields.prevMadrasaStudies },
                  { value: 'other', label: t.admissions.fields.prevOther },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`p-3 rounded-lg border text-xs font-medium cursor-pointer flex items-center justify-between transition-colors ${
                      selectedPrevious === item.value
                        ? 'border-[#C5A869] bg-[#F4EFE6]/50 dark:bg-[#060D1A] text-[#071A3D] dark:text-[#F3EFE6] font-semibold'
                        : 'border-[#E8E2D5] dark:border-[#1F3354] text-[#41536E] dark:text-[#C5D2E5] hover:border-[#C5A869]/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    <input
                      type="radio"
                      value={item.value}
                      {...register('previousLearning')}
                      className="accent-[#071A3D] dark:accent-[#C5A869]"
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.previousLearningDetails}
                </label>
                <textarea
                  rows={2}
                  {...register('previousLearningDetails')}
                  placeholder={t.admissions.fields.previousLearningDetailsPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>
            </div>

            {/* ======================================================
                SECTION G — ADDITIONAL INFORMATION
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.additionalInfo}
                </h2>
                <span className="text-[11px] font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider">
                  07 / 08
                </span>
              </div>

              <div className="space-y-2">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.preferredContact}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      value="whatsapp"
                      {...register('preferredContact')}
                      className="accent-[#071A3D] dark:accent-[#C5A869]"
                    />
                    <span>{t.admissions.fields.contactWhatsapp}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      {...register('preferredContact')}
                      className="accent-[#071A3D] dark:accent-[#C5A869]"
                    />
                    <span>{t.admissions.fields.contactEmail}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.notes}
                </label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  placeholder={t.admissions.fields.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>
            </div>

            {/* ======================================================
                SECTION H — VERIFICATION & CONSENT
            ====================================================== */}
            <div className="space-y-5 pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3 flex items-center justify-between">
                <h2 className={`text-base sm:text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.sections.consent}
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
                    {t.admissions.fields.consentCheckbox} <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-red-500 font-medium pl-7">{errors.consent.message}</p>
                )}

                <p className={`text-[11px] text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed pl-7 ${fontClass}`}>
                  {t.admissions.fields.privacyNotice}
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
                    <span>{t.admissions.fields.submitting}</span>
                  ) : (
                    <>
                      <span>{t.admissions.fields.submit}</span>
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

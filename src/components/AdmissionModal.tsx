import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { Language } from '../types';
import { X, CheckCircle2, Send } from 'lucide-react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
}

interface ModalFormData {
  studentName: string;
  guardianName: string;
  gender: 'male' | 'female';
  course: 'hifz' | 'nazira' | 'fiqh' | 'madrasa';
  classType: 'group' | 'individual';
  languagePreference: Language;
  whatsappNumber: string;
  email: string;
  notes: string;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  defaultCourseId = 'hifz',
}) => {
  const { language, t, isRtl, fontClass } = useLanguage();
  const { navigate } = useRouter();

  const [formData, setFormData] = useState<ModalFormData>({
    studentName: '',
    guardianName: '',
    gender: 'male',
    course: (defaultCourseId as any) || 'hifz',
    classType: 'group',
    languagePreference: language,
    whatsappNumber: '',
    email: '',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultCourseId) {
      setFormData((prev: ModalFormData) => ({ ...prev, course: defaultCourseId as any }));
    }
  }, [defaultCourseId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `APP-${String(Math.floor(1000 + Math.random() * 9000))}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const handleGoToFullPage = () => {
    onClose();
    navigate('/admissions', { courseId: formData.course });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleResetAndClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] shadow-2xl overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D5] dark:border-[#1F3354] bg-[#FBF9F5] dark:bg-[#091528]">
          <div className="text-start">
            <h3 className={`text-lg sm:text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              {t.admissions.title}
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] mt-0.5">
              THEEN – INSTITUTE OF QUR’AN
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-[#5E6D84] hover:text-[#071A3D] dark:text-[#9EADC4] dark:hover:text-white rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-start">
          {isSubmitted ? (
            <div className="py-8 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#C5A869]/20 text-[#8A7038] dark:text-[#C5A869] mx-auto flex items-center justify-center border border-[#C5A869]/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className={`text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.admissions.success.title}
                </h4>
                <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed ${fontClass}`}>
                  {t.admissions.success.desc}
                </p>
              </div>

              {/* Reference ID */}
              <div className="p-4 rounded-lg bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] inline-block">
                <p className="text-[11px] uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] font-semibold mb-1">
                  {t.admissions.success.idLabel}
                </p>
                <p className="font-mono text-base font-bold text-[#071A3D] dark:text-[#F3EFE6] tracking-widest">
                  {referenceId}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md transition-colors"
                >
                  {t.admissions.success.backHome}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D5] dark:border-[#1F3354]">
                <p className={`text-xs text-[#5E6D84] dark:text-[#9EADC4] ${fontClass}`}>
                  {t.admissions.subtitle}
                </p>
                <button
                  type="button"
                  onClick={handleGoToFullPage}
                  className="text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Open Full Application Page →
                </button>
              </div>

              {/* Row 1: Student Name & Guardian Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder={t.admissions.fields.fullNamePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.guardianName}
                  </label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder={t.admissions.fields.guardianNamePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Gender & Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.gender} *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  >
                    <option value="male">{t.admissions.fields.male}</option>
                    <option value="female">{t.admissions.fields.female}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.course} *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  >
                    <option value="hifz">{t.admissions.fields.courseHifz}</option>
                    <option value="nazira">{t.admissions.fields.courseNazira}</option>
                    <option value="fiqh">{t.admissions.fields.courseFiqh}</option>
                    <option value="madrasa">{t.admissions.fields.courseMadrasa}</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Class Type & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.classType} *
                  </label>
                  <select
                    value={formData.classType}
                    onChange={(e) => setFormData({ ...formData, classType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  >
                    <option value="group">{t.admissions.fields.groupClass}</option>
                    <option value="individual">{t.admissions.fields.individualClass}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.classLanguage} *
                  </label>
                  <select
                    value={formData.languagePreference}
                    onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value as Language })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  >
                    <option value="ml">{t.admissions.fields.langMl}</option>
                    <option value="en">{t.admissions.fields.langEn}</option>
                    <option value="ur">{t.admissions.fields.langUr}</option>
                  </select>
                </div>
              </div>

              {/* Row 4: WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.whatsapp} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder={t.admissions.fields.whatsappPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.admissions.fields.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.admissions.fields.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                  {t.admissions.fields.notes}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.admissions.fields.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs font-medium text-[#5E6D84] hover:text-[#071A3D] dark:text-[#9EADC4] dark:hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.admissions.fields.submitting}</span>
                  ) : (
                    <>
                      <span>{t.admissions.fields.submit}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

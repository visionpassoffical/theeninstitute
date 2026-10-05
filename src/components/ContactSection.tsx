import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ContactFormData } from '../types';
import { Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t, fontClass } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phoneOrWhatsapp: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phoneOrWhatsapp: '',
        subject: '',
        message: '',
      });
    }, 500);
  };

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 bg-[#F4EFE6]/50 dark:bg-[#081222] transition-colors duration-300 relative border-t border-[#E8E2D5] dark:border-[#152744]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-6 bg-[#C5A869]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A7038] dark:text-[#D4BC82]">
              {t.contact.kicker}
            </span>
            <span className="h-[1px] w-6 bg-[#C5A869]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.2] text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif ${
              fontClass === 'font-urdu' ? 'font-urdu text-3xl sm:text-4xl leading-[1.8]!' : ''
            }`}
          >
            {t.contact.title}
          </h2>

          <p className={`text-sm sm:text-base text-[#41536E] dark:text-[#B1BFD4] leading-relaxed ${fontClass}`}>
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Institutional Contact Information Column */}
          <div className="lg:col-span-5 flex flex-col text-start space-y-6">
            <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-7 sm:p-8 space-y-6 shadow-xs">
              <h3 className={`text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                THEEN – INSTITUTE OF QUR’AN
              </h3>

              <div className="space-y-4">
                {/* Official Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider ${fontClass}`}>
                      {t.contact.officialEmail}
                    </p>
                    <a
                      href="mailto:theeninstitute@gmail.com"
                      className="text-xs sm:text-sm font-medium text-[#071A3D] dark:text-[#F3EFE6] hover:text-[#C5A869] transition-colors"
                    >
                      theeninstitute@gmail.com
                    </a>
                  </div>
                </div>

                {/* Official Phone / WhatsApp Placeholder */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider ${fontClass}`}>
                      {t.contact.officialPhone}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[#5E6D84] dark:text-[#9EADC4]">
                      {t.contact.phonePlaceholder}
                    </p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] uppercase tracking-wider ${fontClass}`}>
                      {t.contact.hours}
                    </p>
                    <p className={`text-xs sm:text-sm text-[#5E6D84] dark:text-[#9EADC4] ${fontClass}`}>
                      {t.contact.hoursText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Motto Callout */}
            <div className="rounded-xl p-6 bg-[#EDE8DC]/50 dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-center space-y-2">
              <span className="font-arabic text-2xl text-[#C5A869]">
                التِّين
              </span>
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                Excellence in Qur’anic Education & Sacred Knowledge
              </p>
            </div>
          </div>

          {/* Interactive Contact Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-7 sm:p-9 shadow-xs text-start">
            <h3 className={`text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6] mb-6 ${fontClass}`}>
              {t.contact.formTitle}
            </h3>

            {isSubmitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#C5A869]/20 text-[#8A7038] dark:text-[#C5A869] mx-auto flex items-center justify-center border border-[#C5A869]/50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className={`text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
                  {t.contact.successMsg}
                </h4>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                      {t.contact.fields.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.contact.fields.namePlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                      {t.contact.fields.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.contact.fields.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                      {t.contact.fields.phone}
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneOrWhatsapp}
                      onChange={(e) => setFormData({ ...formData, phoneOrWhatsapp: e.target.value })}
                      placeholder={t.contact.fields.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                      {t.contact.fields.subject} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t.contact.fields.subjectPlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[#071A3D] dark:text-[#E2EAF4] ${fontClass}`}>
                    {t.contact.fields.message} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.contact.fields.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:outline-hidden focus:border-[#C5A869] dark:text-white"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#071A3D] dark:bg-[#C5A869] dark:text-[#060D1A] hover:bg-[#0B2556] dark:hover:bg-[#D4BC82] rounded-md shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t.contact.fields.sending}</span>
                    ) : (
                      <>
                        <span>{t.contact.fields.submit}</span>
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
    </section>
  );
};

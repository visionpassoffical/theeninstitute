import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { academicService } from '../../services/academicService';
import { TeacherProfileData, ClassLanguage } from '../../types/academic';
import {
  UserCheck,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  BookOpen,
  Globe,
} from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';

  const [profile, setProfile] = useState<TeacherProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Editable fields
  const [displayName, setDisplayName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<ClassLanguage[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await academicService.getTeacherProfile(teacherId);
        if (data) {
          setProfile(data);
          setDisplayName(data.name);
          setWhatsapp(data.whatsapp);
          setBio(data.bio || '');
          setSelectedLanguages(data.languages);
        }
      } catch (err) {
        console.warn('Profile load warning:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [teacherId]);

  const handleToggleLang = (lang: ClassLanguage) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessNotice(null);

    try {
      const updated = await academicService.updateTeacherProfile(teacherId, {
        name: displayName,
        whatsapp,
        bio,
        languages: selectedLanguages,
      });

      setProfile(updated);
      setSuccessNotice('Faculty profile information updated successfully.');
    } catch (err) {
      console.warn('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeacherLayout
      activeTab="profile"
      title="Faculty Profile & Institutional Credentials"
      subtitle={`Verified THEEN Academic Educator Record`}
    >
      <div className="space-y-6 text-start max-w-4xl mx-auto">
        {/* Verification Status Card */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#071A3D] dark:bg-[#C5A869]/20 border border-[#C5A869]/40 flex items-center justify-center text-[#C5A869] shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  {profile?.name || userProfile?.displayName || 'Faculty Member'}
                </h2>
                <span className="font-mono text-xs font-bold text-[#8A7038] dark:text-[#D4BC82] bg-[#F4EFE6] dark:bg-[#15253F] px-2 py-0.5 rounded">
                  {teacherId}
                </span>
              </div>
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] mt-0.5">
                {profile?.email || userProfile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Active Faculty</span>
            </span>
          </div>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Section 1: Immutable Administrative Credentials */}
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8A7038] dark:text-[#D4BC82]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
                  Verified Academic Credentials (Admin Supervised)
                </h3>
              </div>
              <span className="text-[10px] text-[#5E6D84] dark:text-[#9EADC4]">
                Protected Fields
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                  Teacher ID
                </span>
                <span className="font-mono font-bold text-sm text-[#071A3D] dark:text-[#F3EFE6]">
                  {teacherId}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                  Official Email
                </span>
                <span className="font-bold text-xs text-[#071A3D] dark:text-[#F3EFE6]">
                  {profile?.email || userProfile?.email}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                  Academic Qualification & Sanad
                </span>
                <span className="font-semibold text-xs text-[#071A3D] dark:text-[#F3EFE6]">
                  {profile?.qualification || 'Fazil / Sanad in Qira’at'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                  Alma Mater / Institution
                </span>
                <span className="font-semibold text-xs text-[#071A3D] dark:text-[#F3EFE6]">
                  {profile?.institution || 'Darul Huda Islamic University'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                  Approved Subject Disciplines
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(profile?.subjects || ['hifz', 'nazira', 'fiqh']).map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded bg-[#071A3D] text-[#C5A869] dark:bg-[#C5A869]/20 font-bold uppercase text-[10px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Editable Faculty Information */}
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6] pb-3 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              Public Faculty Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Contact WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Teaching Medium Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ml', 'en', 'ur'] as ClassLanguage[]).map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleToggleLang(lang)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#C5A869] text-[#071A3D] font-bold'
                            : 'bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-[#5E6D84]'
                        }`}
                      >
                        {lang === 'ml' ? 'Malayalam' : lang === 'ur' ? 'Urdu' : 'English'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Faculty Bio / Pedagogical Statement
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief pedagogical focus or statement..."
                  className="w-full px-3.5 py-2 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A869] text-[#071A3D] font-bold uppercase tracking-wider rounded-lg hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Update Faculty Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
};

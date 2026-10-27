import { TeacherApplication } from '../types';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';

export const teacherService = {
  /**
   * Submit new teacher registration directly to Supabase public.teacher_applications table
   */
  submitApplication: async (
    data: Omit<TeacherApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<TeacherApplication> => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `TAPP-${randomNum}`;
    const submittedAt = new Date().toISOString();

    const insertPayload = {
      application_id: applicationId,
      full_name: data.fullName,
      gender: data.gender,
      qualification: data.institution ? `${data.qualification} (${data.institution})` : data.qualification,
      experience: data.experience,
      subjects: data.subjects,
      languages: data.languages,
      preferred_student_type: data.preferredStudents,
      availability: data.preferredTeachingTimes,
      device_info: `${data.device} (${data.internetQuality})`,
      motivation: data.motivation,
      notes: JSON.stringify({
        whatsapp: data.whatsapp,
        email: data.email,
        country: data.country,
        city: data.city,
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        device: data.device,
        internetQuality: data.internetQuality,
        quranBackground: data.quranBackground,
        otherQualifications: data.otherQualifications,
        additionalInformation: data.additionalInformation,
      }),
      status: 'PENDING',
    };

    const { error } = await supabase.from('teacher_applications').insert(insertPayload);

    if (error) {
      console.error('Supabase teacher application insertion error:', error);
      throw new Error(error.message || 'Failed to submit teacher application to Supabase.');
    }

    return {
      ...data,
      applicationId,
      status: 'PENDING',
      submittedAt,
    };
  },

  /**
   * Lookup teacher application by application ID from Supabase
   */
  getApplicationById: async (id: string): Promise<TeacherApplication | null> => {
    if (!isSupabaseConfigured || !id) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .eq('application_id', id)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      let parsedNotes: any = {};
      try {
        if (data.notes && data.notes.startsWith('{')) {
          parsedNotes = JSON.parse(data.notes);
        }
      } catch {}

      return {
        applicationId: data.application_id,
        fullName: data.full_name,
        gender: data.gender as 'male' | 'female',
        dateOfBirth: parsedNotes.dateOfBirth || '',
        age: Number(parsedNotes.age) || 0,
        country: parsedNotes.country || '',
        city: parsedNotes.city || '',
        whatsapp: parsedNotes.whatsapp || '',
        email: parsedNotes.email || '',
        qualification: data.qualification,
        institution: '',
        experience: data.experience || '',
        quranBackground: parsedNotes.quranBackground,
        otherQualifications: parsedNotes.otherQualifications,
        subjects: data.subjects || [],
        languages: data.languages || [],
        preferredStudents: (data.preferred_student_type as any) || 'both',
        preferredTeachingTimes: data.availability || '',
        device: (parsedNotes.device as any) || 'laptop',
        internetQuality: (parsedNotes.internetQuality as any) || 'good',
        motivation: data.motivation || '',
        additionalInformation: parsedNotes.additionalInformation || '',
        consent: true,
        status: data.status,
        submittedAt: data.created_at,
      };
    } catch {
      return null;
    }
  },
};

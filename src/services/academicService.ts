import { Student, TeacherProfileData, CourseType } from '../types/academic';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';

export const academicService = {
  /**
   * Get all students assigned to a specific teacher ID from Supabase public.students table.
   * Under RLS: "Teacher can see ONLY students assigned to that teacher. Never show all students to every teacher."
   */
  getStudentsForTeacher: async (teacherId: string): Promise<Student[]> => {
    if (!isSupabaseConfigured || !teacherId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId)
        .neq('status', 'COMPLETED')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching students from Supabase:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        studentId: row.student_id,
        name: row.name,
        gender: row.gender,
        course: row.course as CourseType,
        classType: row.class_type,
        classLanguage: row.class_language,
        teacherId: row.teacher_id,
        batchId: row.batch_id || undefined,
        batchName: row.batch_name || undefined,
        status: row.status,
        whatsapp: row.whatsapp || undefined,
        email: row.email || undefined,
        joinedAt: row.joined_at || row.created_at,
      }));
    } catch (err) {
      console.error('Student query failed:', err);
      return [];
    }
  },

  /**
   * Look up a student by ID, verifying teacher assignment strictly in Supabase
   */
  getStudentForTeacherById: async (teacherId: string, studentId: string): Promise<Student | null> => {
    if (!isSupabaseConfigured || !teacherId || !studentId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        studentId: data.student_id,
        name: data.name,
        gender: data.gender,
        course: data.course as CourseType,
        classType: data.class_type,
        classLanguage: data.class_language,
        teacherId: data.teacher_id,
        batchId: data.batch_id || undefined,
        batchName: data.batch_name || undefined,
        status: data.status,
        whatsapp: data.whatsapp || undefined,
        email: data.email || undefined,
        joinedAt: data.joined_at || data.created_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Get faculty profile data from Supabase public.teachers table
   */
  getTeacherProfile: async (teacherId: string): Promise<TeacherProfileData | null> => {
    if (!isSupabaseConfigured || !teacherId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('teacher_id', teacherId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        teacherId: data.teacher_id,
        name: data.name,
        gender: data.gender || 'male',
        email: data.email,
        whatsapp: data.whatsapp || '',
        subjects: data.subjects || ['quran_studies'],
        languages: data.languages || ['ml'],
        qualification: data.qualification || '',
        institution: data.institution || '',
        experience: '3+ Years',
        bio: data.bio || '',
        status: data.status || 'ACTIVE',
      };
    } catch {
      return null;
    }
  },

  /**
   * Safe profile update:
   * Teacher must NOT be able to edit: teacherId, status, gender, role, or permissions.
   */
  updateTeacherProfile: async (
    teacherId: string,
    safeData: {
      name?: string;
      whatsapp?: string;
      bio?: string;
      languages?: ('ml' | 'en' | 'ur')[];
    }
  ): Promise<TeacherProfileData> => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    const updatePayload: Record<string, any> = {};
    if (safeData.name !== undefined) updatePayload.name = safeData.name.trim();
    if (safeData.whatsapp !== undefined) updatePayload.whatsapp = safeData.whatsapp.trim();
    if (safeData.bio !== undefined) updatePayload.bio = safeData.bio.trim();
    if (safeData.languages !== undefined) updatePayload.languages = safeData.languages;

    const { error } = await supabase
      .from('teachers')
      .update(updatePayload)
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Teacher profile update error:', error);
      throw new Error(error.message || 'Failed to update teacher profile in database.');
    }

    const refreshed = await academicService.getTeacherProfile(teacherId);
    if (!refreshed) {
      throw new Error('Profile updated, but failed to retrieve updated record.');
    }

    return refreshed;
  },
};

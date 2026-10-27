import { StudentProgressRecord, ProgressStatus, CourseType } from '../types/academic';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';

export const progressService = {
  /**
   * Get all progress records created by this teacher for assigned students from Supabase
   */
  getProgressForTeacher: async (teacherId: string): Promise<StudentProgressRecord[]> => {
    if (!isSupabaseConfigured || !teacherId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching progress from Supabase:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        progressId: row.progress_id,
        studentId: row.student_id,
        studentName: row.student_name || '',
        teacherId: row.teacher_id,
        course: row.course as CourseType,
        lesson: row.lesson,
        homework: row.homework || '',
        remarks: row.remarks || '',
        progressStatus: row.progress_status as ProgressStatus,
        createdAt: row.created_at,
        updatedAt: row.created_at,
        updatedBy: row.updated_by || '',
      }));
    } catch (err) {
      console.error('Progress fetch failed:', err);
      return [];
    }
  },

  /**
   * Get progress history for a specific student from Supabase
   */
  getProgressForStudent: async (
    teacherId: string,
    studentId: string
  ): Promise<StudentProgressRecord[]> => {
    if (!isSupabaseConfigured || !teacherId || !studentId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student progress from Supabase:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        progressId: row.progress_id,
        studentId: row.student_id,
        studentName: row.student_name || '',
        teacherId: row.teacher_id,
        course: row.course as CourseType,
        lesson: row.lesson,
        homework: row.homework || '',
        remarks: row.remarks || '',
        progressStatus: row.progress_status as ProgressStatus,
        createdAt: row.created_at,
        updatedAt: row.created_at,
        updatedBy: row.updated_by || '',
      }));
    } catch {
      return [];
    }
  },

  /**
   * Get latest progress record for a student from Supabase
   */
  getLatestProgressForStudent: async (
    teacherId: string,
    studentId: string
  ): Promise<StudentProgressRecord | null> => {
    if (!isSupabaseConfigured || !teacherId || !studentId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        progressId: data.progress_id,
        studentId: data.student_id,
        studentName: data.student_name || '',
        teacherId: data.teacher_id,
        course: data.course as CourseType,
        lesson: data.lesson,
        homework: data.homework || '',
        remarks: data.remarks || '',
        progressStatus: data.progress_status as ProgressStatus,
        createdAt: data.created_at,
        updatedAt: data.created_at,
        updatedBy: data.updated_by || '',
      };
    } catch {
      return null;
    }
  },

  /**
   * Save progress entry directly to Supabase public.student_progress table
   */
  saveProgress: async (data: {
    studentId: string;
    studentName: string;
    teacherId: string;
    course: CourseType;
    lesson: string;
    homework: string;
    remarks: string;
    progressStatus: ProgressStatus;
    updatedBy: string;
  }): Promise<StudentProgressRecord> => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    const progressId = `PROG-${data.studentId.replace('STU-', '')}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const insertPayload = {
      progress_id: progressId,
      student_id: data.studentId,
      student_name: data.studentName,
      teacher_id: data.teacherId,
      course: data.course,
      lesson: data.lesson.trim(),
      homework: data.homework.trim(),
      remarks: data.remarks.trim(),
      progress_status: data.progressStatus,
      updated_by: data.updatedBy,
    };

    const { error } = await supabase.from('student_progress').insert(insertPayload);

    if (error) {
      console.error('Supabase progress save error:', error);
      throw new Error(error.message || 'Failed to save student progress to Supabase.');
    }

    return {
      progressId,
      studentId: data.studentId,
      studentName: data.studentName,
      teacherId: data.teacherId,
      course: data.course,
      lesson: data.lesson.trim(),
      homework: data.homework.trim(),
      remarks: data.remarks.trim(),
      progressStatus: data.progressStatus,
      createdAt: now,
      updatedAt: now,
      updatedBy: data.updatedBy,
    };
  },
};

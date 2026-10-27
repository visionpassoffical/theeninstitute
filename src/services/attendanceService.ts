import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSubmissionPayload,
  AttendanceSummary,
  CourseType,
  EmailReportResult,
} from '../types/academic';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import { getKolkataDateString } from '../utils/timezone';
import { emailService } from './emailService';

export const attendanceService = {
  /**
   * Deterministic Attendance ID Generator
   * Format: "${teacherId}_${studentId}_${date}" prevents duplicate records
   */
  generateAttendanceDocId: (teacherId: string, studentId: string, date: string): string => {
    return `${teacherId}_${studentId}_${date}`;
  },

  /**
   * Get all attendance records for a specific teacher from Supabase public.attendance table.
   * Under RLS, teacher can view ONLY their own submitted attendance.
   */
  getAttendanceForTeacher: async (teacherId: string): Promise<AttendanceRecord[]> => {
    if (!isSupabaseConfigured || !teacherId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching attendance from Supabase:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        attendanceId: row.attendance_id,
        date: row.date,
        submittedAt: row.submitted_at,
        teacherUid: row.teacher_user_id || '',
        teacherId: row.teacher_id,
        teacherName: row.teacher_name || '',
        studentId: row.student_id,
        studentName: row.student_name || '',
        course: row.course as CourseType,
        classType: row.class_type,
        classLanguage: row.class_language,
        status: row.status as AttendanceStatus,
      }));
    } catch (err) {
      console.error('Attendance fetch failed:', err);
      return [];
    }
  },

  /**
   * Check if attendance has already been submitted today for a specific student from Supabase
   */
  getTodayAttendanceForStudent: async (
    teacherId: string,
    studentId: string,
    dateString?: string
  ): Promise<AttendanceRecord | null> => {
    if (!isSupabaseConfigured || !teacherId || !studentId) {
      return null;
    }

    const date = dateString || getKolkataDateString();

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .eq('date', date)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        attendanceId: data.attendance_id,
        date: data.date,
        submittedAt: data.submitted_at,
        teacherUid: data.teacher_user_id || '',
        teacherId: data.teacher_id,
        teacherName: data.teacher_name || '',
        studentId: data.student_id,
        studentName: data.student_name || '',
        course: data.course as CourseType,
        classType: data.class_type,
        classLanguage: data.class_language,
        status: data.status as AttendanceStatus,
      };
    } catch {
      return null;
    }
  },

  /**
   * Get all attendance records submitted today by this teacher from Supabase
   */
  getTodayAttendanceForTeacher: async (
    teacherId: string,
    dateString?: string
  ): Promise<AttendanceRecord[]> => {
    if (!isSupabaseConfigured || !teacherId) {
      return [];
    }

    const date = dateString || getKolkataDateString();

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('date', date);

      if (error) {
        console.error('Error fetching today attendance from Supabase:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        attendanceId: row.attendance_id,
        date: row.date,
        submittedAt: row.submitted_at,
        teacherUid: row.teacher_user_id || '',
        teacherId: row.teacher_id,
        teacherName: row.teacher_name || '',
        studentId: row.student_id,
        studentName: row.student_name || '',
        course: row.course as CourseType,
        classType: row.class_type,
        classLanguage: row.class_language,
        status: row.status as AttendanceStatus,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Submit single or batch attendance to Supabase public.attendance table
   * Upserts on unique (attendance_id) and triggers automated email dispatch.
   */
  submitAttendanceBatch: async (
    payload: AttendanceSubmissionPayload
  ): Promise<{
    savedRecords: AttendanceRecord[];
    emailResult: EmailReportResult;
  }> => {
    if (!isSupabaseConfigured) {
      throw new Error(supabaseConfigError || 'Supabase integration is not configured.');
    }

    const submittedAt = new Date().toISOString();
    const rowsToUpsert = payload.records.map((item) => {
      const docId = attendanceService.generateAttendanceDocId(
        payload.teacherId,
        item.studentId,
        payload.date
      );

      return {
        attendance_id: docId,
        date: payload.date,
        teacher_id: payload.teacherId,
        teacher_user_id: payload.teacherUid || null,
        teacher_name: payload.teacherName,
        student_id: item.studentId,
        student_name: item.studentName,
        course: item.course,
        class_type: item.classType,
        class_language: item.classLanguage,
        status: item.status,
        submitted_at: submittedAt,
      };
    });

    const { error } = await supabase
      .from('attendance')
      .upsert(rowsToUpsert, { onConflict: 'attendance_id' });

    if (error) {
      console.error('Supabase attendance submission error:', error);
      throw new Error(error.message || 'Failed to persist attendance to Supabase.');
    }

    const savedRecords: AttendanceRecord[] = payload.records.map((item) => ({
      attendanceId: attendanceService.generateAttendanceDocId(
        payload.teacherId,
        item.studentId,
        payload.date
      ),
      date: payload.date,
      submittedAt,
      teacherUid: payload.teacherUid,
      teacherId: payload.teacherId,
      teacherName: payload.teacherName,
      studentId: item.studentId,
      studentName: item.studentName,
      course: item.course,
      classType: item.classType,
      classLanguage: item.classLanguage,
      status: item.status,
    }));

    // Trigger automatic attendance email report to theeninstitute@gmail.com
    // Attendance must NOT fail if email fails
    let emailResult: EmailReportResult;
    try {
      emailResult = await emailService.sendAttendanceReport(payload);
    } catch (err: any) {
      emailResult = {
        sent: false,
        message: 'Attendance was saved to database, but the email report could not be sent.',
        recipient: 'theeninstitute@gmail.com',
        error: err?.message,
      };
    }

    return {
      savedRecords,
      emailResult,
    };
  },

  /**
   * Calculate Attendance Summary for a student from Supabase
   */
  calculateStudentAttendanceSummary: async (
    teacherId: string,
    studentId: string
  ): Promise<AttendanceSummary> => {
    if (!isSupabaseConfigured || !teacherId || !studentId) {
      return {
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0,
        hasData: false,
      };
    }

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId);

      if (error || !data || data.length === 0) {
        return {
          totalClasses: 0,
          presentCount: 0,
          absentCount: 0,
          attendancePercentage: 0,
          hasData: false,
        };
      }

      const totalClasses = data.length;
      const presentCount = data.filter((r: any) => r.status === 'PRESENT').length;
      const absentCount = data.filter((r: any) => r.status === 'ABSENT').length;
      const percentage = Math.round((presentCount / totalClasses) * 100);

      return {
        totalClasses,
        presentCount,
        absentCount,
        attendancePercentage: percentage,
        hasData: true,
      };
    } catch {
      return {
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0,
        hasData: false,
      };
    }
  },
};

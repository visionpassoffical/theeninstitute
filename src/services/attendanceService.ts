import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSubmissionPayload,
  AttendanceSummary,
  EmailReportResult,
} from '../types/academic';
import { getKolkataDateString } from '../utils/timezone';
import { emailService } from './emailService';

const STORAGE_ATTENDANCE_KEY = 'theen_academic_attendance_records';

// Seed sample past attendance for realistic historical calculation
const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    attendanceId: 'MT001_STU-1001_2026-10-01',
    date: '2026-10-01',
    submittedAt: '2026-10-01T10:15:00.000Z',
    teacherUid: 'teacher-uid-mt001',
    teacherId: 'MT001',
    teacherName: 'Usthad Abdul Rahman',
    studentId: 'STU-1001',
    studentName: 'Muhammad Rayan',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    status: 'PRESENT',
  },
  {
    attendanceId: 'MT001_STU-1001_2026-10-02',
    date: '2026-10-02',
    submittedAt: '2026-10-02T10:12:00.000Z',
    teacherUid: 'teacher-uid-mt001',
    teacherId: 'MT001',
    teacherName: 'Usthad Abdul Rahman',
    studentId: 'STU-1001',
    studentName: 'Muhammad Rayan',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    status: 'PRESENT',
  },
  {
    attendanceId: 'MT001_STU-1002_2026-10-01',
    date: '2026-10-01',
    submittedAt: '2026-10-01T10:15:00.000Z',
    teacherUid: 'teacher-uid-mt001',
    teacherId: 'MT001',
    teacherName: 'Usthad Abdul Rahman',
    studentId: 'STU-1002',
    studentName: 'Bilal Ahmed',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    status: 'PRESENT',
  },
  {
    attendanceId: 'MT001_STU-1002_2026-10-02',
    date: '2026-10-02',
    submittedAt: '2026-10-02T10:12:00.000Z',
    teacherUid: 'teacher-uid-mt001',
    teacherId: 'MT001',
    teacherName: 'Usthad Abdul Rahman',
    studentId: 'STU-1002',
    studentName: 'Bilal Ahmed',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    status: 'ABSENT',
  },
  {
    attendanceId: 'MT001_STU-1003_2026-10-01',
    date: '2026-10-01',
    submittedAt: '2026-10-01T10:15:00.000Z',
    teacherUid: 'teacher-uid-mt001',
    teacherId: 'MT001',
    teacherName: 'Usthad Abdul Rahman',
    studentId: 'STU-1003',
    studentName: 'Zayd Faheem',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    status: 'PRESENT',
  },
  {
    attendanceId: 'FT001_STU-2001_2026-10-01',
    date: '2026-10-01',
    submittedAt: '2026-10-01T11:00:00.000Z',
    teacherUid: 'teacher-uid-ft001',
    teacherId: 'FT001',
    teacherName: 'Mu’allima Fathima Zahra',
    studentId: 'STU-2001',
    studentName: 'Amina Fathima',
    course: 'nazira',
    classType: 'group',
    classLanguage: 'ml',
    status: 'PRESENT',
  },
];

export const attendanceService = {
  initStore: () => {
    try {
      if (!localStorage.getItem(STORAGE_ATTENDANCE_KEY)) {
        localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
      }
    } catch {
      // Ignore
    }
  },

  /**
   * Deterministic Attendance ID Generator
   * Section 32: "teacherId_studentId_date" prevents duplicate records
   */
  generateAttendanceDocId: (teacherId: string, studentId: string, date: string): string => {
    return `${teacherId}_${studentId}_${date}`;
  },

  /**
   * Get all attendance records for a specific teacher
   * Section 13 & 15: Teacher can view ONLY their own submitted attendance
   */
  getAttendanceForTeacher: async (teacherId: string): Promise<AttendanceRecord[]> => {
    attendanceService.initStore();
    try {
      const all: AttendanceRecord[] = JSON.parse(
        localStorage.getItem(STORAGE_ATTENDANCE_KEY) || '[]'
      );
      return all
        .filter((r) => r.teacherId === teacherId)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch {
      return INITIAL_ATTENDANCE.filter((r) => r.teacherId === teacherId);
    }
  },

  /**
   * Check if attendance has already been submitted today for a specific student
   * Section 12: Duplicate Attendance Protection
   */
  getTodayAttendanceForStudent: async (
    teacherId: string,
    studentId: string,
    dateString?: string
  ): Promise<AttendanceRecord | null> => {
    attendanceService.initStore();
    const date = dateString || getKolkataDateString();
    const docId = attendanceService.generateAttendanceDocId(teacherId, studentId, date);

    try {
      const all: AttendanceRecord[] = JSON.parse(
        localStorage.getItem(STORAGE_ATTENDANCE_KEY) || '[]'
      );
      return all.find((r) => r.attendanceId === docId) || null;
    } catch {
      return null;
    }
  },

  /**
   * Get all attendance records submitted today by this teacher
   */
  getTodayAttendanceForTeacher: async (
    teacherId: string,
    dateString?: string
  ): Promise<AttendanceRecord[]> => {
    const records = await attendanceService.getAttendanceForTeacher(teacherId);
    const date = dateString || getKolkataDateString();
    return records.filter((r) => r.date === date);
  },

  /**
   * Submit single or batch attendance
   * Performs duplicate check, saves records, and triggers background email report dispatch.
   */
  submitAttendanceBatch: async (
    payload: AttendanceSubmissionPayload
  ): Promise<{
    savedRecords: AttendanceRecord[];
    emailResult: EmailReportResult;
  }> => {
    attendanceService.initStore();
    const submittedAt = new Date().toISOString();
    const all: AttendanceRecord[] = JSON.parse(
      localStorage.getItem(STORAGE_ATTENDANCE_KEY) || '[]'
    );

    const newRecords: AttendanceRecord[] = [];

    for (const item of payload.records) {
      const docId = attendanceService.generateAttendanceDocId(
        payload.teacherId,
        item.studentId,
        payload.date
      );

      // Check if existing
      const existingIndex = all.findIndex((r) => r.attendanceId === docId);

      const record: AttendanceRecord = {
        attendanceId: docId,
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
      };

      if (existingIndex >= 0) {
        // Controlled update of existing record for that day
        all[existingIndex] = record;
      } else {
        all.unshift(record);
      }
      newRecords.push(record);
    }

    try {
      localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(all));
    } catch (err) {
      console.warn('Attendance storage write error:', err);
    }

    // Section 19-21: Trigger automatic attendance email report to theeninstitute@gmail.com
    // Attendance must NOT fail if email fails
    let emailResult: EmailReportResult;
    try {
      emailResult = await emailService.sendAttendanceReport(payload);
    } catch (err: any) {
      emailResult = {
        sent: false,
        message: 'Attendance was saved, but the email report could not be sent.',
        recipient: 'theeninstitute@gmail.com',
        error: err?.message,
      };
    }

    return {
      savedRecords: newRecords,
      emailResult,
    };
  },

  /**
   * Calculate Attendance Summary for a student
   * Section 14: Formula Attendance % = Present / Total Records * 100
   */
  calculateStudentAttendanceSummary: async (
    teacherId: string,
    studentId: string
  ): Promise<AttendanceSummary> => {
    const all = await attendanceService.getAttendanceForTeacher(teacherId);
    const studentRecords = all.filter((r) => r.studentId === studentId);

    if (studentRecords.length === 0) {
      return {
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0,
        hasData: false,
      };
    }

    const presentCount = studentRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = studentRecords.filter((r) => r.status === 'ABSENT').length;
    const percentage = Math.round((presentCount / studentRecords.length) * 100);

    return {
      totalClasses: studentRecords.length,
      presentCount,
      absentCount,
      attendancePercentage: percentage,
      hasData: true,
    };
  },
};

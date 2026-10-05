import { StudentProgressRecord, ProgressStatus, CourseType } from '../types/academic';

const STORAGE_PROGRESS_KEY = 'theen_academic_student_progress';

const INITIAL_PROGRESS: StudentProgressRecord[] = [
  {
    progressId: 'PROG-1001-1',
    studentId: 'STU-1001',
    studentName: 'Muhammad Rayan',
    teacherId: 'MT001',
    course: 'hifz',
    lesson: 'Surah Al-Mulk (Ayah 1-15) revision & Ayah 16-20 new memorization',
    homework: 'Memorize next 5 ayahs with exact makharij rules',
    remarks: 'MashaAllah fluent memorization and good adherence to Ghunnah rules.',
    progressStatus: 'ON_TRACK',
    createdAt: '2026-10-02T10:30:00.000Z',
    updatedAt: '2026-10-02T10:30:00.000Z',
    updatedBy: 'Usthad Abdul Rahman',
  },
  {
    progressId: 'PROG-1002-1',
    studentId: 'STU-1002',
    studentName: 'Bilal Ahmed',
    teacherId: 'MT001',
    course: 'hifz',
    lesson: 'Juz Amma (Surah An-Naba Ayah 1-20)',
    homework: 'Repeat Ayah 1-10 three times with audio recording practice',
    remarks: 'Needs extra attention on Madd letters timing (2 Harakat).',
    progressStatus: 'NEEDS_ATTENTION',
    createdAt: '2026-10-01T10:45:00.000Z',
    updatedAt: '2026-10-01T10:45:00.000Z',
    updatedBy: 'Usthad Abdul Rahman',
  },
  {
    progressId: 'PROG-2001-1',
    studentId: 'STU-2001',
    studentName: 'Amina Fathima',
    teacherId: 'FT001',
    course: 'nazira',
    lesson: 'Qur’an Page 45 (Surah Al-Baqarah Ayah 260-264)',
    homework: 'Read next 2 pages focusing on Ikhfaa rules',
    remarks: 'Excellent Tajweed and clear pronunciation.',
    progressStatus: 'ON_TRACK',
    createdAt: '2026-10-02T11:30:00.000Z',
    updatedAt: '2026-10-02T11:30:00.000Z',
    updatedBy: 'Mu’allima Fathima Zahra',
  },
];

export const progressService = {
  initStore: () => {
    try {
      if (!localStorage.getItem(STORAGE_PROGRESS_KEY)) {
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(INITIAL_PROGRESS));
      }
    } catch {
      // Ignore
    }
  },

  /**
   * Get all progress records created by this teacher for assigned students
   */
  getProgressForTeacher: async (teacherId: string): Promise<StudentProgressRecord[]> => {
    progressService.initStore();
    try {
      const all: StudentProgressRecord[] = JSON.parse(
        localStorage.getItem(STORAGE_PROGRESS_KEY) || '[]'
      );
      return all
        .filter((p) => p.teacherId === teacherId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch {
      return INITIAL_PROGRESS.filter((p) => p.teacherId === teacherId);
    }
  },

  /**
   * Get progress history for a specific student
   */
  getProgressForStudent: async (
    teacherId: string,
    studentId: string
  ): Promise<StudentProgressRecord[]> => {
    const list = await progressService.getProgressForTeacher(teacherId);
    return list.filter((p) => p.studentId === studentId);
  },

  /**
   * Get latest progress status for a student
   */
  getLatestProgressForStudent: async (
    teacherId: string,
    studentId: string
  ): Promise<StudentProgressRecord | null> => {
    const history = await progressService.getProgressForStudent(teacherId, studentId);
    return history.length > 0 ? history[0] : null;
  },

  /**
   * Save or update progress entry
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
    progressService.initStore();
    const all: StudentProgressRecord[] = JSON.parse(
      localStorage.getItem(STORAGE_PROGRESS_KEY) || '[]'
    );

    const now = new Date().toISOString();
    const progressId = `PROG-${data.studentId.replace('STU-', '')}-${Date.now().toString().slice(-4)}`;

    const newRecord: StudentProgressRecord = {
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

    all.unshift(newRecord);

    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(all));
    } catch (err) {
      console.warn('Progress storage write warning:', err);
    }

    return newRecord;
  },
};

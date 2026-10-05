import { Student, TeacherProfileData, AttendanceSummary } from '../types/academic';
import { attendanceService } from './attendanceService';

const STORAGE_STUDENTS_KEY = 'theen_academic_students_data';
const STORAGE_TEACHERS_KEY = 'theen_academic_teachers_data';

// Default initial academic roster with strict teacher assignments & small batches (max 5 students)
const INITIAL_STUDENTS: Student[] = [
  // MT001 (Usthad Teacher - Male Faculty)
  {
    studentId: 'STU-1001',
    name: 'Muhammad Rayan',
    gender: 'male',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'MT001',
    batchId: 'BATCH-HIFZ-01',
    batchName: 'Hifz Morning Batch A (Mal)',
    status: 'ACTIVE',
    whatsapp: '+91 98460 11001',
    email: 'rayan.student@example.com',
    joinedAt: '2026-01-10',
  },
  {
    studentId: 'STU-1002',
    name: 'Bilal Ahmed',
    gender: 'male',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'MT001',
    batchId: 'BATCH-HIFZ-01',
    batchName: 'Hifz Morning Batch A (Mal)',
    status: 'ACTIVE',
    whatsapp: '+91 98460 11002',
    email: 'bilal.student@example.com',
    joinedAt: '2026-01-12',
  },
  {
    studentId: 'STU-1003',
    name: 'Zayd Faheem',
    gender: 'male',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'MT001',
    batchId: 'BATCH-HIFZ-01',
    batchName: 'Hifz Morning Batch A (Mal)',
    status: 'ACTIVE',
    whatsapp: '+91 98460 11003',
    email: 'zayd.student@example.com',
    joinedAt: '2026-01-15',
  },
  {
    studentId: 'STU-1004',
    name: 'Hamza Faris',
    gender: 'male',
    course: 'nazira',
    classType: 'individual',
    classLanguage: 'en',
    teacherId: 'MT001',
    status: 'ACTIVE',
    whatsapp: '+91 98460 11004',
    email: 'hamza.student@example.com',
    joinedAt: '2026-02-01',
  },
  {
    studentId: 'STU-1005',
    name: 'Omar Farooq',
    gender: 'male',
    course: 'fiqh',
    classType: 'individual',
    classLanguage: 'ml',
    teacherId: 'MT001',
    status: 'ACTIVE',
    whatsapp: '+91 98460 11005',
    email: 'omar.student@example.com',
    joinedAt: '2026-02-10',
  },

  // FT001 (Mu'allima Teacher - Female Faculty)
  {
    studentId: 'STU-2001',
    name: 'Amina Fathima',
    gender: 'female',
    course: 'nazira',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'FT001',
    batchId: 'BATCH-NAZ-02',
    batchName: 'Nazira Girls Batch B (Mal)',
    status: 'ACTIVE',
    whatsapp: '+91 98460 22001',
    email: 'amina.student@example.com',
    joinedAt: '2026-01-05',
  },
  {
    studentId: 'STU-2002',
    name: 'Maryam Zahra',
    gender: 'female',
    course: 'nazira',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'FT001',
    batchId: 'BATCH-NAZ-02',
    batchName: 'Nazira Girls Batch B (Mal)',
    status: 'ACTIVE',
    whatsapp: '+91 98460 22002',
    email: 'maryam.student@example.com',
    joinedAt: '2026-01-08',
  },
  {
    studentId: 'STU-2003',
    name: 'Aysha Nuha',
    gender: 'female',
    course: 'hifz',
    classType: 'individual',
    classLanguage: 'en',
    teacherId: 'FT001',
    status: 'ACTIVE',
    whatsapp: '+91 98460 22003',
    email: 'aysha.student@example.com',
    joinedAt: '2026-01-20',
  },
  {
    studentId: 'STU-2004',
    name: 'Khadija Rahman',
    gender: 'female',
    course: 'madrasa',
    classType: 'individual',
    classLanguage: 'ur',
    teacherId: 'FT001',
    status: 'ACTIVE',
    whatsapp: '+91 98460 22004',
    email: 'khadija.student@example.com',
    joinedAt: '2026-02-15',
  },
];

const INITIAL_TEACHERS: TeacherProfileData[] = [
  {
    teacherId: 'MT001',
    name: 'Usthad Abdul Rahman',
    gender: 'male',
    email: 'usthad.teacher@theen-institute.org',
    whatsapp: '+91 98461 00001',
    subjects: ['hifz', 'nazira', 'fiqh'],
    languages: ['ml', 'en', 'ur'],
    qualification: 'Fazil / Sanad in Qira’at & Tajweed',
    institution: 'Darul Huda Islamic University / Al-Azhar Affiliate',
    experience: '8 Years in Qur’anic instruction & Tajweed mastery',
    bio: 'Dedicated Qari and Tajweed instructor guiding students in Hifz and Nazira with classical precision and contemporary pedagogy.',
    status: 'ACTIVE',
  },
  {
    teacherId: 'FT001',
    name: 'Mu’allima Fathima Zahra',
    gender: 'female',
    email: 'muallima.teacher@theen-institute.org',
    whatsapp: '+91 98462 00002',
    subjects: ['nazira', 'hifz', 'madrasa'],
    languages: ['ml', 'en', 'ur'],
    qualification: 'Al-Hafidha, Master of Islamic Studies',
    institution: 'Madeenathunnoor Academy for Women',
    experience: '6 Years in ladies & children Qur’an classes',
    bio: 'Experienced educator providing supportive, focused Tajweed and Hifz education with personalized individual feedback.',
    status: 'ACTIVE',
  },
];

export const academicService = {
  // Initialize default stores if empty
  initStore: () => {
    try {
      if (!localStorage.getItem(STORAGE_STUDENTS_KEY)) {
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      }
      if (!localStorage.getItem(STORAGE_TEACHERS_KEY)) {
        localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(INITIAL_TEACHERS));
      }
    } catch {
      // Ignore
    }
  },

  /**
   * Get all students strictly assigned to a specific teacher ID.
   * Section 5 Requirement: "Teacher can see ONLY students assigned to that teacher. Never show all students to every teacher."
   */
  getStudentsForTeacher: async (teacherId: string): Promise<Student[]> => {
    academicService.initStore();
    try {
      const all: Student[] = JSON.parse(localStorage.getItem(STORAGE_STUDENTS_KEY) || '[]');
      return all.filter((s) => s.teacherId === teacherId && s.status !== 'COMPLETED');
    } catch {
      return INITIAL_STUDENTS.filter((s) => s.teacherId === teacherId);
    }
  },

  /**
   * Look up a student by ID, strictly verifying teacher ownership.
   */
  getStudentForTeacherById: async (teacherId: string, studentId: string): Promise<Student | null> => {
    const list = await academicService.getStudentsForTeacher(teacherId);
    return list.find((s) => s.studentId === studentId) || null;
  },

  /**
   * Get faculty profile data for given teacherId
   */
  getTeacherProfile: async (teacherId: string): Promise<TeacherProfileData | null> => {
    academicService.initStore();
    try {
      const all: TeacherProfileData[] = JSON.parse(
        localStorage.getItem(STORAGE_TEACHERS_KEY) || '[]'
      );
      const found = all.find((t) => t.teacherId === teacherId);
      if (found) return found;
      return INITIAL_TEACHERS.find((t) => t.teacherId === teacherId) || null;
    } catch {
      return INITIAL_TEACHERS.find((t) => t.teacherId === teacherId) || null;
    }
  },

  /**
   * Safe profile update:
   * Section 16 Requirement: "Teacher must NOT be able to edit: teacherId, role, isActive, permissions"
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
    academicService.initStore();
    const existing = (await academicService.getTeacherProfile(teacherId)) || {
      teacherId,
      name: 'Faculty Member',
      gender: 'male',
      email: '',
      whatsapp: '',
      subjects: ['hifz', 'nazira'],
      languages: ['ml', 'en'],
      qualification: '',
      institution: '',
      experience: '',
      status: 'ACTIVE',
    };

    const updated: TeacherProfileData = {
      ...existing,
      name: safeData.name?.trim() || existing.name,
      whatsapp: safeData.whatsapp?.trim() || existing.whatsapp,
      bio: safeData.bio?.trim() || existing.bio,
      languages: safeData.languages || existing.languages,
      // Strictly preserve immutable fields:
      teacherId: existing.teacherId,
      status: existing.status,
      gender: existing.gender,
      email: existing.email,
      qualification: existing.qualification,
      institution: existing.institution,
      experience: existing.experience,
    };

    try {
      const all: TeacherProfileData[] = JSON.parse(
        localStorage.getItem(STORAGE_TEACHERS_KEY) || '[]'
      );
      const filtered = all.filter((t) => t.teacherId !== teacherId);
      filtered.push(updated);
      localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Profile persistence error:', err);
    }

    return updated;
  },
};

export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export type ProgressStatus = 'ON_TRACK' | 'NEEDS_ATTENTION' | 'COMPLETED';

export type CourseType = 'hifz' | 'nazira' | 'fiqh' | 'madrasa';
export type ClassType = 'group' | 'individual';
export type ClassLanguage = 'ml' | 'en' | 'ur';

export interface Student {
  studentId: string; // Format: STU-0001
  name: string;
  gender: 'male' | 'female';
  course: CourseType;
  classType: ClassType;
  classLanguage: ClassLanguage;
  teacherId: string; // Associated faculty ID (e.g., MT001 or FT001)
  batchId?: string; // e.g., BATCH-HIFZ-01 (max 5 students)
  batchName?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  whatsapp?: string;
  email?: string;
  joinedAt: string;
}

export interface AttendanceRecord {
  attendanceId: string; // Unique / deterministic ID: `${teacherId}_${studentId}_${date}`
  date: string; // YYYY-MM-DD in Asia/Kolkata
  submittedAt: string; // ISO string / timestamp
  teacherUid: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  course: CourseType;
  classType: ClassType;
  classLanguage: ClassLanguage;
  status: AttendanceStatus;
}

export interface StudentProgressRecord {
  progressId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  course: CourseType;
  lesson: string;
  homework: string;
  remarks: string;
  progressStatus: ProgressStatus;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface TeacherProfileData {
  teacherId: string; // e.g. MT001 or FT001
  uid?: string;
  name: string;
  gender: 'male' | 'female';
  email: string;
  whatsapp: string;
  subjects: CourseType[];
  languages: ClassLanguage[];
  qualification: string;
  institution: string;
  experience: string;
  bio?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AttendanceSubmissionPayload {
  teacherId: string;
  teacherUid: string;
  teacherName: string;
  date: string;
  records: {
    studentId: string;
    studentName: string;
    course: CourseType;
    classType: ClassType;
    classLanguage: ClassLanguage;
    status: AttendanceStatus;
  }[];
}

export interface EmailReportResult {
  sent: boolean;
  message: string;
  recipient: string;
  error?: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  hasData: boolean;
}

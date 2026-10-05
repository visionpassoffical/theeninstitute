import { TeacherApplication } from '../types';

const STORAGE_KEY = 'theen_teacher_applications_data';
const COUNTER_KEY = 'theen_teacher_app_counter';

export const teacherService = {
  // Generate formatted ID like TAPP-0001
  getNextTeacherAppId: (): string => {
    try {
      const current = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
      const next = current + 1;
      localStorage.setItem(COUNTER_KEY, next.toString());
      return `TAPP-${String(next).padStart(4, '0')}`;
    } catch {
      return `TAPP-${String(Math.floor(1000 + Math.random() * 9000))}`;
    }
  },

  // Submit new teacher registration
  submitApplication: async (
    data: Omit<TeacherApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<TeacherApplication> => {
    // Realistic UI feedback delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const applicationId = teacherService.getNextTeacherAppId();
    const newApplication: TeacherApplication = {
      ...data,
      applicationId,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing: TeacherApplication[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      existing.push(newApplication);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (err) {
      console.warn('Local storage write warning:', err);
    }

    return newApplication;
  },

  // Lookup teacher application
  getApplicationById: (id: string): TeacherApplication | null => {
    try {
      const existing: TeacherApplication[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      return existing.find((app) => app.applicationId === id) || null;
    } catch {
      return null;
    }
  },
};

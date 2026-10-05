import { AdmissionApplication } from '../types';

const STORAGE_KEY = 'theen_admissions_data';
const COUNTER_KEY = 'theen_admission_counter';

export const admissionService = {
  // Generate formatted ID like APP-0001
  getNextApplicationId: (): string => {
    try {
      const current = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
      const next = current + 1;
      localStorage.setItem(COUNTER_KEY, next.toString());
      return `APP-${String(next).padStart(4, '0')}`;
    } catch {
      return `APP-${String(Math.floor(1000 + Math.random() * 9000))}`;
    }
  },

  // Submit new student admission application
  submitApplication: async (
    data: Omit<AdmissionApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<AdmissionApplication> => {
    // Artificial slight latency for realistic UI state handling
    await new Promise((resolve) => setTimeout(resolve, 600));

    const applicationId = admissionService.getNextApplicationId();
    const newApplication: AdmissionApplication = {
      ...data,
      applicationId,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing: AdmissionApplication[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      existing.push(newApplication);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (err) {
      console.warn('Local storage write warning:', err);
    }

    return newApplication;
  },

  // Get application by ID (for status / confirmation verification)
  getApplicationById: (id: string): AdmissionApplication | null => {
    try {
      const existing: AdmissionApplication[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      return existing.find((app) => app.applicationId === id) || null;
    } catch {
      return null;
    }
  },
};

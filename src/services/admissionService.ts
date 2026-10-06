import { AdmissionApplication } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'theen_admissions_data';
const COUNTER_KEY = 'theen_admission_counter';

export const admissionService = {
  // Generate formatted ID like APP-0001
  getNextApplicationId: (): string => {
    try {
      const current = parseInt(localStorage.getItem(COUNTER_KEY) || '1000', 10);
      const next = current + 1;
      localStorage.setItem(COUNTER_KEY, next.toString());
      return `APP-${String(next).padStart(4, '0')}`;
    } catch {
      return `APP-${String(Math.floor(1000 + Math.random() * 9000))}`;
    }
  },

  // Submit new student admission application to Supabase with graceful local fallback
  submitApplication: async (
    data: Omit<AdmissionApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<AdmissionApplication> => {
    const applicationId = admissionService.getNextApplicationId();
    const submittedAt = new Date().toISOString();
    const newApplication: AdmissionApplication = {
      ...data,
      applicationId,
      status: 'PENDING',
      submittedAt,
    };

    // Attempt Supabase insertion; log notice and fallback gracefully if tables are not yet provisioned
    try {
      const { error } = await supabase.from('admissions').insert({
        application_id: applicationId,
        full_name: data.fullName,
        dob: data.dateOfBirth,
        age: data.age?.toString(),
        gender: data.gender,
        country: data.country,
        state: data.state,
        city: data.city,
        whatsapp: data.whatsapp,
        email: data.email,
        guardian_information: {
          isApplyingForSelf: data.isApplyingForSelf,
          guardianName: data.guardianName,
          guardianWhatsapp: data.guardianWhatsapp,
          guardianRelationship: data.guardianRelationship,
        },
        course: data.course,
        class_type: data.classType,
        class_language: data.classLanguage,
        previous_learning: data.previousLearning,
        preferred_contact: data.preferredContact,
        notes: data.notes,
        status: 'PENDING',
      });

      if (error) {
        console.warn('Supabase admission table notice (falling back to resilient local storage):', error.message);
      }
    } catch (err) {
      console.warn('Supabase network notice (falling back to local storage):', err);
    }

    // Always persist to local cache for resilient operation
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

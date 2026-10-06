import { AdmissionApplication } from '../types';
import { supabase } from '../lib/supabase';

export const admissionService = {
  // Submit new student admission application directly to Supabase public.admissions table
  submitApplication: async (
    data: Omit<AdmissionApplication, 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<AdmissionApplication> => {
    // Generate unique application ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `APP-${randomNum}`;
    const submittedAt = new Date().toISOString();

    const insertPayload = {
      application_id: applicationId,
      full_name: data.fullName,
      dob: data.dateOfBirth,
      age: data.age?.toString() || '',
      gender: data.gender,
      country: data.country,
      state: data.state,
      city: data.city,
      whatsapp: data.whatsapp,
      email: data.email,
      guardian_information: {
        isApplyingForSelf: data.isApplyingForSelf,
        guardianName: data.guardianName || '',
        guardianWhatsapp: data.guardianWhatsapp || '',
        guardianRelationship: data.guardianRelationship || '',
      },
      course: data.course,
      class_type: data.classType,
      class_language: data.classLanguage,
      previous_learning: data.previousLearning,
      preferred_contact: data.preferredContact,
      notes: data.notes || '',
      status: 'PENDING',
    };

    const { data: insertedData, error } = await supabase
      .from('admissions')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Supabase Admissions insertion error:', error);
      throw new Error(error.message || 'Failed to submit admission to database.');
    }

    const newApplication: AdmissionApplication = {
      ...data,
      applicationId: insertedData?.application_id || applicationId,
      status: insertedData?.status || 'PENDING',
      submittedAt: insertedData?.created_at || submittedAt,
    };

    return newApplication;
  },

  // Get application by ID (for status / confirmation verification) from Supabase
  getApplicationById: async (id: string): Promise<AdmissionApplication | null> => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('application_id', id)
        .single();

      if (error || !data) return null;

      return {
        fullName: data.full_name,
        dateOfBirth: data.dob,
        age: Number(data.age) || 0,
        gender: data.gender,
        country: data.country,
        state: data.state,
        city: data.city,
        whatsapp: data.whatsapp,
        email: data.email,
        isApplyingForSelf: data.guardian_information?.isApplyingForSelf ?? false,
        guardianName: data.guardian_information?.guardianName || '',
        guardianWhatsapp: data.guardian_information?.guardianWhatsapp || '',
        guardianRelationship: data.guardian_information?.guardianRelationship || '',
        course: data.course,
        classType: data.class_type,
        classLanguage: data.class_language,
        previousLearning: data.previous_learning,
        previousLearningDetails: '',
        preferredContact: data.preferred_contact,
        notes: data.notes,
        consent: true,
        applicationId: data.application_id,
        status: data.status,
        submittedAt: data.created_at,
      };
    } catch {
      return null;
    }
  },
};

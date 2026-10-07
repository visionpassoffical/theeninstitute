import { supabase } from '../lib/supabase';
import { AdmissionApplication } from '../types';
import { Student, TeacherProfileData } from '../types/academic';

export const adminService = {
  // 1. Dashboard Overview Counts
  getDashboardStats: async () => {
    try {
      const [
        { count: pendingAdmissions },
        { count: activeStudents },
        { count: activeTeachers },
        { count: activeBatches },
      ] = await Promise.all([
        supabase.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
        supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
        supabase.from('batches').select('*', { count: 'exact', head: true }),
      ]);

      return {
        pendingAdmissions: pendingAdmissions || 0,
        activeStudents: activeStudents || 0,
        activeTeachers: activeTeachers || 0,
        activeBatches: activeBatches || 0,
      };
    } catch (err) {
      console.warn('Dashboard stats fetch notice:', err);
      return { pendingAdmissions: 0, activeStudents: 0, activeTeachers: 0, activeBatches: 0 };
    }
  },

  // 2. Admissions Management
  getAdmissions: async (): Promise<AdmissionApplication[]> => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((row: any) => ({
        applicationId: row.application_id,
        fullName: row.full_name,
        dateOfBirth: row.dob || '',
        age: Number(row.age) || 0,
        gender: row.gender,
        country: row.country || '',
        state: row.state || '',
        city: row.city || '',
        whatsapp: row.whatsapp,
        email: row.email,
        isApplyingForSelf: row.guardian_information?.isApplyingForSelf ?? false,
        guardianName: row.guardian_information?.guardianName || '',
        guardianWhatsapp: row.guardian_information?.guardianWhatsapp || '',
        guardianRelationship: row.guardian_information?.guardianRelationship || '',
        course: row.course,
        classType: row.class_type,
        classLanguage: row.class_language,
        previousLearning: row.previous_learning || 'beginner',
        previousLearningDetails: '',
        preferredContact: row.preferred_contact || 'whatsapp',
        notes: row.notes || '',
        consent: true,
        status: row.status,
        submittedAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Admissions fetch notice:', err);
      try {
        return JSON.parse(localStorage.getItem('theen_admissions_data') || '[]');
      } catch {
        return [];
      }
    }
  },

  updateAdmissionStatus: async (applicationId: string, status: 'APPROVED' | 'REJECTED', adminEmail?: string): Promise<void> => {
    const { error } = await supabase
      .from('admissions')
      .update({
        status,
        approved_at: status === 'APPROVED' ? new Date().toISOString() : null,
        approved_by: adminEmail || 'Admin',
        rejected_at: status === 'REJECTED' ? new Date().toISOString() : null,
        rejected_by: adminEmail || 'Admin',
      })
      .eq('application_id', applicationId);

    if (error) throw error;

    if (status === 'APPROVED') {
      const { data: admissionData } = await supabase
        .from('admissions')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (admissionData) {
        const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const studentSeq = (count || 0) + 1001;
        const studentId = `STU-${studentSeq}`;
        const defaultTeacherId = admissionData.gender === 'female' ? 'FT001' : 'MT001';

        await supabase.from('students').insert({
          student_id: studentId,
          name: admissionData.full_name,
          gender: admissionData.gender,
          course: admissionData.course,
          class_type: admissionData.class_type,
          class_language: admissionData.class_language,
          teacher_id: defaultTeacherId,
          status: 'ACTIVE',
          whatsapp: admissionData.whatsapp,
          email: admissionData.email,
          joined_at: new Date().toISOString().split('T')[0],
        });
      }
    }
  },

  // 3. Teachers Management
  getTeachers: async (): Promise<TeacherProfileData[]> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((row: any) => ({
        teacherId: row.teacher_id,
        name: row.name,
        gender: row.gender || 'male',
        email: row.email,
        whatsapp: row.whatsapp || '',
        subjects: row.subjects || ['hifz'],
        languages: row.languages || ['ml'],
        qualification: row.qualification || '',
        institution: row.institution || '',
        experience: '3+ Years',
        bio: row.bio || '',
        status: row.status || 'ACTIVE',
      }));
    } catch (err) {
      console.warn('Teachers fetch notice:', err);
      return [];
    }
  },

  saveTeacher: async (teacher: TeacherProfileData, isEdit: boolean): Promise<void> => {
    const payload = {
      teacher_id: teacher.teacherId,
      name: teacher.name,
      gender: teacher.gender,
      email: teacher.email,
      whatsapp: teacher.whatsapp,
      subjects: teacher.subjects,
      languages: teacher.languages,
      qualification: teacher.qualification,
      institution: teacher.institution,
      bio: teacher.bio,
      status: teacher.status,
    };

    if (isEdit) {
      const { error } = await supabase
        .from('teachers')
        .update(payload)
        .eq('teacher_id', teacher.teacherId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('teachers')
        .insert(payload);
      if (error) throw error;
    }
  },

  // 4. Students Management
  getStudents: async (): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((row: any) => ({
        studentId: row.student_id,
        name: row.name,
        gender: row.gender || 'male',
        course: row.course,
        classType: row.class_type,
        classLanguage: row.class_language,
        teacherId: row.teacher_id || 'MT001',
        batchId: row.batch_id,
        batchName: row.batch_name,
        status: row.status || 'ACTIVE',
        whatsapp: row.whatsapp || '',
        email: row.email || '',
        joinedAt: row.joined_at || new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      console.warn('Students fetch notice:', err);
      return [];
    }
  },

  saveStudent: async (student: Student, isEdit: boolean): Promise<void> => {
    const payload = {
      student_id: student.studentId,
      name: student.name,
      gender: student.gender,
      course: student.course,
      class_type: student.classType,
      class_language: student.classLanguage,
      teacher_id: student.teacherId,
      batch_id: student.batchId || null,
      batch_name: student.batchName || null,
      status: student.status,
      whatsapp: student.whatsapp,
      email: student.email,
      joined_at: student.joinedAt,
    };

    if (isEdit) {
      const { error } = await supabase
        .from('students')
        .update(payload)
        .eq('student_id', student.studentId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('students')
        .insert(payload);
      if (error) throw error;
    }
  },
};

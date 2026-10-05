export type Language = 'ml' | 'en' | 'ur';

export type Theme = 'light' | 'dark';

export interface Course {
  id: string;
  number: string;
  name: {
    en: string;
    ml: string;
    ur: string;
  };
  subtitle: {
    en: string;
    ml: string;
    ur: string;
  };
  description: {
    en: string;
    ml: string;
    ur: string;
  };
  highlights: {
    en: string[];
    ml: string[];
    ur: string[];
  };
  madhhabs?: {
    shafi: {
      en: string;
      ml: string;
      ur: string;
    };
    hanafi: {
      en: string;
      ml: string;
      ur: string;
    };
  };
  suitableFor: {
    en: string;
    ml: string;
    ur: string;
  };
}

export interface FaqItem {
  id: string;
  question: {
    en: string;
    ml: string;
    ur: string;
  };
  answer: {
    en: string;
    ml: string;
    ur: string;
  };
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdmissionApplication {
  applicationId: string; // Format: APP-0001
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female';
  country: string;
  state: string;
  city: string;
  whatsapp: string;
  email: string;
  isApplyingForSelf: boolean;
  guardianName?: string;
  guardianWhatsapp?: string;
  guardianRelationship?: string;
  course: 'hifz' | 'nazira' | 'fiqh' | 'madrasa';
  classType: 'group' | 'individual';
  classLanguage: 'ml' | 'en' | 'ur';
  previousLearning: 'beginner' | 'some_reading' | 'nazira_ongoing' | 'hifz_ongoing' | 'madrasa_studies' | 'other';
  previousLearningDetails?: string;
  preferredContact: 'whatsapp' | 'email';
  notes?: string;
  consent: boolean;
  status: ApplicationStatus;
  submittedAt: string;
}

export interface TeacherApplication {
  applicationId: string; // Format: TAPP-0001
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  age: number;
  country: string;
  city: string;
  whatsapp: string;
  email: string;
  qualification: string;
  institution: string;
  experience: string;
  quranBackground?: string;
  otherQualifications?: string;
  subjects: ('hifz' | 'nazira' | 'fiqh' | 'madrasa')[];
  languages: ('ml' | 'en' | 'ur')[];
  preferredStudents: 'male' | 'female' | 'both';
  preferredTeachingTimes: string;
  device: 'smartphone' | 'tablet' | 'laptop' | 'desktop';
  internetQuality: 'good' | 'average' | 'limited';
  motivation: string;
  additionalInformation?: string;
  consent: boolean;
  status: ApplicationStatus;
  submittedAt: string;
  assignedTeacherId?: string; // Structured for future post-approval ID (MT001 / FT001)
}

export interface ContactFormData {
  name: string;
  email: string;
  phoneOrWhatsapp: string;
  subject: string;
  message: string;
}

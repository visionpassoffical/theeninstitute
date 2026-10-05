import { z } from 'zod';

export const createTeacherSchema = (validationMessages: Record<string, string>) => {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: validationMessages.fullName || 'Please enter your full name.' }),
    gender: z.enum(['male', 'female'], {
      message: validationMessages.gender || 'Please select gender.',
    }),
    dateOfBirth: z
      .string()
      .min(1, { message: validationMessages.dob || 'Please enter date of birth.' }),
    age: z
      .number({ message: validationMessages.age || 'Please enter a valid age.' })
      .min(18, { message: 'Teachers must be at least 18 years of age.' })
      .max(80, { message: 'Please enter a valid age.' }),
    country: z
      .string()
      .trim()
      .min(2, { message: validationMessages.country || 'Please enter your country.' }),
    city: z
      .string()
      .trim()
      .min(2, { message: validationMessages.city || 'Please enter your city.' }),
    whatsapp: z
      .string()
      .trim()
      .min(7, { message: validationMessages.whatsapp || 'Please enter a valid WhatsApp number.' }),
    email: z
      .string()
      .trim()
      .email({ message: validationMessages.email || 'Please enter a valid email address.' }),

    qualification: z
      .string()
      .trim()
      .min(2, { message: validationMessages.qualification || 'Please enter your Islamic qualification.' }),
    institution: z
      .string()
      .trim()
      .min(2, { message: validationMessages.institution || 'Please enter the institution name.' }),
    experience: z
      .string()
      .trim()
      .min(3, { message: validationMessages.experience || 'Please summarize your teaching experience.' }),
    quranBackground: z.string().optional(),
    otherQualifications: z.string().optional(),

    subjects: z
      .array(z.enum(['hifz', 'nazira', 'fiqh', 'madrasa']))
      .min(1, { message: validationMessages.subjects || 'Please select at least one teaching subject.' }),

    languages: z
      .array(z.enum(['ml', 'en', 'ur']))
      .min(1, { message: validationMessages.languages || 'Please select at least one teaching language.' }),

    preferredStudents: z.enum(['male', 'female', 'both'], {
      message: validationMessages.preferredStudents || 'Please select preferred student allocation.',
    }),
    preferredTeachingTimes: z
      .string()
      .trim()
      .min(2, { message: validationMessages.preferredTimes || 'Please specify your teaching availability.' }),

    device: z.enum(['smartphone', 'tablet', 'laptop', 'desktop'], {
      message: validationMessages.device || 'Please select your primary teaching device.',
    }),
    internetQuality: z.enum(['good', 'average', 'limited'], {
      message: validationMessages.internet || 'Please select your internet quality.',
    }),

    motivation: z
      .string()
      .trim()
      .min(30, { message: validationMessages.motivation || 'Please state why you would like to teach with THEEN (min 30 characters).' }),
    additionalInformation: z.string().optional(),

    consent: z.boolean().refine((val) => val === true, {
      message: validationMessages.consent || 'You must confirm that the information provided is accurate.',
    }),
  });
};

export type TeacherFormValues = z.infer<ReturnType<typeof createTeacherSchema>>;

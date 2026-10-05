import { z } from 'zod';

export const createAdmissionSchema = (validationMessages: Record<string, string>) => {
  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, { message: validationMessages.fullName || 'Please enter your full name.' }),
      dateOfBirth: z
        .string()
        .min(1, { message: validationMessages.dob || 'Please select a valid date of birth.' }),
      age: z
        .number({ message: validationMessages.age || 'Please enter a valid age.' })
        .min(4, { message: 'Age must be at least 4 years.' })
        .max(100, { message: 'Please enter a valid age.' }),
      gender: z.enum(['male', 'female'], {
        message: validationMessages.gender || 'Please select a gender.',
      }),
      country: z
        .string()
        .trim()
        .min(2, { message: validationMessages.country || 'Please enter your country.' }),
      state: z
        .string()
        .trim()
        .min(2, { message: validationMessages.state || 'Please enter your state.' }),
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

      // Guardian logic
      isApplyingForSelf: z.boolean(),
      guardianName: z.string().optional(),
      guardianWhatsapp: z.string().optional(),
      guardianRelationship: z.string().optional(),

      course: z.enum(['hifz', 'nazira', 'fiqh', 'madrasa'], {
        message: validationMessages.course || 'Please select a course.',
      }),
      classType: z.enum(['group', 'individual'], {
        message: validationMessages.classType || 'Please select a class format.',
      }),
      classLanguage: z.enum(['ml', 'en', 'ur'], {
        message: validationMessages.classLanguage || 'Please select your preferred class language.',
      }),
      previousLearning: z.enum(
        ['beginner', 'some_reading', 'nazira_ongoing', 'hifz_ongoing', 'madrasa_studies', 'other'],
        {
          message: validationMessages.previousLearning || 'Please select your previous learning background.',
        }
      ),
      previousLearningDetails: z.string().optional(),
      preferredContact: z.enum(['whatsapp', 'email']),
      notes: z.string().optional(),
      consent: z.boolean().refine((val) => val === true, {
        message: validationMessages.consent || 'You must confirm that the information provided is accurate.',
      }),
    })
    .superRefine((data, ctx) => {
      // If student is minor (age < 18) or isApplyingForSelf is false, require guardian information
      if (!data.isApplyingForSelf || data.age < 18) {
        if (!data.guardianName || data.guardianName.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardianName'],
            message: validationMessages.guardianName || 'Please enter parent/guardian full name.',
          });
        }
        if (!data.guardianWhatsapp || data.guardianWhatsapp.trim().length < 7) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardianWhatsapp'],
            message: validationMessages.guardianWhatsapp || 'Please enter parent/guardian WhatsApp number.',
          });
        }
        if (!data.guardianRelationship || data.guardianRelationship.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardianRelationship'],
            message: validationMessages.guardianRelationship || 'Please specify relationship to student.',
          });
        }
      }
    });
};

export type AdmissionFormValues = z.infer<ReturnType<typeof createAdmissionSchema>>;

import { z } from 'zod';

// Valid enum values — kept in sync with the form's <option> values
const revenueValues = ['under-50m', '50m-150m', '150m-500m', '500m-plus', 'prefer-not'] as const;
const intentValues = ['ai-strategy', 'ai-build', 'ai-enablement', 'data-infra', 'ai-audit', 'other'] as const;
const sourceValues = ['google', 'linkedin', 'word-of-mouth', 'conference', 'case-study', 'other'] as const;

// Helper: treat empty strings as absent for optional fields
const optionalStr = (max: number, label?: string) =>
  z
    .string()
    .max(max, `${label ?? 'Field'} must be under ${max} characters`)
    .transform((v) => v.trim() || undefined)
    .optional();

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),

  company: z.string().min(1, 'Company is required').max(100, 'Company must be under 100 characters'),

  role: optionalStr(100, 'Role'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254),

  phone: z
    .string()
    .max(30, 'Phone must be under 30 characters')
    .refine(
      (v) => !v.trim() || /^[+\d\s\-().]+$/.test(v.trim()),
      'Please enter a valid phone number'
    )
    .transform((v) => v.trim() || undefined)
    .optional(),

  revenue: z
    .enum([...revenueValues, '' as ''])
    .transform((v) => (v === '' ? undefined : v))
    .optional(),

  intent: z.enum(intentValues, {
    errorMap: () => ({ message: 'Please select what you are looking for' }),
  }),

  message: z
    .string()
    .min(10, 'Please tell us a bit more (at least 10 characters)')
    .max(5000, 'Message must be under 5000 characters'),

  source: z
    .enum([...sourceValues, '' as ''])
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

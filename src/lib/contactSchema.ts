import { z } from 'zod';

const revenueValues = ['under-50m', '50m-150m', '150m-500m', '500m-plus', 'prefer-not'] as const;
const validIntents = ['stack-discover', 'stack-build', 'stack-scale'] as const;
const sourceValues = ['google', 'linkedin', 'word-of-mouth', 'conference', 'case-study', 'other'] as const;

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),

  company: z.string().min(1, 'Company is required').max(100, 'Company must be under 100 characters'),

  role: z.string().min(1, 'Role / Title is required').max(100, 'Role must be under 100 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254),

  phone: z
    .string()
    .min(1, 'Phone is required')
    .max(30, 'Phone must be under 30 characters')
    .refine(
      (v) => /^[+\d\s\-().]+$/.test(v.trim()),
      'Please enter a valid phone number'
    ),

  revenue: z.enum(revenueValues, {
    errorMap: () => ({ message: 'Annual Revenue is required' }),
  }),

  intent: z
    .string()
    .min(1, 'Please select what you are looking for')
    .refine(
      (v) => v.split(',').every((s) => (validIntents as readonly string[]).includes(s.trim())),
      'Please select what you are looking for'
    ),

  message: z
    .string()
    .min(10, 'Please tell us a bit more (at least 10 characters)')
    .max(5000, 'Message must be under 5000 characters'),

  source: z.enum(sourceValues, {
    errorMap: () => ({ message: 'Please tell us how you heard about us' }),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

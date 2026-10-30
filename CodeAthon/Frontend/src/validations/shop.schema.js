import { z } from 'zod';
import { INDIAN_STATES } from '../constants/indianStates';

export const shopSchema = z.object({
  name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters')
    .trim(),

  ownerName: z
    .string()
    .min(2, 'Owner name must be at least 2 characters')
    .max(60)
    .trim()
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .min(5, 'Business address must be at least 5 characters')
    .max(250)
    .trim(),

  state: z
    .string()
    .min(1, 'Please select the state for GST tax jurisdiction')
    .refine((val) => INDIAN_STATES.includes(val), {
      message: 'Please select a valid Indian state or Union Territory',
    }),

  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), {
      message: 'Please enter a valid 15-character Indian GSTIN',
    }),

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: 'Phone must be a valid 10-digit mobile number',
    }),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  invoicePrefix: z
    .string()
    .trim()
    .max(10, 'Invoice prefix cannot exceed 10 characters')
    .default('INV-'),
});

export default shopSchema;

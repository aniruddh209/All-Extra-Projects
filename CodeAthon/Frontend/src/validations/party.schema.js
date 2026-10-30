import { z } from 'zod';
import { INDIAN_STATES } from '../constants/states';

/**
 * Party / Customer Zod Validation Schema
 */
export const partySchema = z.object({
  name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters')
    .trim(),

  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
    .trim(),

  address: z
    .string()
    .min(3, 'Address is required for GST tax invoices')
    .max(300, 'Address cannot exceed 300 characters')
    .trim(),

  state: z
    .string()
    .min(1, 'State is required for GST determination')
    .refine((val) => INDIAN_STATES.includes(val), {
      message: 'Please select a valid Indian state',
    }),

  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
      {
        message: 'Invalid GSTIN format (e.g. 24AAAAA0000A1Z5)',
      }
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .refine((val) => !val || /^\S+@\S+\.\S+$/.test(val), {
      message: 'Please provide a valid email address',
    }),
});

export default partySchema;

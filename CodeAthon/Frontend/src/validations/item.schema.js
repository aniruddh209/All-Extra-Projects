import { z } from 'zod';
import { GST_RATES } from '../constants/gstRates';

/**
 * Item / Product Zod Validation Schema
 */
export const itemSchema = z.object({
  name: z
    .string()
    .min(2, 'Item name must be at least 2 characters')
    .max(150, 'Item name cannot exceed 150 characters')
    .trim(),

  hsnCode: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[0-9]{2,8}$/.test(val), {
      message: 'HSN/SAC code must be 2 to 8 numeric digits',
    }),

  price: z.coerce
    .number({ invalid_type_error: 'Unit price must be a valid number' })
    .positive('Unit price must be greater than zero'),

  gstPercent: z.coerce
    .number({ invalid_type_error: 'Please select a GST rate' })
    .refine((val) => GST_RATES.includes(val), {
      message: 'GST rate must be one of: 0%, 5%, 12%, 18%, 28%',
    }),
});

export default itemSchema;

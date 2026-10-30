import { z } from 'zod';
import { GST_RATES } from '../constants/gstRates';

export const billItemSchema = z.object({
  itemId: z.string().optional(),
  name: z.string().min(1, 'Item name is required').trim(),
  hsnCode: z.string().trim().optional(),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  price: z.coerce.number().positive('Unit price must be greater than 0'),
  gstPercent: z.coerce
    .number()
    .refine((val) => GST_RATES.includes(val), {
      message: 'GST rate must be 0%, 5%, 12%, 18%, or 28%',
    }),
});

export const billSchema = z.object({
  partyId: z.string().min(1, 'Please select a customer / party for this invoice'),
  invoiceDate: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  items: z
    .array(billItemSchema)
    .min(1, 'Invoice must contain at least one line item'),
});

export default billSchema;

import { z } from 'zod';
import ROLES from '../constants/roles';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([ROLES.ADMIN, ROLES.STAFF], {
    errorMap: () => ({ message: 'Please select a role (Admin or Staff)' }),
  }),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum([ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  isActive: z.boolean().default(true),
});

export default {
  createUserSchema,
  updateUserSchema,
};

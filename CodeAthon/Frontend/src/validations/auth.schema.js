import { z } from 'zod';
import { INDIAN_STATES } from '../constants/states';

/**
 * Authentication Zod Validation Schemas
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    businessName: z
      .string()
      .min(2, 'Business name must be at least 2 characters')
      .max(200, 'Business name cannot exceed 200 characters')
      .trim(),
    state: z
      .string()
      .min(1, 'State is required for GST calculation')
      .refine((val) => INDIAN_STATES.includes(val), {
        message: 'Please select a valid Indian state',
      }),
    role: z.enum(['OWNER', 'ADMIN', 'STAFF']).default('OWNER'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain numbers only'),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    resetToken: z.string().min(1, 'Reset session expired. Please restart.'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

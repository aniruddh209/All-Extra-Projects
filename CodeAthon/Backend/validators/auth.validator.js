import { z } from 'zod';
import { INDIAN_STATES } from '../constants/states.js';

/**
 * Auth validation schemas (Zod).
 * Used with validate.middleware.js on auth routes.
 * Shared between signup, login, forgot-password, verify-otp, reset-password.
 */

// ─── Signup ───
export const signupSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),

    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .toLowerCase(),

    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),

    confirmPassword: z.string({ required_error: 'Please confirm your password' }),

    businessName: z
      .string({ required_error: 'Business name is required' })
      .trim()
      .min(2, 'Business name must be at least 2 characters')
      .max(200, 'Business name cannot exceed 200 characters'),

    state: z
      .string({ required_error: 'State is required' })
      .refine((val) => INDIAN_STATES.includes(val), {
        message: 'Please select a valid Indian state',
      }),

    role: z
      .enum(['OWNER', 'ADMIN', 'STAFF'], {
        errorMap: () => ({ message: 'Role must be OWNER, ADMIN, or STAFF' }),
      })
      .optional()
      .default('OWNER'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Login ───
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email')
    .toLowerCase(),

  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

// ─── Forgot Password ───
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email')
    .toLowerCase(),
});

// ─── Verify OTP ───
export const verifyOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email')
    .toLowerCase(),

  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

// ─── Reset Password ───
export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .toLowerCase(),

    resetToken: z.string({ required_error: 'Reset token is required' }).min(1, 'Reset token is required'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),

    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

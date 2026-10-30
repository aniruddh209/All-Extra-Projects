import rateLimit from 'express-rate-limit';

/**
 * Standard rate limiter for authentication endpoints (login, signup).
 * Prevents brute force password attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Strict rate limiter for sensitive OTP endpoints.
 * Prevents spamming emails or brute-forcing 6-digit codes.
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 15 minutes.',
  },
});

export default { authLimiter, otpLimiter };

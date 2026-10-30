import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import requireAuth from '../middleware/auth.middleware.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimit.middleware.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Public routes
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', otpLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', otpLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import env from '../config/env.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import ApiError from '../utils/ApiError.js';
import otpService from './otp.service.js';
import emailService from './email.service.js';

/**
 * Authentication Service
 *
 * Core business logic for authentication and password recovery:
 * - Signup (User + Shop generation)
 * - Login (Password check + JWT generation)
 * - Get current user & shop
 * - Forgot password (OTP generation & email)
 * - Verify OTP (Issues temporary resetToken)
 * - Reset password (Validates resetToken & updates password)
 */
class AuthService {
  /**
   * Generate JWT token for an authenticated user.
   * @param {object} user - User document
   * @returns {string} JWT token
   */
  generateToken(user) {
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      shopId: user.shopId ? user.shopId.toString() : null,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  /**
   * Hash a raw password string using bcrypt.
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare candidate password against stored bcrypt hash.
   * @param {string} candidate
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async comparePassword(candidate, hash) {
    return bcrypt.compare(candidate, hash);
  }

  /**
   * Register a new business owner and their shop.
   * Both records are linked reciprocally using pre-generated ObjectIds.
   *
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.email
   * @param {string} data.password
   * @param {string} data.businessName
   * @param {string} data.state
   * @returns {Promise<{ user: object, shop: object, token: string }>}
   */
  async signup({ name, email, password, businessName, state, role = 'OWNER' }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const userId = new mongoose.Types.ObjectId();
    const shopId = new mongoose.Types.ObjectId();

    let shop = null;
    let user = null;

    const assignedRole = ['OWNER', 'ADMIN', 'STAFF'].includes(role) ? role : 'OWNER';

    try {
      // Create Shop
      shop = await Shop.create({
        _id: shopId,
        businessName: businessName.trim(),
        ownerName: name.trim(),
        state: state.trim(),
        ownerId: userId,
        invoicePrefix: env.INVOICE_PREFIX || 'INV',
      });

      // Create User with selected role
      user = await User.create({
        _id: userId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
        shopId: shop._id,
        isActive: true,
      });
    } catch (err) {
      if (shop) {
        await Shop.findByIdAndDelete(shopId).catch(() => {});
      }
      throw err;
    }

    const token = this.generateToken(user);

    // Return user object without sensitive fields
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, shop, token };
  }

  /**
   * Authenticate a user with email and password.
   *
   * @param {object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<{ user: object, shop: object, token: string }>}
   */
  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact your business owner.');
    }

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const shop = await Shop.findById(user.shopId);

    const token = this.generateToken(user);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, shop, token };
  }

  /**
   * Get current authenticated user details and shop profile.
   *
   * @param {string} userId
   * @returns {Promise<{ user: object, shop: object }>}
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account is deactivated');
    }

    const shop = await Shop.findById(user.shopId);

    return { user, shop };
  }

  /**
   * Request a password reset OTP.
   * Implements rate limiting / resend cooldown and anti-enumeration.
   *
   * @param {string} email
   * @returns {Promise<{ message: string }>}
   */
  async forgotPassword(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const genericMessage = 'If an account with that email exists, a password reset code has been sent.';

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+resetOtpLastSentAt +resetOtpAttempts'
    );

    // Anti-enumeration: don't reveal if user does not exist
    if (!user) {
      return { message: genericMessage };
    }

    // Check resend cooldown
    if (user.resetOtpLastSentAt) {
      const secondsSinceLastSent = (Date.now() - new Date(user.resetOtpLastSentAt).getTime()) / 1000;
      if (secondsSinceLastSent < env.OTP_RESEND_COOLDOWN_SECONDS) {
        const waitSeconds = Math.ceil(env.OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSent);
        throw ApiError.tooManyRequests(`Please wait ${waitSeconds}s before requesting a new code.`);
      }
    }

    // Generate & hash OTP
    const otp = otpService.generateOtp();
    const otpHash = await otpService.hashOtp(otp);

    const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60 * 1000);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiresAt = expiresAt;
    user.resetOtpAttempts = 0;
    user.resetOtpLastSentAt = new Date();
    await user.save();

    // Send email asynchronously (non-blocking)
    emailService.sendPasswordResetOtp({
      to: user.email,
      name: user.name,
      otp,
      expiresInMinutes: env.OTP_EXPIRES_MINUTES,
    }).catch((err) => {
      console.error('Failed to send reset OTP email:', err.message);
    });

    return { message: genericMessage };
  }

  /**
   * Verify an OTP and receive a temporary resetToken.
   *
   * @param {object} params
   * @param {string} params.email
   * @param {string} params.otp
   * @returns {Promise<{ resetToken: string, message: string }>}
   */
  async verifyOtp({ email, otp }) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts'
    );

    if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
      throw ApiError.badRequest('Invalid or expired verification code');
    }

    // Check expiry
    if (new Date() > new Date(user.resetOtpExpiresAt)) {
      user.resetOtpHash = undefined;
      user.resetOtpExpiresAt = undefined;
      await user.save();
      throw ApiError.badRequest('Verification code has expired. Please request a new one.');
    }

    // Check attempts limit
    if (user.resetOtpAttempts >= env.OTP_MAX_ATTEMPTS) {
      user.resetOtpHash = undefined;
      user.resetOtpExpiresAt = undefined;
      await user.save();
      throw ApiError.tooManyRequests('Too many failed attempts. Please request a new verification code.');
    }

    const isValid = await otpService.verifyOtp(otp, user.resetOtpHash);
    if (!isValid) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
      await user.save();
      const remaining = env.OTP_MAX_ATTEMPTS - user.resetOtpAttempts;
      throw ApiError.badRequest(`Invalid verification code. ${remaining} attempts remaining.`);
    }

    // OTP is valid: issue a temporary reset token (valid for 15 minutes)
    const resetToken = otpService.generateResetToken();
    const tokenHash = otpService.hashResetToken(resetToken);

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    // Invalidate the OTP now that it's consumed
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    await user.save();

    return {
      resetToken,
      message: 'Code verified successfully. You may now reset your password.',
    };
  }

  /**
   * Reset user password using the verified resetToken.
   *
   * @param {object} params
   * @param {string} params.email
   * @param {string} params.resetToken
   * @param {string} params.password
   * @returns {Promise<{ message: string }>}
   */
  async resetPassword({ email, resetToken, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+resetTokenHash +resetTokenExpiresAt +password'
    );

    if (!user || !user.resetTokenHash || !user.resetTokenExpiresAt) {
      throw ApiError.badRequest('Invalid or expired reset session. Please restart the process.');
    }

    if (new Date() > new Date(user.resetTokenExpiresAt)) {
      user.resetTokenHash = undefined;
      user.resetTokenExpiresAt = undefined;
      await user.save();
      throw ApiError.badRequest('Reset session has expired. Please restart the process.');
    }

    const isValid = otpService.verifyResetToken(resetToken, user.resetTokenHash);
    if (!isValid) {
      throw ApiError.badRequest('Invalid reset token.');
    }

    // Set new password
    user.password = await this.hashPassword(password);
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();

    return { message: 'Password has been reset successfully. You can now log in.' };
  }
}

export default new AuthService();

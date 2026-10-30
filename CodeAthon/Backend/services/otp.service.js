import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * OTP and Reset Token Service
 *
 * Handles generation and secure hashing of:
 * - 6-digit one-time passwords (for email verification)
 * - 64-char reset tokens (returned after successful OTP verification, consumed during password reset)
 */
class OtpService {
  /**
   * Generate a cryptographically secure 6-digit numeric OTP string.
   * Range: 100000 to 999999
   * @returns {string} 6-digit OTP
   */
  generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Hash an OTP using bcrypt for secure storage.
   * @param {string} otp
   * @returns {Promise<string>}
   */
  async hashOtp(otp) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
  }

  /**
   * Verify an OTP against its bcrypt hash.
   * @param {string} otp - Plain text 6-digit OTP
   * @param {string} hash - Stored bcrypt hash
   * @returns {Promise<boolean>}
   */
  async verifyOtp(otp, hash) {
    if (!otp || !hash) return false;
    return bcrypt.compare(otp, hash);
  }

  /**
   * Generate a random hex reset token (32 bytes = 64 hex characters).
   * @returns {string}
   */
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash a reset token using SHA-256 for fast and safe database storage.
   * @param {string} token
   * @returns {string}
   */
  hashResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify a raw reset token against a stored SHA-256 hash.
   * @param {string} token - Raw token provided by user
   * @param {string} storedHash - Stored SHA-256 hash in DB
   * @returns {boolean}
   */
  verifyResetToken(token, storedHash) {
    if (!token || !storedHash) return false;
    const computedHash = this.hashResetToken(token);
    const computedBuf = Buffer.from(computedHash);
    const storedBuf = Buffer.from(storedHash);
    if (computedBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  }
}

export default new OtpService();

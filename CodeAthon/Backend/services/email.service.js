import nodemailer from 'nodemailer';
import env from '../config/env.js';
import { getPasswordResetTemplate } from '../templates/emails/passwordReset.js';

/**
 * Email Service
 *
 * Handles outgoing email via Nodemailer.
 * Features:
 * - Real SMTP when configured
 * - Graceful fallback to console logging in development/test if SMTP is not configured
 * - In-memory store for recent sent emails (useful for automated testing)
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.recentEmails = []; // Holds last 20 emails for debugging/testing
    this.initTransporter();
  }

  initTransporter() {
    const hasConfig = env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASSWORD;

    if (hasConfig) {
      try {
        this.transporter = nodemailer.createTransport({
          host: env.EMAIL_HOST,
          port: env.EMAIL_PORT,
          secure: env.EMAIL_PORT === 465,
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
          },
        });
      } catch (err) {
        console.warn('Failed to initialize SMTP transporter, falling back to mock mode:', err.message);
        this.transporter = null;
      }
    }
  }

  /**
   * Send a general email.
   * @param {object} options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} [options.html] - HTML content
   * @param {Array} [options.attachments] - Nodemailer attachments array
   * @returns {Promise<{ success: boolean, messageId?: string, simulated?: boolean }>}
   */
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    const mailOptions = {
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM || env.EMAIL_USER || 'no-reply@gstbilling.local'}>`,
      to,
      subject,
      text,
      html,
      attachments,
    };

    // Store in recent emails for debugging/testing inspection
    this.recentEmails.unshift({
      to,
      subject,
      text,
      html,
      sentAt: new Date(),
    });
    if (this.recentEmails.length > 20) {
      this.recentEmails.pop();
    }

    if (!this.transporter) {
      this.initTransporter();
    }

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EMAIL DISPATCH SUCCESS] Invoice PDF sent to ${to} (MessageID: ${info.messageId})`);
        return { success: true, messageId: info.messageId, simulated: false };
      } catch (error) {
        console.error('SMTP sending error, falling back to console log:', error.message);
        console.log(`[EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
        return { success: true, simulated: true, note: 'Simulated due to SMTP error' };
      }
    } else {
      // Mock mode: log clearly for local development/testing
      console.log(`\n──────────────────────────────────────────────────`);
      console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text:\n${text}`);
      console.log(`──────────────────────────────────────────────────\n`);
      return { success: true, simulated: true };
    }
  }

  /**
   * Send a password reset OTP email.
   * @param {object} params
   * @param {string} params.to - User email
   * @param {string} params.name - User name
   * @param {string} params.otp - 6-digit OTP
   * @param {number} [params.expiresInMinutes=10]
   */
  async sendPasswordResetOtp({ to, name, otp, expiresInMinutes = 10 }) {
    const template = getPasswordResetTemplate({ name, otp, expiresInMinutes });
    return this.sendEmail({
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  /**
   * Get the most recently simulated email (for test verification).
   */
  getLatestEmail() {
    return this.recentEmails[0] || null;
  }
}

export default new EmailService();

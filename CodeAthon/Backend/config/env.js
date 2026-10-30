import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from the Backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Centralized environment configuration.
 * All environment variables are accessed through this object.
 * Validates required variables at startup — fail fast if misconfigured.
 */
const env = {
  // Server
  PORT: parseInt(process.env.PORT, 10) || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Client
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Email
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'GST Billing System',

  // OTP
  OTP_EXPIRES_MINUTES: parseInt(process.env.OTP_EXPIRES_MINUTES, 10) || 10,
  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS, 10) || 5,
  OTP_RESEND_COOLDOWN_SECONDS: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS, 10) || 60,

  // Invoice
  INVOICE_PREFIX: process.env.INVOICE_PREFIX || 'INV',
};

/**
 * Validate that critical environment variables are present.
 * Called once at startup in app.js — if any are missing, the server won't start.
 */
export function validateEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file. See .env.example for reference.'
    );
  }
}

export default env;

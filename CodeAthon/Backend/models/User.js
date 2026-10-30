import mongoose from 'mongoose';
import { ROLE_VALUES } from '../constants/roles.js';

/**
 * User Schema
 *
 * Stores authentication credentials, role, shop association,
 * and password-reset OTP fields.
 *
 * Security notes:
 * - password: select:false — never returned in queries unless explicitly selected
 * - resetOtpHash: stored as bcrypt hash, never plain text
 * - resetTokenHash: short-lived token issued after OTP verification
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ROLE_VALUES,
        message: 'Role must be one of: {VALUE}',
      },
      default: 'STAFF',
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop association is required'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ─── Password Reset OTP Fields ───
    resetOtpHash: {
      type: String,
      select: false,
    },

    resetOtpExpiresAt: {
      type: Date,
      select: false,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    resetOtpLastSentAt: {
      type: Date,
      select: false,
    },

    // ─── Reset Token (issued after OTP verification) ───
    resetTokenHash: {
      type: String,
      select: false,
    },

    resetTokenExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── Indexes ───
userSchema.index({ shopId: 1 });
// email unique index is created by unique:true above

const User = mongoose.model('User', userSchema);

export default User;

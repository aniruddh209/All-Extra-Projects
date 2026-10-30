import env from '../config/env.js';
import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * Common cookie options for HTTP-only JWT token.
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Handle user registration (OWNER + Shop creation).
 */
export const signup = asyncHandler(async (req, res) => {
  const { user, shop, token } = await authService.signup(req.body);

  res.cookie('token', token, getCookieOptions());

  return apiResponse.created(res, 'Account registered successfully', {
    user,
    shop,
    token,
  });
});

/**
 * Handle user login.
 */
export const login = asyncHandler(async (req, res) => {
  const { user, shop, token } = await authService.login(req.body);

  res.cookie('token', token, getCookieOptions());

  return apiResponse.success(res, 'Logged in successfully', {
    user,
    shop,
    token,
  });
});

/**
 * Handle user logout.
 */
export const logout = asyncHandler(async (req, res) => {
  const { maxAge, ...clearOptions } = getCookieOptions();
  res.clearCookie('token', clearOptions);

  return apiResponse.success(res, 'Logged out successfully');
});

/**
 * Get current authenticated user profile and business details.
 */
export const getMe = asyncHandler(async (req, res) => {
  const { user, shop } = await authService.getCurrentUser(req.user._id);

  return apiResponse.success(res, 'User profile retrieved', {
    user,
    shop,
  });
});

/**
 * Initiate password reset by requesting an OTP.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);

  return apiResponse.success(res, result.message);
});

/**
 * Verify OTP and retrieve a resetToken.
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);

  return apiResponse.success(res, result.message, {
    resetToken: result.resetToken,
  });
});

/**
 * Reset password using verified resetToken.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);

  return apiResponse.success(res, result.message);
});

export default {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

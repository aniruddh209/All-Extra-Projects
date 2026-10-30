import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Authentication Middleware
 *
 * Verifies JWT token from HTTP-only cookie or Authorization header.
 * Populates `req.user` with current user details and shop association.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Bearer token in header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Verify user still exists in database and is active
    const user = await User.findById(decoded.userId).select('name email role shopId isActive');
    if (!user) {
      throw ApiError.unauthorized('The user belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account is inactive. Please contact your business owner.');
    }

    // Attach to request
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
    };
    req.shopId = user.shopId;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid authentication token.');
    }
    throw error;
  }
});

export default requireAuth;

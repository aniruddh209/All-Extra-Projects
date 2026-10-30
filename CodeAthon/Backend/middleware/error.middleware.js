import env from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Global error handling middleware.
 * This is the LAST middleware in the Express pipeline.
 * All errors (thrown or passed via next(error)) end up here.
 *
 * Responsibilities:
 * 1. Log the error (full details in development, minimal in production)
 * 2. Handle known operational errors (ApiError instances)
 * 3. Handle Mongoose-specific errors (validation, cast, duplicate key)
 * 4. Handle JWT errors
 * 5. Return a consistent error response
 * 6. Never leak stack traces, DB internals, or secrets to the client
 */
const errorHandler = (err, req, res, _next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ─── Mongoose Validation Error ───
  // Triggered when a document fails schema validation (required fields, enum, etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ─── Mongoose Cast Error ───
  // Triggered when an invalid ObjectId is passed (e.g., /parties/not-an-id)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── Mongoose Duplicate Key Error ───
  // Triggered when a unique index constraint is violated
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for "${field}". This ${field} already exists.`;
  }

  // ─── JWT Errors ───
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please login again.';
  }

  // ─── Logging ───
  if (env.isDev) {
    console.error('─── ERROR ───');
    console.error(`Status: ${statusCode}`);
    console.error(`Message: ${message}`);
    if (err.stack) {
      console.error(`Stack: ${err.stack}`);
    }
    console.error('─────────────');
  } else {
    // In production, only log unexpected (non-operational) errors
    if (!err.isOperational) {
      console.error('UNEXPECTED ERROR:', err);
    }
  }

  // ─── Response ───
  // Never include stack trace in client response
  return sendError(res, statusCode, message, errors);
};

export default errorHandler;

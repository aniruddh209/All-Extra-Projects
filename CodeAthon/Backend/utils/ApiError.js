/**
 * Custom API Error class.
 * Extends the native Error to include an HTTP status code
 * and optional structured validation errors.
 *
 * Caught by the global error middleware and formatted into
 * a consistent API error response.
 *
 * Usage:
 *   throw new ApiError(404, 'Party not found');
 *   throw new ApiError(400, 'Validation failed', [{ field: 'name', message: 'Required' }]);
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 429, 500)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of field-level validation errors
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes expected errors from programming bugs

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = 'Forbidden', errors = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = 'Not Found', errors = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = 'Conflict', errors = []) {
    return new ApiError(409, message, errors);
  }

  static tooManyRequests(message = 'Too Many Requests', errors = []) {
    return new ApiError(429, message, errors);
  }

  static internal(message = 'Internal Server Error', errors = []) {
    return new ApiError(500, message, errors);
  }
}

export default ApiError;

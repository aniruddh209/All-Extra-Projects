/**
 * Consistent API response helpers.
 * Every controller should use these to ensure uniform response shape.
 *
 * Success: { success: true, message: "...", data: { ... } }
 * Error:   { success: false, message: "...", errors: [ ... ] }
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status (200, 201, etc.)
 * @param {string} message - Human-readable message
 * @param {any} data - Response payload
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * Typically called by the global error middleware, not controllers directly.
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status (400, 401, 403, 404, 500, etc.)
 * @param {string} message - Human-readable error message
 * @param {Array} errors - Optional field-level errors
 */
export const sendError = (res, statusCode, message, errors = []) => {
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const success = (res, message = 'Success', data = null) => {
  return sendSuccess(res, 200, message, data);
};

export const created = (res, message = 'Created successfully', data = null) => {
  return sendSuccess(res, 201, message, data);
};

export const apiResponse = {
  sendSuccess,
  sendError,
  success,
  created,
};

export default apiResponse;


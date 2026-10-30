import ApiError from '../utils/ApiError.js';

/**
 * 404 Not Found middleware.
 * Catches requests to undefined routes and passes a 404 error
 * to the global error handler.
 *
 * Must be placed AFTER all route definitions and BEFORE the error handler.
 */
const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundHandler;
